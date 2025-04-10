import React from 'react';
import { actionButtonStyle, iconStyle, iconColors } from '../../styles/actionButtons';

interface Agency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: string;
  toursCount: number;
}

interface AgenciesListProps {
  agencies: Agency[];
  onEdit: (agency: Agency) => void;
  onDelete: (agencyId: string) => void;
  onDuplicate: (agency: Agency) => void;
}

const AgenciesList: React.FC<AgenciesListProps> = ({ agencies, onEdit, onDelete, onDuplicate }) => {
  // Funzione per ottenere il colore dello stato
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Funzione per ottenere l'etichetta dello stato
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Attiva';
      case 'inactive':
        return 'Inattiva';
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
              <th>Contatto</th>
              <th>Indirizzo</th>
              <th>Stato</th>
              <th>Tour</th>
              <th style={{ textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id}>
                <td>
                  <div className="font-medium">{agency.name}</div>
                </td>
                <td>
                  <div>{agency.contactPerson}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{agency.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{agency.phone}</div>
                </td>
                <td>
                  <div>{agency.address}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{agency.city}, {agency.country}</div>
                </td>
                <td>
                  <span className={`badge ${getStatusColor(agency.status)}`}>
                    {getStatusLabel(agency.status)}
                  </span>
                </td>
                <td>
                  <div className="font-medium">{agency.toursCount}</div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>

                    <button
                      style={actionButtonStyle}
                      title="Modifica"
                      onClick={() => onEdit(agency)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.edit} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Duplica"
                      onClick={() => onDuplicate(agency)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.duplicate} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      style={actionButtonStyle}
                      title="Elimina"
                      onClick={() => onDelete(agency.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.delete} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {agencies.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nessuna agenzia trovata. Clicca su "Aggiungi Agenzia" per crearne una nuova.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgenciesList;
