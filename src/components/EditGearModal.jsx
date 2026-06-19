import { useState, useEffect, useRef } from 'react';

// Kompres dan resize gambar ke max 300px agar db.json tidak terlalu besar
function compressImage(file, maxSize = 300, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/webp', quality));
    };
    img.src = url;
  });
}

export default function EditGearModal({ isOpen, onClose, gear, onSave }) {
  const [formData, setFormData] = useState(() => {
    const raw = gear?.level || '+0';
    return {
      name: gear?.name || '',
      enhancement: raw.replace('+', ''),
      image: gear?.image || ''
    };
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, image: compressed }));
    } catch {
      alert('Gagal memproses gambar. Coba file lain.');
    } finally {
      setIsUploading(false);
      // reset input agar file yang sama bisa dipilih ulang
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(gear.id, {
      name: formData.name.trim(),
      level: `+${formData.enhancement}`,
      image: formData.image
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
              width: '44px', height: '44px', borderRadius: '8px',
              background: gear.rarity === 'legendary' ? 'linear-gradient(145deg, #1a0a00, #2a1200)' : 'linear-gradient(145deg, #0f0a1e, #1a1035)',
              border: `2px solid ${gear.rarity === 'legendary' ? '#f97316' : '#7c3aed'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', flexShrink: 0, overflow: 'hidden'
            }}>
              {formData.image
                ? <img src={formData.image} alt={gear.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : gear.icon}
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
            overflowY: 'auto', flex: 1, padding: '0 0.25rem',
            scrollbarWidth: 'thin', scrollbarColor: 'rgba(167,139,250,0.3) transparent',
          }}>

            {/* Gear Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="gear-edit-name">Nama Gear</label>
              <input
                type="text" id="gear-edit-name" className="form-input"
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
                <span style={{ color: '#f97316', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-display)', flexShrink: 0, lineHeight: 1 }}>+</span>
                <input
                  type="number" id="gear-edit-enhancement" className="form-input"
                  value={formData.enhancement}
                  onChange={(e) => setFormData(prev => ({ ...prev, enhancement: e.target.value }))}
                  min="0" max="30" style={{ flex: 1 }}
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                Preview badge: <span style={{ color: '#f97316', fontWeight: 700 }}>+{formData.enhancement}</span>
              </p>
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Gambar Gear</label>

              {/* Preview box */}
              <div style={{
                width: '100%', aspectRatio: '1 / 1',
                maxWidth: '160px', margin: '0 auto 0.75rem',
                borderRadius: '10px', overflow: 'hidden',
                background: gear.rarity === 'legendary' ? 'linear-gradient(145deg,#1a0a00,#2a1200)' : 'linear-gradient(145deg,#0f0a1e,#1a1035)',
                border: `2px solid ${gear.rarity === 'legendary' ? '#f97316' : '#5b21b6'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.5rem', position: 'relative'
              }}>
                {formData.image
                  ? <img src={formData.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{gear.icon}</span>
                }
                {isUploading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', color: '#fff'
                  }}>Memproses...</div>
                )}
              </div>

              {/* Upload & Remove buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <label
                  htmlFor="gear-image-file"
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '0.5rem', padding: '0.6rem 1rem',
                    background: 'rgba(255,86,155,0.08)',
                    border: '1px dashed rgba(255,86,155,0.35)',
                    borderRadius: '10px', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.85rem',
                    transition: 'all 0.2s', fontFamily: 'var(--font-display)'
                  }}
                >
                  📁 Upload Gambar
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="gear-image-file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {formData.image && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      padding: '0.6rem 0.85rem', borderRadius: '10px',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#f87171', cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >🗑️</button>
                )}
              </div>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.4rem', textAlign: 'center' }}>
                Gambar akan dikompres otomatis. Format: JPG, PNG, WebP.
              </p>
            </div>
          </div>

          <div className="form-actions" style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {isUploading ? 'Memproses...' : 'Simpan Gear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
