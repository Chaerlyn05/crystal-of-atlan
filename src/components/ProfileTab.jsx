import { useState } from 'react';
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

          {/* Game-style 5-column grid flanking character */}
          <div className="equipment-grid-game">
            {/* Center Character Portrait spanning 3 rows */}
            <div className="gear-char-card">
              <div className="gear-char-glow" />
              <div className="gear-char-avatar-wrapper">
                <img src={avatar} alt={name} className="gear-char-avatar" />
              </div>
              <div className="gear-char-details">
                <div className="gear-char-name">{name}</div>
                <div className="gear-char-class">{charClass}</div>
                <div className="gear-char-power">⚔️ {formatNumber(power)} CP</div>
              </div>
            </div>

            {/* 12 Equipment slots */}
            {equipment.map((gear) => (
              <div
                key={gear.id}
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
            ))}
          </div>
        </div>
      </div>

      {isEditGearOpen && isAdmin && selectedGear && (
        <EditGearModal
          isOpen={isEditGearOpen && isAdmin}
          onClose={() => setIsEditGearOpen(false)}
          gear={selectedGear}
          onSave={handleSaveGear}
        />
      )}
    </div>
  );
}
