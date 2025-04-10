import { useState } from 'react';
import '../../styles/chat.css';

const ChatMessage = ({ message, isAi, timestamp, sources = [] }) => {
  const [showSources, setShowSources] = useState(false);
  
  // Function to get source icon based on type
  const getSourceIcon = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'webpage':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        );
    }
  };

  return (
    <div className={isAi ? "chat-message ai" : "chat-message user"}>
      <div className={isAi ? "chat-message-avatar" : "chat-message-avatar user"}>
        {isAi ? "AI" : "U"}
      </div>
      <div className="chat-message-content">
        <div className="chat-message-header">
          <div className="chat-message-name">{isAi ? "Assistente AI" : "Tu"}</div>
          <div className="chat-message-time">{timestamp}</div>
        </div>
        <div className="chat-message-text">
          {message}
          
          {isAi && sources.length > 0 && (
            <div className="chat-sources">
              <div 
                className="chat-sources-title" 
                onClick={() => setShowSources(!showSources)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Fonti ({sources.length}) {showSources ? '▼' : '►'}
              </div>
              
              {showSources && (
                <div className="chat-sources-content">
                  {sources.map((source, index) => (
                    <div key={index} className="chat-source-item">
                      <div className="chat-source-icon">
                        {getSourceIcon(source.type)}
                      </div>
                      <div className="chat-source-title">{source.title}</div>
                      <div 
                        className="chat-source-relevance"
                        style={{
                          backgroundColor: 
                            source.relevance > 80 ? '#d4edda' : 
                            source.relevance > 50 ? '#fff3cd' : '#f8d7da',
                          color: 
                            source.relevance > 80 ? '#155724' : 
                            source.relevance > 50 ? '#856404' : '#721c24'
                        }}
                      >
                        {source.relevance}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
