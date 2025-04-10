import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddAgencyModal from '../components/modals/AddAgencyModal';
import EditAgencyModal2 from '../components/modals/EditAgencyModal2';
import AgenciesList from '../components/agencies/AgenciesList';
import { updateAgency } from '../lib/supabaseClient';

interface Agency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  toursCount: number;
}

const AgenciesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([
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
      toursCount: 12
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
      toursCount: 8
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
      toursCount: 0
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
        return 'Attiva';
      case 'inactive':
        return 'Inattiva';
      default:
        return status;
    }
  };

  const handleAddAgency = (newAgency: Agency) => {
    setAgencies(prev => [...prev, newAgency]);
  };

  const handleEditAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowEditModal(true);
  };

  const handleUpdateAgency = async (updatedAgency: Agency) => {
    try {
      // Aggiorna l'agenzia nel database
      const { data, error } = await updateAgency(updatedAgency.id, updatedAgency);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale
      setAgencies(prev => prev.map(agency => agency.id === updatedAgency.id ? updatedAgency : agency));
    } catch (error) {
      console.error('Error updating agency:', error);
      // In caso di errore, aggiorna comunque lo stato locale
      setAgencies(prev => prev.map(agency => agency.id === updatedAgency.id ? updatedAgency : agency));
    }
  };

  const handleDeleteAgency = (agencyId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questa agenzia?')) {
      setAgencies(prev => prev.filter(agency => agency.id !== agencyId));
    }
  };

  const handleDuplicateAgency = (agency: Agency) => {
    // Crea una copia dell'agenzia con un nuovo ID
    const duplicatedAgency = {
      ...agency,
      id: `agency-${Date.now()}`, // Genera un ID temporaneo
      name: `${agency.name} (Copia)`
    };

    // Aggiungi l'agenzia duplicata
    setAgencies(prev => [...prev, duplicatedAgency]);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="header">
          <h1 className="page-title">Gestione Agenzie</h1>
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
            Aggiungi Agenzia
          </button>
        </div>

        <div className="card">
          <AgenciesList
            agencies={agencies}
            onEdit={handleEditAgency}
            onDelete={handleDeleteAgency}
            onDuplicate={handleDuplicateAgency}
          />
        </div>
      </div>

      {/* Add Agency Modal */}
      <AddAgencyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddAgency}
      />

      {/* Edit Agency Modal */}
      {showEditModal && selectedAgency && (
        <EditAgencyModal2
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateAgency}
          agency={selectedAgency}
        />
      )}
    </DashboardLayout>
  );
};

export default AgenciesPage;
