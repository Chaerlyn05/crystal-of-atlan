import { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,14,40,0.98) 0%, rgba(12,10,30,0.98) 100%)',
        border: '1px solid rgba(167,139,250,0.25)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 0 60px rgba(167,139,250,0.15), 0 25px 50px rgba(0,0,0,0.6)',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.05)', border: 'none',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            borderRadius: '50%', width: '28px', height: '28px',
            fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
        >✕</button>

        {/* Lock icon */}
        <div style={{
          width: '64px', height: '64px',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(236,72,153,0.2))',
          borderRadius: '50%', margin: '0 auto 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(167,139,250,0.3)',
          boxShadow: '0 0 30px rgba(167,139,250,0.2)',
          fontSize: '28px',
        }}>🔐</div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          color: '#fff',
          marginBottom: '0.4rem',
        }}>Admin Access</h2>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          marginBottom: '1.75rem',
        }}>Masukkan PIN untuk mengaktifkan mode edit</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(''); }}
            placeholder="Masukkan PIN..."
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${error ? 'rgba(239,68,68,0.6)' : 'rgba(167,139,250,0.25)'}`,
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: '#fff',
              fontSize: '1rem',
              textAlign: 'center',
              letterSpacing: '0.2em',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
              marginBottom: error ? '0.5rem' : '1.25rem',
            }}
            onFocus={e => !error && (e.target.style.borderColor = 'rgba(167,139,250,0.6)')}
            onBlur={e => !error && (e.target.style.borderColor = 'rgba(167,139,250,0.25)')}
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
            style={{
              width: '100%',
              background: loading || !pin.trim()
                ? 'rgba(167,139,250,0.2)'
                : 'linear-gradient(135deg, #a78bfa, #ec4899)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading || !pin.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
          >
            {loading ? 'Memverifikasi...' : '🔓 Unlock Edit Mode'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', marginTop: '1.25rem' }}>
          Hanya pemilik akun yang dapat login
        </p>
      </div>
    </div>
  );
}
