import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import NewBusCalendar from '../components/calendar/NewBusCalendar';
import AddTourModal from '../components/modals/AddTourModal';
import EditTourModal from '../components/modals/EditTourModal';
import ToursList from '../components/tours/ToursList';

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

  const [tours, setTours] = useState<Tour[]>([
    {
      id: 'tour1',
      title: 'Tour Roma',
      start: '2023-06-10',
      end: '2023-06-15',
      busId: 'bus1',
      busName: 'Bus Gran Turismo 1',
      driverId: 'driver1',
      driverName: 'Mario Rossi',
      agencyId: 'agency1',
      agencyName: 'Viaggi Napoli',
      status: 'active',
      location: 'Roma - Hotel Colosseo'
    },
    {
      id: 'tour2',
      title: 'Tour Milano',
      start: '2023-06-12',
      end: '2023-06-18',
      busId: 'bus2',
      busName: 'Bus Gran Turismo 2',
      driverId: 'driver2',
      driverName: 'Luigi Verdi',
      agencyId: 'agency2',
      agencyName: 'Europa Tours',
      status: 'preparation',
      location: 'Milano - Piazza Duomo'
    },
    {
      id: 'tour3',
      title: 'Tour Venezia',
      start: '2023-06-20',
      end: '2023-06-25',
      busId: 'bus3',
      busName: 'Bus Gran Turismo 3',
      driverId: 'driver3',
      driverName: 'Giuseppe Bianchi',
      agencyId: 'agency3',
      agencyName: 'Italia Vacanze',
      status: 'active',
      location: 'Venezia - Piazza San Marco'
    }
  ]);

  const buses = [
    { id: 'bus1', name: 'Bus Gran Turismo 1', plate: 'AA123BB' },
    { id: 'bus2', name: 'Bus Gran Turismo 2', plate: 'CC456DD' },
    { id: 'bus3', name: 'Bus Gran Turismo 3', plate: 'EE789FF' },
    { id: 'bus4', name: 'Bus Gran Turismo 4', plate: 'GG012HH' }
  ];

  const drivers = [
    { id: 'driver1', name: 'Mario Rossi' },
    { id: 'driver2', name: 'Luigi Verdi' },
    { id: 'driver3', name: 'Giuseppe Bianchi' }
  ];

  const agencies = [
    { id: 'agency1', name: 'Viaggi Napoli' },
    { id: 'agency2', name: 'Europa Tours' },
    { id: 'agency3', name: 'Italia Vacanze' }
  ];

  const handleAddTour = (newTour: Tour) => {
    console.log('Aggiunto nuovo tour:', newTour);
    setTours(prev => [...prev, newTour]);
  };

  const handleEditTour = (updatedTour: Tour) => {
    setTours(prev => prev.map(tour => tour.id === updatedTour.id ? updatedTour : tour));
  };

  const handleDeleteTour = (tourId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
      setTours(prev => prev.filter(tour => tour.id !== tourId));
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

        {view === 'calendar' ? (
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
