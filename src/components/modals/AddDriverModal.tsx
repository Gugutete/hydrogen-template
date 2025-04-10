import { useState } from 'react';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: any) => void;
}

const AddDriverModal = ({ isOpen, onClose, onSave }: AddDriverModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    phone: '',
    email: '',
    status: 'active',
    drivingHours: {
      weekly: 0,
      biWeekly: 0,
      monthly: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Il numero di patente è obbligatorio';
    }

    if (!formData.licenseExpiry.trim()) {
      newErrors.licenseExpiry = 'La data di scadenza è obbligatoria';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Il numero di telefono è obbligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...formData,
        id: `driver${Date.now()}`
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Aggiungi Autista</h2>
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
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome Completo</label>
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

          <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="licenseNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Numero Patente</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.licenseNumber ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.licenseNumber && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.licenseNumber}</p>}
            </div>

            <div>
              <label htmlFor="licenseExpiry" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Scadenza Patente</label>
              <input
                type="date"
                id="licenseExpiry"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.licenseExpiry ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.licenseExpiry && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.licenseExpiry}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Telefono</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.phone && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.email ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.email && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.email}</p>}
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
              <option value="inactive">Inattivo</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem' }}>Ore di Guida Iniziali</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="drivingHours.weekly" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ore Settimanali</label>
              <input
                type="number"
                id="drivingHours.weekly"
                name="drivingHours.weekly"
                value={formData.drivingHours.weekly}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>Massimo consentito: 56 ore</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="drivingHours.biWeekly" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ore Bisettimanali</label>
              <input
                type="number"
                id="drivingHours.biWeekly"
                name="drivingHours.biWeekly"
                value={formData.drivingHours.biWeekly}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>Massimo consentito: 90 ore</p>
            </div>

            <div>
              <label htmlFor="drivingHours.monthly" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ore Mensili</label>
              <input
                type="number"
                id="drivingHours.monthly"
                name="drivingHours.monthly"
                value={formData.drivingHours.monthly}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>
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

export default AddDriverModal;
