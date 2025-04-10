-- Tabella per i bus
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plate TEXT NOT NULL,
  model TEXT NOT NULL,
  seats INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL,
  next_maintenance DATE NOT NULL,
  documents_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per gli autisti
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  weekly_hours INTEGER DEFAULT 0,
  bi_weekly_hours INTEGER DEFAULT 0,
  monthly_hours INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per le agenzie
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT NOT NULL,
  tours_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per i tour
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  bus_id UUID REFERENCES buses(id),
  driver_id UUID REFERENCES drivers(id),
  agency_id UUID REFERENCES agencies(id),
  status TEXT NOT NULL,
  price DECIMAL(10, 2),
  passengers INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella per le manutenzioni
CREATE TABLE maintenances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_id UUID REFERENCES buses(id),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger per aggiornare il campo updated_at
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

CREATE TRIGGER update_drivers_updated_at
BEFORE UPDATE ON drivers
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

CREATE TRIGGER update_maintenances_updated_at
BEFORE UPDATE ON maintenances
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger per aggiornare il conteggio dei tour per le agenzie
CREATE OR REPLACE FUNCTION update_agency_tours_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agencies SET tours_count = tours_count + 1 WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agencies SET tours_count = tours_count - 1 WHERE id = OLD.agency_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.agency_id != OLD.agency_id THEN
    UPDATE agencies SET tours_count = tours_count - 1 WHERE id = OLD.agency_id;
    UPDATE agencies SET tours_count = tours_count + 1 WHERE id = NEW.agency_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agency_tours_count
AFTER INSERT OR UPDATE OR DELETE ON tours
FOR EACH ROW
EXECUTE FUNCTION update_agency_tours_count();
