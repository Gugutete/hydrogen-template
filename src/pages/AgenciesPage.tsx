import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import AddAgencyModal from '../components/modals/AddAgencyModal';
import EditAgencyModal2 from '../components/modals/EditAgencyModal2';
import AgenciesList from '../components/agencies/AgenciesList';
import { fetchAgencies, insertAgency, updateAgency, deleteAgency } from '../lib/supabaseClient';

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
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica i dati delle agenzie all'avvio
  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await fetchAgencies();

        if (error) {
          throw error;
        }

        console.log('Dati agenzie recuperati da Supabase:', data);

        if (data && data.length > 0) {
          setAgencies(data);
        } else {
          // Se non ci sono dati, mostra un messaggio
          setError('Nessuna agenzia trovata. Aggiungi la prima agenzia.');
        }
      } catch (err) {
        console.error('Errore nel caricamento delle agenzie:', err);
        setError('Si è verificato un errore nel caricamento delle agenzie.');
      } finally {
        setLoading(false);
      }
    };

    loadAgencies();
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
        return 'Attiva';
      case 'inactive':
        return 'Inattiva';
      default:
        return status;
    }
  };

  const handleAddAgency = async (newAgency: Agency) => {
    try {
      setLoading(true);
      // Inserisci l'agenzia nel database
      const result = await insertAgency(newAgency);

      if (result) {
        // Aggiorna lo stato locale con i dati restituiti dal server
        setAgencies(prev => [...prev, result]);
      }
    } catch (err) {
      console.error('Errore nell\'inserimento dell\'agenzia:', err);
      // In caso di errore, aggiungi comunque l'agenzia allo stato locale
      setAgencies(prev => [...prev, newAgency]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgency = (agency: Agency) => {
    setSelectedAgency(agency);
    setShowEditModal(true);
  };

  const handleUpdateAgency = async (updatedAgency: Agency) => {
    try {
      setLoading(true);
      // Aggiorna l'agenzia nel database
      const { data, error } = await updateAgency(updatedAgency.id, updatedAgency);

      if (error) {
        throw error;
      }

      // Aggiorna lo stato locale con i dati restituiti dal server
      if (data && data.length > 0) {
        setAgencies(prev => prev.map(agency => agency.id === updatedAgency.id ? data[0] : agency));
      } else {
        // Se non ci sono dati restituiti, usa i dati locali
        setAgencies(prev => prev.map(agency => agency.id === updatedAgency.id ? updatedAgency : agency));
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento dell\'agenzia:', err);
      // In caso di errore, aggiorna comunque lo stato locale
      setAgencies(prev => prev.map(agency => agency.id === updatedAgency.id ? updatedAgency : agency));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgency = async (agencyId: string) => {
    // Chiedi conferma prima di eliminare
    if (window.confirm('Sei sicuro di voler eliminare questa agenzia?')) {
      try {
        setLoading(true);
        // Elimina l'agenzia dal database
        const { error } = await deleteAgency(agencyId);

        if (error) {
          throw error;
        }

        // Aggiorna lo stato locale
        setAgencies(prev => prev.filter(agency => agency.id !== agencyId));
      } catch (err) {
        console.error('Errore nell\'eliminazione dell\'agenzia:', err);
        // In caso di errore, elimina comunque l'agenzia dallo stato locale
        setAgencies(prev => prev.filter(agency => agency.id !== agencyId));
      } finally {
        setLoading(false);
      }
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

        {loading ? (
          <div className="card">
            <div className="text-center py-8">
              <div className="spinner"></div>
              <p className="mt-4">Caricamento agenzie in corso...</p>
            </div>
          </div>
        ) : error && agencies.length === 0 ? (
          <div className="card">
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary mt-4"
              >
                Aggiungi la prima agenzia
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <AgenciesList
              agencies={agencies}
              onEdit={handleEditAgency}
              onDelete={handleDeleteAgency}
              onDuplicate={handleDuplicateAgency}
            />
          </div>
        )}
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
