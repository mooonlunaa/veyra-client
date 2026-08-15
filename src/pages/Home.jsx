import { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { Link } from "react-router-dom";
import { playlistApi } from "../lib/api";
import { SearchIcon, PlaylistIcon, PlayIcon, PlusIcon } from "../components/Icons";

const GRADIENTS = [
  ["#FF5F6D", "#FFC371"],
  ["#7F00FF", "#E100FF"],
  ["#00C9FF", "#92FE9D"],
  ["#F857A6", "#FF5858"],
  ["#00B09B", "#96C93D"],
  ["#4568DC", "#B06AB3"],
];

function gradientFor(id) {
  const sum = String(id)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const [a, b] = GRADIENTS[sum % GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playlistApi
      .list()
      .then(setPlaylists)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function quickPlay(e, pl) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = await playlistApi.get(pl.id);
      if (!data.songs || data.songs.length === 0) return;
      const queue = data.songs.map((s) => ({
        id: s.song_id,
        title: s.title,
        thumbnail: s.thumbnail,
        duration: s.duration,
      }));
      onPlay?.(queue[0], queue, 0);
    } catch {
      // biarkan user coba lagi dari halaman playlist
    }
  }

  return (
    <div className="veyra-fade-in">
      <div style={styles.hero}>
        <p style={styles.eyebrow}>{getGreeting()}</p>
        <h1 style={styles.title}>Halo, {user?.username} 👋</h1>
        <p style={styles.subtitle}>Mau dengarkan apa hari ini?</p>

        <div style={styles.cards}>
          <Link to="/search" className="veyra-glass-card" style={styles.actionCard}>
            <span style={{ ...styles.actionIcon, background: "var(--veyra-gradient)" }}>
              <SearchIcon size={18} />
            </span>
            <span style={styles.actionLabel}>Cari Lagu</span>
          </Link>
          <Link to="/playlists" className="veyra-glass-card" style={styles.actionCard}>
            <span style={{ ...styles.actionIcon, background: "var(--veyra-gradient)" }}>
              <PlaylistIcon size={18} />
            </span>
            <span style={styles.actionLabel}>Semua Playlist</span>
          </Link>
        </div>
      </div>

      <div style={styles.sectionHead}>
        <h2 style={styles.sectionTitle}>Playlist Kamu</h2>
        {playlists.length > 0 && (
          <Link to="/playlists" style={styles.seeAll}>Lihat semua</Link>
        )}
      </div>

      {loading && <p style={styles.status}>Memuat playlist...</p>}

      {!loading && playlists.length === 0 && (
        <Link to="/playlists" className="veyra-glass-card" style={styles.emptyCard}>
          <PlusIcon size={18} />
          <span>Buat playlist pertamamu</span>
        </Link>
      )}

      <div className="veyra-row">
        {playlists.map((pl) => (
          <Link key={pl.id} to={`/playlists/${pl.id}`} className="veyra-glass-card" style={styles.plCard}>
            <div style={{ ...styles.plArt, background: gradientFor(pl.id) }}>
              <PlaylistIcon size={26} />
              <button style={styles.plPlayBtn} onClick={(e) => quickPlay(e, pl)}>
                <PlayIcon size={13} />
              </button>
            </div>
            <p style={styles.plName}>{pl.name}</p>
            <p style={styles.plSub}>{pl.songCount} lagu</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero: {
    borderRadius: 20,
    padding: "28px 24px",
    marginBottom: 32,
    background:
      "linear-gradient(160deg, var(--veyra-c1) 0%, rgba(0,0,0,0) 60%), linear-gradient(0deg, rgba(21,21,23,0.9), rgba(21,21,23,0.9))",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  eyebrow: { margin: "0 0 6px 0", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.06em" },
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 24px 0" },
  cards: { display: "flex", gap: 12, flexWrap: "wrap" },
  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: "12px 18px 12px 12px",
    color: "#F2F2F0",
    textDecoration: "none",
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  },
  actionLabel: { fontSize: 14, fontWeight: 600 },
  sectionHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: 0 },
  seeAll: { fontSize: 12.5, color: "#8A8A8E", textDecoration: "none", fontWeight: 500 },
  status: { color: "#8A8A8E", fontSize: 14 },
  emptyCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    padding: "18px 20px",
    color: "#F2F2F0",
    textDecoration: "none",
    marginBottom: 8,
    width: "fit-content",
  },
  plCard: {
    flex: "0 0 auto",
    width: 150,
    borderRadius: 12,
    padding: 12,
    textDecoration: "none",
    color: "#F2F2F0",
  },
  plArt: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.85)",
    marginBottom: 10,
  },
  plPlayBtn: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(11,11,12,0.55)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  plName: {
    margin: "0 0 2px 0",
    fontSize: 13.5,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  plSub: { margin: 0, fontSize: 12, color: "#8A8A8E" },
};
