import '../../styles/global.css';

const Header = ({ title, subtitle }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center" style={{ padding: '20px 0' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{title}</h1>
            {subtitle && <p style={{ margin: 0, color: 'var(--text-light)' }}>{subtitle}</p>}
          </div>
          <div className="flex">
            <button className="btn-secondary mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Esporta
            </button>
            <button className="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Condividi
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
