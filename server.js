import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// Default state kalau db.json rusak atau hilang
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
    currencies: { gold: 4850000, crystals: 12450, energy: "120 / 150", abyss: 35 },
    combatStats: [
      { name: "ATK", value: 92, raw: "12,450" },
      { name: "CRIT", value: 85, raw: "68.5%" },
      { name: "CRIT DMG", value: 78, raw: "210%" },
      { name: "SPEED", value: 70, raw: "115%" },
      { name: "DEF", value: 55, raw: "3,890" },
      { name: "ELEM DMG", value: 90, raw: "+88%" }
    ],
    equipment: [
      { id: "weapon", name: "Glacial Void Scepter", type: "Weapon", level: "+15", rarity: "epic", icon: "🪄" },
      { id: "helmet", name: "Void Weaver Hood", type: "Helmet", level: "+12", rarity: "epic", icon: "🦹" },
      { id: "armor", name: "Void Weaver Robe", type: "Armor", level: "+12", rarity: "epic", icon: "🥋" },
      { id: "boots", name: "Void Weaver Greaves", type: "Boots", level: "+10", rarity: "epic", icon: "🥾" },
      { id: "ring", name: "Crimson Crystal Ring", type: "Ring", level: "+10", rarity: "legendary", icon: "💍" },
      { id: "necklace", name: "Crystal Heart Amulet", type: "Necklace", level: "+12", rarity: "legendary", icon: "📿" }
    ]
  },
  alts: [
    { id: 1, name: "Valkyria", class: "Gunslinger", level: 55, power: 36200, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
    { id: 2, name: "Zweihander", class: "Guardian", level: 42, power: 24100, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
  ]
};

// Helper: baca db.json
function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    console.warn('⚠️  db.json tidak ditemukan atau rusak, menggunakan data default.');
    return DEFAULT_STATE;
  }
}

// Helper: tulis ke db.json
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json());

// Serve static frontend (hasil build) di production
app.use(express.static(path.join(__dirname, 'dist')));

// GET /api/state — ambil semua data
app.get('/api/state', (req, res) => {
  const data = readDB();
  res.json(data);
});

// POST /api/state — simpan semua data
app.post('/api/state', (req, res) => {
  try {
    const newState = req.body;
    if (!newState || !newState.mainCharacter) {
      return res.status(400).json({ error: 'Data tidak valid.' });
    }
    // Pastikan avatar selalu pakai lokal
    newState.mainCharacter.avatar = '/avatar.png';
    writeDB(newState);
    res.json({ success: true });
  } catch (err) {
    console.error('Gagal menyimpan data:', err);
    res.status(500).json({ error: 'Gagal menyimpan data.' });
  }
});

// POST /api/reset — reset ke data default
app.post('/api/reset', (req, res) => {
  writeDB(DEFAULT_STATE);
  res.json(DEFAULT_STATE);
});

// Catch-all: kirim index.html untuk semua route (React SPA)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Atlan Hub API berjalan di http://localhost:${PORT}`);
});
