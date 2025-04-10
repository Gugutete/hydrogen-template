import { useState } from 'react';

interface AddBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bus: any) => void;
}

const AddBusModal = ({ isOpen, onClose, onSave }: AddBusModalProps) => {
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

    if (!formData.seats.trim()) {
      newErrors.seats = 'Il numero di posti è obbligatorio';
    } else if (isNaN(Number(formData.seats)) || Number(formData.seats) <= 0) {
      newErrors.seats = 'Inserisci un numero valido di posti';
    }

    if (!formData.year.trim()) {
      newErrors.year = 'L\'anno è obbligatorio';
    } else if (
      isNaN(Number(formData.year)) ||
      Number(formData.year) < 1900 ||
      Number(formData.year) > new Date().getFullYear()
    ) {
      newErrors.year = 'Inserisci un anno valido';
    }

    if (!formData.nextMaintenance.trim()) {
      newErrors.nextMaintenance = 'La data di manutenzione è obbligatoria';
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

  if (!isOpen) {
    console.log('AddBusModal is closed');
    return null;
  }

  console.log('AddBusModal is open');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl" style={{ padding: '2rem' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Aggiungi Bus</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <div className="mb-6">
            <label htmlFor="name" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="plate" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Targa</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.plate ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.plate && <p className="mt-1 text-sm text-red-600">{errors.plate}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="model" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Modello</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.model ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
          </div>

          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="seats" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Posti</label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.seats ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.seats && <p className="mt-1 text-sm text-red-600">{errors.seats}</p>}
            </div>

            <div>
              <label htmlFor="year" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Anno</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.year ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="status" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
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

          <div className="mb-6">
            <label htmlFor="nextMaintenance" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prossima Manutenzione</label>
            <input
              type="date"
              id="nextMaintenance"
              name="nextMaintenance"
              value={formData.nextMaintenance}
              onChange={handleChange}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.nextMaintenance ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.nextMaintenance && <p className="mt-1 text-sm text-red-600">{errors.nextMaintenance}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="documentsStatus" className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato Documenti</label>
            <select
              id="documentsStatus"
              name="documentsStatus"
              value={formData.documentsStatus}
              onChange={handleChange}
              className="form-input"
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

          <div className="mt-6 flex justify-end space-x-3">
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

export default AddBusModal;
