import React from 'react';
import { actionButtonStyle, iconStyle, iconColors } from '../../styles/actionButtons';

interface Bus {
  id: string;
  name: string;
  plate: string;
  model: string;
  seats: number;
  year: number;
  status: string;
  nextMaintenance: string;
  documentsStatus: string;
}

interface BusListProps {
  buses: Bus[];
  onEdit: (bus: Bus) => void;
  onDelete: (busId: string) => void;
  onDuplicate: (bus: Bus) => void;
  onViewDocuments?: (bus: Bus) => void;
}

const BusList: React.FC<BusListProps> = ({ buses, onEdit, onDelete, onDuplicate, onViewDocuments }) => {
  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('it-IT');
    } catch (error) {
      return dateString;
    }
  };

  // Funzione per ottenere il colore dello stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Funzione per ottenere l'etichetta dello stato
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attivo';
      case 'maintenance':
        return 'In Manutenzione';
      case 'inactive':
        return 'Inattivo';
      case 'valid':
        return 'Validi';
      case 'expiring':
        return 'In Scadenza';
      case 'expired':
        return 'Scaduti';
      default:
        return status;
    }
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Targa</th>
              <th>Modello</th>
              <th>Posti</th>
              <th>Anno</th>
              <th>Stato</th>
              <th>Documenti</th>
              <th>Prossima Manutenzione</th>
              <th style={{ textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td>
                  <div className="font-medium">{bus.name}</div>
                </td>
                <td>
                  <div>{bus.plate}</div>
                </td>
                <td>
                  <div>{bus.model}</div>
                </td>
                <td>
                  <div>{bus.seats}</div>
                </td>
                <td>
                  <div>{bus.year}</div>
                </td>
                <td>
                  <span className={`badge ${getStatusColor(bus.status)}`}>
                    {getStatusLabel(bus.status)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusColor(bus.documentsStatus)}`}>
                    {getStatusLabel(bus.documentsStatus)}
                  </span>
                </td>
                <td>
                  <div>
                    {formatDate(bus.nextMaintenance)}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    {onViewDocuments && (
                      <button
                        style={actionButtonStyle}
                        title="Visualizza Documenti"
                        onClick={() => onViewDocuments(bus)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.view} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}

                    <button
                      style={actionButtonStyle}
                      title="Modifica"
                      onClick={() => onEdit(bus)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.edit} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Duplica"
                      onClick={() => onDuplicate(bus)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.duplicate} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Elimina"
                      onClick={() => onDelete(bus.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.delete} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {buses.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nessun bus trovato. Clicca su "Aggiungi Bus" per crearne uno nuovo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusList;
