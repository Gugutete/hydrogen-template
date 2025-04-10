import { useState } from 'react';
import '../../styles/agents.css';

const AgentConfig = () => {
  const [agents, setAgents] = useState([
    {
      id: 'a1',
      name: 'Assistente Supporto Clienti',
      description: 'Gestisce le richieste dei clienti e i ticket di supporto',
      status: 'active',
      memoryUsage: 78,
      connectedSources: 5,
      lastActive: '2 ore fa',
      type: 'support',
    },
    {
      id: 'a2',
      name: 'Assistente Vendite',
      description: 'Fornisce raccomandazioni sui prodotti e informazioni sulle vendite',
      status: 'active',
      memoryUsage: 45,
      connectedSources: 3,
      lastActive: '30 minuti fa',
      type: 'sales',
    },
    {
      id: 'a3',
      name: 'Analista Dati',
      description: 'Analizza i dati aziendali e genera report',
      status: 'inactive',
      memoryUsage: 12,
      connectedSources: 8,
      lastActive: '3 giorni fa',
      type: 'analytics',
    },
    {
      id: 'a4',
      name: 'Agente Knowledge Base',
      description: 'Gestisce e recupera informazioni dalla knowledge base',
      status: 'active',
      memoryUsage: 92,
      connectedSources: 12,
      lastActive: '5 minuti fa',
      type: 'knowledge',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'support',
  });

  // Toggle agent status
  const toggleAgentStatus = (id) => {
    setAgents(agents.map(agent => 
      agent.id === id 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' } 
        : agent
    ));
  };

  // Handle input change for new agent form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAgentObj = {
      id: `a${agents.length + 1}`,
      ...newAgent,
      status: 'active',
      memoryUsage: 0,
      connectedSources: 0,
      lastActive: 'Appena creato',
    };
    
    setAgents([...agents, newAgentObj]);
    setShowModal(false);
    setNewAgent({
      name: '',
      description: '',
      type: 'support',
    });
  };

  // Get progress bar color based on memory usage
  const getProgressBarColor = (usage) => {
    if (usage < 50) return 'green';
    if (usage < 80) return 'yellow';
    return 'red';
  };

  // Get agent avatar based on type
  const getAgentAvatar = (type) => {
    switch(type) {
      case 'support':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case 'sales':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'analytics':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
        );
      case 'knowledge':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>
        );
    }
  };

  return (
    <div className="agents-container">
      <div className="agents-header">
        <div className="agents-title">Agenti AI</div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Crea nuovo agente
        </button>
      </div>

      <div className="agents-grid">
        {agents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                {getAgentAvatar(agent.type)}
              </div>
              <button className="agent-menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
            <div className="agent-content">
              <div className="agent-name">{agent.name}</div>
              <div className={`agent-status ${agent.status}`}>
                {agent.status === 'active' ? 'Attivo' : 'Inattivo'}
              </div>
              <div className="agent-description">{agent.description}</div>
              
              <div className="agent-stats">
                <div className="agent-stat">
                  <div className="agent-stat-header">
                    <div className="agent-stat-label">Utilizzo memoria</div>
                    <div className="agent-stat-value">{agent.memoryUsage}%</div>
                  </div>
                  <div className="agent-progress">
                    <div 
                      className={`agent-progress-bar ${getProgressBarColor(agent.memoryUsage)}`}
                      style={{ width: `${agent.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                <div style={{ marginBottom: '5px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  {agent.connectedSources} fonti collegate
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Ultimo utilizzo: {agent.lastActive}
                </div>
              </div>
            </div>
            
            <div className="agent-footer">
              <button className="agent-configure">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                Configura
              </button>
              
              <label className="agent-toggle">
                <input 
                  type="checkbox" 
                  checked={agent.status === 'active'} 
                  onChange={() => toggleAgentStatus(agent.id)}
                />
                <span className="agent-toggle-slider"></span>
              </label>
            </div>
          </div>
        ))}
        
        {/* Create New Agent Card */}
        <div className="create-agent-card" onClick={() => setShowModal(true)}>
          <div className="create-agent-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div className="create-agent-title">Crea nuovo agente</div>
          <div className="create-agent-text">Configura un agente AI personalizzato per le tue esigenze</div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showModal && (
        <div className="agent-modal">
          <div className="agent-modal-content">
            <div className="agent-modal-header">
              <div className="agent-modal-title">Crea nuovo agente</div>
              <button className="agent-modal-close" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="agent-modal-body">
                <div className="agent-form-group">
                  <label className="agent-form-label" htmlFor="name">Nome dell'agente</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="agent-form-input" 
                    placeholder="Es. Assistente Supporto Clienti" 
                    value={newAgent.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="agent-form-group">
                  <label className="agent-form-label" htmlFor="description">Descrizione</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    className="agent-form-textarea" 
                    placeholder="Descrivi cosa farà questo agente..." 
                    value={newAgent.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="agent-form-group">
                  <label className="agent-form-label" htmlFor="type">Tipo di agente</label>
                  <select 
                    id="type" 
                    name="type" 
                    className="agent-form-select"
                    value={newAgent.type}
                    onChange={handleInputChange}
                  >
                    <option value="support">Supporto Clienti</option>
                    <option value="sales">Vendite</option>
                    <option value="analytics">Analisi Dati</option>
                    <option value="knowledge">Knowledge Base</option>
                  </select>
                </div>
              </div>
              
              <div className="agent-modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Annulla
                </button>
                <button type="submit" className="btn-primary">Crea agente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentConfig;
