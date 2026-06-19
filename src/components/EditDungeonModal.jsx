import { useState, useEffect } from 'react';

export default function EditDungeonModal({ isOpen, onClose, dungeon, onSave }) {
  const [formData, setFormData] = useState(() => ({
    id: dungeon?.id || null,
    name: dungeon?.name || '',
    cp: dungeon?.cp || 0,
    status: dungeon?.status || 'IN PROGRESS',
    icon: dungeon?.icon || '🔥'
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
      [id]: id === 'cp' ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const emojiOptions = ['🔥', '💀', '⚔️', '🛡️', '🗺️', '💎', '👑', '🧪', '👾'];

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <h3 className="modal-title">Edit Petualangan / Dungeon</h3>
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
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nama Petualangan / Dungeon</label>
              <input type="text" id="name" className="form-input" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cp">Rekomendasi CP</label>
              <input type="number" id="cp" className="form-input" value={formData.cp} onChange={handleChange} required min="0" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select id="status" className="form-input" value={formData.status} onChange={handleChange} style={{ background: '#1a1424' }}>
                <option value="COMPLETED">COMPLETED</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="NOT STARTED">NOT STARTED</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="icon">Ikon Dungeon</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {emojiOptions.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                    style={{
                      fontSize: '1.25rem',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      border: formData.icon === emoji ? '2px solid var(--primary-cyan)' : '1px solid rgba(255,255,255,0.1)',
                      background: formData.icon === emoji ? 'rgba(255, 86, 155, 0.15)' : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <input 
                type="text" 
                id="icon" 
                className="form-input" 
                value={formData.icon} 
                onChange={handleChange} 
                placeholder="Atau masukkan emoji khusus"
                maxLength="4"
              />
            </div>
          </div>

          <div className="form-actions" style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
