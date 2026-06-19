import { useState, useEffect, useCallback } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const handleClose = useCallback(() => {
    setPin('');
    setError('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        onLoginSuccess(data.token);
        setPin('');
        setError('');
        onClose();
      } else {
        setError(data.error || 'PIN salah. Coba lagi.');
      }
    } catch {
      setError('Koneksi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal glass-card" style={{ maxWidth: '380px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: 'none', marginBottom: '1rem', justifyContent: 'flex-end' }}>
          <button className="modal-close" onClick={handleClose} style={{ fontSize: '1.5rem', opacity: 0.6 }}>&times;</button>
        </div>

        {/* Lock icon */}
        <div style={{
          width: '64px', height: '64px',
          background: 'linear-gradient(135deg, rgba(255, 86, 155, 0.2), rgba(255, 155, 38, 0.2))',
          borderRadius: '50%', margin: '0 auto 1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(255, 86, 155, 0.35)',
          boxShadow: '0 0 30px rgba(255, 86, 155, 0.2)',
          fontSize: '28px',
        }}>🔐</div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.35rem',
          color: '#fff',
          marginBottom: '0.4rem',
        }}>Admin Access</h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginBottom: '1.75rem',
        }}>Masukkan PIN untuk mengaktifkan mode edit</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(''); }}
            placeholder="Masukkan PIN..."
            autoFocus
            className="form-input"
            style={{
              textAlign: 'center',
              letterSpacing: '0.2em',
              fontSize: '1.1rem',
              marginBottom: error ? '0.5rem' : '1.25rem',
            }}
          />

          {error && (
            <div style={{
              color: '#f87171', fontSize: '0.8rem',
              marginBottom: '1rem',
              padding: '0.4rem 0.75rem',
              background: 'rgba(239,68,68,0.1)',
              borderRadius: '6px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="btn-primary"
            style={{
              justifyContent: 'center',
              width: '100%',
              padding: '0.8rem',
              fontSize: '0.95rem',
              letterSpacing: '0.05em',
            }}
          >
            {loading ? 'Memverifikasi...' : '🔓 Unlock Edit Mode'}
          </button>
        </form>

        <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem', marginTop: '1.25rem' }}>
          Hanya pemilik akun yang dapat login
        </p>
      </div>
    </div>
  );
}
