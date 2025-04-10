import React from 'react';

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Sei sicuro di voler eliminare questo tour?')) {
          onDelete();
        }
      }}
      style={{
        position: 'absolute',
        top: '2px',
        right: '2px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        backgroundColor: '#ef4444',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: 'none',
        padding: 0,
        zIndex: 1000
      }}
      title="Elimina tour"
    >
      ×
    </button>
  );
};

export default DeleteButton;
