import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddBusModal2 from '../components/modals/AddBusModal2';
import EditBusModal2 from '../components/modals/EditBusModal2';
import BusList from '../components/buses/BusList';
import { fetchBuses, insertBus, deleteBus, updateBus } from '../lib/supabaseClient';

interface Bus {
  id: string;
  name: string;
  plate: string;
  model: string;
  seats: number;
  year: number;
  status: string;
  nextMaintenance: string;
  documentsStatus: string;
}

const BusesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busToDelete, setBusToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadBuses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await fetchBuses();

        if (error) {
          throw error;
        }

        if (data) {
          // Converti i nomi delle colonne da snake_case a camelCase
          const formattedData = data.map((bus: any) => ({
            id: bus.id,
            name: bus.name,
            plate: bus.plate,
            model: bus.model,
            seats: bus.seats,
            year: bus.year,
            status: bus.status,
            nextMaintenance: bus.next_maintenance,
            documentsStatus: bus.documents_status
          }));

          setBuses(formattedData);
        } else {
          // Se non ci sono dati nel database, usa i dati di esempio
          setBuses([
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
          ]);
        }
      } catch (err: any) {
        console.error('Error loading buses:', err);
        setError(err.message || 'Errore nel caricamento dei bus');

        // In caso di errore, usa i dati di esempio
        setBuses([
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
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBuses();
  }, []);

  // Queste variabili di stato sono già definite sopra

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'maintenance':
        return 'badge-danger';
      case 'inactive':
        return 'badge-info';
      case 'valid':
        return 'badge-success';
      case 'expiring':
        return 'badge-warning';
      case 'expired':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo';
      case 'maintenance':
        return 'In Manutenzione';
      case 'inactive':
        return 'Inattivo';
      case 'valid':
        return 'Validi';
      case 'expiring':
        return 'In Scadenza';
      case 'expired':
        return 'Scaduti';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  const handleAddBus = async (newBus: Bus) => {
    try {
      // Converti i nomi delle proprietà da camelCase a snake_case
      const busData = {
        name: newBus.name,
        plate: newBus.plate,
        model: newBus.model,
        seats: newBus.seats,
        year: newBus.year,
        status: newBus.status,
        next_maintenance: newBus.nextMaintenance,
        documents_status: newBus.documentsStatus
      };

      const { data, error } = await insertBus(busData);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Aggiungi il nuovo bus con l'ID generato dal database
        const addedBus = {
          ...newBus,
          id: data[0].id
        };

        setBuses(prev => [...prev, addedBus]);
      } else {
        // Se non riceviamo dati dal database, aggiungi comunque il bus con l'ID generato localmente
        setBuses(prev => [...prev, newBus]);
      }
    } catch (err: any) {
      console.error('Error adding bus:', err);
      // In caso di errore, aggiungi comunque il bus con l'ID generato localmente
      setBuses(prev => [...prev, newBus]);
    }
  };

  const handleDeleteBus = (id: string) => {
    // Imposta il bus da eliminare e mostra la finestra di conferma
    setBusToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleEditBus = (bus: Bus) => {
    setSelectedBus(bus);
    setShowEditModal(true);
  };

  const handleUpdateBus = async (updatedBus: Bus) => {
    try {
      console.log('Tentativo di aggiornamento bus:', updatedBus);
      // Aggiorna il bus nel database
      const { data, error } = await updateBus(updatedBus.id, updatedBus);

      if (error) {
        console.error('Errore nell\'aggiornamento del bus:', error);
        alert(`Errore nell'aggiornamento del bus: ${error.message || 'Errore sconosciuto'}`);
        throw error;
      }

      console.log('Bus aggiornato con successo, aggiornamento UI');
      // Aggiorna lo stato locale solo se l'aggiornamento è andato a buon fine
      if (data && data.length > 0) {
        setBuses(prev => prev.map(bus => bus.id === updatedBus.id ? data[0] : bus));
      } else {
        setBuses(prev => prev.map(bus => bus.id === updatedBus.id ? updatedBus : bus));
      }
      alert('Bus aggiornato con successo!');
    } catch (err: any) {
      console.error('Error updating bus:', err);
      // Non aggiorniamo lo stato locale in caso di errore
    }
  };

  const handleDuplicateBus = (bus: Bus) => {
    // Crea una copia del bus con un nuovo ID
    const duplicatedBus = {
      ...bus,
      id: `bus-${Date.now()}`, // Genera un ID temporaneo
      name: `${bus.name} (Copia)`
    };

    // Aggiungi il bus duplicato
    handleAddBus(duplicatedBus);
  };

  const handleViewDocuments = (bus: Bus) => {
    console.log('Visualizza documenti del bus:', bus);
    // TODO: Implementare la visualizzazione dei documenti
  };

  const confirmDelete = async () => {
    if (busToDelete) {
      try {
        console.log('Tentativo di eliminazione bus con ID:', busToDelete);
        const { error } = await deleteBus(busToDelete);

        if (error) {
          console.error('Errore nell\'eliminazione del bus:', error);
          alert(`Errore nell'eliminazione del bus: ${error.message || 'Errore sconosciuto'}`);
          throw error;
        }

        console.log('Bus eliminato con successo, aggiornamento UI');
        // Rimuovi il bus dalla lista locale solo se l'eliminazione è andata a buon fine
        setBuses(prev => prev.filter(bus => bus.id !== busToDelete));
        alert('Bus eliminato con successo!');
      } catch (err: any) {
        console.error('Error deleting bus:', err);
        // Non rimuoviamo il bus dalla lista locale in caso di errore
      } finally {
        setShowDeleteConfirm(false);
        setBusToDelete(null);
      }
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="header">
          <h1 className="page-title">Gestione Bus</h1>
          <button
            onClick={() => {
              console.log('Opening AddBusModal');
              setShowAddModal(true);
            }}
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
            Aggiungi Bus
          </button>
        </div>

        <div className="card">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #4f46e5',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '1rem'
                }} />
                <p>Caricamento in corso...</p>
              </div>
            </div>
          ) : error ? (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          ) : (
            <BusList
              buses={buses}
              onEdit={handleEditBus}
              onDelete={handleDeleteBus}
              onDuplicate={handleDuplicateBus}
              onViewDocuments={handleViewDocuments}
            />
          )}
        </div>
      </div>

      {/* Add Bus Modal */}
      <AddBusModal2
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddBus}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Conferma Eliminazione</h2>
            <p style={{ marginBottom: '1.5rem' }}>Sei sicuro di voler eliminare questo bus? Questa azione non può essere annullata.</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-white"
              >
                Annulla
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {showEditModal && selectedBus && (
        <EditBusModal2
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateBus}
          bus={selectedBus}
        />
      )}
    </DashboardLayout>
  );
};

export default BusesPage;
