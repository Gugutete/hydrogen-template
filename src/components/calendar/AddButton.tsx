import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface AddButtonProps {
  date: Date;
  busId: string;
}

const AddButton: React.FC<AddButtonProps> = ({ date, busId }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/tours', {
          state: {
            openAddModal: true,
            selectedDate: format(date, 'yyyy-MM-dd'),
            selectedBusId: busId
          }
        });
      }}
      style={{
        position: 'absolute',
        top: '4px',
        right: '4px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        backgroundColor: '#e5e7eb',
        color: '#4b5563',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 5
      }}
      title="Aggiungi tour"
    >
      +
    </button>
  );
};

export default AddButton;
