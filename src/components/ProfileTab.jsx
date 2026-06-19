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
            <div className="hero-avatar-wrapper" style={{ width: '160px', height: '160px' }}>
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

        {/* Right Equipment Panel */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Peralatan Karakter</h3>
            {isAdmin && (
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--primary-cyan)',
                background: 'rgba(255,86,155,0.08)',
                border: '1px solid rgba(255,86,155,0.2)',
                borderRadius: '6px',
                padding: '0.2rem 0.6rem'
              }}>
                ✏️ Hover &amp; klik untuk edit
              </span>
            )}
          </div>

          {/* Game-style 2+gap+2 grid per baris */}
          <div className="equipment-grid-game">
            {equipment.map((gear, index) => (
              <React.Fragment key={gear.id}>
                <div
                  className={`gear-card rarity-${gear.rarity}${isAdmin ? ' admin-mode' : ''}`}
                  onClick={() => handleGearClick(gear)}
                  title={isAdmin ? `Edit ${gear.type}` : gear.name}
                >
                  {/* Enhancement badge */}
                  <div className="gear-enhancement-badge">{gear.level}</div>

                  {/* Image or emoji icon */}
                  {gear.image ? (
                    <img src={gear.image} alt={gear.name} className="gear-card-image" />
                  ) : (
                    <div className="gear-card-icon">{gear.icon}</div>
                  )}

                  {/* Type label at bottom */}
                  <div className="gear-type-label">{gear.type}</div>

                  {/* Admin edit overlay on hover */}
                  {isAdmin && (
                    <div className="gear-edit-overlay">
                      ✏️
                      <span>Edit</span>
                    </div>
                  )}
                </div>
                {/* Spacer SETELAH item ke-2, 6, 10 (posisi 1, 5, 9) → kolom tengah */}
                {index % 4 === 1 && <div className="gear-spacer" />}
              </React.Fragment>
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
