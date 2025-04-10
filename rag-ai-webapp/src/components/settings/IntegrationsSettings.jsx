import { useState } from 'react';
import '../../styles/settings.css';

const IntegrationsSettings = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Sample integrations data
  const [integrations, setIntegrations] = useState([
    {
      id: 'i1',
      name: 'Piattaforma E-Commerce',
      description: 'Connetti al tuo negozio online',
      icon: 'shopping-cart',
      status: 'connected',
      lastSync: '10 minuti fa',
      type: 'ecommerce',
    },
    {
      id: 'i2',
      name: 'Sistema CRM',
      description: 'Gestisci le relazioni con i clienti',
      icon: 'users',
      status: 'connected',
      lastSync: '1 ora fa',
      type: 'crm',
    },
    {
      id: 'i3',
      name: 'Database',
      description: 'Connetti al tuo database',
      icon: 'database',
      status: 'disconnected',
      type: 'database',
    },
    {
      id: 'i4',
      name: 'Email Marketing',
      description: 'Integra con le campagne email',
      icon: 'mail',
      status: 'disconnected',
      type: 'email',
    },
    {
      id: 'i5',
      name: 'Calendario',
      description: 'Sincronizza con il tuo calendario',
      icon: 'calendar',
      status: 'connected',
      lastSync: '3 ore fa',
      type: 'calendar',
    },
    {
      id: 'i6',
      name: 'API Personalizzata',
      description: 'Connetti a endpoint personalizzati',
      icon: 'link',
      status: 'disconnected',
      type: 'api',
    },
  ]);

  // Toggle integration status
  const toggleIntegrationStatus = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'connected' ? 'disconnected' : 'connected',
            lastSync: integration.status === 'disconnected' ? 'Appena ora' : integration.lastSync
          } 
        : integration
    ));
  };

  // Get integration icon based on type
  const getIntegrationIcon = (icon) => {
    switch(icon) {
      case 'shopping-cart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        );
      case 'users':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case 'database':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'link':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-title">Impostazioni</div>
      </div>

      <div className="settings-tabs">
        <div 
          className={activeTab === 'integrations' ? 'settings-tab active' : 'settings-tab'}
          onClick={() => setActiveTab('integrations')}
        >
          Integrazioni
        </div>
        <div 
          className={activeTab === 'api' ? 'settings-tab active' : 'settings-tab'}
          onClick={() => setActiveTab('api')}
        >
          API
        </div>
        <div 
          className={activeTab === 'account' ? 'settings-tab active' : 'settings-tab'}
          onClick={() => setActiveTab('account')}
        >
          Account
        </div>
        <div 
          className={activeTab === 'appearance' ? 'settings-tab active' : 'settings-tab'}
          onClick={() => setActiveTab('appearance')}
        >
          Aspetto
        </div>
      </div>

      {activeTab === 'integrations' && (
        <>
          <div className="settings-section">
            <div className="settings-section-title">Integrazioni</div>
            <div className="settings-section-description">
              Connetti il tuo sistema RAG AI con servizi esterni e fonti di dati
            </div>
            
            <div className="settings-grid">
              {integrations.map(integration => (
                <div key={integration.id} className="integration-card">
                  <div className="integration-header">
                    <div className="integration-icon">
                      {getIntegrationIcon(integration.icon)}
                    </div>
                    <div className={`integration-status ${integration.status}`}>
                      {integration.status === 'connected' ? 'Connesso' : 'Disconnesso'}
                    </div>
                  </div>
                  <div className="integration-content">
                    <div className="integration-title">{integration.name}</div>
                    <div className="integration-description">{integration.description}</div>
                    
                    {integration.status === 'connected' && integration.lastSync && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <polyline points="1 20 1 14 7 14"></polyline>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                        Ultima sincronizzazione: {integration.lastSync}
                      </div>
                    )}
                  </div>
                  
                  <div className="integration-footer">
                    <button className="integration-configure">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Configura
                    </button>
                    
                    <label className="integration-toggle">
                      <input 
                        type="checkbox" 
                        checked={integration.status === 'connected'} 
                        onChange={() => toggleIntegrationStatus(integration.id)}
                      />
                      <span className="integration-toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
              
              {/* Add Integration Card */}
              <div className="add-integration-card">
                <div className="add-integration-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <div className="add-integration-title">Aggiungi integrazione</div>
                <div className="add-integration-text">Connetti a un nuovo servizio o fonte di dati</div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'api' && (
        <>
          <div className="settings-section">
            <div className="settings-section-title">Impostazioni API</div>
            <div className="settings-section-description">
              Gestisci le chiavi API e le impostazioni per l'integrazione con altri sistemi
            </div>
            
            <div className="settings-card">
              <div className="settings-card-title">Chiave API</div>
              <div className="settings-card-content">
                <p>Usa questa chiave per autenticare le richieste API al tuo sistema RAG AI.</p>
                <div className="api-key-input">
                  <input 
                    type={showApiKey ? "text" : "password"} 
                    value="sk-1234567890abcdefghijklmnopqrstuvwxyz" 
                    readOnly 
                    className="settings-form-input"
                  />
                  <button onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                  <button className="copy-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
                <button className="btn-secondary" style={{ marginTop: '10px' }}>
                  Rigenera chiave API
                </button>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="settings-card-title">Webhook URL</div>
              <div className="settings-card-content">
                <p>Usa questo URL per ricevere notifiche in tempo reale dal tuo sistema RAG AI.</p>
                <div className="webhook-url">
                  https://api.example.com/webhook/rag-ai/1234567890
                </div>
                <button className="copy-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copia URL
                </button>
              </div>
            </div>
            
            <div className="settings-card">
              <div className="settings-card-title">Limiti API</div>
              <div className="settings-card-content">
                <div className="settings-form-group">
                  <label className="settings-form-label">Richieste al minuto</label>
                  <select className="settings-form-select">
                    <option value="60">60 richieste/minuto</option>
                    <option value="120">120 richieste/minuto</option>
                    <option value="300">300 richieste/minuto</option>
                    <option value="600">600 richieste/minuto</option>
                    <option value="1200">1200 richieste/minuto</option>
                  </select>
                </div>
                
                <div className="settings-form-group">
                  <label className="settings-form-label">Dimensione massima richiesta</label>
                  <select className="settings-form-select">
                    <option value="1">1 MB</option>
                    <option value="5">5 MB</option>
                    <option value="10">10 MB</option>
                    <option value="20">20 MB</option>
                    <option value="50">50 MB</option>
                  </select>
                </div>
                
                <div className="settings-form-actions">
                  <button className="btn-primary">Salva impostazioni</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'account' && (
        <>
          <div className="settings-section">
            <div className="settings-section-title">Impostazioni Account</div>
            <div className="settings-section-description">
              Gestisci le impostazioni del tuo account e le preferenze
            </div>
            
            <div className="settings-form">
              <div className="settings-form-group">
                <label className="settings-form-label">Nome</label>
                <input type="text" className="settings-form-input" value="Utente Demo" />
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Email</label>
                <input type="email" className="settings-form-input" value="utente@example.com" />
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Lingua</label>
                <select className="settings-form-select">
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Fuso orario</label>
                <select className="settings-form-select">
                  <option value="Europe/Rome">Europe/Rome (GMT+1)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                </select>
              </div>
              
              <div className="settings-form-actions">
                <button className="btn-secondary">Annulla</button>
                <button className="btn-primary">Salva modifiche</button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'appearance' && (
        <>
          <div className="settings-section">
            <div className="settings-section-title">Impostazioni Aspetto</div>
            <div className="settings-section-description">
              Personalizza l'aspetto e il tema dell'interfaccia
            </div>
            
            <div className="settings-form">
              <div className="settings-form-group">
                <label className="settings-form-label">Tema</label>
                <select className="settings-form-select">
                  <option value="light">Chiaro</option>
                  <option value="dark">Scuro</option>
                  <option value="system">Usa impostazioni di sistema</option>
                </select>
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Colore primario</label>
                <select className="settings-form-select">
                  <option value="purple">Viola</option>
                  <option value="blue">Blu</option>
                  <option value="green">Verde</option>
                  <option value="red">Rosso</option>
                  <option value="orange">Arancione</option>
                </select>
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Dimensione carattere</label>
                <select className="settings-form-select">
                  <option value="small">Piccolo</option>
                  <option value="medium">Medio</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              
              <div className="settings-form-group">
                <label className="settings-form-label">Densità layout</label>
                <select className="settings-form-select">
                  <option value="compact">Compatto</option>
                  <option value="comfortable">Confortevole</option>
                  <option value="spacious">Spazioso</option>
                </select>
              </div>
              
              <div className="settings-form-actions">
                <button className="btn-secondary">Ripristina predefiniti</button>
                <button className="btn-primary">Applica</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IntegrationsSettings;
