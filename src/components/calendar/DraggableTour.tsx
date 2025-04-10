import React from 'react';
import { format } from 'date-fns';
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

interface DraggableTourProps {
  tour: Tour;
  date: Date;
  getStatusColor: (status: string) => string;
  onEditTour: (tour: Tour) => void;
  onEditLocation?: (tour: Tour, date: Date, location: string) => void;
}

const DraggableTour: React.FC<DraggableTourProps> = ({ tour, date, getStatusColor, onEditTour, onEditLocation }) => {
  // Gestisce l'inizio del trascinamento
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Salva i dati del tour come stringa JSON
    e.dataTransfer.setData('application/json', JSON.stringify(tour));
    // Imposta l'effetto di trascinamento
    e.dataTransfer.effectAllowed = 'move';

    // Aggiungi una classe per lo stile durante il trascinamento
    if (e.currentTarget.classList) {
      setTimeout(() => {
        e.currentTarget.classList.add('dragging');
      }, 0);
    }
  };

  // Gestisce la fine del trascinamento
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    // Rimuovi la classe di stile
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('dragging');
    }
  };

  // Funzione per ottenere la location per questa data specifica
  const getDailyLocation = (date: Date): string => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dailyLocation = tour.dailyLocations?.find(dl => dl.date === dateStr);
    return dailyLocation?.location || tour.location || 'Nessuna location';
  };

  return (
    <div
      className="tour-item"
      style={{
        backgroundColor: getStatusColor(tour.status),
        color: 'white',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        marginBottom: '0.5rem',
        cursor: 'grab',
        userSelect: 'none'
      }}
      onClick={() => onEditTour(tour)}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-tour-id={tour.id}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{tour.title}</div>
      <div style={{ fontSize: '0.75rem' }}>{tour.agencyName}</div>
      <div
        style={{
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          marginTop: '4px',
          marginBottom: '4px'
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onEditLocation) {
            const dateStr = format(date, 'yyyy-MM-dd');
            // Trova la location per questa data specifica o usa quella predefinita
            const dailyLocation = tour.dailyLocations?.find(dl => dl.date === dateStr);
            const currentLocation = dailyLocation?.location || tour.location || '';

            // Chiedi all'utente di inserire una nuova location
            const newLocation = window.prompt('Inserisci la location per questa data:', currentLocation);

            if (newLocation !== null && onEditLocation) {
              onEditLocation(tour, date, newLocation);
            }
          }
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '2px 6px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            display: 'inline-block'
          }}
        >
          {getDailyLocation(date)}
        </span>
        <span style={{ marginLeft: '4px', fontSize: '10px' }}>✏️</span>
      </div>
      <div style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '2px' }}>
        Autista: {tour.driverName || 'Non assegnato'}
      </div>
    </div>
  );
};

export default DraggableTour;
