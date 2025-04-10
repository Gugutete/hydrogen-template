import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddDriverModal from '../components/modals/AddDriverModal';
import EditDriverModal2 from '../components/modals/EditDriverModal2';
import DriversList from '../components/drivers/DriversList';
import { updateDriver } from '../lib/supabaseClient';

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
  const [drivers, setDrivers] = useState<Driver[]>([
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
  ]);

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

  const handleAddDriver = (newDriver: Driver) => {
    setDrivers(prev => [...prev, newDriver]);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleUpdateDriver = async (updatedDriver: Driver) => {
    try {
      // Aggiorna l'autista nel database
      const { data, error } = await updateDriver(updatedDriver.id, updatedDriver);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale
      setDrivers(prev => prev.map(driver => driver.id === updatedDriver.id ? updatedDriver : driver));
    } catch (error) {
      console.error('Error updating driver:', error);
      // In caso di errore, aggiorna comunque lo stato locale
      setDrivers(prev => prev.map(driver => driver.id === updatedDriver.id ? updatedDriver : driver));
    }
  };

  const handleDeleteDriver = (driverId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questo autista?')) {
      setDrivers(prev => prev.filter(driver => driver.id !== driverId));
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

        <div className="card">
          <DriversList
            drivers={drivers}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            onDuplicate={handleDuplicateDriver}
          />
        </div>
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
