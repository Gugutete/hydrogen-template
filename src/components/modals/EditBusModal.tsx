import React, { useState, useEffect } from 'react';

interface Bus {
  id: string;
  name: string;
  plate: string;
  model: string;
  seats: number;
  year: number;
  status: string;
  nextMaintenance: string;
  documentsStatus: string;
}

interface EditBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bus: Bus) => void;
  bus: Bus | null;
}

const EditBusModal: React.FC<EditBusModalProps> = ({ isOpen, onClose, onSave, bus }) => {
  const [formData, setFormData] = useState<Bus>({
    id: '',
    name: '',
    plate: '',
    model: '',
    seats: 0,
    year: 0,
    status: 'active',
    nextMaintenance: '',
    documentsStatus: 'valid'
  });

  useEffect(() => {
    if (bus) {
      setFormData({
        ...bus,
        // Assicurati che i campi numerici siano numeri
        seats: typeof bus.seats === 'string' ? parseInt(bus.seats) : bus.seats,
        year: typeof bus.year === 'string' ? parseInt(bus.year) : bus.year,
      });
    }
  }, [bus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          <h2>Modifica Bus</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="plate">Targa</label>
            <input
              type="text"
              id="plate"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Modello</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="seats">Posti</label>
            <input
              type="number"
              id="seats"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Anno</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
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
            >
              <option value="active">Attivo</option>
              <option value="maintenance">In Manutenzione</option>
              <option value="inactive">Inattivo</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nextMaintenance">Prossima Manutenzione</label>
            <input
              type="date"
              id="nextMaintenance"
              name="nextMaintenance"
              value={formData.nextMaintenance ? formData.nextMaintenance.split('T')[0] : ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="documentsStatus">Stato Documenti</label>
            <select
              id="documentsStatus"
              name="documentsStatus"
              value={formData.documentsStatus}
              onChange={handleChange}
            >
              <option value="valid">Validi</option>
              <option value="expiring">In Scadenza</option>
              <option value="expired">Scaduti</option>
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

export default EditBusModal;
