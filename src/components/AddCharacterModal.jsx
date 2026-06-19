import { useState, useEffect } from 'react';

export default function AddCharacterModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState(() => ({
    name: '',
    class: 'Spellweaver',
    level: 1,
    power: 5000
  }));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'level' || id === 'power' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', class: 'Spellweaver', level: 1, power: 5000 });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card">
        <div className="modal-header">
          <h3 className="modal-title">Tambah Karakter Alternatif (Alt)</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Nama Karakter</label>
            <input 
              type="text" 
              id="name" 
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="Contoh: GlacialSorcerer" 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="class">Class</label>
            <select 
              id="class" 
              className="form-input" 
              style={{ backgroundColor: 'var(--bg-dark)' }} 
              value={formData.class}
              onChange={handleChange}
              required
            >
              <option value="Spellweaver">Spellweaver</option>
              <option value="Aethelblade">Aethelblade</option>
              <option value="Shadow Puppeteer">Shadow Puppeteer</option>
              <option value="Gunslinger">Gunslinger</option>
              <option value="Guardian">Guardian</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="level">Level</label>
            <input 
              type="number" 
              id="level" 
              className="form-input" 
              value={formData.level}
              onChange={handleChange}
              required 
              min="1" 
              max="100" 
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="power">Combat Power (CP)</label>
            <input 
              type="number" 
              id="power" 
              className="form-input" 
              value={formData.power}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Tambah</button>
          </div>

        </form>
      </div>
    </div>
  );
}
