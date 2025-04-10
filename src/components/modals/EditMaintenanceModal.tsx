import React, { useState, useEffect } from 'react';

interface Bus {
  id: string;
  name: string;
}

interface Maintenance {
  id: string;
  busId: string;
  busName: string;
  type: string;
  description: string;
  date: string;
  cost: number;
  status: string;
}

interface EditMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (maintenance: Maintenance) => void;
  maintenance: Maintenance | null;
  buses: Bus[];
}

const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({ isOpen, onClose, onSave, maintenance, buses }) => {
  const [formData, setFormData] = useState<Maintenance>({
    id: '',
    busId: '',
    busName: '',
    type: 'routine',
    description: '',
    date: '',
    cost: 0,
    status: 'scheduled'
  });

  useEffect(() => {
    if (maintenance) {
      setFormData({
        ...maintenance,
        // Assicurati che i campi numerici siano numeri
        cost: typeof maintenance.cost === 'string' ? parseFloat(maintenance.cost as any) : maintenance.cost
      });
    }
  }, [maintenance]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'busId') {
      const selectedBus = buses.find(bus => bus.id === value);
      setFormData(prev => ({
        ...prev,
        busId: value,
        busName: selectedBus ? selectedBus.name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Modifica Manutenzione</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="busId">Bus</label>
            <select
              id="busId"
              name="busId"
              value={formData.busId}
              onChange={handleChange}
              required
            >
              <option value="">Seleziona un bus</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.id}>{bus.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type">Tipo</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="routine">Manutenzione Ordinaria</option>
              <option value="repair">Riparazione</option>
              <option value="inspection">Ispezione</option>
              <option value="emergency">Emergenza</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date ? formData.date.split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Costo (€)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Stato</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="scheduled">Programmata</option>
              <option value="in_progress">In Corso</option>
              <option value="completed">Completata</option>
              <option value="cancelled">Annullata</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">Annulla</button>
            <button type="submit" className="btn btn-primary">Salva</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal;
