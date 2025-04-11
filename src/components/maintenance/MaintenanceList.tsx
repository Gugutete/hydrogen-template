import React from 'react';
import { actionButtonStyle, iconStyle, iconColors } from '../../styles/actionButtons';

interface Maintenance {
  id: string;
  busId: string;
  busName: string;
  type: string;
  description: string;
  date: string;
  cost?: number;
  status: string;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

interface MaintenanceListProps {
  maintenances: Maintenance[];
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (maintenanceId: string) => void;
  onDuplicate: (maintenance: Maintenance) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ maintenances, onEdit, onDelete, onDuplicate }) => {
  // Funzione per formattare la data
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('it-IT');
    } catch (error) {
      return dateString;
    }
  };

  // Funzione per formattare la valuta
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Funzione per ottenere il colore dello stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Funzione per ottenere l'etichetta dello stato
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completata';
      case 'scheduled':
        return 'Programmata';
      case 'in_progress':
        return 'In Corso';
      case 'cancelled':
        return 'Annullata';
      default:
        return status;
    }
  };

  // Funzione per ottenere l'etichetta del tipo
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'routine':
        return 'Manutenzione Ordinaria';
      case 'repair':
        return 'Riparazione';
      case 'inspection':
        return 'Ispezione';
      case 'emergency':
        return 'Emergenza';
      default:
        return type;
    }
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Bus</th>
              <th>Descrizione</th>
              <th>Data</th>
              <th>{maintenances.some(m => m.type !== 'document') ? 'Costo' : 'File'}</th>
              <th>Stato</th>
              <th style={{ textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>
                  <div className="font-medium">{maintenance.busName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {getTypeLabel(maintenance.type)}
                  </div>
                </td>
                <td>
                  <div>{maintenance.description}</div>
                </td>
                <td>
                  <div>{formatDate(maintenance.date)}</div>
                </td>
                <td>
                  {maintenance.type !== 'document' ? (
                    <div>{maintenance.cost ? formatCurrency(maintenance.cost) : '-'}</div>
                  ) : (
                    <div>
                      {maintenance.fileUrl ? (
                        <div className="flex items-center">
                          <span className="mr-2">{maintenance.fileName || 'Documento'}</span>
                          <button
                            onClick={() => {
                              // Se l'URL inizia con 'blob:', è un URL temporaneo
                              if (maintenance.fileUrl.startsWith('blob:')) {
                                // Apri il file in una nuova finestra
                                window.open(maintenance.fileUrl, '_blank');
                              } else {
                                // Altrimenti, prova ad aprire l'URL normalmente
                                window.open(maintenance.fileUrl, '_blank');
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            title="Visualizza documento"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ maxWidth: '16px', maxHeight: '16px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500">Nessun file</span>
                      )}
                    </div>
                  )}
                </td>
                <td>
                  <span className={`badge ${getStatusColor(maintenance.status)}`}>
                    {getStatusLabel(maintenance.status)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>

                    <button
                      style={actionButtonStyle}
                      title="Modifica"
                      onClick={() => onEdit(maintenance)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.edit} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Duplica"
                      onClick={() => onDuplicate(maintenance)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.duplicate} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Elimina"
                      onClick={() => onDelete(maintenance.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.delete} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {maintenances.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nessuna manutenzione trovata. Clicca su "Aggiungi Manutenzione" per crearne una nuova.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceList;
