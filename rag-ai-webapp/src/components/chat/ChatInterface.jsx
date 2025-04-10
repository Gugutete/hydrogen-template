import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import '../../styles/chat.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Ciao! Come posso aiutarti oggi?',
      isAi: true,
      timestamp: '10:30',
      sources: []
    }
  ]);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (message) => {
    // Hide welcome screen when user sends first message
    if (showWelcome) {
      setShowWelcome(false);
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: "Basandomi sui documenti nel tuo Brain, ho trovato che queste informazioni sono correlate alla tua domanda. I dati mostrano che i sistemi RAG (Retrieval-Augmented Generation) combinano la potenza dei grandi modelli linguistici con il recupero di conoscenze specifiche per fornire risposte più accurate e contestuali.",
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            id: 's1',
            title: 'Introduzione ai sistemi RAG',
            type: 'pdf',
            url: 'https://example.com/rag-intro.pdf',
            relevance: 95
          },
          {
            id: 's2',
            title: 'Costruire soluzioni AI aziendali',
            type: 'webpage',
            url: 'https://example.com/enterprise-ai',
            relevance: 82
          },
          {
            id: 's3',
            title: 'Guida all\'integrazione della Knowledge Base',
            type: 'text',
            relevance: 68
          }
        ]
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="chat-container">
      {showWelcome ? (
        <div className="chat-welcome">
          <div className="chat-welcome-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h2 className="chat-welcome-title">Inizia una conversazione con il tuo assistente AI</h2>
          <p className="chat-welcome-text">
            Fai domande sui tuoi documenti, ottieni informazioni dai tuoi dati o esplora nuove idee con l'assistenza basata sull'intelligenza artificiale.
          </p>
          
          <div className="chat-suggestions">
            <div className="chat-suggestion" onClick={() => handleSuggestionClick("Cos'è un sistema RAG e come funziona?")}>
              <div className="chat-suggestion-title">Cos'è un sistema RAG e come funziona?</div>
              <div className="chat-suggestion-text">Scopri i principi di base dei sistemi di Retrieval-Augmented Generation</div>
            </div>
            
            <div className="chat-suggestion" onClick={() => handleSuggestionClick("Come posso integrare il mio sistema CRM con questo assistente AI?")}>
              <div className="chat-suggestion-title">Come posso integrare il mio sistema CRM con questo assistente AI?</div>
              <div className="chat-suggestion-text">Esplora le opzioni di integrazione con i tuoi sistemi esistenti</div>
            </div>
            
            <div className="chat-suggestion" onClick={() => handleSuggestionClick("Riassumi gli ultimi dati di vendita dalla mia piattaforma e-commerce")}>
              <div className="chat-suggestion-title">Riassumi i dati di vendita</div>
              <div className="chat-suggestion-text">Ottieni un riepilogo dei dati di vendita dalla tua piattaforma e-commerce</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isAi={message.isAi}
              timestamp={message.timestamp}
              sources={message.sources}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;
