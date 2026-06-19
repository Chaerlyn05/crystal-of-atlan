import React, { useState } from 'react';
import EditGearModal from './EditGearModal';

export default function ProfileTab({ mainCharacter, onUpdateGear, isAdmin }) {
  const { name, class: charClass, power, server, guild, bio, avatar, equipment } = mainCharacter;
  const [selectedGear, setSelectedGear] = useState(null);
  const [isEditGearOpen, setIsEditGearOpen] = useState(false);

  const handleGearClick = (gear) => {
    if (!isAdmin) return;
    setSelectedGear(gear);
    setIsEditGearOpen(true);
  };

  const handleSaveGear = (gearId, updates) => {
    onUpdateGear(gearId, updates);
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
            </div>
          </div>
        </div>

        {/* Right Equipment Slots Grid */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Peralatan Karakter (Equipment)</h3>
            {isAdmin && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,86,155,0.1)', border: '1px solid rgba(255,86,155,0.2)', borderRadius: '6px', padding: '0.2rem 0.6rem' }}>
                ✏️ Klik gear untuk edit
              </span>
            )}
          </div>
          <div className="equipment-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {equipment.map(gear => (
              <div
                key={gear.id}
                className={`gear-slot rarity-${gear.rarity}`}
                onClick={() => handleGearClick(gear)}
                style={{
                  cursor: isAdmin ? 'pointer' : 'default',
                  padding: '0.75rem',
                  gap: '0.65rem',
                  position: 'relative'
                }}
                title={isAdmin ? `Klik untuk edit ${gear.type}` : ''}
              >
                <div className="gear-icon-box" style={{ width: '40px', height: '40px', fontSize: '1.2rem', flexShrink: 0 }}>
                  {gear.icon}
                </div>
                <div className="gear-details" style={{ overflow: 'hidden', minWidth: 0 }}>
                  <div className="gear-name" style={{ fontSize: '0.8rem' }}>{gear.name}</div>
                  <div className="gear-type" style={{ fontSize: '0.7rem' }}>
                    {gear.type} <span className="gear-level">{gear.level}</span>
                  </div>
                </div>
                {isAdmin && (
                  <span style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    fontSize: '0.65rem',
                    opacity: 0.4
                  }}>✏️</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditGearModal
        isOpen={isEditGearOpen && isAdmin}
        onClose={() => setIsEditGearOpen(false)}
        gear={selectedGear}
        onSave={handleSaveGear}
      />
    </div>
  );
}
