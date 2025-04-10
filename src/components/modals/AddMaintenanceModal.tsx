import { useState } from 'react';

interface Bus {
  id: string;
  name: string;
}

interface AddMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (maintenance: any) => void;
  buses: Bus[];
  type: 'maintenance' | 'document';
}

const AddMaintenanceModal = ({ isOpen, onClose, onSave, buses, type }: AddMaintenanceModalProps) => {
  const [formData, setFormData] = useState({
    busId: '',
    type: type === 'maintenance' ? 'regular' : 'document',
    description: '',
    date: '',
    cost: '',
    status: 'scheduled',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.busId) {
      newErrors.busId = 'Seleziona un bus';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descrizione è obbligatoria';
    }

    if (!formData.date) {
      newErrors.date = 'La data è obbligatoria';
    }

    if (!formData.cost.trim()) {
      newErrors.cost = 'Il costo è obbligatorio';
    } else if (isNaN(Number(formData.cost)) || Number(formData.cost) < 0) {
      newErrors.cost = 'Inserisci un costo valido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedBus = buses.find(bus => bus.id === formData.busId);

      onSave({
        ...formData,
        id: `maint${Date.now()}`,
        busName: selectedBus?.name || '',
        cost: Number(formData.cost)
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
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
        maxWidth: '700px',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {type === 'maintenance' ? 'Aggiungi Manutenzione' : 'Aggiungi Documento'}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="busId" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bus</label>
            <select
              id="busId"
              name="busId"
              value={formData.busId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.busId ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleziona un bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>{bus.name}</option>
              ))}
            </select>
            {errors.busId && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.busId}</p>}
          </div>

          {type === 'maintenance' && (
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tipo di Manutenzione</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              >
                <option value="regular">Ordinaria</option>
                <option value="extraordinary">Straordinaria</option>
              </select>
            </div>
          )}

          {type === 'document' && (
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tipo di Documento</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              >
                <option value="document">Documento</option>
                <option value="insurance">Assicurazione</option>
                <option value="revision">Revisione</option>
                <option value="license">Licenza</option>
              </select>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descrizione</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.description ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.description && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.description}</p>}
          </div>

          <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.date ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.date && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="cost" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Costo (€)</label>
              <input
                type="text"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.cost ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.cost && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.cost}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="status" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="scheduled">Programmata</option>
              <option value="in-progress">In Corso</option>
              <option value="completed">Completata</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="notes" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Note</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-white"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
