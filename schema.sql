-- Create schema for Schiavo Bus Management System

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plate TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  seats INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  reminder_days INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID REFERENCES buses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  next_maintenance_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  license_number TEXT NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'driving', 'rest', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE driving_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  hours DECIMAL(4, 2) NOT NULL,
  tour_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  country TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  bus_id UUID REFERENCES buses(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('preparation', 'active', 'empty', 'stop')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint to driving_hours after tours table is created
ALTER TABLE driving_hours ADD CONSTRAINT fk_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL;

-- Create views for easier querying
CREATE VIEW bus_status AS
SELECT 
  b.id,
  b.name,
  b.plate,
  b.model,
  b.seats,
  b.year,
  (
    SELECT COUNT(*) FROM documents d 
    WHERE d.bus_id = b.id AND d.expiry_date < NOW()
  ) AS expired_documents,
  (
    SELECT COUNT(*) FROM documents d 
    WHERE d.bus_id = b.id AND d.expiry_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
  ) AS expiring_documents,
  (
    SELECT COUNT(*) FROM maintenance_records m 
    WHERE m.bus_id = b.id AND m.status = 'scheduled'
  ) AS scheduled_maintenance,
  (
    SELECT MIN(m.next_maintenance_date) FROM maintenance_records m 
    WHERE m.bus_id = b.id
  ) AS next_maintenance_date
FROM buses b;

CREATE VIEW driver_status AS
SELECT 
  d.id,
  d.name,
  d.email,
  d.phone,
  d.license_number,
  d.license_expiry,
  d.status,
  (
    SELECT SUM(dh.hours) FROM driving_hours dh 
    WHERE dh.driver_id = d.id AND dh.date BETWEEN NOW() - INTERVAL '7 days' AND NOW()
  ) AS weekly_hours,
  (
    SELECT COUNT(*) FROM driving_hours dh 
    WHERE dh.driver_id = d.id AND dh.date BETWEEN NOW() - INTERVAL '6 days' AND NOW() AND dh.hours > 0
  ) AS consecutive_driving_days
FROM drivers d;

CREATE VIEW tour_details AS
SELECT 
  t.id,
  t.title,
  t.start_date,
  t.end_date,
  t.status,
  t.notes,
  b.id AS bus_id,
  b.name AS bus_name,
  b.plate AS bus_plate,
  d.id AS driver_id,
  d.name AS driver_name,
  a.id AS agency_id,
  a.name AS agency_name,
  a.contact_person AS agency_contact
FROM tours t
LEFT JOIN buses b ON t.bus_id = b.id
LEFT JOIN drivers d ON t.driver_id = d.id
LEFT JOIN agencies a ON t.agency_id = a.id;

-- Create functions for business logic
CREATE OR REPLACE FUNCTION check_driver_availability(driver_id UUID, start_date DATE, end_date DATE)
RETURNS BOOLEAN AS $$
DECLARE
  consecutive_days INTEGER;
  weekly_hours DECIMAL;
BEGIN
  -- Check consecutive driving days
  SELECT COUNT(*) INTO consecutive_days
  FROM driving_hours
  WHERE driver_id = $1
    AND date BETWEEN NOW() - INTERVAL '6 days' AND NOW()
    AND hours > 0;
  
  -- Check weekly hours
  SELECT COALESCE(SUM(hours), 0) INTO weekly_hours
  FROM driving_hours
  WHERE driver_id = $1
    AND date BETWEEN NOW() - INTERVAL '7 days' AND NOW();
  
  -- Return false if driver has worked 6 consecutive days or more than 56 hours in a week
  IF consecutive_days >= 6 OR weekly_hours >= 56 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if driver is already assigned to another tour during the requested period
  IF EXISTS (
    SELECT 1 FROM tours
    WHERE driver_id = $1
      AND status IN ('preparation', 'active')
      AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_bus_availability(bus_id UUID, start_date DATE, end_date DATE)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if bus is already assigned to another tour during the requested period
  IF EXISTS (
    SELECT 1 FROM tours
    WHERE bus_id = $1
      AND status IN ('preparation', 'active', 'stop')
      AND (
        (start_date <= $2 AND end_date >= $2) OR
        (start_date <= $3 AND end_date >= $3) OR
        (start_date >= $2 AND end_date <= $3)
      )
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check if bus has expired documents
  IF EXISTS (
    SELECT 1 FROM documents
    WHERE bus_id = $1
      AND expiry_date < $3
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_buses_updated_at
BEFORE UPDATE ON buses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_records_updated_at
BEFORE UPDATE ON maintenance_records
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driving_hours_updated_at
BEFORE UPDATE ON driving_hours
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at
BEFORE UPDATE ON agencies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON tours
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
BEFORE UPDATE ON itineraries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to update document status
CREATE OR REPLACE FUNCTION update_document_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expiry_date < CURRENT_DATE THEN
    NEW.status = 'expired';
  ELSIF NEW.expiry_date < CURRENT_DATE + (NEW.reminder_days * INTERVAL '1 day') THEN
    NEW.status = 'expiring';
  ELSE
    NEW.status = 'valid';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driving_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read buses" ON buses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert buses" ON buses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update buses" ON buses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete buses" ON buses
  FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat similar policies for other tables
