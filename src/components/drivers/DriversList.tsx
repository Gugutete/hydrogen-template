import React from 'react';
import { actionButtonStyle, iconStyle, iconColors } from '../../styles/actionButtons';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  status: string;
  drivingHours: {
    weekly: number;
    biWeekly: number;
    monthly: number;
  };
}

interface DriversListProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driverId: string) => void;
  onDuplicate: (driver: Driver) => void;
}

const DriversList: React.FC<DriversListProps> = ({ drivers, onEdit, onDelete, onDuplicate }) => {
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
        return 'Attivo';
      case 'inactive':
        return 'Inattivo';
      default:
        return status;
    }
  };

  // Funzione per ottenere lo stato delle ore di guida
  const getDrivingHoursStatus = (weekly: number, biWeekly: number) => {
    if (weekly > 56 || biWeekly > 90) {
      return 'danger';
    } else if (weekly > 45 || biWeekly > 80) {
      return 'warning';
    } else {
      return 'success';
    }
  };

  // Funzione per ottenere il colore dello stato delle ore di guida
  const getDrivingHoursColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'danger':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Funzione per calcolare la percentuale delle ore di guida
  const calculatePercentage = (hours: number, max: number) => {
    return Math.min(100, (hours / max) * 100);
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Patente</th>
              <th>Scadenza Patente</th>
              <th>Contatti</th>
              <th>Stato</th>
              <th>Ore di Guida</th>
              <th style={{ textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => {
              const hoursStatus = getDrivingHoursStatus(
                driver.drivingHours.weekly,
                driver.drivingHours.biWeekly
              );

              return (
                <tr key={driver.id}>
                  <td>
                    <div className="font-medium">{driver.name}</div>
                  </td>
                  <td>
                    <div>{driver.licenseNumber}</div>
                  </td>
                  <td>
                    <div>{formatDate(driver.licenseExpiry)}</div>
                  </td>
                  <td>
                    <div>{driver.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{driver.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(driver.status)}`}>
                      {getStatusLabel(driver.status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', width: '80px' }}>Settimanale:</span>
                        <div style={{
                          height: '8px',
                          width: '100px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${calculatePercentage(driver.drivingHours.weekly, 56)}%`,
                            backgroundColor: getDrivingHoursColor(hoursStatus)
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem' }}>{driver.drivingHours.weekly}h</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', width: '80px' }}>Bisettimanale:</span>
                        <div style={{
                          height: '8px',
                          width: '100px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${calculatePercentage(driver.drivingHours.biWeekly, 90)}%`,
                            backgroundColor: getDrivingHoursColor(hoursStatus)
                          }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem' }}>{driver.drivingHours.biWeekly}h</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>

                      <button
                        style={actionButtonStyle}
                        title="Modifica"
                        onClick={() => onEdit(driver)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.edit} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        style={actionButtonStyle}
                        title="Duplica"
                        onClick={() => onDuplicate(driver)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.duplicate} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        style={actionButtonStyle}
                        title="Elimina"
                        onClick={() => onDelete(driver.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={iconColors.default} style={iconStyle} onMouseOver={(e) => e.currentTarget.style.stroke = iconColors.delete} onMouseOut={(e) => e.currentTarget.style.stroke = iconColors.default}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nessun autista trovato. Clicca su "Aggiungi Autista" per crearne uno nuovo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriversList;
