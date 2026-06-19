import React, { useState, useEffect } from 'react';

export default function EditGearModal({ isOpen, onClose, gear, onSave }) {
  const [formData, setFormData] = useState({ name: '', enhancement: '0' });

  useEffect(() => {
    if (gear) {
      const raw = gear.level || '+0';
      setFormData({
        name: gear.name || '',
        enhancement: raw.replace('+', '')
      });
    }
  }, [gear, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(gear.id, {
      name: formData.name.trim(),
      level: `+${formData.enhancement}`
    });
    onClose();
  };

  if (!isOpen || !gear) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card" style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{gear.icon}</span>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Edit Slot</p>
              <h3 className="modal-title" style={{ fontSize: '1.1rem' }}>{gear.type}</h3>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="gear-edit-name">Nama Gear</label>
            <input
              type="text"
              id="gear-edit-name"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`Masukkan nama ${gear.type}...`}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gear-edit-enhancement">Enhancement Level</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                color: 'var(--accent-gold)',
                fontWeight: 800,
                fontSize: '1.4rem',
                fontFamily: 'var(--font-display)',
                textShadow: 'var(--glow-gold)',
                flexShrink: 0
              }}>+</span>
              <input
                type="number"
                id="gear-edit-enhancement"
                className="form-input"
                value={formData.enhancement}
                onChange={(e) => setFormData(prev => ({ ...prev, enhancement: e.target.value }))}
                min="0"
                max="20"
                style={{ flex: 1 }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              Preview: <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>+{formData.enhancement}</span>
            </p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Gear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
