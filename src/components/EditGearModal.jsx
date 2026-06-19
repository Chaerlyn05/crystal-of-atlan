import React, { useState, useEffect } from 'react';

export default function EditGearModal({ isOpen, onClose, gear, onSave }) {
  const [formData, setFormData] = useState({ name: '', enhancement: '0', image: '' });

  useEffect(() => {
    if (gear) {
      const raw = gear.level || '+0';
      setFormData({
        name: gear.name || '',
        enhancement: raw.replace('+', ''),
        image: gear.image || ''
      });
    }
  }, [gear, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(gear.id, {
      name: formData.name.trim(),
      level: `+${formData.enhancement}`,
      image: formData.image.trim()
    });
    onClose();
  };

  if (!isOpen || !gear) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card" style={{ maxWidth: '440px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              background: gear.rarity === 'legendary'
                ? 'linear-gradient(145deg, #1a0a00, #2a1200)'
                : 'linear-gradient(145deg, #0f0a1e, #1a1035)',
              border: `2px solid ${gear.rarity === 'legendary' ? '#f97316' : '#7c3aed'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0,
              overflow: 'hidden'
            }}>
              {gear.image ? (
                <img src={gear.image} alt={gear.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : gear.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Edit Gear · <span style={{ color: gear.rarity === 'legendary' ? '#f97316' : '#a78bfa' }}>{gear.rarity}</span>
              </p>
              <h3 className="modal-title" style={{ fontSize: '1.05rem' }}>{gear.type}</h3>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{
            overflowY: 'auto',
            flex: 1,
            padding: '0 0.25rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(167,139,250,0.3) transparent',
          }}>
            {/* Gear Name */}
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

            {/* Enhancement Level */}
            <div className="form-group">
              <label className="form-label" htmlFor="gear-edit-enhancement">Enhancement Level</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  color: '#f97316',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  lineHeight: 1
                }}>+</span>
                <input
                  type="number"
                  id="gear-edit-enhancement"
                  className="form-input"
                  value={formData.enhancement}
                  onChange={(e) => setFormData(prev => ({ ...prev, enhancement: e.target.value }))}
                  min="0"
                  max="30"
                  style={{ flex: 1 }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                Preview badge: <span style={{ color: '#f97316', fontWeight: 700 }}>+{formData.enhancement}</span>
              </p>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="gear-edit-image">URL Gambar Gear (opsional)</label>
              <input
                type="url"
                id="gear-edit-image"
                className="form-input"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://... (paste link gambar item)"
              />
              {formData.image && (
                <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', height: '80px', background: '#111' }}>
                  <img
                    src={formData.image}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                Kosongkan untuk tampilkan emoji ikon bawaan.
              </p>
            </div>
          </div>

          <div className="form-actions" style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Gear</button>
          </div>
        </form>
      </div>
    </div>
  );
}
