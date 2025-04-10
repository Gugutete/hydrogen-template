import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  busName: string;
  driverId: string;
  driverName: string;
  status: 'preparation' | 'active' | 'empty' | 'stop';
}

const TourCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Tour Roma',
        start: '2023-06-10',
        end: '2023-06-15',
        busId: 'bus1',
        busName: 'Bus Gran Turismo 1',
        driverId: 'driver1',
        driverName: 'Mario Rossi',
        status: 'active'
      },
      {
        id: '2',
        title: 'Tour Milano',
        start: '2023-06-12',
        end: '2023-06-18',
        busId: 'bus2',
        busName: 'Bus Gran Turismo 2',
        driverId: 'driver2',
        driverName: 'Luigi Verdi',
        status: 'preparation'
      },
      {
        id: '3',
        title: 'Tour Venezia',
        start: '2023-06-20',
        end: '2023-06-25',
        busId: 'bus3',
        busName: 'Bus Gran Turismo 3',
        driverId: 'driver3',
        driverName: 'Giuseppe Bianchi',
        status: 'active'
      }
    ];
    
    setEvents(mockEvents);
  }, []);
  
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const renderCalendarHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {format(currentDate, 'MMMM yyyy', { locale: it })}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={goToPreviousMonth}
            className="btn btn-white"
            style={{ padding: '0.5rem 1rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToToday}
            className="btn btn-white"
            style={{ padding: '0.5rem 1rem' }}
          >
            Oggi
          </button>
          <button 
            onClick={goToNextMonth}
            className="btn btn-white"
            style={{ padding: '0.5rem 1rem' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  const renderCalendarDays = () => {
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e5e7eb', marginBottom: '1px' }}>
        {weekdays.map((day, index) => (
          <div 
            key={index} 
            style={{ 
              backgroundColor: 'white', 
              padding: '0.5rem', 
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };
  
  const getEventForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const currentDate = new Date(dateStr);
      
      return currentDate >= eventStart && currentDate <= eventEnd;
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981'; // green
      case 'preparation':
        return '#3b82f6'; // blue
      case 'empty':
        return '#6b7280'; // gray
      case 'stop':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };
  
  const renderCalendarCells = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const cells = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div 
          key={`empty-${i}`} 
          style={{ 
            backgroundColor: 'white', 
            minHeight: '100px',
            padding: '0.5rem',
            color: '#d1d5db'
          }}
        />
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= days; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = format(new Date(), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      const eventsForDay = getEventForDate(date);
      
      cells.push(
        <div 
          key={`day-${day}`} 
          style={{ 
            backgroundColor: 'white', 
            minHeight: '100px',
            padding: '0.5rem',
            border: isToday ? '2px solid #3b82f6' : 'none',
            position: 'relative'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: isToday ? '#3b82f6' : 'transparent',
            color: isToday ? 'white' : '#374151',
            fontWeight: isToday ? 'bold' : 'normal',
            marginBottom: '0.5rem'
          }}>
            {day}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {eventsForDay.map(event => (
              <div 
                key={event.id} 
                style={{ 
                  backgroundColor: getStatusColor(event.status),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={`${event.title} - ${event.busName} - ${event.driverName}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e5e7eb' }}>
        {cells}
      </div>
    );
  };
  
  return (
    <div className="card">
      {renderCalendarHeader()}
      {renderCalendarDays()}
      {renderCalendarCells()}
    </div>
  );
};

export default TourCalendar;
