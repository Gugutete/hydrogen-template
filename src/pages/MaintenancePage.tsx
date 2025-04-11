import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddMaintenanceModal from '../components/modals/AddMaintenanceModal';
import EditMaintenanceModal2 from '../components/modals/EditMaintenanceModal2';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import { fetchMaintenances, fetchBuses, insertMaintenance, updateMaintenance, deleteMaintenance, updateBus } from '../lib/supabaseClient';

interface Maintenance {
  id: string;
  busId: string;
  busName: string;
  type: 'regular' | 'extraordinary' | 'document';
  description: string;
  date: string;
  cost: number;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
}

const MaintenancePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'maintenance' | 'documents'>('maintenance');
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [buses, setBuses] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i dati all'avvio
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Recupera tutti i dati necessari in parallelo
        const [maintenancesResult, busesResult] = await Promise.all([
          fetchMaintenances(),
          fetchBuses()
        ]);

        // Verifica errori
        if (maintenancesResult.error) throw maintenancesResult.error;
        if (busesResult.error) throw busesResult.error;

        console.log('Dati recuperati:', {
          maintenances: maintenancesResult.data,
          buses: busesResult.data
        });

        // Imposta i dati recuperati
        if (maintenancesResult.data) setMaintenances(maintenancesResult.data);

        // Prepara i dati dei bus per i dropdown
        if (busesResult.data) {
          const formattedBuses = busesResult.data.map(bus => ({
            id: bus.id,
            name: bus.name
          }));
          setBuses(formattedBuses);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'badge-info';
      case 'in-progress':
        return 'badge-warning';
      case 'completed':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programmata';
      case 'in-progress':
        return 'In Corso';
      case 'completed':
        return 'Completata';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'regular':
        return 'Ordinaria';
      case 'extraordinary':
        return 'Straordinaria';
      case 'document':
        return 'Documento';
      default:
        return type;
    }
  };

  const handleAddMaintenance = async (newMaintenance: Maintenance) => {
    try {
      setLoading(true);
      // Inserisci la manutenzione nel database
      const result = await insertMaintenance(newMaintenance);

      if (result) {
        // Aggiorna lo stato locale con i dati restituiti dal server
        setMaintenances(prev => [...prev, result]);

        // Se la manutenzione è programmata e di tipo regolare, aggiorna la prossima manutenzione del bus
        if (newMaintenance.status === 'scheduled' && newMaintenance.type === 'regular') {
          await updateBusNextMaintenance(newMaintenance.busId);
        }
      }
    } catch (err) {
      console.error('Errore nell\'inserimento della manutenzione:', err);
      // In caso di errore, aggiungi comunque la manutenzione allo stato locale
      setMaintenances(prev => [...prev, newMaintenance]);
    } finally {
      setLoading(false);
    }
  };

  // Funzione per aggiornare la prossima manutenzione di un bus
  const updateBusNextMaintenance = async (busId: string) => {
    try {
      // Recupera tutte le manutenzioni programmate per questo bus
      const filteredMaintenances = maintenances.filter(m =>
        m.busId === busId &&
        m.status === 'scheduled' &&
        m.type === 'regular' &&
        new Date(m.date) > new Date()
      );

      // Aggiungi la nuova manutenzione alla lista filtrata
      const allMaintenances = [...filteredMaintenances];

      // Ordina le manutenzioni per data
      allMaintenances.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Prendi la prima manutenzione programmata (la più vicina)
      const nextMaintenance = allMaintenances.length > 0 ? allMaintenances[0].date : null;

      if (nextMaintenance) {
        // Recupera il bus
        const { data: busData } = await fetchBuses();
        const bus = busData.find(b => b.id === busId);

        if (bus) {
          // Aggiorna la prossima manutenzione del bus
          await updateBus(busId, { ...bus, nextMaintenance });
          console.log(`Prossima manutenzione del bus ${busId} aggiornata a ${nextMaintenance}`);
        }
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento della prossima manutenzione del bus:', err);
    }
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditModal(true);
  };

  const handleUpdateMaintenance = async (updatedMaintenance: Maintenance) => {
    try {
      setLoading(true);
      // Aggiorna la manutenzione nel database
      const { data, error } = await updateMaintenance(updatedMaintenance.id, updatedMaintenance);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale con i dati restituiti dal server
      if (data && data.length > 0) {
        setMaintenances(prev => prev.map(maintenance => maintenance.id === updatedMaintenance.id ? data[0] : maintenance));
      } else {
        // Se non ci sono dati restituiti, usa i dati locali
        setMaintenances(prev => prev.map(maintenance => maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance));
      }

      // Se la manutenzione è programmata e di tipo regolare, aggiorna la prossima manutenzione del bus
      if (updatedMaintenance.status === 'scheduled' && updatedMaintenance.type === 'regular') {
        await updateBusNextMaintenance(updatedMaintenance.busId);
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento della manutenzione:', err);
      // In caso di errore, aggiorna comunque lo stato locale
      setMaintenances(prev => prev.map(maintenance => maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questa manutenzione?')) {
      try {
        setLoading(true);

        // Trova la manutenzione prima di eliminarla
        const maintenanceToDelete = maintenances.find(m => m.id === maintenanceId);

        // Elimina la manutenzione dal database
        const { error } = await deleteMaintenance(maintenanceId);

        if (error) {
          throw error;
        }

        // Aggiorna lo stato locale
        setMaintenances(prev => prev.filter(maintenance => maintenance.id !== maintenanceId));

        // Se la manutenzione eliminata era programmata e di tipo regolare, aggiorna la prossima manutenzione del bus
        if (maintenanceToDelete && maintenanceToDelete.status === 'scheduled' && maintenanceToDelete.type === 'regular') {
          await updateBusNextMaintenance(maintenanceToDelete.busId);
        }
      } catch (err) {
        console.error('Errore nell\'eliminazione della manutenzione:', err);
        // In caso di errore, elimina comunque la manutenzione dallo stato locale
        setMaintenances(prev => prev.filter(maintenance => maintenance.id !== maintenanceId));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicateMaintenance = (maintenance: Maintenance) => {
    // Crea una copia della manutenzione con un nuovo ID
    const duplicatedMaintenance = {
      ...maintenance,
      id: `maint-${Date.now()}`, // Genera un ID temporaneo
      description: `${maintenance.description} (Copia)`
    };

    // Aggiungi la manutenzione duplicata
    setMaintenances(prev => [...prev, duplicatedMaintenance]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const filteredMaintenances = maintenances.filter(maintenance => {
    if (activeTab === 'maintenance') {
      return maintenance.type === 'regular' || maintenance.type === 'extraordinary';
    } else {
      return maintenance.type === 'document';
    }
  });

  return (
    <DashboardLayout>
      <div>
        <div className="header">
          <h1 className="page-title">Gestione Manutenzione e Documenti</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{
              minWidth: '200px',
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
            {activeTab === 'maintenance' ? 'Aggiungi Manutenzione' : 'Aggiungi Documento'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('maintenance')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: activeTab === 'maintenance' ? 'bold' : 'normal',
              borderBottom: activeTab === 'maintenance' ? '2px solid #4f46e5' : 'none',
              color: activeTab === 'maintenance' ? '#4f46e5' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Manutenzioni
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            style={{
              padding: '0.75rem 1rem',
              fontWeight: activeTab === 'documents' ? 'bold' : 'normal',
              borderBottom: activeTab === 'documents' ? '2px solid #4f46e5' : 'none',
              color: activeTab === 'documents' ? '#4f46e5' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Documenti
          </button>
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
                Aggiungi la prima manutenzione
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <MaintenanceList
              maintenances={filteredMaintenances}
              onEdit={handleEditMaintenance}
              onDelete={handleDeleteMaintenance}
              onDuplicate={handleDuplicateMaintenance}
            />
          </div>
        )}
      </div>

      {/* Add Maintenance Modal */}
      <AddMaintenanceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMaintenance}
        buses={buses}
        type={activeTab}
      />

      {/* Edit Maintenance Modal */}
      {showEditModal && selectedMaintenance && (
        <EditMaintenanceModal2
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateMaintenance}
          maintenance={selectedMaintenance}
          buses={buses}
        />
      )}
    </DashboardLayout>
  );
};

export default MaintenancePage;
