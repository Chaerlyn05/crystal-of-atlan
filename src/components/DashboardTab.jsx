import React, { useEffect, useState } from 'react';

export default function DashboardTab({ mainCharacter }) {
  const { name, class: charClass, power, level, server, guild, bio, avatar, currencies, combatStats } = mainCharacter;
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Delay slightly to trigger the chart heights transition
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [combatStats]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="page-content active">
      <div className="dashboard-grid">
        {/* Currencies Tracker */}
        <div className="col-12 material-grid">
          <div className="material-card">
            <div className="material-icon">🪙</div>
            <div className="material-info">
              <span className="material-value">{formatNumber(currencies.gold)}</span>
              <span className="material-name">Gold</span>
            </div>
          </div>
          <div className="material-card">
            <div className="material-icon">💎</div>
            <div className="material-info">
              <span className="material-value">{formatNumber(currencies.crystals)}</span>
              <span className="material-name">Crystals</span>
            </div>
          </div>
          <div className="material-card">
            <div className="material-icon">⚡</div>
            <div className="material-info">
              <span className="material-value">{currencies.energy}</span>
              <span className="material-name">Energy</span>
            </div>
          </div>
          <div className="material-card">
            <div className="material-icon">🎫</div>
            <div className="material-info">
              <span className="material-value">{currencies.abyss}</span>
              <span className="material-name">Abyss Tickets</span>
            </div>
          </div>
        </div>

        {/* Main Character Hero Widget */}
        <div className="col-8 glass-card hero-widget">
          <div className="hero-avatar-container">
            <div className="hero-avatar-glow"></div>
            <div className="hero-avatar-wrapper">
              <img src={avatar} alt="Main Character" className="hero-avatar" />
            </div>
          </div>
          <div className="hero-info">
            <div className="hero-class-badge">{charClass}</div>
            <h2 className="hero-name">{name}</h2>
            <div className="hero-power">
              <span>⚔️</span>
              <span>{formatNumber(power)} Combat Power</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
              {bio}
            </p>
          </div>
        </div>

        {/* Quick Stats Widget */}
        <div className="col-4 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <div className="stat-widget">
            <div className="stat-icon">📈</div>
            <div className="stat-details">
              <div className="stat-value">Level {level}</div>
              <div className="stat-label">Main Level</div>
            </div>
          </div>
          <div className="stat-widget purple">
            <div className="stat-icon">🛡️</div>
            <div className="stat-details">
              <div className="stat-value">{guild || "Tidak ada Guild"}</div>
              <div className="stat-label">Guild</div>
            </div>
          </div>
          <div className="stat-widget gold">
            <div className="stat-icon">👑</div>
            <div className="stat-details">
              <div className="stat-value">{server}</div>
              <div className="stat-label">Server</div>
            </div>
          </div>
        </div>

        {/* Dynamic Combat Stats Chart */}
        <div className="col-6 glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '1rem' }}>Combat Stats Distribution</h3>
          <div className="chart-container">
            {combatStats.map((stat, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div 
                  className="chart-bar" 
                  data-value={stat.raw} 
                  style={{ height: animate ? `${stat.value}%` : '0%' }}
                />
                <span className="chart-label">{stat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quest Progress Tracker */}
        <div className="col-6 glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>Petualangan Harian & Abyss</h3>
          <div className="character-list-row">
            <div className="character-item">
              <div className="char-main-info">
                <div className="material-icon" style={{ background: 'rgba(255, 86, 155, 0.12)', borderRadius: '8px', width: '36px', height: '36px', fontSize: '1.1rem' }}>🔥</div>
                <div>
                  <div className="char-name">Abyss Vault - Tower of Ruin</div>
                  <div className="char-class">Rekomendasi CP: 38,000</div>
                </div>
              </div>
              <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.85rem', background: 'rgba(34, 197, 94, 0.15)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>COMPLETED</span>
            </div>
            <div className="character-item">
              <div className="char-main-info">
                <div className="material-icon" style={{ background: 'rgba(255, 155, 38, 0.12)', borderRadius: '8px', width: '36px', height: '36px', fontSize: '1.1rem' }}>💀</div>
                <div>
                  <div className="char-name">Weekly Void Raid: Leviathan</div>
                  <div className="char-class">Rekomendasi CP: 45,000</div>
                </div>
              </div>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.85rem', background: 'rgba(255, 184, 0, 0.15)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>IN PROGRESS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
