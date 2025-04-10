import { useState } from 'react';
import '../../styles/brain.css';

const DocumentManager = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample documents data
  const [documents, setDocuments] = useState([
    {
      id: 'd1',
      title: 'Architettura del Sistema RAG',
      type: 'pdf',
      size: '2.4 MB',
      dateAdded: '15/04/2023',
      tags: ['architettura', 'tecnico'],
    },
    {
      id: 'd2',
      title: 'Guida all\'onboarding dei clienti',
      type: 'doc',
      size: '1.8 MB',
      dateAdded: '12/04/2023',
      tags: ['guida', 'cliente'],
    },
    {
      id: 'd3',
      title: 'Roadmap Prodotto 2023',
      type: 'ppt',
      size: '4.2 MB',
      dateAdded: '28/03/2023',
      tags: ['roadmap', 'interno'],
    },
    {
      id: 'd4',
      title: 'Documentazione API',
      type: 'web',
      url: 'https://api.example.com/docs',
      dateAdded: '05/04/2023',
      tags: ['api', 'tecnico'],
    },
    {
      id: 'd5',
      title: 'Performance Vendite Q3',
      type: 'xls',
      size: '3.1 MB',
      dateAdded: '01/04/2023',
      tags: ['vendite', 'report'],
    },
    {
      id: 'd6',
      title: 'Blog Aziendale',
      type: 'web',
      url: 'https://example.com/blog',
      dateAdded: '20/03/2023',
      tags: ['marketing', 'pubblico'],
    },
  ]);

  // Get all unique tags
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)));
  
  // Filter documents based on search and active filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || doc.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Get document icon based on type
  const getDocumentIcon = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'doc':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'xls':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'ppt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'web':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        );
    }
  };

  return (
    <div className="brain-container">
      <div className="brain-header">
        <div className="brain-title">Brain</div>
        <div className="brain-actions">
          <button className="btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuova cartella
          </button>
          <button className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Carica documento
          </button>
        </div>
      </div>

      <div className="brain-tabs">
        <div 
          className={activeTab === 'documents' ? 'brain-tab active' : 'brain-tab'}
          onClick={() => setActiveTab('documents')}
        >
          Documenti
        </div>
        <div 
          className={activeTab === 'websites' ? 'brain-tab active' : 'brain-tab'}
          onClick={() => setActiveTab('websites')}
        >
          Siti Web
        </div>
        <div 
          className={activeTab === 'collections' ? 'brain-tab active' : 'brain-tab'}
          onClick={() => setActiveTab('collections')}
        >
          Collezioni
        </div>
      </div>

      <div className="brain-search">
        <input 
          type="text" 
          className="brain-search-input" 
          placeholder="Cerca documenti..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="brain-filters">
        <div 
          className={activeFilter === 'all' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('all')}
        >
          Tutti
        </div>
        <div 
          className={activeFilter === 'pdf' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('pdf')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          PDF
        </div>
        <div 
          className={activeFilter === 'doc' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('doc')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Word
        </div>
        <div 
          className={activeFilter === 'xls' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('xls')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          Excel
        </div>
        <div 
          className={activeFilter === 'ppt' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('ppt')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          PowerPoint
        </div>
        <div 
          className={activeFilter === 'web' ? 'brain-filter active' : 'brain-filter'}
          onClick={() => setActiveFilter('web')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Web
        </div>
      </div>

      {/* Upload Area */}
      <div className="upload-area">
        <div className="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div className="upload-title">Trascina e rilascia i file qui</div>
        <div className="upload-text">Supporta PDF, DOCX, XLSX, PPTX, TXT o</div>
        <button className="upload-button">Seleziona file</button>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="brain-grid">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="document-card">
              <div className="document-card-header">
                <div className={`document-icon ${doc.type}`}>
                  {getDocumentIcon(doc.type)}
                </div>
                <button className="document-menu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="document-content">
                <div className="document-title">{doc.title}</div>
                <div className="document-info">
                  {doc.size ? `${doc.size} · ` : ''}
                  Aggiunto il {doc.dateAdded}
                </div>
                <div className="document-tags">
                  {doc.tags.map(tag => (
                    <div key={tag} className="document-tag">{tag}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          </div>
          <div className="empty-title">Nessun documento trovato</div>
          <div className="empty-text">
            {searchQuery || activeFilter !== 'all' 
              ? "Prova a modificare la tua ricerca o i filtri"
              : "Inizia caricando documenti nel tuo Brain"}
          </div>
          <button className="btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Carica il tuo primo documento
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
