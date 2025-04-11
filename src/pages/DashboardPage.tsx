import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { fetchBuses, fetchDrivers, fetchTours, fetchAgencies, fetchMaintenances } from '../lib/supabaseClient';

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
    nextMaintenance: '2023-07-15',
    documentsStatus: 'valid'
  },
  {
    id: 'bus2',
    name: 'Bus Gran Turismo 2',
    plate: 'NA456CD',
    model: 'Setra S 516 HDH',
    seats: 48,
    year: 2019,
    status: 'maintenance',
    nextMaintenance: '2023-04-08',
    documentsStatus: 'expiring'
  },
  {
    id: 'bus3',
    name: 'Bus Gran Turismo 3',
    plate: 'NA789EF',
    model: 'MAN Lion\'s Coach',
    seats: 50,
    year: 2021,
    status: 'active',
    nextMaintenance: '2023-09-05',
    documentsStatus: 'valid'
  }
];

const demoDrivers = [
  {
    id: 'driver1',
    name: 'Mario Rossi',
    licenseNumber: 'NA12345678',
    licenseExpiry: '2025-05-15',
    phone: '+39 123 456 7890',
    email: 'mario.rossi@example.com',
    status: 'active',
    drivingHours: {
      weekly: 32,
      biWeekly: 68,
      monthly: 140
    }
  },
  {
    id: 'driver2',
    name: 'Luigi Verdi',
    licenseNumber: 'NA87654321',
    licenseExpiry: '2024-08-22',
    phone: '+39 098 765 4321',
    email: 'luigi.verdi@example.com',
    status: 'active',
    drivingHours: {
      weekly: 40,
      biWeekly: 75,
      monthly: 160
    }
  },
  {
    id: 'driver3',
    name: 'Giuseppe Bianchi',
    licenseNumber: 'NA11223344',
    licenseExpiry: '2023-12-10',
    phone: '+39 111 222 3333',
    email: 'giuseppe.bianchi@example.com',
    status: 'inactive',
    drivingHours: {
      weekly: 0,
      biWeekly: 45,
      monthly: 120
    }
  }
];

const demoAgencies = [
  {
    id: 'agency1',
    name: 'Viaggi Napoli',
    contactPerson: 'Antonio Esposito',
    email: 'info@viagginapoli.it',
    phone: '+39 081 123 4567',
    address: 'Via Toledo 123',
    city: 'Napoli',
    country: 'Italia',
    status: 'active',
    toursCount: 1
  },
  {
    id: 'agency2',
    name: 'Europa Tours',
    contactPerson: 'Maria Bianchi',
    email: 'contact@europatours.com',
    phone: '+39 02 987 6543',
    address: 'Via Montenapoleone 45',
    city: 'Milano',
    country: 'Italia',
    status: 'active',
    toursCount: 1
  },
  {
    id: 'agency3',
    name: 'Italia Vacanze',
    contactPerson: 'Giuseppe Verdi',
    email: 'info@italiavacanze.it',
    phone: '+39 06 543 2109',
    address: 'Via del Corso 78',
    city: 'Roma',
    country: 'Italia',
    status: 'inactive',
    toursCount: 1
  }
];

const demoTours = [
  {
    id: 'tour1',
    title: 'Tour Roma',
    start: '2023-06-10',
    end: '2023-06-15',
    busId: 'bus1',
    driverId: 'driver1',
    agencyId: 'agency1',
    status: 'active',
    price: 5000,
    passengers: 45,
    notes: 'Tour culturale a Roma'
  },
  {
    id: 'tour2',
    title: 'Tour Milano',
    start: '2023-06-12',
    end: '2023-06-18',
    busId: 'bus2',
    driverId: 'driver2',
    agencyId: 'agency2',
    status: 'preparation',
    price: 6500,
    passengers: 40,
    notes: 'Tour business a Milano'
  },
  {
    id: 'tour3',
    title: 'Tour Venezia',
    start: '2023-06-20',
    end: '2023-06-25',
    busId: 'bus3',
    driverId: 'driver3',
    agencyId: 'agency3',
    status: 'active',
    price: 7000,
    passengers: 48,
    notes: 'Tour romantico a Venezia'
  }
];

const DashboardPage = () => {
  // Stati per i dati
  const [stats, setStats] = useState({
    buses: 0,
    drivers: 0,
    activeTours: 0,
    agencies: 0
  });

  const [upcomingTours, setUpcomingTours] = useState<Array<{
    id: string | number;
    name: string;
    startDate: string;
    endDate: string;
    bus: string;
    driver: string;
    agency: string;
  }>>([]);
  const [alerts, setAlerts] = useState<Array<{
    id: number;
    type: 'info' | 'warning' | 'danger';
    message: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i dati all'avvio
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Recupera tutti i dati necessari
        const [busesResult, driversResult, toursResult, agenciesResult, maintenancesResult] = await Promise.all([
          fetchBuses(),
          fetchDrivers(),
          fetchTours(),
          fetchAgencies(),
          fetchMaintenances()
        ]);

        console.log('Dati recuperati:', {
          buses: busesResult.data,
          drivers: driversResult.data,
          tours: toursResult.data,
          agencies: agenciesResult.data,
          maintenances: maintenancesResult.data
        });

        // Usa i dati reali o i dati di esempio se non ci sono dati reali
        const buses = busesResult.data.length > 0 ? busesResult.data : demoBuses;
        const drivers = driversResult.data.length > 0 ? driversResult.data : demoDrivers;
        const tours = toursResult.data.length > 0 ? toursResult.data : demoTours;
        const agencies = agenciesResult.data.length > 0 ? agenciesResult.data : demoAgencies;

        // Calcola le statistiche
        const busesCount = buses.length;
        const driversCount = drivers.length;
        const activeToursCount = tours.filter(tour =>
          tour.status === 'active' ||
          (new Date(tour.start || tour.startDate) <= new Date() && new Date(tour.end || tour.endDate) >= new Date())
        ).length;
        const agenciesCount = agencies.length;

        setStats({
          buses: busesCount,
          drivers: driversCount,
          activeTours: activeToursCount,
          agencies: agenciesCount
        });

        // Prepara i prossimi tour
        const today = new Date();
        const nextTours = tours
          .filter(tour => new Date(tour.start || tour.startDate) >= today)
          .sort((a, b) => new Date(a.start || a.startDate) - new Date(b.start || b.startDate))
          .slice(0, 5) // Prendi i primi 5 tour futuri
          .map(tour => {
            // Trova i dettagli del bus, autista e agenzia
            const bus = buses.find(b => b.id === (tour.busId || tour.bus_id));
            const driver = drivers.find(d => d.id === (tour.driverId || tour.driver_id));
            const agency = agencies.find(a => a.id === (tour.agencyId || tour.agency_id));

            return {
              id: tour.id,
              name: tour.title,
              startDate: tour.start || tour.startDate || tour.start_date,
              endDate: tour.end || tour.endDate || tour.end_date,
              bus: bus ? bus.name : 'Non assegnato',
              driver: driver ? driver.name : 'Non assegnato',
              agency: agency ? agency.name : 'Non assegnata'
            };
          });

        setUpcomingTours(nextTours);

        // Genera avvisi
        const newAlerts = [];
        let alertId = 1;

        // Avvisi per documenti in scadenza
        buses.forEach(bus => {
          if (bus.documentsStatus === 'expiring') {
            newAlerts.push({
              id: alertId++,
              type: 'warning',
              message: `Documenti del bus ${bus.name} in scadenza`
            });
          } else if (bus.documentsStatus === 'expired') {
            newAlerts.push({
              id: alertId++,
              type: 'danger',
              message: `Documenti del bus ${bus.name} scaduti`
            });
          }
        });

        // Avvisi per manutenzioni programmate
        buses.forEach(bus => {
          const nextMaintenance = bus.nextMaintenance;
          if (nextMaintenance) {
            const maintenanceDate = new Date(nextMaintenance);
            const daysUntilMaintenance = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24));

            if (daysUntilMaintenance <= 15 && daysUntilMaintenance > 0) {
              newAlerts.push({
                id: alertId++,
                type: 'info',
                message: `Manutenzione programmata per ${bus.name} il ${new Date(nextMaintenance).toLocaleDateString('it-IT')}`
              });
            } else if (daysUntilMaintenance <= 0) {
              newAlerts.push({
                id: alertId++,
                type: 'danger',
                message: `Manutenzione scaduta per ${bus.name}`
              });
            }
          }
        });

        // Avvisi per ore di guida degli autisti
        drivers.forEach(driver => {
          if (driver.drivingHours && driver.drivingHours.weekly >= 45) {
            newAlerts.push({
              id: alertId++,
              type: 'warning',
              message: `L'autista ${driver.name} ha raggiunto il limite di ore di guida settimanali (${driver.drivingHours.weekly} ore)`
            });
          }
        });

        // Avvisi per licenze in scadenza
        drivers.forEach(driver => {
          const licenseExpiry = new Date(driver.licenseExpiry);
          const daysUntilExpiry = Math.ceil((licenseExpiry - today) / (1000 * 60 * 60 * 24));

          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            newAlerts.push({
              id: alertId++,
              type: 'warning',
              message: `La licenza dell'autista ${driver.name} scadrà tra ${daysUntilExpiry} giorni`
            });
          } else if (daysUntilExpiry <= 0) {
            newAlerts.push({
              id: alertId++,
              type: 'danger',
              message: `La licenza dell'autista ${driver.name} è scaduta`
            });
          }
        });

        setAlerts(newAlerts);
        setLoading(false);
      } catch (err) {
        console.error('Errore nel caricamento dei dati della dashboard:', err);
        setError('Si è verificato un errore nel caricamento dei dati. Utilizzo dati di esempio.');

        // In caso di errore, usa i dati di esempio
        const busesCount = demoBuses.length;
        const driversCount = demoDrivers.length;
        const activeToursCount = demoTours.filter(tour =>
          tour.status === 'active' ||
          (new Date(tour.start_date) <= new Date() && new Date(tour.end_date) >= new Date())
        ).length;
        const agenciesCount = demoAgencies.length;

        setStats({
          buses: busesCount,
          drivers: driversCount,
          activeTours: activeToursCount,
          agencies: agenciesCount
        });

        // Prepara i prossimi tour di esempio
        const today = new Date();
        const nextTours = demoTours
          .filter(tour => new Date(tour.start_date) >= today)
          .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
          .slice(0, 5)
          .map(tour => {
            const bus = demoBuses.find(b => b.id === tour.busId);
            const driver = demoDrivers.find(d => d.id === tour.driverId);
            const agency = demoAgencies.find(a => a.id === tour.agencyId);

            return {
              id: tour.id,
              name: tour.title,
              startDate: tour.start_date,
              endDate: tour.end_date,
              bus: bus ? bus.name : 'Non assegnato',
              driver: driver ? driver.name : 'Non assegnato',
              agency: agency ? agency.name : 'Non assegnata'
            };
          });

        setUpcomingTours(nextTours);

        // Genera avvisi di esempio
        const newAlerts = [
          { id: 1, type: 'warning', message: 'Documento "Assicurazione" del Bus Gran Turismo 2 scadrà tra 15 giorni' },
          { id: 2, type: 'danger', message: 'Documento "Revisione" del Bus Gran Turismo 2 è scaduto' },
          { id: 3, type: 'info', message: 'Manutenzione programmata per Bus Gran Turismo 1 il 15/05/2023' },
          { id: 4, type: 'warning', message: 'L\'autista Mario Rossi ha raggiunto il limite di ore di guida settimanali' }
        ];

        setAlerts(newAlerts);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="page-title">Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 3v3m-8-3v3m0-10a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Bus</p>
              <p className="stat-value">{stats.buses}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Autisti</p>
              <p className="stat-value">{stats.drivers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Tour Attivi</p>
              <p className="stat-value">{stats.activeTours}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Agenzie</p>
              <p className="stat-value">{stats.agencies}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Avvisi</h2>
          {loading ? (
            <div className="text-center py-4">Caricamento in corso...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-4">Nessun avviso da mostrare</div>
          ) : (
            <div className="space-y-4">
              {alerts.map(alert => {
                let bgColor = '';
                let textColor = '';
                let Icon = null;

                if (alert.type === 'danger') {
                  bgColor = '#fee2e2';
                  textColor = '#b91c1c';
                  Icon = () => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  );
                } else if (alert.type === 'warning') {
                  bgColor = '#fef3c7';
                  textColor = '#92400e';
                  Icon = () => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  );
                } else {
                  bgColor = '#e0f2fe';
                  textColor = '#0369a1';
                  Icon = () => (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  );
                }

                return (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      backgroundColor: bgColor,
                      color: textColor,
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div style={{
                      flexShrink: 0,
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{alert.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Tours */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Prossimi Tour</h2>
          {loading ? (
            <div className="text-center py-4">Caricamento in corso...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : upcomingTours.length === 0 ? (
            <div className="text-center py-4">Nessun tour programmato</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Date</th>
                    <th>Bus</th>
                    <th>Autista</th>
                    <th>Agenzia</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTours.map(tour => (
                    <tr key={tour.id}>
                      <td>
                        <div className="font-medium">{tour.name}</div>
                      </td>
                      <td>
                        <div>
                          {new Date(tour.startDate).toLocaleDateString('it-IT')} - {new Date(tour.endDate).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td>
                        <div>{tour.bus}</div>
                      </td>
                      <td>
                        <div>{tour.driver}</div>
                      </td>
                      <td>
                        <div>{tour.agency}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
