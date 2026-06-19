import React, { useState, useEffect } from 'react';

export default function EditProfileModal({ isOpen, onClose, mainCharacter, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    power: 0,
    level: 1,
    server: '',
    guild: '',
    gold: 0,
    crystals: 0,
    abyss: 0,
    bio: ''
  });

  useEffect(() => {
    if (mainCharacter) {
      setFormData({
        name: mainCharacter.name,
        class: mainCharacter.class,
        power: mainCharacter.power,
        level: mainCharacter.level,
        server: mainCharacter.server,
        guild: mainCharacter.guild,
        gold: mainCharacter.currencies.gold,
        crystals: mainCharacter.currencies.crystals,
        abyss: mainCharacter.currencies.abyss,
        bio: mainCharacter.bio
      });
    }
  }, [mainCharacter, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'power' || id === 'level' || id === 'gold' || id === 'crystals' || id === 'abyss' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        {/* Header — sticky */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <h3 className="modal-title">Edit Profil Akun & Karakter</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{
            overflowY: 'auto',
            flex: 1,
            padding: '0 0.25rem',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(167,139,250,0.3) transparent',
          }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nama Explorer</label>
              <input type="text" id="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="class">Class Utama</label>
              <input type="text" id="class" className="form-input" value={formData.class} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="power">Combat Power (CP)</label>
              <input type="number" id="power" className="form-input" value={formData.power} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="level">Level Karakter</label>
              <input type="number" id="level" className="form-input" value={formData.level} onChange={handleChange} required min="1" max="100" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="server">Server</label>
              <input type="text" id="server" className="form-input" value={formData.server} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="guild">Guild</label>
              <input type="text" id="guild" className="form-input" value={formData.guild} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="gold">Mata Uang Gold</label>
              <input type="number" id="gold" className="form-input" value={formData.gold} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="crystals">Mata Uang Opal</label>
              <input type="number" id="crystals" className="form-input" value={formData.crystals} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="abyss">Total Cumulative</label>
              <input type="number" id="abyss" className="form-input" value={formData.abyss} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="bio">Deskripsi / Bio Karakter</label>
              <textarea id="bio" className="form-input" rows="3" style={{ resize: 'none' }} value={formData.bio} onChange={handleChange}></textarea>
            </div>
          </div>

          {/* Footer — sticky */}
          <div className="form-actions" style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
