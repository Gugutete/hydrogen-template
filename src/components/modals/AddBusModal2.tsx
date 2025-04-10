import { useState } from 'react';

interface AddBusModal2Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bus: any) => void;
}

const AddBusModal2 = ({ isOpen, onClose, onSave }: AddBusModal2Props) => {
  const [formData, setFormData] = useState({
    name: '',
    plate: '',
    model: '',
    seats: '',
    year: '',
    status: 'active',
    nextMaintenance: '',
    documentsStatus: 'valid'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è obbligatorio';
    }

    if (!formData.plate.trim()) {
      newErrors.plate = 'La targa è obbligatoria';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Il modello è obbligatorio';
    }

    if (!formData.seats) {
      newErrors.seats = 'Il numero di posti è obbligatorio';
    } else if (isNaN(Number(formData.seats)) || Number(formData.seats) <= 0) {
      newErrors.seats = 'Inserisci un numero valido di posti';
    }

    if (!formData.year) {
      newErrors.year = 'L\'anno è obbligatorio';
    } else if (isNaN(Number(formData.year)) || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear()) {
      newErrors.year = 'Inserisci un anno valido';
    }

    if (!formData.nextMaintenance) {
      newErrors.nextMaintenance = 'La data di prossima manutenzione è obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...formData,
        id: `bus${Date.now()}`,
        seats: Number(formData.seats),
        year: Number(formData.year)
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Aggiungi Bus</h2>
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
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.name && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.name}</p>}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="plate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Targa</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.plate ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.plate && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.plate}</p>}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="model" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Modello</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.model ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.model && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.model}</p>}
          </div>

          <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="seats" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Posti</label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.seats ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.seats && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.seats}</p>}
            </div>

            <div>
              <label htmlFor="year" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Anno</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.year ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.year && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.year}</p>}
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
              <option value="active">Attivo</option>
              <option value="maintenance">In Manutenzione</option>
              <option value="inactive">Inattivo</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="nextMaintenance" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prossima Manutenzione</label>
            <input
              type="date"
              id="nextMaintenance"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.nextMaintenance ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.nextMaintenance && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.nextMaintenance}</p>}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="documentsStatus" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato Documenti</label>
            <select
              id="documentsStatus"
              name="documentsStatus"
              value={formData.documentsStatus}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="valid">Validi</option>
              <option value="expiring">In Scadenza</option>
              <option value="expired">Scaduti</option>
            </select>
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

export default AddBusModal2;
