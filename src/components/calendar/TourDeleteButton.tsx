import React, { useState } from 'react';

interface TourDeleteButtonProps {
  tourId: string;
  onDelete: (tourId: string) => void;
}

const TourDeleteButton: React.FC<TourDeleteButtonProps> = ({ tourId, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      style={{
        marginTop: '5px',
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
            onDelete(tourId);
          }
        }}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '12px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Elimina
      </button>
    </div>
  );
};

export default TourDeleteButton;
