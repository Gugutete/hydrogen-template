import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ChatInterface from './components/chat/ChatInterface';
import DocumentManager from './components/brain/DocumentManager';
import AgentConfig from './components/agents/AgentConfig';
import IntegrationsSettings from './components/settings/IntegrationsSettings';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

  // Get title and subtitle based on active section
  const getSectionInfo = () => {
    switch(activeSection) {
      case 'chat':
        return { title: 'Chat', subtitle: 'Interagisci con il tuo assistente AI' };
      case 'brain':
        return { title: 'Brain', subtitle: 'Gestisci i tuoi documenti e fonti di conoscenza' };
      case 'agents':
        return { title: 'Agenti AI', subtitle: 'Configura e gestisci i tuoi agenti AI' };
      case 'settings':
        return { title: 'Impostazioni', subtitle: 'Configura il tuo sistema RAG AI' };
      default:
        return { title: 'Chat', subtitle: 'Interagisci con il tuo assistente AI' };
    }
  };

  // Render content based on active section
  const renderContent = () => {
    switch(activeSection) {
      case 'chat':
        return <ChatInterface />;
      case 'brain':
        return <DocumentManager />;
      case 'agents':
        return <AgentConfig />;
      case 'settings':
        return <IntegrationsSettings />;
      default:
        return <ChatInterface />;
    }
  };

  const { title, subtitle } = getSectionInfo();

  return (
    <div className="app-container">
      <Sidebar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="main-content">
        <Header
          title={title}
          subtitle={subtitle}
        />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
