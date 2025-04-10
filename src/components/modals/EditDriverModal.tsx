import React, { useState, useEffect } from 'react';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  status: string;
  drivingHours: {
    weekly: number;
    biWeekly: number;
    monthly: number;
  };
}

interface EditDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driver: Driver) => void;
  driver: Driver | null;
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ isOpen, onClose, onSave, driver }) => {
  const [formData, setFormData] = useState<Driver>({
    id: '',
    name: '',
    licenseNumber: '',
    licenseExpiry: '',
    phone: '',
    email: '',
    status: 'active',
    drivingHours: {
      weekly: 0,
      biWeekly: 0,
      monthly: 0
    }
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        ...driver,
        // Assicurati che i campi numerici siano numeri
        drivingHours: {
          weekly: typeof driver.drivingHours.weekly === 'string' ? parseInt(driver.drivingHours.weekly as any) : driver.drivingHours.weekly,
          biWeekly: typeof driver.drivingHours.biWeekly === 'string' ? parseInt(driver.drivingHours.biWeekly as any) : driver.drivingHours.biWeekly,
          monthly: typeof driver.drivingHours.monthly === 'string' ? parseInt(driver.drivingHours.monthly as any) : driver.drivingHours.monthly
        }
      });
    }
  }, [driver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('drivingHours.')) {
      const hourType = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        drivingHours: {
          ...prev.drivingHours,
          [hourType]: parseInt(value)
        }
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
          <h2>Modifica Autista</h2>
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
            <label htmlFor="licenseNumber">Numero Patente</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="licenseExpiry">Scadenza Patente</label>
            <input
              type="date"
              id="licenseExpiry"
              name="licenseExpiry"
              value={formData.licenseExpiry ? formData.licenseExpiry.split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
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
              <option value="inactive">Inattivo</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="drivingHours.weekly">Ore di Guida Settimanali</label>
            <input
              type="number"
              id="drivingHours.weekly"
              name="drivingHours.weekly"
              value={formData.drivingHours.weekly}
              onChange={handleChange}
              min="0"
              max="56"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="drivingHours.biWeekly">Ore di Guida Bisettimanali</label>
            <input
              type="number"
              id="drivingHours.biWeekly"
              name="drivingHours.biWeekly"
              value={formData.drivingHours.biWeekly}
              onChange={handleChange}
              min="0"
              max="90"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="drivingHours.monthly">Ore di Guida Mensili</label>
            <input
              type="number"
              id="drivingHours.monthly"
              name="drivingHours.monthly"
              value={formData.drivingHours.monthly}
              onChange={handleChange}
              min="0"
              required
            />
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

export default EditDriverModal;
