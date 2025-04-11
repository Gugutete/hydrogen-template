import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import '../../styles/calendar.css';
import DroppableCell from './DroppableCell';
import { DailyLocation } from '../../types/dailyLocation';

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
  dailyLocations?: DailyLocation[];
}

interface BusCalendarProps {
  tours?: Tour[];
  onDeleteTour?: (tourId: string) => void;
  buses?: Bus[];
}

const NewBusCalendar = ({ tours: propTours, onDeleteTour, buses: propBuses }: BusCalendarProps) => {
  // Funzione per gestire lo spostamento di un tour
  const handleMoveTour = (tour: Tour, newBusId: string, newDate: Date) => {
    console.log('Spostamento tour:', tour.id, 'da bus', tour.busId, 'a bus', newBusId);
    console.log('Da data:', tour.start, 'a data:', format(newDate, 'yyyy-MM-dd'));

    // Crea una copia del tour con le nuove date e il nuovo bus
    const updatedTour = {
      ...tour,
      busId: newBusId,
      start: format(newDate, 'yyyy-MM-dd'),
      end: format(newDate, 'yyyy-MM-dd')
    };

    // Crea una nuova lista di tour, rimuovendo il tour originale
    // e aggiungendo la versione aggiornata
    const newTours = tours.filter(t => t.id !== tour.id);

    // Aggiungi il tour aggiornato alla nuova lista
    newTours.push(updatedTour);

    // Aggiorna lo stato locale dei tour
    setTours([...newTours]);

    // Forza un aggiornamento della visualizzazione
    setTimeout(() => {
      // Questo forza un re-render del componente
      setCurrentDate(new Date(currentDate));
    }, 100);

    // Qui potresti chiamare una funzione per aggiornare i dati sul server
    console.log('Tour spostato con successo:', updatedTour);
  };

  // Funzione per gestire la modifica della location per una data specifica
  const handleEditLocation = (tour: Tour, date: Date, newLocation: string) => {
    console.log('Modifica location per tour:', tour.id, 'data:', format(date, 'yyyy-MM-dd'), 'nuova location:', newLocation);

    // Crea una copia del tour
    const updatedTour = { ...tour };

    // Converti la data in formato stringa
    const dateStr = format(date, 'yyyy-MM-dd');

    // Inizializza l'array delle location giornaliere se non esiste
    if (!updatedTour.dailyLocations) {
      updatedTour.dailyLocations = [];
    }

    // Cerca se esiste già una location per questa data
    const existingLocationIndex = updatedTour.dailyLocations.findIndex(dl => dl.date === dateStr);

    if (existingLocationIndex >= 0) {
      // Aggiorna la location esistente
      updatedTour.dailyLocations[existingLocationIndex].location = newLocation;
    } else {
      // Aggiungi una nuova location giornaliera
      updatedTour.dailyLocations.push({
        date: dateStr,
        location: newLocation
      });
    }

    // Crea una nuova lista di tour, rimuovendo il tour originale
    // e aggiungendo la versione aggiornata
    const newTours = tours.filter(t => t.id !== tour.id);
    newTours.push(updatedTour);

    // Aggiorna lo stato locale dei tour
    setTours([...newTours]);

    // Qui potresti chiamare una funzione per aggiornare i dati sul server
    console.log('Tour aggiornato con successo:', updatedTour);
  };
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

  // Genera i giorni visibili nel calendario (1 mese alla volta)
  useEffect(() => {
    // Otteniamo il primo giorno del mese corrente
    const startDate = new Date(selectedYear, currentDate.getMonth(), 1);
    // Otteniamo l'ultimo giorno del mese corrente
    const endDate = new Date(selectedYear, currentDate.getMonth() + 1, 0);
    // Generiamo un array con tutti i giorni del mese
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    // Impostiamo i giorni visibili
    setVisibleDays(days);

    console.log(`Mostrando giorni dal ${format(startDate, 'dd/MM/yyyy')} al ${format(endDate, 'dd/MM/yyyy')}`);
    console.log(`Totale giorni: ${days.length}`);
  }, [currentDate, selectedYear]);

  // Usa i bus passati come props o un array vuoto se non disponibili
  useEffect(() => {
    if (propBuses && propBuses.length > 0) {
      console.log('Bus ricevuti dalle props:', propBuses);
      setBuses(propBuses);
    } else {
      console.log('Nessun bus ricevuto dalle props, uso i dati di esempio');
      // Dati di esempio come fallback
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
    }
  }, [propBuses]);

  // Usa i tour passati come props o un array vuoto se non disponibili
  useEffect(() => {
    if (propTours && propTours.length > 0) {
      console.log('Tour ricevuti dalle props:', propTours);
      setTours(propTours);
    } else {
      console.log('Nessun tour ricevuto dalle props');
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

  // Funzione per ottenere il colore in base allo stato del tour
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confermato':
        return '#10b981'; // verde
      case 'in attesa':
        return '#f59e0b'; // giallo
      case 'annullato':
        return '#ef4444'; // rosso
      default:
        return '#3b82f6'; // blu
    }
  };

  // Ottieni i tour per un bus in una data specifica
  const getToursForBusOnDate = (busId: string, date: Date) => {
    // Creiamo una copia della data senza l'ora per confrontare solo le date
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    dateWithoutTime.setHours(0, 0, 0, 0);

    // Debug per vedere i tour disponibili
    if (date.getDate() === 1 && date.getMonth() === new Date().getMonth()) {
      console.log('Cercando tour per bus:', busId, 'in data:', format(date, 'yyyy-MM-dd'));
      console.log('Tour disponibili:', tours);
    }

    const filteredTours = tours.filter(tour => {
      // Verifichiamo che il tour sia per questo bus
      if (tour.busId !== busId) {
        // Debug per il primo giorno del mese corrente
        if (date.getDate() === 1 && date.getMonth() === new Date().getMonth()) {
          console.log('Tour', tour.id, 'scartato: busId non corrisponde', tour.busId, '!=', busId);
        }
        return false;
      }

      // Verifichiamo che il tour sia attivo in questa data
      if (!tour.start || !tour.end) {
        if (date.getDate() === 1 && date.getMonth() === new Date().getMonth()) {
          console.log('Tour', tour.id, 'scartato: date mancanti', tour.start, tour.end);
        }
        return false;
      }

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

      // Debug per il primo giorno del mese corrente
      if (date.getDate() === 1 && date.getMonth() === new Date().getMonth()) {
        console.log('Tour', tour.id, 'date confronto:',
          'cellDate:', format(dateWithoutTime, 'yyyy-MM-dd'),
          'tourStart:', format(tourStart, 'yyyy-MM-dd'),
          'tourEnd:', format(tourEnd, 'yyyy-MM-dd'),
          'isActive:', isActive
        );
      }

      return isActive;
    });

    // Debug per il primo giorno del mese corrente
    if (date.getDate() === 1 && date.getMonth() === new Date().getMonth() && filteredTours.length > 0) {
      console.log('Tour trovati per bus', busId, 'in data', format(date, 'yyyy-MM-dd'), ':', filteredTours);
    }

    return filteredTours;
  };

  // Verifica se ci sono tour per un bus specifico in una data specifica
  const hasTourForBusOnDate = (busId: string, date: Date) => {
    return getToursForBusOnDate(busId, date).length > 0;
  };

  // Funzione per aggiungere un nuovo tour
  const handleAddTour = (date: Date, busId: string) => {
    navigate('/tours', {
      state: {
        openAddModal: true,
        selectedDate: format(date, 'yyyy-MM-dd'),
        selectedBusId: busId
      }
    });
  };

  // Funzione per modificare un tour esistente
  const handleEditTour = (tour: Tour) => {
    navigate('/tours', {
      state: {
        openEditModal: true,
        tourId: tour.id,
        tourData: tour
      }
    });
  };

  // Renderizza l'intestazione del calendario
  const renderCalendarHeader = () => {
    // Calcola il nome del mese visibile
    const currentMonth = new Date(selectedYear, currentDate.getMonth(), 1);
    const monthDisplay = format(currentMonth, 'MMMM', { locale: it });

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
            {monthDisplay} {selectedYear}
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

  // Funzione per formattare il nome del mese
  const getMonthName = (date: Date) => {
    return format(date, 'MMMM', { locale: it });
  };

  // Funzione per resettare l'offset quando cambia il mese o l'anno
  useEffect(() => {
    setVisibleDaysOffset(0);
  }, [currentDate, selectedYear]);

  // Funzione per verificare se una data è nel mese specificato
  const isInMonth = (date: Date, month: number, year: number) => {
    return date.getMonth() === month && date.getFullYear() === year;
  };

  // Stato per tenere traccia dell'offset di visualizzazione (quanti giorni saltare)
  const [visibleDaysOffset, setVisibleDaysOffset] = useState(0);

  // Funzione per ottenere i giorni attualmente visibili (30 alla volta)
  const getCurrentVisibleDays = () => {
    // Mostriamo tutti i giorni disponibili (3 mesi) invece di limitare a 30
    // Questo permetterà lo scrolling orizzontale con il mouse
    return visibleDays;
  };

  // Funzione per scorrere a sinistra (giorni precedenti)
  const scrollLeft = () => {
    if (visibleDaysOffset >= 30) {
      setVisibleDaysOffset(visibleDaysOffset - 30);
    } else {
      setVisibleDaysOffset(0);
    }
  };

  // Funzione per scorrere a destra (giorni successivi)
  const scrollRight = () => {
    if (visibleDaysOffset + 30 < visibleDays.length) {
      setVisibleDaysOffset(visibleDaysOffset + 30);
    }
  };

  // Renderizza la tabella del calendario
  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      {renderCalendarHeader()}

      {/* Rimossi i pulsanti di navigazione per 30 giorni alla volta poiché ora mostriamo tutti i giorni e permettiamo lo scrolling orizzontale */}

      <div style={{ overflowX: 'auto', width: '100%', maxHeight: '80vh' }}>
          <table className="calendar-table">
        <thead>
          <tr>
            <th className="bus-column">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0.75rem 30px' }}>
                Bus / Data
              </div>
            </th>
            {getCurrentVisibleDays().map((day, index) => {
              const isToday = isSameDay(day, new Date());
              const isFirstOfMonth = day.getDate() === 1;

              // Determina se mostrare l'intestazione del mese
              // Mostra sempre l'intestazione del mese per il primo giorno del mese
              const showMonthHeader = isFirstOfMonth;

              return (
                <th
                  key={index}
                  className={`${isToday ? 'today-column' : ''} ${isFirstOfMonth ? 'first-of-month' : ''}`}
                >
                  {/* Rimuoviamo l'intestazione del mese poiché mostreremo il mese in ogni cella */}
                  <div className="date-header">
                    <div className="day-name">{format(day, 'EEE', { locale: it })}</div>
                    <div className="day-number">{format(day, 'd', { locale: it })}</div>
                    <div className="month-name">{format(day, 'MMM', { locale: it })}</div>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {buses.map(bus => (
            <tr key={bus.id}>
              <td className="bus-info">
                <div className="bus-content">
                  <div className="bus-name">{bus.name}</div>
                  <div className="bus-plate">Targa: {bus.plate}</div>
                </div>
              </td>
              {getCurrentVisibleDays().map((day, dayIndex) => {
                const toursForDay = getToursForBusOnDate(bus.id, day);
                const isToday = isSameDay(day, new Date());

                return (
                  <DroppableCell
                    key={dayIndex}
                    busId={bus.id}
                    date={day}
                    tours={toursForDay}
                    isToday={isToday}
                    getStatusColor={getStatusColor}
                    onAddTour={handleAddTour}
                    onEditTour={handleEditTour}
                    onMoveTour={handleMoveTour}
                    onEditLocation={handleEditLocation}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
          </table>
        </div>
      </div>
  );
};

export default NewBusCalendar;
