import { useState, useEffect } from 'react';
import { format, parseISO, eachDayOfInterval } from 'date-fns';
import { DailyLocation } from '../../types/dailyLocation';

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

interface Tour {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  busName?: string;
  driverId?: string;
  driverName?: string;
  agencyId?: string;
  agencyName?: string;
  status: string;
  price?: number;
  passengers?: number;
  notes?: string;
  location?: string;
  dailyLocations?: DailyLocation[];
}

interface EditTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tour: any) => void;
  onDelete?: (tourId: string) => void;
  buses: Bus[];
  drivers: Driver[];
  agencies: Agency[];
  tour: Tour | null;
}

const EditTourModal = ({ isOpen, onClose, onSave, onDelete, buses, drivers, agencies, tour }: EditTourModalProps) => {
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
    passengers: '',
    location: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [dailyLocations, setDailyLocations] = useState<DailyLocation[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Aggiorna i valori iniziali quando cambia il tour o lo stato del modale
  useEffect(() => {
    if (isOpen && tour) {
      // Se il modale è aperto e abbiamo un tour, impostiamo i valori del tour
      // Formatta le date in YYYY-MM-DD per i campi input type="date"
      let startDate = tour.start || '';
      let endDate = tour.end || '';

      // Se le date sono in formato ISO, estraiamo solo la parte YYYY-MM-DD
      if (startDate.includes('T')) {
        startDate = startDate.split('T')[0];
      }

      if (endDate.includes('T')) {
        endDate = endDate.split('T')[0];
      }

      setFormData({
        title: tour.title || '',
        start: startDate,
        end: endDate,
        busId: tour.busId || '',
        driverId: tour.driverId || '',
        agencyId: tour.agencyId || '',
        status: tour.status || 'preparation',
        notes: tour.notes?.toString() || '',
        price: tour.price?.toString() || '',
        passengers: tour.passengers?.toString() || '',
        location: tour.location || ''
      });

      // Imposta le location giornaliere se presenti
      if (tour.dailyLocations && tour.dailyLocations.length > 0) {
        setDailyLocations([...tour.dailyLocations]);
      } else {
        // Se non ci sono location giornaliere, crea un array vuoto
        setDailyLocations([]);
      }
    } else if (!isOpen) {
      // Se il modale è chiuso, resettiamo il form
      setFormData(initialFormState);
      setDailyLocations([]);
      // Resettiamo anche gli errori
      setErrors({});
    }
  }, [isOpen, tour]);

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

    if (validateForm() && tour) {
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

      const updatedTour = {
        ...tour,
        ...formData,
        start,
        end,
        busName: selectedBus?.name || tour.busName || '',
        driverName: selectedDriver?.name || tour.driverName || '',
        agencyName: selectedAgency?.name || tour.agencyName || '',
        price: formData.price ? Number(formData.price) : 0,
        passengers: formData.passengers ? Number(formData.passengers) : 0,
        dailyLocations: dailyLocations
      };

      console.log('Aggiornando tour:', updatedTour);
      onSave(updatedTour);
      onClose();
    }
  };

  if (!isOpen || !tour) return null;

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Modifica Tour</h2>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
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

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Location Giornaliere</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Puoi specificare una location diversa per ogni giorno del tour. Se non specifichi una location per un giorno specifico, verrà utilizzata la location principale.
            </p>

            {formData.start && formData.end && (
              <div style={{ marginTop: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Data</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Location</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eachDayOfInterval({
                      start: parseISO(formData.start.split('T')[0]),
                      end: parseISO(formData.end.split('T')[0])
                    }).map(day => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const dailyLocation = dailyLocations.find(dl => dl.date === dateStr);
                      const locationValue = dailyLocation?.location || formData.location;

                      return (
                        <tr key={dateStr}>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            {format(day, 'dd/MM/yyyy')}
                          </td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                            <input
                              type="text"
                              value={locationValue}
                              onChange={(e) => {
                                const newLocation = e.target.value;
                                const newDailyLocations = [...dailyLocations];
                                const existingIndex = newDailyLocations.findIndex(dl => dl.date === dateStr);

                                if (existingIndex >= 0) {
                                  // Aggiorna la location esistente
                                  newDailyLocations[existingIndex].location = newLocation;
                                } else {
                                  // Aggiungi una nuova location
                                  newDailyLocations.push({
                                    date: dateStr,
                                    location: newLocation
                                  });
                                }

                                setDailyLocations(newDailyLocations);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem'
                              }}
                              placeholder="Location per questo giorno"
                            />
                          </td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => {
                                // Rimuovi la location per questo giorno
                                const newDailyLocations = dailyLocations.filter(dl => dl.date !== dateStr);
                                setDailyLocations(newDailyLocations);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              Ripristina
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {/* Pulsante elimina a sinistra */}
            {onDelete && tour && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
                    onDelete(tour.id);
                    onClose();
                  }
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Elimina Tour
              </button>
            )}

            {/* Pulsanti annulla e salva a destra */}
            <div style={{ display: 'flex', gap: '1rem' }}>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTourModal;
