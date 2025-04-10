import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardPage = () => {
  // Mock data for demonstration
  const stats = {
    buses: 12,
    drivers: 18,
    activeTours: 5,
    agencies: 8
  };

  const upcomingTours = [
    { id: 1, name: 'Tour Roma', startDate: '2023-04-10', endDate: '2023-04-15', bus: 'Bus Gran Turismo 1', driver: 'Mario Rossi', agency: 'Viaggi Napoli' },
    { id: 2, name: 'Tour Milano', startDate: '2023-04-12', endDate: '2023-04-18', bus: 'Bus Gran Turismo 2', driver: 'Luigi Verdi', agency: 'Europa Tours' },
    { id: 3, name: 'Tour Venezia', startDate: '2023-04-20', endDate: '2023-04-25', bus: 'Bus Gran Turismo 3', driver: 'Giuseppe Bianchi', agency: 'Italia Vacanze' }
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Documento "Assicurazione" del Bus Gran Turismo 2 scadrà tra 15 giorni' },
    { id: 2, type: 'danger', message: 'Documento "Revisione" del Bus Gran Turismo 2 è scaduto' },
    { id: 3, type: 'info', message: 'Manutenzione programmata per Bus Gran Turismo 1 il 15/05/2023' },
    { id: 4, type: 'warning', message: 'L\'autista Mario Rossi ha raggiunto il limite di ore di guida settimanali' }
  ];

  return (
    <DashboardLayout>
      <div>
        <h1 className="page-title">Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4 3v3m-8-3v3m0-10a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Bus</p>
              <p className="stat-value">{stats.buses}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Autisti</p>
              <p className="stat-value">{stats.drivers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Tour Attivi</p>
              <p className="stat-value">{stats.activeTours}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="stat-info">
              <p className="stat-label">Agenzie</p>
              <p className="stat-value">{stats.agencies}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Avvisi</h2>
          <div className="space-y-4">
            {alerts.map(alert => {
              let bgColor = '';
              let textColor = '';
              let Icon = null;

              if (alert.type === 'danger') {
                bgColor = '#fee2e2';
                textColor = '#b91c1c';
                Icon = () => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                );
              } else if (alert.type === 'warning') {
                bgColor = '#fef3c7';
                textColor = '#92400e';
                Icon = () => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                );
              } else {
                bgColor = '#e0f2fe';
                textColor = '#0369a1';
                Icon = () => (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                );
              }

              return (
                <div
                  key={alert.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: bgColor,
                    color: textColor,
                    marginBottom: '0.5rem'
                  }}
                >
                  <div style={{
                    flexShrink: 0,
                    marginRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Tours */}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Prossimi Tour</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Tour</th>
                  <th>Date</th>
                  <th>Bus</th>
                  <th>Autista</th>
                  <th>Agenzia</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTours.map(tour => (
                  <tr key={tour.id}>
                    <td>
                      <div className="font-medium">{tour.name}</div>
                    </td>
                    <td>
                      <div>
                        {new Date(tour.startDate).toLocaleDateString('it-IT')} - {new Date(tour.endDate).toLocaleDateString('it-IT')}
                      </div>
                    </td>
                    <td>
                      <div>{tour.bus}</div>
                    </td>
                    <td>
                      <div>{tour.driver}</div>
                    </td>
                    <td>
                      <div>{tour.agency}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
