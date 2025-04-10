function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#7122ff' }}>RAG AI Web App</h1>
      <p>
        Questa è un'applicazione RAG AI per aziende con supporto per chat, gestione documenti, agenti e integrazioni.
      </p>
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginTop: '20px' }}>
        <h2>Funzionalità principali:</h2>
        <ul>
          <li>Chat con AI e attribuzione delle fonti</li>
          <li>Gestione gerarchica di documenti</li>
          <li>Configurazione di agenti AI</li>
          <li>Integrazioni con sistemi esterni</li>
        </ul>
      </div>
      <button
        style={{
          backgroundColor: '#7122ff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '10px',
          marginTop: '20px',
          cursor: 'pointer'
        }}
      >
        Inizia una nuova chat
      </button>
    </div>
  );
}

export default App;
