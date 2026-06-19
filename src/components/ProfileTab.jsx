import React from 'react';

export default function ProfileTab({ mainCharacter, onUpdateGear, isAdmin }) {
  const { name, class: charClass, power, server, guild, bio, avatar, equipment } = mainCharacter;

  const handleGearClick = (gearId, currentName, gearType) => {
    if (!isAdmin) return;
    const newName = prompt(`Ubah nama untuk ${gearType}:`, currentName);
    if (newName !== null && newName.trim() !== "") {
      onUpdateGear(gearId, newName.trim());
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="page-content active">
      <div className="profile-showcase-container">
        {/* Left Character Summary Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div className="hero-avatar-container" style={{ marginTop: '1rem' }}>
            <div className="hero-avatar-glow"></div>
            <div className="hero-avatar-wrapper" style={{ width: '180px', height: '180px' }}>
              <img src={avatar} alt="Character" className="hero-avatar" />
            </div>
          </div>
          <div>
            <h2 className="hero-name">{name}</h2>
            <div className="hero-class-badge">{charClass}</div>
            <div className="hero-power" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              <span>⚔️</span> <span>{formatNumber(power)} CP</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {bio}
          </p>
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', textAlign: 'left' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Account Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Server</span> <span>{server}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Guild</span> <span>{guild || "Tidak ada Guild"}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sub-Class</span> <span>Glacial Void</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Equipment Slots Grid */}
        <div className="glass-card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Peralatan Karakter (Equipment)</h3>
          <div className="equipment-grid">
            {equipment.map(gear => (
              <div 
                key={gear.id} 
                className={`gear-slot rarity-${gear.rarity}`}
                onClick={() => handleGearClick(gear.id, gear.name, gear.type)}
                style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                title={isAdmin ? 'Klik untuk edit nama gear' : ''}
              >
                <div className="gear-icon-box">{gear.icon}</div>
                <div className="gear-details">
                  <div className="gear-name">{gear.name}</div>
                  <div className="gear-type">{gear.type} <span className="gear-level">{gear.level}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
