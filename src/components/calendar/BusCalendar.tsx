import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import '../../styles/calendar.css';
import AddButton from './AddButton';

interface Bus {
  id: string;
  name: string;
  plate: string;
  driverId?: string;
  driverName?: string;
}

interface Tour {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  status: string;
  agencyId?: string;
  agencyName?: string;
  location?: string;
  driverId?: string;
  driverName?: string;
}

interface BusCalendarProps {
  tours?: Tour[];
  onDeleteTour?: (tourId: string) => void;
}

const BusCalendar = ({ tours: propTours, onDeleteTour }: BusCalendarProps) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);

  // Genera i giorni visibili nel calendario (esattamente 1 mese)
  useEffect(() => {
    // Otteniamo il primo giorno del mese
    const startDate = new Date(selectedYear, currentDate.getMonth(), 1);
    // Otteniamo l'ultimo giorno del mese
    const endDate = new Date(selectedYear, currentDate.getMonth() + 1, 0);
    // Generiamo un array con tutti i giorni del mese
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    // Impostiamo i giorni visibili
    setVisibleDays(days);

    console.log('Giorni visibili:', days.map(d => format(d, 'yyyy-MM-dd')));
    console.log('Primo giorno:', format(days[0], 'yyyy-MM-dd'));
    console.log('Ultimo giorno:', format(days[days.length - 1], 'yyyy-MM-dd'));
  }, [currentDate, selectedYear]);

  // Mock data per bus e autisti
  useEffect(() => {
    const mockBuses: Bus[] = [
      {
        id: 'bus1',
        name: 'Bus Gran Turismo 1',
        plate: 'AA123BB',
        driverId: 'driver1',
        driverName: 'Mario Rossi'
      },
      {
        id: 'bus2',
        name: 'Bus Gran Turismo 2',
        plate: 'CC456DD',
        driverId: 'driver2',
        driverName: 'Luigi Verdi'
      },
      {
        id: 'bus3',
        name: 'Bus Gran Turismo 3',
        plate: 'EE789FF',
        driverId: 'driver3',
        driverName: 'Giuseppe Bianchi'
      },
      {
        id: 'bus4',
        name: 'Bus Gran Turismo 4',
        plate: 'GG012HH',
        driverId: 'driver4',
        driverName: 'Antonio Neri'
      }
    ];

    setBuses(mockBuses);
  }, []);

  // Usa i tour passati come props o un array vuoto se non disponibili
  useEffect(() => {
    if (propTours && propTours.length > 0) {
      setTours(propTours);
    }
  }, [propTours]);

  // Funzioni di navigazione
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedYear(today.getFullYear());
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour);
    setShowEditModal(true);
  };

  const handleAddTourClick = (e: React.MouseEvent, date: Date, busId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedDate(date);
    setSelectedBusId(busId);
    setShowAddModal(true);
  };

  const handleCloseModals = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedTour(null);
    setSelectedDate(null);
    setSelectedBusId(null);
  };

  const handleSaveTour = (tour: Tour) => {
    // In una vera applicazione, qui salveremmo il tour nel database
    if (selectedTour) {
      // Aggiornamento di un tour esistente
      setTours(prevTours =>
        prevTours.map(t => t.id === tour.id ? tour : t)
      );
    } else {
      // Aggiunta di un nuovo tour
      const newTour = {
        ...tour,
        id: `tour${Date.now()}` // Assicuriamoci che l'ID sia unico
      };
      setTours(prevTours => [...prevTours, newTour]);
      console.log('Nuovo tour aggiunto:', newTour);
    }
    handleCloseModals();
  };

  // Ottieni il colore in base allo stato del tour
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981'; // verde
      case 'preparation':
        return '#f59e0b'; // giallo
      case 'empty':
        return '#6b7280'; // grigio
      case 'stop':
        return '#ef4444'; // rosso
      default:
        return '#3b82f6'; // blu
    }
  };

  // Verifica se un tour è attivo in una data specifica
  const isTourActiveOnDate = (tour: Tour, date: Date) => {
    // Assicuriamoci che le date siano valide
    if (!tour.start || !tour.end) return false;

    // Creiamo le date senza l'ora per confrontare solo le date
    const tourStartStr = tour.start.split('T')[0];
    const tourEndStr = tour.end.split('T')[0];

    // Convertiamo le stringhe in oggetti Date
    const tourStart = new Date(tourStartStr);
    const tourEnd = new Date(tourEndStr);

    // Creiamo una copia della data senza l'ora
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // Resettiamo le ore per tutte le date per un confronto corretto
    tourStart.setHours(0, 0, 0, 0);
    tourEnd.setHours(0, 0, 0, 0);
    dateWithoutTime.setHours(0, 0, 0, 0);

    // Debug
    console.log('Tour:', tour.title);
    console.log('Data da verificare:', dateWithoutTime.toISOString().split('T')[0]);
    console.log('Data inizio tour:', tourStart.toISOString().split('T')[0]);
    console.log('Data fine tour:', tourEnd.toISOString().split('T')[0]);

    // Confrontiamo le date (inclusivo per inizio e fine)
    const isActive = (
      dateWithoutTime.getTime() >= tourStart.getTime() &&
      dateWithoutTime.getTime() <= tourEnd.getTime()
    );

    console.log('Il tour è attivo in questa data?', isActive);
    return isActive;
  };

  // Ottieni i tour per un bus in una data specifica
  const getToursForBusOnDate = (busId: string, date: Date) => {
    // Creiamo una copia della data senza l'ora per confrontare solo le date
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    dateWithoutTime.setHours(0, 0, 0, 0);

    const filteredTours = tours.filter(tour => {
      // Verifichiamo che il tour sia per questo bus
      if (tour.busId !== busId) return false;

      // Verifichiamo che il tour sia attivo in questa data
      if (!tour.start || !tour.end) return false;

      // Creiamo le date senza l'ora per confrontare solo le date
      const tourStartStr = tour.start.split('T')[0];
      const tourEndStr = tour.end.split('T')[0];

      // Convertiamo le stringhe in oggetti Date
      const tourStart = new Date(tourStartStr);
      const tourEnd = new Date(tourEndStr);

      // Resettiamo le ore per tutte le date per un confronto corretto
      tourStart.setHours(0, 0, 0, 0);
      tourEnd.setHours(0, 0, 0, 0);

      // Confrontiamo le date (inclusivo per inizio e fine)
      const isActive = dateWithoutTime >= tourStart && dateWithoutTime <= tourEnd;

      return isActive;
    });

    return filteredTours;
  };

  // Verifica se un tour è attivo in una data specifica
  const isTourActiveOnDay = (tour: Tour, date: Date) => {
    if (!tour.start || !tour.end) return false;

    // Creiamo le date senza l'ora per confrontare solo le date
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    dateWithoutTime.setHours(0, 0, 0, 0);

    const tourStartStr = tour.start.split('T')[0];
    const tourEndStr = tour.end.split('T')[0];

    const tourStart = new Date(tourStartStr);
    const tourEnd = new Date(tourEndStr);

    tourStart.setHours(0, 0, 0, 0);
    tourEnd.setHours(0, 0, 0, 0);

    return dateWithoutTime >= tourStart && dateWithoutTime <= tourEnd;
  };

  // Verifica se ci sono tour per qualsiasi bus in una data specifica
  const hasAnyTourOnDate = (date: Date) => {
    // Verifichiamo se c'è almeno un tour attivo in questa data per qualsiasi bus
    return buses.some(bus => getToursForBusOnDate(bus.id, date).length > 0);
  };

  // Verifica se ci sono tour per un bus specifico in una data specifica
  const hasTourForBusOnDate = (busId: string, date: Date) => {
    // Verifichiamo se ci sono tour per questo bus in questa data
    return getToursForBusOnDate(busId, date).length > 0;
  };

  // Verifica se la data è nel mese corrente
  const isDateInCurrentMonth = (date: Date) => {
    // Verifichiamo che la data sia nel mese corrente
    const result = date.getMonth() === currentDate.getMonth() &&
                  date.getFullYear() === currentDate.getFullYear();

    // Debug
    if (format(date, 'yyyy-MM-dd') === '2023-04-01' || format(date, 'yyyy-MM-dd') === '2023-04-30') {
      console.log(`Data ${format(date, 'yyyy-MM-dd')} è nel mese corrente? ${result}`);
    }

    return result;
  };

  // Renderizza l'intestazione del calendario
  const renderCalendarHeader = () => {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {format(currentDate, 'MMMM', { locale: it })}
          </h2>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '1rem'
            }}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={goToPreviousMonth}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Oggi
          </button>
          <button
            onClick={goToNextMonth}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    );
  };

  // Renderizza le date nella parte superiore del calendario
  const renderCalendarDates = () => {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '250px repeat(' + visibleDays.length + ', minmax(100px, 1fr))',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        position: 'sticky',
        top: 0,
        zIndex: 25
      }}>
        <div style={{
          padding: '0.75rem',
          fontWeight: 'bold',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'sticky',
          left: 0,
          backgroundColor: '#f9fafb',
          zIndex: 30
        }}>
          Bus / Data
        </div>
        {visibleDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={index}
              style={{
                padding: '0.75rem',
                textAlign: 'center',
                fontWeight: isToday ? 'bold' : 'normal',
                backgroundColor: isToday ? '#ebf5ff' : 'transparent',
                borderRight: index < visibleDays.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {format(day, 'EEE', { locale: it })}
              </div>
              <div style={{
                fontSize: '1.125rem',
                color: isToday ? '#3b82f6' : '#111827'
              }}>
                {format(day, 'd', { locale: it })}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                {format(day, 'MMM', { locale: it })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizza le righe dei bus con i relativi tour
  const renderBusRows = () => {
    return (
      <div style={{
        display: 'grid',
        gridTemplateRows: 'repeat(' + buses.length + ', minmax(80px, auto))',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {buses.map((bus, busIndex) => (
          <div
            key={bus.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '250px repeat(' + visibleDays.length + ', minmax(100px, 1fr))',
              borderBottom: busIndex < buses.length - 1 ? '1px solid #e5e7eb' : 'none'
            }}
          >
            {/* Colonna fissa con informazioni sul bus */}
            <div style={{
              padding: '0.75rem',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              position: 'sticky',
              left: 0,
              zIndex: 20
            }}>
              <div style={{ fontWeight: 'bold' }}>{bus.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Targa: {bus.plate}
              </div>
            </div>

            {/* Celle per ogni giorno */}
            {visibleDays.map((day, dayIndex) => {
              const toursForDay = getToursForBusOnDate(bus.id, day);
              const isToday = isSameDay(day, new Date());

              // Verifichiamo se questa data è nel mese corrente
              const isCurrentMonth = isDateInCurrentMonth(day);
              // Verifichiamo se ci sono tour per questo bus in questa data
              const hasTour = hasTourForBusOnDate(bus.id, day);
              // Mostriamo il pulsante + solo se non ci sono tour e la data è nel mese corrente
              const showAddButton = !hasTour && isCurrentMonth;

              // Debug
              if (format(day, 'yyyy-MM-dd') === '2023-04-01' || format(day, 'yyyy-MM-dd') === '2023-04-30') {
                console.log(`Data ${format(day, 'yyyy-MM-dd')} - Bus ${bus.id} - Ha tour? ${hasTour} - È nel mese corrente? ${isCurrentMonth} - Mostra +? ${showAddButton}`);
              }

              return (
                <div
                  key={dayIndex}
                  style={{
                    padding: '0.5rem',
                    borderRight: dayIndex < visibleDays.length - 1 ? '1px solid #e5e7eb' : 'none',
                    backgroundColor: isToday ? '#ebf5ff' : 'white',
                    minHeight: '100px',
                    minWidth: '180px',
                    position: 'relative'
                  }}
                >
                  {/* Pulsante per aggiungere un tour - mostrato solo se non ci sono tour in questa data/bus e la data è nel mese corrente */}
                  {showAddButton && (
                    <AddButton date={day} busId={bus.id} />
                  )}

                  {/* Lista dei tour */}
                  {toursForDay.map(tour => (
                    <div
                      key={tour.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Utilizziamo lo stesso approccio del pulsante + che ora funziona
                        // Navighiamo alla pagina principale e impostiamo lo stato per aprire il modale di modifica
                        navigate('/tours', {
                          state: {
                            openEditModal: true,
                            tourId: tour.id,
                            tourData: tour
                          }
                        });
                        return false;
                      }}
                      className="tour-cell"
                      id={`tour-${tour.id}`}
                      style={{
                        backgroundColor: getStatusColor(tour.status),
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      title={`${tour.title} - ${tour.agencyName} - ${tour.location}`}
                    >
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tour.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tour.agencyName}
                        </div>
                        <div style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tour.location}
                        </div>
                        <div style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px', fontStyle: 'italic' }}>
                          Autista: {tour.driverName || 'Non assegnato'}
                        </div>
                      </div>

                      {/* Rimosso pulsante elimina dal calendario */}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Renderizza il modale per modificare un tour
  const renderEditTourModal = () => {
    if (!showEditModal || !selectedTour) return null;

    // Riferimenti per i campi del form
    const titleRef = React.useRef<HTMLInputElement>(null);
    const agencyNameRef = React.useRef<HTMLInputElement>(null);
    const locationRef = React.useRef<HTMLInputElement>(null);
    const startDateRef = React.useRef<HTMLInputElement>(null);
    const endDateRef = React.useRef<HTMLInputElement>(null);
    const statusRef = React.useRef<HTMLSelectElement>(null);

    // Funzione per raccogliere i dati dal form e aggiornare il tour
    const updateTour = () => {
      if (!selectedTour) return;

      // Ottieni i valori dai campi
      const title = titleRef.current?.value || selectedTour.title;
      const agencyName = agencyNameRef.current?.value || selectedTour.agencyName || '';
      const location = locationRef.current?.value || selectedTour.location || '';
      const startDate = startDateRef.current?.value || selectedTour.start;
      const endDate = endDateRef.current?.value || selectedTour.end;
      const status = statusRef.current?.value as 'preparation' | 'active' | 'empty' | 'stop' || selectedTour.status;

      // Aggiorna il tour
      const updatedTour: Tour = {
        ...selectedTour,
        title,
        start: startDate,
        end: endDate,
        status,
        agencyName,
        location
      };

      // Salva il tour aggiornato
      handleSaveTour(updatedTour);
    };

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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Modifica Tour</h2>
            <button
              onClick={handleCloseModals}
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

          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Titolo</label>
              <input
                ref={titleRef}
                type="text"
                defaultValue={selectedTour.title}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Agenzia</label>
              <input
                ref={agencyNameRef}
                type="text"
                defaultValue={selectedTour.agencyName}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
              <input
                ref={locationRef}
                type="text"
                defaultValue={selectedTour.location}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Inizio</label>
                <input
                  ref={startDateRef}
                  type="date"
                  defaultValue={selectedTour.start}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Fine</label>
                <input
                  ref={endDateRef}
                  type="date"
                  defaultValue={selectedTour.end}
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato</label>
              <select
                ref={statusRef}
                defaultValue={selectedTour.status}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              >
                <option value="active">Attivo</option>
                <option value="preparation">In Preparazione</option>
                <option value="empty">Vuoto</option>
                <option value="stop">Fermo</option>
              </select>
            </div>

            <div style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Annulla
              </button>
              <button
                onClick={updateTour}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizza il modale per aggiungere un tour
  const renderAddTourModal = () => {
    if (!showAddModal || !selectedDate || !selectedBusId) return null;

    // Riferimenti per i campi del form
    const titleRef = React.useRef<HTMLInputElement>(null);
    const agencyRef = React.useRef<HTMLSelectElement>(null);
    const locationRef = React.useRef<HTMLInputElement>(null);
    const startDateRef = React.useRef<HTMLInputElement>(null);
    const endDateRef = React.useRef<HTMLInputElement>(null);
    const statusRef = React.useRef<HTMLSelectElement>(null);

    // Funzione per raccogliere i dati dal form e creare un nuovo tour
    const createNewTour = () => {
      // Ottieni i valori dai campi
      const title = titleRef.current?.value || 'Nuovo Tour';
      const agencyId = agencyRef.current?.value || 'agency1';
      const agencyName = agencyRef.current?.options[agencyRef.current.selectedIndex]?.text || 'Viaggi Napoli';
      const location = locationRef.current?.value || 'Nuova Location';
      const startDate = startDateRef.current?.value || format(selectedDate, 'yyyy-MM-dd');
      const endDate = endDateRef.current?.value || format(selectedDate, 'yyyy-MM-dd');
      const status = statusRef.current?.value as 'preparation' | 'active' | 'empty' | 'stop' || 'preparation';

      // Crea il nuovo tour
      const newTour: Tour = {
        id: `tour${Date.now()}`,
        title,
        start: startDate,
        end: endDate,
        busId: selectedBusId,
        status,
        agencyId,
        agencyName,
        location
      };

      // Salva il tour
      handleSaveTour(newTour);
    };

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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Aggiungi Tour</h2>
            <button
              onClick={handleCloseModals}
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

          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Titolo</label>
              <input
                ref={titleRef}
                type="text"
                placeholder="Inserisci il titolo del tour"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Agenzia</label>
              <select
                ref={agencyRef}
                defaultValue="agency1"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              >
                <option value="">Seleziona un'agenzia</option>
                <option value="agency1">Viaggi Napoli</option>
                <option value="agency2">Europa Tours</option>
                <option value="agency3">Italia Vacanze</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
              <input
                ref={locationRef}
                type="text"
                placeholder="Inserisci la location"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Inizio</label>
                <input
                  ref={startDateRef}
                  type="date"
                  defaultValue={format(selectedDate, 'yyyy-MM-dd')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Data Fine</label>
                <input
                  ref={endDateRef}
                  type="date"
                  defaultValue={format(selectedDate, 'yyyy-MM-dd')}
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stato</label>
              <select
                ref={statusRef}
                defaultValue="preparation"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
              >
                <option value="active">Attivo</option>
                <option value="preparation">In Preparazione</option>
                <option value="empty">Vuoto</option>
                <option value="stop">Fermo</option>
              </select>
            </div>

            <div style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={handleCloseModals}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Annulla
              </button>
              <button
                onClick={createNewTour}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
        {renderCalendarHeader()}
      </div>
      <div style={{
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <div style={{ minWidth: '1200px' }}>
          {renderCalendarDates()}
          {renderBusRows()}
        </div>
      </div>
      {renderEditTourModal()}
      {renderAddTourModal()}
    </div>
  );
};

export default BusCalendar;
