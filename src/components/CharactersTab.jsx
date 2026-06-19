
export default function CharactersTab({ alts, onDeleteAlt, onOpenAddModal, isAdmin }) {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="page-content active">
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Daftar Karakter Tambahan (Alts)</h3>
          {isAdmin && (
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={onOpenAddModal}>
              + Tambah Karakter
            </button>
          )}
        </div>
        <div className="character-list-row">
          {alts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
              Belum ada karakter alternatif. Tambahkan satu untuk memulai pelacakan!
            </div>
          ) : (
            alts.map(alt => (
              <div key={alt.id} className="character-item">
                <div className="char-main-info">
                  <img src={alt.avatar} alt={alt.name} className="char-icon" />
                  <div>
                    <div className="char-name">{alt.name}</div>
                    <div className="char-class">{alt.class}</div>
                  </div>
                </div>
                <div className="char-stats-summary">
                  <div>
                    <div className="char-stat-val">Lv. {alt.level}</div>
                    <div className="char-stat-lbl">Level</div>
                  </div>
                  <div>
                    <div className="char-stat-val">{formatNumber(alt.power)}</div>
                    <div className="char-stat-lbl">CP</div>
                  </div>
                  {isAdmin && (
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.35rem 0.65rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                      onClick={() => onDeleteAlt(alt.id)}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
