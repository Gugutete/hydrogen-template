-- Inserimento di dati di esempio per i bus
INSERT INTO buses (name, plate, model, seats, year, status, next_maintenance, documents_status)
VALUES
  ('Bus Gran Turismo 1', 'NA123AB', 'Mercedes Tourismo', 52, 2020, 'active', '2023-07-15', 'valid'),
  ('Bus Gran Turismo 2', 'NA456CD', 'Setra S 516 HDH', 48, 2019, 'maintenance', '2023-04-08', 'expiring'),
  ('Bus Gran Turismo 3', 'NA789EF', 'MAN Lion''s Coach', 50, 2021, 'active', '2023-09-05', 'valid');

-- Inserimento di dati di esempio per gli autisti
INSERT INTO drivers (name, license_number, license_expiry, phone, email, status, weekly_hours, bi_weekly_hours, monthly_hours)
VALUES
  ('Mario Rossi', 'NA12345678', '2025-05-15', '+39 123 456 7890', 'mario.rossi@example.com', 'active', 32, 68, 140),
  ('Luigi Verdi', 'NA87654321', '2024-08-22', '+39 098 765 4321', 'luigi.verdi@example.com', 'active', 40, 75, 160),
  ('Giuseppe Bianchi', 'NA11223344', '2023-12-10', '+39 111 222 3333', 'giuseppe.bianchi@example.com', 'inactive', 0, 45, 120);

-- Inserimento di dati di esempio per le agenzie
INSERT INTO agencies (name, contact_person, email, phone, address, city, country, status, tours_count)
VALUES
  ('Viaggi Napoli', 'Antonio Esposito', 'info@viagginapoli.it', '+39 081 123 4567', 'Via Toledo 123', 'Napoli', 'Italia', 'active', 0),
  ('Europa Tours', 'Maria Bianchi', 'contact@europatours.com', '+39 02 987 6543', 'Via Montenapoleone 45', 'Milano', 'Italia', 'active', 0),
  ('Italia Vacanze', 'Giuseppe Verdi', 'info@italiavacanze.it', '+39 06 543 2109', 'Via del Corso 78', 'Roma', 'Italia', 'inactive', 0);

-- Ottieni gli ID dei bus, autisti e agenzie inseriti
DO $$
DECLARE
  bus1_id UUID;
  bus2_id UUID;
  bus3_id UUID;
  driver1_id UUID;
  driver2_id UUID;
  driver3_id UUID;
  agency1_id UUID;
  agency2_id UUID;
  agency3_id UUID;
BEGIN
  SELECT id INTO bus1_id FROM buses WHERE name = 'Bus Gran Turismo 1' LIMIT 1;
  SELECT id INTO bus2_id FROM buses WHERE name = 'Bus Gran Turismo 2' LIMIT 1;
  SELECT id INTO bus3_id FROM buses WHERE name = 'Bus Gran Turismo 3' LIMIT 1;
  
  SELECT id INTO driver1_id FROM drivers WHERE name = 'Mario Rossi' LIMIT 1;
  SELECT id INTO driver2_id FROM drivers WHERE name = 'Luigi Verdi' LIMIT 1;
  SELECT id INTO driver3_id FROM drivers WHERE name = 'Giuseppe Bianchi' LIMIT 1;
  
  SELECT id INTO agency1_id FROM agencies WHERE name = 'Viaggi Napoli' LIMIT 1;
  SELECT id INTO agency2_id FROM agencies WHERE name = 'Europa Tours' LIMIT 1;
  SELECT id INTO agency3_id FROM agencies WHERE name = 'Italia Vacanze' LIMIT 1;
  
  -- Inserimento di dati di esempio per i tour
  INSERT INTO tours (title, start_date, end_date, bus_id, driver_id, agency_id, status, price, passengers, notes)
  VALUES
    ('Tour Roma', '2023-06-10', '2023-06-15', bus1_id, driver1_id, agency1_id, 'active', 5000.00, 45, 'Tour culturale a Roma'),
    ('Tour Milano', '2023-06-12', '2023-06-18', bus2_id, driver2_id, agency2_id, 'preparation', 6500.00, 40, 'Tour business a Milano'),
    ('Tour Venezia', '2023-06-20', '2023-06-25', bus3_id, driver3_id, agency3_id, 'active', 7000.00, 48, 'Tour romantico a Venezia');
  
  -- Inserimento di dati di esempio per le manutenzioni
  INSERT INTO maintenances (bus_id, type, description, date, cost, status, notes)
  VALUES
    (bus1_id, 'regular', 'Cambio olio e filtri', '2023-07-15', 450.00, 'scheduled', 'Manutenzione ordinaria programmata'),
    (bus2_id, 'extraordinary', 'Sostituzione freni', '2023-04-08', 1200.00, 'in-progress', 'Intervento urgente'),
    (bus3_id, 'document', 'Rinnovo assicurazione', '2023-09-05', 3500.00, 'completed', 'Assicurazione annuale'),
    (bus2_id, 'document', 'Revisione annuale', '2023-05-20', 250.00, 'scheduled', 'Revisione obbligatoria');
END $$;
