import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { Link } from "react-router-dom";
import { playlistApi } from "../lib/api";
import { getRecentlyPlayed } from "../lib/recentlyPlayed";
import { SearchIcon, PlaylistIcon, PlayIcon, PlusIcon } from "../components/Icons";
import Wave from "../components/Wave";

const GRADIENTS = [
  ["#FF5F6D", "#FFC371"], ["#7F00FF", "#E100FF"], ["#00C9FF", "#92FE9D"],
  ["#F857A6", "#FF5858"], ["#00B09B", "#96C93D"], ["#4568DC", "#B06AB3"],
];
function gradientFor(seed) {
  const sum = String(seed).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const [a, b] = GRADIENTS[sum % GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

const MOODS = [
  { label: "Fokus", query: "instrumental fokus", desc: "Instrumental buat kerja & belajar" },
  { label: "Santai", query: "musik santai", desc: "Tempo pelan, cocok buat rebahan" },
  { label: "Lari Pagi", query: "musik semangat lari pagi", desc: "Tempo cepat, energi penuh" },
  { label: "Late Night", query: "lagu malam santai", desc: "Teman begadang" },
  { label: "Party", query: "lagu party dj" },
  { label: "Hujan", query: "lagu hujan galau" },
  { label: "Galau", query: "lagu galau indonesia" },
  { label: "Semangat Pagi", query: "lagu semangat pagi" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function Home({ onPlay }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loadingPl, setLoadingPl] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    playlistApi.list().then(setPlaylists).catch(() => {}).finally(() => setLoadingPl(false));
    setRecent(getRecentlyPlayed(user?.username));
  }, [user?.username]);

  async function quickPlayPlaylist(e, pl) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = await playlistApi.get(pl.id);
      if (!data.songs || data.songs.length === 0) return;
      const queue = data.songs.map((s) => ({ id: s.song_id, title: s.title, thumbnail: s.thumbnail, duration: s.duration }));
      onPlay?.(queue[0], queue, 0);
    } catch {
      // biarkan user coba lagi dari halaman playlist
    }
  }

  function playRecent(index) {
    onPlay?.(recent[index], recent, index);
  }

  return (
    <div className="veyra-fade-in">
      <div style={styles.hero}>
        <p style={styles.eyebrow}><Wave playing size={12} /> {getGreeting()}</p>
        <h1 style={styles.title}>Halo, {user?.username} 👋</h1>
        <p style={styles.subtitle}>Mau dengerin apa hari ini?</p>
        <div style={styles.actions}>
          <Link to="/search" className="veyra-glass-btn solid">
            <SearchIcon size={15} /> Cari Lagu
          </Link>
          <Link to="/playlists" className="veyra-glass-btn">
            <PlaylistIcon size={15} /> Semua Playlist
          </Link>
        </div>
      </div>

      {recent.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHead}><h2 style={styles.sectionTitle}>Baru diputar</h2></div>
          <div className="veyra-row">
            {recent.map((t, i) => (
              <div key={t.id + i} className="veyra-glass-card" style={styles.trackCard} onClick={() => playRecent(i)}>
                <div style={styles.artWrap}>
                  <img src={t.thumbnail} alt="" style={styles.artImg} />
                  <button style={styles.playFab} onClick={(e) => { e.stopPropagation(); playRecent(i); }}>
                    <PlayIcon size={13} />
                  </button>
                </div>
                <p style={styles.trackTitle}>{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionHead}><h2 style={styles.sectionTitle}>Jelajahi mood</h2></div>
        <div className="veyra-row">
          {MOODS.slice(0, 4).map((m) => (
            <Link key={m.label} to={`/search?q=${encodeURIComponent(m.query)}`} className="veyra-glass-card" style={styles.featureCard}>
              <div style={{ ...styles.featureArt, background: gradientFor(m.label) }}>
                <SearchIcon size={20} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={styles.featureTitle}>{m.label}</p>
                {m.desc && <p style={styles.featureSub}>{m.desc}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>Playlist kamu</h2>
          {playlists.length > 0 && <Link to="/playlists" style={styles.seeAll}>Lihat semua</Link>}
        </div>

        {loadingPl && <p style={styles.status}>Memuat playlist...</p>}
        {!loadingPl && playlists.length === 0 && (
          <Link to="/playlists" className="veyra-glass-card" style={styles.emptyCard}>
            <PlusIcon size={16} /> <span>Buat playlist pertamamu</span>
          </Link>
        )}

        <div className="veyra-row">
          {playlists.map((pl) => (
            <Link key={pl.id} to={`/playlists/${pl.id}`} className="veyra-glass-card" style={styles.plCard}>
              <div style={{ ...styles.plArt, background: gradientFor(pl.id) }}>
                <PlaylistIcon size={24} />
                <button style={styles.playFab} onClick={(e) => quickPlayPlaylist(e, pl)}>
                  <PlayIcon size={12} />
                </button>
              </div>
              <p style={styles.trackTitle}>{pl.name}</p>
              <p style={styles.plSub}>{pl.songCount} lagu</p>
            </Link>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHead}><h2 style={styles.sectionTitle}>Mood &amp; Genre</h2></div>
        <div style={styles.moodRow}>
          {MOODS.map((m) => (
            <Link key={m.label} to={`/search?q=${encodeURIComponent(m.query)}`} className="veyra-mood-chip veyra-glass">
              {m.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    position: "relative", borderRadius: 22, padding: "30px 26px", marginBottom: 34, overflow: "hidden",
    background: "linear-gradient(150deg, rgba(127,0,255,0.35), rgba(0,0,0,0) 55%), rgba(21,21,23,0.65)",
    border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
  },
  eyebrow: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.7)", margin: "0 0 8px 0" },
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" },
  subtitle: { fontSize: 14.5, color: "rgba(255,255,255,0.72)", margin: "0 0 22px 0" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap" },
  section: { marginBottom: 32 },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: 0 },
  seeAll: { fontSize: 12.5, color: "#8A8A8E", textDecoration: "none", fontWeight: 500 },
  status: { color: "#8A8A8E", fontSize: 14 },
  emptyCard: { display: "flex", alignItems: "center", gap: 10, borderRadius: 12, padding: "16px 18px", color: "#F2F2F0", textDecoration: "none", width: "fit-content" },
  trackCard: { flex: "0 0 auto", width: 148, padding: 12, cursor: "pointer" },
  artWrap: { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 9, overflow: "hidden", marginBottom: 10, background: "#151517" },
  artImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  playFab: {
    position: "absolute", bottom: 6, right: 6, width: 28, height: 28, borderRadius: "50%",
    background: "var(--veyra-gradient)", border: "none", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  trackTitle: { margin: "0 0 2px 0", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  featureCard: { flex: "0 0 auto", width: 280, display: "flex", alignItems: "center", gap: 14, padding: 12, textDecoration: "none", color: "#F2F2F0" },
  featureArt: { width: 60, height: 60, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.9)" },
  featureTitle: { margin: "0 0 3px 0", fontSize: 14, fontWeight: 700 },
  featureSub: { margin: 0, fontSize: 12, color: "#8A8A8E", lineHeight: 1.4 },
  plCard: { flex: "0 0 auto", width: 152, padding: 12, textDecoration: "none", color: "#F2F2F0" },
  plArt: { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.85)", marginBottom: 10 },
  plSub: { margin: 0, fontSize: 12, color: "#8A8A8E" },
  moodRow: { display: "flex", gap: 10, flexWrap: "wrap" },
};
