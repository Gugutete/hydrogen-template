import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import NewBusCalendar from '../components/calendar/NewBusCalendar';
import AddTourModal from '../components/modals/AddTourModal';
import EditTourModal from '../components/modals/EditTourModal';
import ToursList from '../components/tours/ToursList';
import { fetchTours, fetchBuses, fetchDrivers, fetchAgencies, insertTour, updateTour, deleteTour } from '../lib/supabaseClient';

interface Tour {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  busName: string;
  driverId: string;
  driverName: string;
  agencyId: string;
  agencyName: string;
  status: string;
  price?: number;
  passengers?: number;
  notes?: string;
  location?: string;
}

const ToursPage = () => {
  const location = useLocation();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Gestisce l'apertura del modale quando si naviga dalla pagina del calendario
  useEffect(() => {
    if (location.state) {
      if (location.state.openAddModal) {
        setShowAddModal(true);
        if (location.state.selectedDate) {
          setSelectedDate(location.state.selectedDate);
        }
        if (location.state.selectedBusId) {
          setSelectedBusId(location.state.selectedBusId);
        }
      } else if (location.state.openEditModal && location.state.tourData) {
        setShowEditModal(true);
        setSelectedTour(location.state.tourData);
      }
      // Rimuovi lo stato per evitare che il modale si apra nuovamente al refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [tours, setTours] = useState<Tour[]>([]);
  const [buses, setBuses] = useState<Array<{ id: string; name: string; plate?: string }>>([]);
  const [drivers, setDrivers] = useState<Array<{ id: string; name: string }>>([]);
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i dati all'avvio
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Recupera tutti i dati necessari in parallelo
        const [toursResult, busesResult, driversResult, agenciesResult] = await Promise.all([
          fetchTours(),
          fetchBuses(),
          fetchDrivers(),
          fetchAgencies()
        ]);

        // Verifica errori
        if (toursResult.error) throw toursResult.error;
        if (busesResult.error) throw busesResult.error;
        if (driversResult.error) throw driversResult.error;
        if (agenciesResult.error) throw agenciesResult.error;

        console.log('Dati recuperati:', {
          tours: toursResult.data,
          buses: busesResult.data,
          drivers: driversResult.data,
          agencies: agenciesResult.data
        });

        // Imposta i dati recuperati
        if (toursResult.data) setTours(toursResult.data);

        // Prepara i dati dei bus per i dropdown
        if (busesResult.data) {
          const formattedBuses = busesResult.data.map(bus => ({
            id: bus.id,
            name: bus.name,
            plate: bus.plate
          }));
          setBuses(formattedBuses);
        }

        // Prepara i dati degli autisti per i dropdown
        if (driversResult.data) {
          const formattedDrivers = driversResult.data.map(driver => ({
            id: driver.id,
            name: driver.name
          }));
          setDrivers(formattedDrivers);
        }

        // Prepara i dati delle agenzie per i dropdown
        if (agenciesResult.data) {
          const formattedAgencies = agenciesResult.data.map(agency => ({
            id: agency.id,
            name: agency.name
          }));
          setAgencies(formattedAgencies);
        }
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
        setError('Si è verificato un errore nel caricamento dei dati.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddTour = async (newTour: Tour) => {
    try {
      setLoading(true);
      console.log('Aggiunto nuovo tour:', newTour);

      // Inserisci il tour nel database
      const result = await insertTour(newTour);

      if (result) {
        // Aggiorna lo stato locale con i dati restituiti dal server
        setTours(prev => [...prev, result]);
      }
    } catch (err) {
      console.error('Errore nell\'inserimento del tour:', err);
      // In caso di errore, aggiungi comunque il tour allo stato locale
      setTours(prev => [...prev, newTour]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTour = async (updatedTour: Tour) => {
    try {
      setLoading(true);
      // Aggiorna il tour nel database
      const { data, error } = await updateTour(updatedTour.id, updatedTour);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale con i dati restituiti dal server
      if (data && data.length > 0) {
        setTours(prev => prev.map(tour => tour.id === updatedTour.id ? data[0] : tour));
      } else {
        // Se non ci sono dati restituiti, usa i dati locali
        setTours(prev => prev.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento del tour:', err);
      // In caso di errore, aggiorna comunque lo stato locale
      setTours(prev => prev.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
      try {
        setLoading(true);
        // Elimina il tour dal database
        const { error } = await deleteTour(tourId);

        if (error) {
          throw error;
        }

        // Aggiorna lo stato locale
        setTours(prev => prev.filter(tour => tour.id !== tourId));
      } catch (err) {
        console.error('Errore nell\'eliminazione del tour:', err);
        // In caso di errore, elimina comunque il tour dallo stato locale
        setTours(prev => prev.filter(tour => tour.id !== tourId));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicateTour = (tourToDuplicate: Tour) => {
    const newTour = {
      ...tourToDuplicate,
      id: `tour${Date.now()}`,
      title: `${tourToDuplicate.title} (Copia)`
    };
    setTours(prev => [...prev, newTour]);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="header">
          <h1 className="page-title">Gestione Tour</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{
              display: 'flex',
              borderRadius: '0.375rem',
              overflow: 'hidden',
              border: '1px solid #d1d5db'
            }}>
              <button
                onClick={() => setView('calendar')}
                className={`btn ${view === 'calendar' ? 'btn-primary' : 'btn-white'}`}
                style={{
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendario
              </button>
              <button
                onClick={() => setView('list')}
                className={`btn ${view === 'list' ? 'btn-primary' : 'btn-white'}`}
                style={{
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Lista
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              style={{
                minWidth: '160px',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Aggiungi Tour
            </button>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="mt-4">Caricamento dati in corso...</p>
            </div>
          </div>
        ) : error ? (
          <div className="card">
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary mt-4"
              >
                Aggiungi il primo tour
              </button>
            </div>
          </div>
        ) : view === 'calendar' ? (
          <NewBusCalendar tours={tours} onDeleteTour={handleDeleteTour} />
        ) : (
          <ToursList
            tours={tours}
            onEdit={(tour) => {
              setSelectedTour(tour);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteTour}
            onDuplicate={handleDuplicateTour}
          />
        )}

        {/* Add Tour Modal */}
        <AddTourModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTour}
          buses={buses}
          drivers={drivers}
          agencies={agencies}
          initialDate={selectedDate}
          initialBusId={selectedBusId}
        />

        {/* Edit Tour Modal */}
        <EditTourModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditTour}
          onDelete={handleDeleteTour}
          buses={buses}
          drivers={drivers}
          agencies={agencies}
          tour={selectedTour}
        />
      </div>
    </DashboardLayout>
  );
};

export default ToursPage;
