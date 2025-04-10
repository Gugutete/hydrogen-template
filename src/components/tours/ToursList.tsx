import React from 'react';

interface Tour {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  busName: string;
  driverId: string;
  driverName: string;
  agencyId: string;
  agencyName: string;
  status: string;
  price?: number;
  passengers?: number;
  notes?: string;
  location?: string;
}

interface ToursListProps {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (tourId: string) => void;
  onDuplicate: (tour: Tour) => void;
}

const ToursList: React.FC<ToursListProps> = ({ tours, onEdit, onDelete, onDuplicate }) => {
  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('it-IT');
    } catch (error) {
      return dateString;
    }
  };

  // Funzione per ottenere il badge in base allo stato
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-success">Attivo</span>;
      case 'preparation':
        return <span className="badge badge-warning">In Preparazione</span>;
      case 'completed':
        return <span className="badge badge-info">Completato</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancellato</span>;
      case 'empty':
        return <span className="badge badge-secondary">Vuoto</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Nome Tour</th>
            <th>Data Inizio</th>
            <th>Data Fine</th>
            <th>Bus</th>
            <th>Autista</th>
            <th>Stato</th>
            <th style={{ textAlign: 'right' }}>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(tour => (
            <tr key={tour.id}>
              <td>
                <div className="font-medium">{tour.title}</div>
                {tour.location && (
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{tour.location}</div>
                )}
              </td>
              <td>{formatDate(tour.start)}</td>
              <td>{formatDate(tour.end)}</td>
              <td>{tour.busName}</td>
              <td>{tour.driverName}</td>
              <td>
                {getStatusBadge(tour.status)}
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Visualizza Dettagli"
                    onClick={() => onEdit(tour)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#3b82f6', width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Modifica"
                    onClick={() => onEdit(tour)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#f59e0b', width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Duplica"
                    onClick={() => onDuplicate(tour)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8b5cf6', width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                    title="Elimina"
                    onClick={() => onDelete(tour.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#ef4444', width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {tours.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                Nessun tour trovato. Clicca su "Aggiungi Tour" per crearne uno nuovo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ToursList;
