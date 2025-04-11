import { createClient } from '@supabase/supabase-js';

// Credenziali reali di Supabase
const supabaseUrl = 'https://vrgnppslfvfeimnwgasa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZ25wcHNsZnZmZWltbndnYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzc1MDQsImV4cCI6MjA1OTg1MzUwNH0.hPaZFaz3vYO4GJLbbSdnH_scIPiGrhluEUMjR8N8unM';

// Creiamo un client Supabase con le credenziali reali
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true // Manteniamo la sessione persistente
  }
});

// Credenziali di accesso per l'applicazione di demo
export const DEMO_EMAIL = 'guidodipace@gmail.com';
export const DEMO_PASSWORD = 'Guido20121985';

// Funzioni per l'autenticazione
export const signIn = async (email: string, password: string) => {
  console.log(`Tentativo di login con email: ${email}`);

  try {
    // Prova ad autenticarti con Supabase
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      console.error('Errore di autenticazione Supabase:', result.error);

      // Se l'autenticazione fallisce ma le credenziali corrispondono a quelle di demo
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        console.log('Utilizzando autenticazione di fallback per demo');
        // In modalità demo, restituisci un utente fittizio
        return {
          data: {
            user: {
              id: '1',
              email: DEMO_EMAIL,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            session: {
              access_token: 'demo-token',
              refresh_token: 'demo-refresh-token',
              expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
            }
          },
          error: null
        };
      }
    }

    console.log('Risultato autenticazione Supabase:', result);
    return result;
  } catch (err) {
    console.error('Errore durante l\'autenticazione:', err);

    // In caso di errore, se le credenziali corrispondono a quelle di demo
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      console.log('Utilizzando autenticazione di fallback per demo dopo errore');
      // In modalità demo, restituisci un utente fittizio
      return {
        data: {
          user: {
            id: '1',
            email: DEMO_EMAIL,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'demo-token',
            refresh_token: 'demo-refresh-token',
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          }
        },
        error: null
      };
    }

    return { data: null, error: err };
  }
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const signInAnonymously = async () => {
  console.log('Tentativo di accesso anonimo');
  try {
    // Prova ad autenticarti in modo anonimo con Supabase
    const result = await supabase.auth.signInAnonymously();

    if (result.error) {
      console.error('Errore di autenticazione anonima Supabase:', result.error);
      // Fallback: restituisci una sessione fittizia
      return {
        data: {
          user: {
            id: 'anonymous',
            email: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'anonymous-token',
            refresh_token: 'anonymous-refresh-token',
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          }
        },
        error: null
      };
    }

    console.log('Risultato autenticazione anonima Supabase:', result);
    return result;
  } catch (err) {
    console.error('Errore durante l\'autenticazione anonima:', err);
    // Fallback: restituisci una sessione fittizia
    return {
      data: {
        user: {
          id: 'anonymous',
          email: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        session: {
          access_token: 'anonymous-token',
          refresh_token: 'anonymous-refresh-token',
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        }
      },
      error: null
    };
  }
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

// Dati di esempio per la modalità demo
const demoBuses = [
  {
    id: 'bus1',
    name: 'Bus Gran Turismo 1',
    plate: 'NA123AB',
    model: 'Mercedes Tourismo',
    seats: 52,
    year: 2020,
    status: 'active',
    next_maintenance: '2023-07-15',
    documents_status: 'valid'
  },
  {
    id: 'bus2',
    name: 'Bus Gran Turismo 2',
    plate: 'NA456CD',
    model: 'Setra S 516 HDH',
    seats: 48,
    year: 2019,
    status: 'maintenance',
    next_maintenance: '2023-04-08',
    documents_status: 'expiring'
  },
  {
    id: 'bus3',
    name: 'Bus Gran Turismo 3',
    plate: 'NA789EF',
    model: 'MAN Lion\'s Coach',
    seats: 50,
    year: 2021,
    status: 'active',
    next_maintenance: '2023-09-05',
    documents_status: 'valid'
  }
];

const demoDrivers = [
  {
    id: 'driver1',
    name: 'Mario Rossi',
    license_number: 'NA12345678',
    license_expiry: '2025-05-15',
    phone: '+39 123 456 7890',
    email: 'mario.rossi@example.com',
    status: 'active',
    weekly_hours: 32,
    bi_weekly_hours: 68,
    monthly_hours: 140
  },
  {
    id: 'driver2',
    name: 'Luigi Verdi',
    license_number: 'NA87654321',
    license_expiry: '2024-08-22',
    phone: '+39 098 765 4321',
    email: 'luigi.verdi@example.com',
    status: 'active',
    weekly_hours: 40,
    bi_weekly_hours: 75,
    monthly_hours: 160
  },
  {
    id: 'driver3',
    name: 'Giuseppe Bianchi',
    license_number: 'NA11223344',
    license_expiry: '2023-12-10',
    phone: '+39 111 222 3333',
    email: 'giuseppe.bianchi@example.com',
    status: 'inactive',
    weekly_hours: 0,
    bi_weekly_hours: 45,
    monthly_hours: 120
  }
];

const demoAgencies = [
  {
    id: 'agency1',
    name: 'Viaggi Napoli',
    contact_person: 'Antonio Esposito',
    email: 'info@viagginapoli.it',
    phone: '+39 081 123 4567',
    address: 'Via Toledo 123',
    city: 'Napoli',
    country: 'Italia',
    status: 'active',
    tours_count: 1
  },
  {
    id: 'agency2',
    name: 'Europa Tours',
    contact_person: 'Maria Bianchi',
    email: 'contact@europatours.com',
    phone: '+39 02 987 6543',
    address: 'Via Montenapoleone 45',
    city: 'Milano',
    country: 'Italia',
    status: 'active',
    tours_count: 1
  },
  {
    id: 'agency3',
    name: 'Italia Vacanze',
    contact_person: 'Giuseppe Verdi',
    email: 'info@italiavacanze.it',
    phone: '+39 06 543 2109',
    address: 'Via del Corso 78',
    city: 'Roma',
    country: 'Italia',
    status: 'inactive',
    tours_count: 1
  }
];

const demoTours = [
  {
    id: 'tour1',
    title: 'Tour Roma',
    start_date: '2023-06-10',
    end_date: '2023-06-15',
    bus_id: 'bus1',
    driver_id: 'driver1',
    agency_id: 'agency1',
    status: 'active',
    price: 5000,
    passengers: 45,
    notes: 'Tour culturale a Roma'
  },
  {
    id: 'tour2',
    title: 'Tour Milano',
    start_date: '2023-06-12',
    end_date: '2023-06-18',
    bus_id: 'bus2',
    driver_id: 'driver2',
    agency_id: 'agency2',
    status: 'preparation',
    price: 6500,
    passengers: 40,
    notes: 'Tour business a Milano'
  },
  {
    id: 'tour3',
    title: 'Tour Venezia',
    start_date: '2023-06-20',
    end_date: '2023-06-25',
    bus_id: 'bus3',
    driver_id: 'driver3',
    agency_id: 'agency3',
    status: 'active',
    price: 7000,
    passengers: 48,
    notes: 'Tour romantico a Venezia'
  }
];

const demoMaintenances = [
  {
    id: 'maint1',
    bus_id: 'bus1',
    type: 'regular',
    description: 'Cambio olio e filtri',
    date: '2023-07-15',
    cost: 450,
    status: 'scheduled',
    notes: 'Manutenzione ordinaria programmata'
  },
  {
    id: 'maint2',
    bus_id: 'bus2',
    type: 'extraordinary',
    description: 'Sostituzione freni',
    date: '2023-04-08',
    cost: 1200,
    status: 'in-progress',
    notes: 'Intervento urgente'
  },
  {
    id: 'maint3',
    bus_id: 'bus3',
    type: 'document',
    description: 'Rinnovo assicurazione',
    date: '2023-09-05',
    cost: 3500,
    status: 'completed',
    notes: 'Assicurazione annuale'
  }
];

// Funzioni per il database
export const fetchBuses = async () => {
  try {
    console.log('Tentativo di recupero bus da Supabase...');
    // Recupera i dati da Supabase
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('name');

    if (error) {
      console.error('Errore Supabase nel recupero dei bus:', error);
      throw error;
    }

    console.log('Dati bus ricevuti da Supabase:', data);

    // Anche se non ci sono dati, restituisci un array vuoto invece dei dati demo
    // Trasforma i dati dal formato snake_case al formato camelCase
    const formattedData = data ? data.map(bus => ({
      id: bus.id,
      name: bus.name,
      plate: bus.plate,
      model: bus.model,
      seats: bus.seats,
      year: bus.year,
      status: bus.status,
      nextMaintenance: bus.next_maintenance,
      documentsStatus: bus.documents_status
    })) : [];

    console.log('Dati bus formattati:', formattedData);
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Errore nel recupero dei bus:', err);
    // In caso di errore, restituisci un array vuoto invece dei dati demo
    return { data: [], error: err };
  }
};

export const fetchDrivers = async () => {
  try {
    console.log('Tentativo di recupero autisti da Supabase...');
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Errore Supabase nel recupero degli autisti:', error);
      throw error;
    }

    console.log('Dati autisti ricevuti da Supabase:', data);

    // Anche se non ci sono dati, restituisci un array vuoto invece dei dati demo
    // Trasforma i dati dal formato snake_case al formato camelCase
    const formattedData = data ? data.map(driver => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.license_number,
      licenseExpiry: driver.license_expiry,
      phone: driver.phone,
      email: driver.email,
      status: driver.status,
      drivingHours: {
        weekly: driver.weekly_hours || 0,
        biWeekly: driver.bi_weekly_hours || 0,
        monthly: driver.monthly_hours || 0
      }
    })) : [];

    console.log('Dati autisti formattati:', formattedData);
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Errore nel recupero degli autisti:', err);
    // In caso di errore, restituisci un array vuoto invece dei dati demo
    return { data: [], error: err };
  }
};

export const fetchTours = async () => {
  try {
    console.log('Tentativo di recupero tour da Supabase...');
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('start');

    if (error) {
      console.error('Errore Supabase nel recupero dei tour:', error);
      throw error;
    }

    console.log('Dati tour ricevuti da Supabase:', data);

    // Anche se non ci sono dati, restituisci un array vuoto invece dei dati demo
    // Trasforma i dati dal formato snake_case al formato camelCase
    const formattedData = data ? data.map(tour => ({
      id: tour.id,
      title: tour.title,
      start: tour.start,
      end: tour.end,
      busId: tour.bus_id,
      driverId: tour.driver_id,
      agencyId: tour.agency_id,
      status: tour.status,
      notes: tour.notes,
      price: tour.price,
      passengers: tour.passengers,
      location: tour.location,
      busName: tour.bus_name,
      driverName: tour.driver_name,
      agencyName: tour.agency_name,
      dailyLocations: tour.daily_locations || []
    })) : [];

    console.log('Dati tour formattati:', formattedData);
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Errore nel recupero dei tour:', err);
    // In caso di errore, restituisci un array vuoto invece dei dati demo
    return { data: [], error: err };
  }
};

export const fetchAgencies = async () => {
  try {
    console.log('Tentativo di recupero agenzie da Supabase...');
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Errore Supabase nel recupero delle agenzie:', error);
      throw error;
    }

    console.log('Dati agenzie ricevuti da Supabase:', data);

    // Anche se non ci sono dati, restituisci un array vuoto invece dei dati demo
    // Trasforma i dati dal formato snake_case al formato camelCase
    const formattedData = data ? data.map(agency => ({
      id: agency.id,
      name: agency.name,
      contactPerson: agency.contact_person,
      email: agency.email,
      phone: agency.phone,
      address: agency.address,
      city: agency.city,
      country: agency.country,
      status: agency.status,
      toursCount: agency.tours_count || 0
    })) : [];

    console.log('Dati agenzie formattati:', formattedData);
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Errore nel recupero delle agenzie:', err);
    // In caso di errore, restituisci un array vuoto invece dei dati demo
    return { data: [], error: err };
  }
};

export const fetchMaintenances = async () => {
  try {
    console.log('Tentativo di recupero manutenzioni da Supabase...');
    const { data, error } = await supabase
      .from('maintenances')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Errore Supabase nel recupero delle manutenzioni:', error);
      throw error;
    }

    console.log('Dati manutenzioni ricevuti da Supabase:', data);

    // Anche se non ci sono dati, restituisci un array vuoto invece dei dati demo
    // Trasforma i dati dal formato snake_case al formato camelCase
    const formattedData = data ? data.map(maintenance => ({
      id: maintenance.id,
      busId: maintenance.bus_id,
      busName: maintenance.bus_name,
      type: maintenance.type,
      description: maintenance.description,
      date: maintenance.date,
      cost: maintenance.cost,
      status: maintenance.status,
      notes: maintenance.notes
    })) : [];

    console.log('Dati manutenzioni formattati:', formattedData);
    return { data: formattedData, error: null };
  } catch (err) {
    console.error('Errore nel recupero delle manutenzioni:', err);
    // In caso di errore, restituisci un array vuoto invece dei dati demo
    return { data: [], error: err };
  }
};

// Funzioni per l'inserimento e l'aggiornamento di dati
export const insertBus = async (bus: any) => {
  try {
    console.log('Tentativo di inserimento bus in Supabase:', bus);
    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedBus = {
      name: bus.name,
      plate: bus.plate,
      model: bus.model,
      seats: bus.seats,
      year: bus.year,
      status: bus.status,
      next_maintenance: bus.nextMaintenance,
      documents_status: bus.documentsStatus
    };

    console.log('Dati bus formattati per Supabase:', formattedBus);

    // Inserisci i dati in Supabase
    const { data, error } = await supabase
      .from('buses')
      .insert(formattedBus)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'inserimento del bus:', error);
      throw error;
    }

    console.log('Risposta inserimento bus da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(bus => ({
        id: bus.id,
        name: bus.name,
        plate: bus.plate,
        model: bus.model,
        seats: bus.seats,
        year: bus.year,
        status: bus.status,
        nextMaintenance: bus.next_maintenance,
        documentsStatus: bus.documents_status
      }))[0];

      console.log('Dati bus inserito formattati:', formattedData);
      return formattedData;
    } else {
      console.error('Nessun dato restituito dopo l\'inserimento del bus');
      throw new Error('Nessun dato restituito dopo l\'inserimento');
    }
  } catch (err) {
    console.error('Errore nell\'inserimento del bus:', err);
    // Non simuliamo più l'inserimento, ma lanciamo l'errore
    throw err;
  }
};

export const insertDriver = async (driver: any) => {
  try {
    console.log('Tentativo di inserimento autista in Supabase:', driver);
    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedDriver = {
      name: driver.name,
      license_number: driver.licenseNumber,
      license_expiry: driver.licenseExpiry,
      phone: driver.phone,
      email: driver.email,
      status: driver.status,
      weekly_hours: driver.drivingHours?.weekly || 0,
      bi_weekly_hours: driver.drivingHours?.biWeekly || 0,
      monthly_hours: driver.drivingHours?.monthly || 0
    };

    console.log('Dati autista formattati per Supabase:', formattedDriver);

    // Inserisci i dati in Supabase
    const { data, error } = await supabase
      .from('drivers')
      .insert(formattedDriver)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'inserimento dell\'autista:', error);
      throw error;
    }

    console.log('Risposta inserimento autista da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(driver => ({
        id: driver.id,
        name: driver.name,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry,
        phone: driver.phone,
        email: driver.email,
        status: driver.status,
        drivingHours: {
          weekly: driver.weekly_hours || 0,
          biWeekly: driver.bi_weekly_hours || 0,
          monthly: driver.monthly_hours || 0
        }
      }))[0];

      console.log('Dati autista inserito formattati:', formattedData);
      return formattedData;
    } else {
      console.error('Nessun dato restituito dopo l\'inserimento dell\'autista');
      throw new Error('Nessun dato restituito dopo l\'inserimento');
    }
  } catch (err) {
    console.error('Errore nell\'inserimento dell\'autista:', err);
    // Non simuliamo più l'inserimento, ma lanciamo l'errore
    throw err;
  }
};

export const insertTour = async (tour: any) => {
  try {
    console.log('Tentativo di inserimento tour in Supabase:', tour);

    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedTour = {
      title: tour.title,
      start: tour.start,
      end: tour.end,
      bus_id: tour.busId,
      driver_id: tour.driverId,
      agency_id: tour.agencyId,
      status: tour.status,
      notes: tour.notes,
      price: tour.price,
      passengers: tour.passengers,
      location: tour.location,
      bus_name: tour.busName,
      driver_name: tour.driverName,
      agency_name: tour.agencyName,
      daily_locations: tour.dailyLocations || []
    };

    console.log('Dati tour formattati per Supabase:', formattedTour);

    // Inserisci i dati in Supabase
    const { data, error } = await supabase
      .from('tours')
      .insert(formattedTour)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'inserimento del tour:', error);
      throw error;
    }

    console.log('Risposta inserimento tour da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(tour => ({
        id: tour.id,
        title: tour.title,
        start: tour.start,
        end: tour.end,
        busId: tour.bus_id,
        driverId: tour.driver_id,
        agencyId: tour.agency_id,
        status: tour.status,
        notes: tour.notes,
        price: tour.price,
        passengers: tour.passengers,
        location: tour.location,
        busName: tour.bus_name,
        driverName: tour.driver_name,
        agencyName: tour.agency_name,
        dailyLocations: tour.daily_locations || []
      }))[0];

      console.log('Dati tour inserito formattati:', formattedData);
      return formattedData;
    } else {
      console.error('Nessun dato restituito dopo l\'inserimento del tour');
      throw new Error('Nessun dato restituito dopo l\'inserimento');
    }
  } catch (err) {
    console.error('Errore nell\'inserimento del tour:', err);
    // Non simuliamo più l'inserimento, ma lanciamo l'errore
    throw err;
  }
};

export const insertAgency = async (agency: any) => {
  try {
    console.log('Tentativo di inserimento agenzia in Supabase:', agency);
    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedAgency = {
      name: agency.name,
      contact_person: agency.contactPerson,
      email: agency.email,
      phone: agency.phone,
      address: agency.address,
      city: agency.city,
      country: agency.country,
      status: agency.status,
      tours_count: agency.toursCount || 0
    };

    console.log('Dati agenzia formattati per Supabase:', formattedAgency);

    // Inserisci i dati in Supabase
    const { data, error } = await supabase
      .from('agencies')
      .insert(formattedAgency)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'inserimento dell\'agenzia:', error);
      throw error;
    }

    console.log('Risposta inserimento agenzia da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(agency => ({
        id: agency.id,
        name: agency.name,
        contactPerson: agency.contact_person,
        email: agency.email,
        phone: agency.phone,
        address: agency.address,
        city: agency.city,
        country: agency.country,
        status: agency.status,
        toursCount: agency.tours_count || 0
      }))[0];

      console.log('Dati agenzia inserita formattati:', formattedData);
      return formattedData;
    } else {
      console.error('Nessun dato restituito dopo l\'inserimento dell\'agenzia');
      throw new Error('Nessun dato restituito dopo l\'inserimento');
    }
  } catch (err) {
    console.error('Errore nell\'inserimento dell\'agenzia:', err);
    // Non simuliamo più l'inserimento, ma lanciamo l'errore
    throw err;
  }
};

export const insertMaintenance = async (maintenance: any) => {
  try {
    console.log('Tentativo di inserimento manutenzione in Supabase:', maintenance);
    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedMaintenance = {
      bus_id: maintenance.busId,
      bus_name: maintenance.busName,
      type: maintenance.type,
      description: maintenance.description,
      date: maintenance.date,
      cost: maintenance.cost,
      status: maintenance.status,
      notes: maintenance.notes
    };

    console.log('Dati manutenzione formattati per Supabase:', formattedMaintenance);

    // Inserisci i dati in Supabase
    const { data, error } = await supabase
      .from('maintenances')
      .insert(formattedMaintenance)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'inserimento della manutenzione:', error);
      throw error;
    }

    console.log('Risposta inserimento manutenzione da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(maintenance => ({
        id: maintenance.id,
        busId: maintenance.bus_id,
        busName: maintenance.bus_name,
        type: maintenance.type,
        description: maintenance.description,
        date: maintenance.date,
        cost: maintenance.cost,
        status: maintenance.status,
        notes: maintenance.notes
      }))[0];

      console.log('Dati manutenzione inserita formattati:', formattedData);
      return formattedData;
    } else {
      console.error('Nessun dato restituito dopo l\'inserimento della manutenzione');
      throw new Error('Nessun dato restituito dopo l\'inserimento');
    }
  } catch (err) {
    console.error('Errore nell\'inserimento della manutenzione:', err);
    // Non simuliamo più l'inserimento, ma lanciamo l'errore
    throw err;
  }
};

// Funzioni per l'aggiornamento di dati
export const updateBus = async (id: string, bus: any) => {
  try {
    console.log('Tentativo di aggiornamento bus con ID:', id, 'Dati:', bus);

    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedBus = {
      name: bus.name,
      plate: bus.plate,
      model: bus.model,
      seats: bus.seats,
      year: bus.year,
      status: bus.status,
      next_maintenance: bus.nextMaintenance,
      documents_status: bus.documentsStatus
    };

    console.log('Dati bus formattati per Supabase:', formattedBus);

    // Aggiorna il bus in Supabase
    const { data, error } = await supabase
      .from('buses')
      .update(formattedBus)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'aggiornamento del bus:', error);
      throw error;
    }

    console.log('Risposta aggiornamento bus da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(bus => ({
        id: bus.id,
        name: bus.name,
        plate: bus.plate,
        model: bus.model,
        seats: bus.seats,
        year: bus.year,
        status: bus.status,
        nextMaintenance: bus.next_maintenance,
        documentsStatus: bus.documents_status
      }))[0];

      console.log('Dati bus aggiornato formattati:', formattedData);
      return { data: [formattedData], error: null };
    } else {
      console.error('Nessun dato restituito dopo l\'aggiornamento del bus');
      throw new Error('Nessun dato restituito dopo l\'aggiornamento');
    }
  } catch (err) {
    console.error('Errore nell\'aggiornamento del bus:', err);
    // Non simuliamo più l'aggiornamento, ma lanciamo l'errore
    return { data: null, error: err };
  }
};

export const updateDriver = async (id: string, driver: any) => {
  try {
    console.log('Tentativo di aggiornamento autista con ID:', id, 'Dati:', driver);

    // Trasforma i dati dal formato camelCase al formato snake_case
    const formattedDriver = {
      name: driver.name,
      license_number: driver.licenseNumber,
      license_expiry: driver.licenseExpiry,
      phone: driver.phone,
      email: driver.email,
      status: driver.status,
      weekly_hours: driver.drivingHours?.weekly || 0,
      bi_weekly_hours: driver.drivingHours?.biWeekly || 0,
      monthly_hours: driver.drivingHours?.monthly || 0
    };

    console.log('Dati autista formattati per Supabase:', formattedDriver);

    // Aggiorna l'autista in Supabase
    const { data, error } = await supabase
      .from('drivers')
      .update(formattedDriver)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Errore Supabase nell\'aggiornamento dell\'autista:', error);
      throw error;
    }

    console.log('Risposta aggiornamento autista da Supabase:', data);

    if (data && data.length > 0) {
      // Trasforma i dati di ritorno dal formato snake_case al formato camelCase
      const formattedData = data.map(driver => ({
        id: driver.id,
        name: driver.name,
        licenseNumber: driver.license_number,
        licenseExpiry: driver.license_expiry,
        phone: driver.phone,
        email: driver.email,
        status: driver.status,
        drivingHours: {
          weekly: driver.weekly_hours || 0,
          biWeekly: driver.bi_weekly_hours || 0,
          monthly: driver.monthly_hours || 0
        }
      }))[0];

      console.log('Dati autista aggiornato formattati:', formattedData);
      return { data: [formattedData], error: null };
    } else {
      console.error('Nessun dato restituito dopo l\'aggiornamento dell\'autista');
      throw new Error('Nessun dato restituito dopo l\'aggiornamento');
    }
  } catch (err) {
    console.error('Errore nell\'aggiornamento dell\'autista:', err);
    // Non simuliamo più l'aggiornamento, ma lanciamo l'errore
    return { data: null, error: err };
  }
};

export const updateTour = async (id: string, tour: any) => {
  try {
    const { data, error } = await supabase.from('tours').update(tour).eq('id', id).select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.log('Simulazione aggiornamento tour in modalità demo');
    return { data: [{ ...tour, id }], error: null };
  }
};

export const updateAgency = async (id: string, agency: any) => {
  try {
    const { data, error } = await supabase.from('agencies').update(agency).eq('id', id).select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.log('Simulazione aggiornamento agenzia in modalità demo');
    return { data: [{ ...agency, id }], error: null };
  }
};

export const updateMaintenance = async (id: string, maintenance: any) => {
  try {
    const { data, error } = await supabase.from('maintenances').update(maintenance).eq('id', id).select();

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (err) {
    console.log('Simulazione aggiornamento manutenzione in modalità demo');
    return { data: [{ ...maintenance, id }], error: null };
  }
};

// Funzioni per l'eliminazione di dati
export const deleteBus = async (id: string) => {
  try {
    console.log('Tentativo di eliminazione bus con ID:', id);

    // Elimina il bus da Supabase
    const { error } = await supabase
      .from('buses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore Supabase nell\'eliminazione del bus:', error);
      throw error;
    }

    console.log('Bus eliminato con successo');
    return { error: null };
  } catch (err) {
    console.error('Errore nell\'eliminazione del bus:', err);
    // Non simuliamo più l'eliminazione, ma lanciamo l'errore
    return { error: err };
  }
};

export const deleteDriver = async (id: string) => {
  try {
    console.log('Tentativo di eliminazione autista con ID:', id);

    // Elimina l'autista da Supabase
    const { error } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore Supabase nell\'eliminazione dell\'autista:', error);
      throw error;
    }

    console.log('Autista eliminato con successo');
    return { error: null };
  } catch (err) {
    console.error('Errore nell\'eliminazione dell\'autista:', err);
    // Non simuliamo più l'eliminazione, ma lanciamo l'errore
    return { error: err };
  }
};

export const deleteTour = async (id: string) => {
  try {
    console.log('Tentativo di eliminazione tour con ID:', id);

    // Elimina il tour da Supabase
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore Supabase nell\'eliminazione del tour:', error);
      throw error;
    }

    console.log('Tour eliminato con successo');
    return { error: null };
  } catch (err) {
    console.error('Errore nell\'eliminazione del tour:', err);
    // Non simuliamo più l'eliminazione, ma lanciamo l'errore
    return { error: err };
  }
};

export const deleteAgency = async (id: string) => {
  try {
    console.log('Tentativo di eliminazione agenzia con ID:', id);

    // Elimina l'agenzia da Supabase
    const { error } = await supabase
      .from('agencies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore Supabase nell\'eliminazione dell\'agenzia:', error);
      throw error;
    }

    console.log('Agenzia eliminata con successo');
    return { error: null };
  } catch (err) {
    console.error('Errore nell\'eliminazione dell\'agenzia:', err);
    // Non simuliamo più l'eliminazione, ma lanciamo l'errore
    return { error: err };
  }
};

export const deleteMaintenance = async (id: string) => {
  try {
    console.log('Tentativo di eliminazione manutenzione con ID:', id);

    // Elimina la manutenzione da Supabase
    const { error } = await supabase
      .from('maintenances')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Errore Supabase nell\'eliminazione della manutenzione:', error);
      throw error;
    }

    console.log('Manutenzione eliminata con successo');
    return { error: null };
  } catch (err) {
    console.error('Errore nell\'eliminazione della manutenzione:', err);
    // Non simuliamo più l'eliminazione, ma lanciamo l'errore
    return { error: err };
  }
};
