-- Questo script configura le policy di sicurezza per le tabelle in Supabase

-- Abilita RLS (Row Level Security) per la tabella tours
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Elimina le policy esistenti per la tabella tours
DROP POLICY IF EXISTS "Allow anonymous select" ON tours;
DROP POLICY IF EXISTS "Allow anonymous insert" ON tours;
DROP POLICY IF EXISTS "Allow anonymous update" ON tours;
DROP POLICY IF EXISTS "Allow anonymous delete" ON tours;

-- Crea policy per consentire SELECT a tutti gli utenti
CREATE POLICY "Allow anonymous select" ON tours
  FOR SELECT USING (true);

-- Crea policy per consentire INSERT a tutti gli utenti
CREATE POLICY "Allow anonymous insert" ON tours
  FOR INSERT WITH CHECK (true);

-- Crea policy per consentire UPDATE a tutti gli utenti
CREATE POLICY "Allow anonymous update" ON tours
  FOR UPDATE USING (true);

-- Crea policy per consentire DELETE a tutti gli utenti
CREATE POLICY "Allow anonymous delete" ON tours
  FOR DELETE USING (true);

-- Ripeti lo stesso processo per le altre tabelle

-- Tabella buses
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous select" ON buses;
DROP POLICY IF EXISTS "Allow anonymous insert" ON buses;
DROP POLICY IF EXISTS "Allow anonymous update" ON buses;
DROP POLICY IF EXISTS "Allow anonymous delete" ON buses;
CREATE POLICY "Allow anonymous select" ON buses FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON buses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON buses FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON buses FOR DELETE USING (true);

-- Tabella drivers
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous select" ON drivers;
DROP POLICY IF EXISTS "Allow anonymous insert" ON drivers;
DROP POLICY IF EXISTS "Allow anonymous update" ON drivers;
DROP POLICY IF EXISTS "Allow anonymous delete" ON drivers;
CREATE POLICY "Allow anonymous select" ON drivers FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON drivers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON drivers FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON drivers FOR DELETE USING (true);

-- Tabella agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous select" ON agencies;
DROP POLICY IF EXISTS "Allow anonymous insert" ON agencies;
DROP POLICY IF EXISTS "Allow anonymous update" ON agencies;
DROP POLICY IF EXISTS "Allow anonymous delete" ON agencies;
CREATE POLICY "Allow anonymous select" ON agencies FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON agencies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON agencies FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON agencies FOR DELETE USING (true);

-- Tabella maintenances
ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous select" ON maintenances;
DROP POLICY IF EXISTS "Allow anonymous insert" ON maintenances;
DROP POLICY IF EXISTS "Allow anonymous update" ON maintenances;
DROP POLICY IF EXISTS "Allow anonymous delete" ON maintenances;
CREATE POLICY "Allow anonymous select" ON maintenances FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON maintenances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON maintenances FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete" ON maintenances FOR DELETE USING (true);
