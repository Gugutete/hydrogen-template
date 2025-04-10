import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddMaintenanceModal from '../components/modals/AddMaintenanceModal';
import EditMaintenanceModal2 from '../components/modals/EditMaintenanceModal2';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import { updateMaintenance } from '../lib/supabaseClient';

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

  // Mock buses for the modal
  const buses = [
    { id: 'bus1', name: 'Bus Gran Turismo 1' },
    { id: 'bus2', name: 'Bus Gran Turismo 2' },
    { id: 'bus3', name: 'Bus Gran Turismo 3' }
  ];
  const [maintenances, setMaintenances] = useState<Maintenance[]>([
    {
      id: 'maint1',
      busId: 'bus1',
      busName: 'Bus Gran Turismo 1',
      type: 'regular',
      description: 'Cambio olio e filtri',
      date: '2023-07-15',
      cost: 450,
      status: 'scheduled'
    },
    {
      id: 'maint2',
      busId: 'bus2',
      busName: 'Bus Gran Turismo 2',
      type: 'extraordinary',
      description: 'Sostituzione freni',
      date: '2023-04-08',
      cost: 1200,
      status: 'in-progress'
    },
    {
      id: 'maint3',
      busId: 'bus3',
      busName: 'Bus Gran Turismo 3',
      type: 'document',
      description: 'Rinnovo assicurazione',
      date: '2023-09-05',
      cost: 3500,
      status: 'completed'
    },
    {
      id: 'maint4',
      busId: 'bus2',
      busName: 'Bus Gran Turismo 2',
      type: 'document',
      description: 'Revisione annuale',
      date: '2023-05-20',
      cost: 250,
      status: 'scheduled'
    }
  ]);

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

  const handleAddMaintenance = (newMaintenance: Maintenance) => {
    setMaintenances(prev => [...prev, newMaintenance]);
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditModal(true);
  };

  const handleUpdateMaintenance = async (updatedMaintenance: Maintenance) => {
    try {
      // Aggiorna la manutenzione nel database
      const { data, error } = await updateMaintenance(updatedMaintenance.id, updatedMaintenance);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale
      setMaintenances(prev => prev.map(maintenance => maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance));
    } catch (error) {
      console.error('Error updating maintenance:', error);
      // In caso di errore, aggiorna comunque lo stato locale
      setMaintenances(prev => prev.map(maintenance => maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance));
    }
  };

  const handleDeleteMaintenance = (maintenanceId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questa manutenzione?')) {
      setMaintenances(prev => prev.filter(maintenance => maintenance.id !== maintenanceId));
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

        <div className="card">
          <MaintenanceList
            maintenances={filteredMaintenances}
            onEdit={handleEditMaintenance}
            onDelete={handleDeleteMaintenance}
            onDuplicate={handleDuplicateMaintenance}
          />
        </div>
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
