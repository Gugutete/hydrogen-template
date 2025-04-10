import { useState, useEffect } from 'react';

interface Bus {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Agency {
  id: string;
  name: string;
}

interface AddTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tour: any) => void;
  buses: Bus[];
  drivers: Driver[];
  agencies: Agency[];
  initialDate?: string;
  initialBusId?: string;
}

const AddTourModal = ({ isOpen, onClose, onSave, buses, drivers, agencies, initialDate, initialBusId }: AddTourModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    busId: '',
    driverId: '',
    agencyId: '',
    status: 'preparation',
    notes: '',
    price: '',
    passengers: ''
  });

  // Stato iniziale vuoto per il reset del form
  const initialFormState = {
    title: '',
    start: '',
    end: '',
    busId: '',
    driverId: '',
    agencyId: '',
    status: 'preparation',
    notes: '',
    price: '',
    passengers: ''
  };

  // Aggiorna i valori iniziali quando cambiano i props
  useEffect(() => {
    if (isOpen) {
      // Se il modale è aperto, impostiamo i valori iniziali
      setFormData(prev => {
        // Se abbiamo una data iniziale, impostiamo sia la data di inizio che quella di fine
        // Se non abbiamo una data di fine, impostiamo la stessa data di inizio
        const startDate = initialDate || '';
        const endDate = initialDate || '';

        return {
          // Partiamo da un form vuoto
          ...initialFormState,
          // Poi aggiungiamo i valori iniziali se disponibili
          start: startDate,
          end: endDate,
          busId: initialBusId || ''
        };
      });
    } else {
      // Se il modale è chiuso, resettiamo il form
      setFormData(initialFormState);
      // Resettiamo anche gli errori
      setErrors({});
    }
  }, [isOpen, initialDate, initialBusId]);

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

    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }

    if (!formData.start) {
      newErrors.start = 'La data di inizio è obbligatoria';
    }

    if (!formData.end) {
      newErrors.end = 'La data di fine è obbligatoria';
    } else if (formData.start && new Date(formData.end) < new Date(formData.start)) {
      newErrors.end = 'La data di fine deve essere successiva alla data di inizio';
    }

    if (!formData.busId) {
      newErrors.busId = 'Seleziona un bus';
    }

    if (!formData.driverId) {
      newErrors.driverId = 'Seleziona un autista';
    }

    if (!formData.agencyId) {
      newErrors.agencyId = 'Seleziona un\'agenzia';
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Inserisci un prezzo valido';
    }

    if (formData.passengers && (isNaN(Number(formData.passengers)) || Number(formData.passengers) < 0)) {
      newErrors.passengers = 'Inserisci un numero valido di passeggeri';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedBus = buses.find(bus => bus.id === formData.busId);
      const selectedDriver = drivers.find(driver => driver.id === formData.driverId);
      const selectedAgency = agencies.find(agency => agency.id === formData.agencyId);

      // Gestione speciale per le date: se inizio e fine sono uguali, è un tour di un solo giorno
      let { start, end } = formData;

      // Assicuriamoci che le date siano in formato ISO (YYYY-MM-DD)
      if (start && !start.includes('T')) {
        start = `${start}T00:00:00.000Z`;
      }

      if (end && !end.includes('T')) {
        end = `${end}T23:59:59.999Z`;
      }

      // Crea il nuovo tour con tutti i dati necessari
      const newTour = {
        ...formData,
        start,
        end,
        id: `tour${Date.now()}`,
        busName: selectedBus?.name || '',
        driverName: selectedDriver?.name || '',
        agencyName: selectedAgency?.name || '',
        price: formData.price ? Number(formData.price) : 0,
        passengers: formData.passengers ? Number(formData.passengers) : 0,
        // Assicuriamoci che lo status sia impostato correttamente
        status: formData.status || 'preparation'
      };

      console.log('Salvando nuovo tour:', newTour);
      onSave(newTour);
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
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '2rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Aggiungi Tour</h2>
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

        <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Titolo Tour</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.title ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            {errors.title && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="start" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Inizio</label>
              <input
                type="date"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.start ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.start && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.start}</p>}
            </div>

            <div>
              <label htmlFor="end" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Fine</label>
              <input
                type="date"
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.end ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.end && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.end}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="driverId" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Autista</label>
            <select
              id="driverId"
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.driverId ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleziona un autista</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
            {errors.driverId && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.driverId}</p>}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="agencyId" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Agenzia</label>
            <select
              id="agencyId"
              name="agencyId"
              value={formData.agencyId}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: errors.agencyId ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            >
              <option value="">Seleziona un'agenzia</option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.id}>{agency.name}</option>
              ))}
            </select>
            {errors.agencyId && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.agencyId}</p>}
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="price" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prezzo (€)</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.price ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.price && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="passengers" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Numero Passeggeri</label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: errors.passengers ? '1px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
              {errors.passengers && <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}>{errors.passengers}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
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
              <option value="preparation">In Preparazione</option>
              <option value="active">Attivo</option>
              <option value="completed">Completato</option>
              <option value="cancelled">Cancellato</option>
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

export default AddTourModal;
