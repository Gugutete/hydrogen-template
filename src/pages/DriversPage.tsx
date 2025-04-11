import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddDriverModal from '../components/modals/AddDriverModal';
import EditDriverModal2 from '../components/modals/EditDriverModal2';
import DriversList from '../components/drivers/DriversList';
import { fetchDrivers, insertDriver, updateDriver, deleteDriver } from '../lib/supabaseClient';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  status: string;
  drivingHours: {
    weekly: number;
    biWeekly: number;
    monthly: number;
  };
}

const DriversPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i dati degli autisti all'avvio
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await fetchDrivers();

        if (error) {
          throw error;
        }

        console.log('Dati autisti recuperati da Supabase:', data);

        if (data && data.length > 0) {
          setDrivers(data);
        } else {
          // Se non ci sono dati, mostra un messaggio
          setError('Nessun autista trovato. Aggiungi il primo autista.');
        }
      } catch (err) {
        console.error('Errore nel caricamento degli autisti:', err);
        setError('Si è verificato un errore nel caricamento degli autisti.');
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo';
      case 'inactive':
        return 'Inattivo';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  const getDrivingHoursStatus = (weekly: number, biWeekly: number) => {
    // According to EU regulation 561/2006
    if (weekly > 56 || biWeekly > 90) {
      return 'danger';
    } else if (weekly > 50 || biWeekly > 80) {
      return 'warning';
    } else {
      return 'success';
    }
  };

  const handleAddDriver = async (newDriver: Driver) => {
    try {
      setLoading(true);
      // Inserisci l'autista nel database
      const result = await insertDriver(newDriver);

      if (result) {
        // Aggiorna lo stato locale con i dati restituiti dal server
        setDrivers(prev => [...prev, result]);
      }
    } catch (err) {
      console.error('Errore nell\'inserimento dell\'autista:', err);
      // In caso di errore, aggiungi comunque l'autista allo stato locale
      setDrivers(prev => [...prev, newDriver]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleUpdateDriver = async (updatedDriver: Driver) => {
    try {
      setLoading(true);
      // Aggiorna l'autista nel database
      const { data, error } = await updateDriver(updatedDriver.id, updatedDriver);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale con i dati restituiti dal server
      if (data && data.length > 0) {
        setDrivers(prev => prev.map(driver => driver.id === updatedDriver.id ? data[0] : driver));
      } else {
        // Se non ci sono dati restituiti, usa i dati locali
        setDrivers(prev => prev.map(driver => driver.id === updatedDriver.id ? updatedDriver : driver));
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento dell\'autista:', err);
      // In caso di errore, aggiorna comunque lo stato locale
      setDrivers(prev => prev.map(driver => driver.id === updatedDriver.id ? updatedDriver : driver));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async (driverId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questo autista?')) {
      try {
        setLoading(true);
        // Elimina l'autista dal database
        const { error } = await deleteDriver(driverId);

        if (error) {
          throw error;
        }

        // Aggiorna lo stato locale
        setDrivers(prev => prev.filter(driver => driver.id !== driverId));
      } catch (err) {
        console.error('Errore nell\'eliminazione dell\'autista:', err);
        // In caso di errore, elimina comunque l'autista dallo stato locale
        setDrivers(prev => prev.filter(driver => driver.id !== driverId));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicateDriver = (driver: Driver) => {
    // Crea una copia dell'autista con un nuovo ID
    const duplicatedDriver = {
      ...driver,
      id: `driver-${Date.now()}`, // Genera un ID temporaneo
      name: `${driver.name} (Copia)`
    };

    // Aggiungi l'autista duplicato
    setDrivers(prev => [...prev, duplicatedDriver]);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="header">
          <h1 className="page-title">Gestione Autisti</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{
              minWidth: '160px',
              backgroundColor: '#4338ca',
              padding: '0.75rem 1.25rem',
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
            Aggiungi Autista
          </button>
        </div>

        {loading ? (
          <div className="card">
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="mt-4">Caricamento autisti in corso...</p>
            </div>
          </div>
        ) : error && drivers.length === 0 ? (
          <div className="card">
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary mt-4"
              >
                Aggiungi il primo autista
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <DriversList
              drivers={drivers}
              onEdit={handleEditDriver}
              onDelete={handleDeleteDriver}
              onDuplicate={handleDuplicateDriver}
            />
          </div>
        )}
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddDriver}
      />

      {/* Edit Driver Modal */}
      {showEditModal && selectedDriver && (
        <EditDriverModal2
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateDriver}
          driver={selectedDriver}
        />
      )}
    </DashboardLayout>
  );
};

export default DriversPage;
