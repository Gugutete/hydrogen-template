import React from 'react';
import DraggableTour from './DraggableTour';
import { DailyLocation } from '../../types/dailyLocation';

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

interface DroppableCellProps {
  busId: string;
  date: Date;
  tours: Tour[];
  isToday: boolean;
  getStatusColor: (status: string) => string;
  onAddTour: (date: Date, busId: string) => void;
  onEditTour: (tour: Tour) => void;
  onMoveTour: (tour: Tour, newBusId: string, newDate: Date) => void;
  onEditLocation?: (tour: Tour, date: Date, location: string) => void;
}

const DroppableCell: React.FC<DroppableCellProps> = ({
  busId,
  date,
  tours,
  isToday,
  getStatusColor,
  onAddTour,
  onEditTour,
  onMoveTour,
  onEditLocation
}) => {
  const isFirstOfMonth = date.getDate() === 1;

  // Gestisce l'evento di drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Previene il comportamento predefinito per permettere il drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Aggiungi una classe per lo stile durante il drag over
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  // Gestisce l'evento di drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Rimuovi la classe di stile
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  // Gestisce l'evento di drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Rimuovi la classe di stile
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }

    // Ottieni i dati del tour
    const tourData = e.dataTransfer.getData('application/json');
    if (!tourData) return;

    try {
      // Converti i dati in un oggetto tour
      const tour: Tour = JSON.parse(tourData);

      // Chiama la funzione per spostare il tour
      onMoveTour(tour, busId, date);
    } catch (error) {
      console.error('Errore durante il parsing dei dati del tour:', error);
    }
  };

  return (
    <td className={`calendar-cell ${isToday ? 'today-cell' : ''} ${isFirstOfMonth ? 'first-of-month-cell' : ''}`}>
      <div
        style={{
          backgroundColor: isToday ? '#ebf5ff' : 'white',
          minHeight: '100px',
          position: 'relative',
          height: '100%',
          width: '100%',
          padding: '0.5rem'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-bus-id={busId}
        data-date={date.toISOString().split('T')[0]}
      >
        {tours.length === 0 && (
          <button
            className="add-tour-button"
            onClick={() => onAddTour(date, busId)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '24px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              color: '#4b5563',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              zIndex: 5
            }}
          >
            +
          </button>
        )}

        <div className="tours-container">
          {tours.map((tour) => (
            <DraggableTour
              key={tour.id}
              tour={tour}
              date={date}
              getStatusColor={getStatusColor}
              onEditTour={onEditTour}
              onEditLocation={onEditLocation}
            />
          ))}
        </div>
      </div>
    </td>
  );
};

export default DroppableCell;
