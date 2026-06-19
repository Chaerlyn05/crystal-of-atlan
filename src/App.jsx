import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import CharactersTab from './components/CharactersTab';
import EditProfileModal from './components/EditProfileModal';
import AddCharacterModal from './components/AddCharacterModal';
import LoginModal from './components/LoginModal';
import EditDungeonModal from './components/EditDungeonModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const DEFAULT_STATE = {
  mainCharacter: {
    name: "Aethelgard",
    class: "Spellweaver",
    power: 42850,
    level: 60,
    server: "S1 - Crystal Coast",
    guild: "AtlanElite",
    bio: "Petualang legendaris yang berspesialisasi dalam elemen es dan manipulasi gravitasi di dunia Atlan.",
    avatar: "/avatar.png",
    currencies: {
      gold: 4850000,
      crystals: 12450,
      energy: "120 / 150",
      abyss: 35
    },
    combatStats: [
      { name: "ATK", value: 92, raw: "12,450" },
      { name: "CRIT", value: 85, raw: "68.5%" },
      { name: "CRIT DMG", value: 78, raw: "210%" },
      { name: "SPEED", value: 70, raw: "115%" },
      { name: "DEF", value: 55, raw: "3,890" },
      { name: "ELEM DMG", value: 90, raw: "+88%" }
    ],
    equipment: [
      { id: "helmet",   name: "Void Weaver Hood",       type: "Helmet",   level: "+12", rarity: "epic",      icon: "🪖", image: "" },
      { id: "armor",    name: "Void Weaver Robe",       type: "Armor",    level: "+12", rarity: "epic",      icon: "🥋", image: "" },
      { id: "glove",    name: "Void Weaver Gloves",     type: "Glove",    level: "+10", rarity: "epic",      icon: "🧤", image: "" },
      { id: "pants",    name: "Void Weaver Legguards",  type: "Pants",    level: "+10", rarity: "epic",      icon: "👖", image: "" },
      { id: "shoes",    name: "Void Weaver Greaves",    type: "Shoes",    level: "+10", rarity: "epic",      icon: "👟", image: "" },
      { id: "talisman", name: "Void Crystal Talisman",  type: "Talisman", level: "+8",  rarity: "legendary", icon: "🔮", image: "" },
      { id: "weapon",   name: "Glacial Void Scepter",   type: "Weapon",   level: "+15", rarity: "epic",      icon: "🪄", image: "" },
      { id: "necklace", name: "Crystal Heart Amulet",   type: "Necklace", level: "+12", rarity: "legendary", icon: "📿", image: "" },
      { id: "bracers",  name: "Ethereal Bracers",        type: "Bracers",  level: "+8",  rarity: "epic",      icon: "⛓️", image: "" },
      { id: "ring",     name: "Crimson Crystal Ring",   type: "Ring",     level: "+10", rarity: "legendary", icon: "💍", image: "" },
      { id: "seal",     name: "Arcane Void Seal",        type: "Seal",     level: "+8",  rarity: "epic",      icon: "🔱", image: "" },
      { id: "relic",    name: "Ancient Atlan Relic",     type: "Relic",    level: "+6",  rarity: "legendary", icon: "⚗️", image: "" }
    ]
  },
  alts: [
    { id: 1, name: "Valkyria", class: "Gunslinger", level: 55, power: 36200, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: 2, name: "Zweihander", class: "Guardian", level: 42, power: 24100, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
  ],
  dungeons: [
    { id: 1, name: "Abyss Vault - Tower of Ruin", cp: 38000, status: "COMPLETED", icon: "🔥" },
    { id: 2, name: "Weekly Void Raid: Leviathan", cp: 45000, status: "IN PROGRESS", icon: "💀" }
  ]
};

function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddAltOpen, setIsAddAltOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('admin_token') || null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditDungeonOpen, setIsEditDungeonOpen] = useState(false);
  const [selectedDungeon, setSelectedDungeon] = useState(null);

  // Validasi token dari sessionStorage saat pertama load
  useEffect(() => {
    const savedToken = sessionStorage.getItem('admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAdmin(true);
    }
  }, []);

  // Load data dari server saat pertama buka
  useEffect(() => {
    fetch(`${API_URL}/state`)
      .then(res => res.json())
      .then(data => {
        setState(data);
        setIsLoading(false);
        setApiError(false);
      })
      .catch(() => {
        console.warn('Backend tidak terhubung, menggunakan data lokal sementara.');
        setApiError(true);
        setIsLoading(false);
      });
  }, []);

  // Retry koneksi ke backend setiap 3 detik jika error
  useEffect(() => {
    if (!apiError) return;
    const interval = setInterval(() => {
      fetch(`${API_URL}/state`)
        .then(res => res.json())
        .then(data => {
          setState(data);
          setApiError(false);
          clearInterval(interval);
          console.log('✅ Terhubung ke backend!');
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [apiError]);

  // Simpan data ke server setiap kali state berubah
  const saveToServer = useCallback((newState) => {
    const token = sessionStorage.getItem('admin_token');
    fetch(`${API_URL}/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newState)
    }).catch(() => {
      console.warn('Gagal menyimpan ke server.');
    });
  }, []);

  const handleResetData = () => {
    if (!isAdmin) return;
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang semua data ke bawaan?")) {
      const token = sessionStorage.getItem('admin_token');
      fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      })
        .then(res => res.json())
        .then(data => setState(data))
        .catch(() => setState(DEFAULT_STATE));
    }
  };

  const handleToggleLock = () => {
    if (isAdmin) {
      // Logout
      const token = sessionStorage.getItem('admin_token');
      if (token) {
        fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => {});
      }
      sessionStorage.removeItem('admin_token');
      setAdminToken(null);
      setIsAdmin(false);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = (token) => {
    setAdminToken(token);
    setIsAdmin(true);
  };

  const handleSaveProfile = (updatedProfile) => {
    setState(prev => {
      const newState = {
        ...prev,
        mainCharacter: {
          ...prev.mainCharacter,
          name: updatedProfile.name,
          class: updatedProfile.class,
          power: updatedProfile.power,
          level: updatedProfile.level,
          server: updatedProfile.server,
          guild: updatedProfile.guild,
          bio: updatedProfile.bio,
          currencies: {
            ...prev.mainCharacter.currencies,
            gold: updatedProfile.gold,
            crystals: updatedProfile.crystals,
            abyss: updatedProfile.abyss
          }
        }
      };
      saveToServer(newState);
      return newState;
    });
  };

  const handleUpdateGear = (gearId, updates) => {
    setState(prev => {
      const newState = {
        ...prev,
        mainCharacter: {
          ...prev.mainCharacter,
          equipment: prev.mainCharacter.equipment.map(gear =>
            gear.id === gearId ? { ...gear, ...updates } : gear
          )
        }
      };
      saveToServer(newState);
      return newState;
    });
  };

  const handleEditDungeonClick = (dungeon) => {
    setSelectedDungeon(dungeon);
    setIsEditDungeonOpen(true);
  };

  const handleSaveDungeon = (updatedDungeon) => {
    setState(prev => {
      const updatedDungeons = prev.dungeons ? prev.dungeons.map(d =>
        d.id === updatedDungeon.id ? updatedDungeon : d
      ) : DEFAULT_STATE.dungeons.map(d =>
        d.id === updatedDungeon.id ? updatedDungeon : d
      );

      const newState = {
        ...prev,
        dungeons: updatedDungeons
      };
      saveToServer(newState);
      return newState;
    });
  };

  const handleAddAlt = (newAltData) => {
    const avatars = {
      "Spellweaver": "/avatar.png",
      "Aethelblade": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      "Shadow Puppeteer": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      "Gunslinger": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      "Guardian": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    };

    const newAlt = {
      id: Date.now(),
      name: newAltData.name,
      class: newAltData.class,
      level: newAltData.level,
      power: newAltData.power,
      avatar: avatars[newAltData.class] || avatars["Spellweaver"]
    };

    setState(prev => {
      const newState = { ...prev, alts: [...prev.alts, newAlt] };
      saveToServer(newState);
      return newState;
    });
  };

  const handleDeleteAlt = (altId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus karakter alt ini?")) {
      setState(prev => {
        const newState = { ...prev, alts: prev.alts.filter(alt => alt.id !== altId) };
        saveToServer(newState);
        return newState;
      });
    }
  };

  const getSubheading = () => {
    switch (activeTab) {
      case 'dashboard': return "Selamat datang kembali ke Atlan, Petualang.";
      case 'profile': return "Kelola detail stats karakter utama dan saksikan peralatan tempur Anda.";
      case 'characters': return "Daftar semua karakter alt Anda untuk melacak perkembangan petualangan.";
      default: return "";
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', flexDirection: 'column', gap: '1rem',
        background: 'var(--bg-darker)', color: 'var(--text-muted)',
        fontFamily: 'var(--font-display)'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--primary-cyan)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p>Memuat data karakter...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {apiError && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(8px)',
          color: '#fff', textAlign: 'center', padding: '0.6rem 1rem',
          fontSize: '0.85rem', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
        }}>
          <span>⚠️ Backend server tidak terhubung. Jalankan <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>node server.js</code> terlebih dahulu agar perubahan tersimpan. Mencoba ulang...</span>
          <button onClick={() => setApiError(false)} style={{
            background: 'rgba(0,0,0,0.25)', border: 'none', color: '#fff',
            cursor: 'pointer', borderRadius: '50%', width: '22px', height: '22px',
            fontSize: '14px', lineHeight: 1, flexShrink: 0
          }}>✕</button>
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        name={state.mainCharacter.name}
        avatar={state.mainCharacter.avatar}
        isAdmin={isAdmin}
        onToggleLock={handleToggleLock}
      />

      <main className="main-wrapper" style={apiError ? { paddingTop: '3.5rem' } : {}}>
        <header>
          <div className="header-title">
            <h1 style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
            <p>{getSubheading()}</p>
          </div>
          <div className="header-actions">
            {isAdmin && (
              <button className="btn-secondary" onClick={handleResetData}>Reset Data</button>
            )}
            {isAdmin && (
              <button className="btn-primary" onClick={() => setIsEditOpen(true)}>
                <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <DashboardTab 
            mainCharacter={state.mainCharacter} 
            dungeons={state.dungeons || DEFAULT_STATE.dungeons}
            isAdmin={isAdmin}
            onEditDungeon={handleEditDungeonClick}
          />
        )}
        {activeTab === 'profile' && <ProfileTab mainCharacter={state.mainCharacter} onUpdateGear={handleUpdateGear} isAdmin={isAdmin} />}
        {activeTab === 'characters' && (
          <CharactersTab
            alts={state.alts}
            onDeleteAlt={handleDeleteAlt}
            onOpenAddModal={() => setIsAddAltOpen(true)}
            isAdmin={isAdmin}
          />
        )}
      </main>

      <EditProfileModal
        isOpen={isEditOpen && isAdmin}
        onClose={() => setIsEditOpen(false)}
        mainCharacter={state.mainCharacter}
        onSave={handleSaveProfile}
      />

      <AddCharacterModal
        isOpen={isAddAltOpen && isAdmin}
        onClose={() => setIsAddAltOpen(false)}
        onAdd={handleAddAlt}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <EditDungeonModal
        isOpen={isEditDungeonOpen && isAdmin}
        onClose={() => setIsEditDungeonOpen(false)}
        dungeon={selectedDungeon}
        onSave={handleSaveDungeon}
      />
    </div>
  );
}

export default App;
