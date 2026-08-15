import { useState } from "react";
import { musicApi } from "../lib/api";
import { SearchIcon, PlayIcon, PlusIcon } from "../components/Icons";
import AddToPlaylistMenu from "../components/AddToPlaylistMenu";

function formatDuration(sec) {
  if (!sec && sec !== 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Search({ onPlay }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addTarget, setAddTarget] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await musicApi.search(query);
      setResults(data);
    } catch (err) {
      setError("Gagal memuat hasil pencarian.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="veyra-fade-in">
      <h1 style={styles.title}>Cari Musik</h1>

      <form onSubmit={handleSearch} style={styles.searchBar}>
        <SearchIcon size={18} />
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Cari judul lagu atau artis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {loading && <p style={styles.status}>Mencari...</p>}
      {error && <p style={{ ...styles.status, color: "#E5675A" }}>{error}</p>}

      <div className="veyra-grid" style={styles.grid}>
        {results.map((track, i) => (
          <div key={track.id + i} className="veyra-glass-card" style={styles.card}>
            <div style={styles.thumbWrap}>
              <img src={track.thumbnail} alt="" style={styles.thumb} />
              <button
                style={styles.addBtn}
                onClick={(e) => { e.stopPropagation(); setAddTarget(track); }}
                title="Tambah ke playlist"
              >
                <PlusIcon size={14} />
              </button>
              <button style={styles.playBtn} onClick={() => onPlay(track, results, i)}>
                <PlayIcon size={20} />
              </button>
              <span style={styles.duration}>{formatDuration(track.duration)}</span>
            </div>
            <p style={styles.cardTitle}>{track.title}</p>
          </div>
        ))}
      </div>

      {addTarget && (
        <AddToPlaylistMenu track={addTarget} onClose={() => setAddTarget(null)} />
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 24px 0" },
  searchBar: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 10,
    padding: "12px 16px",
    maxWidth: 480,
    marginBottom: 28,
    color: "#8A8A8E",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F2F2F0",
    fontSize: 14,
    fontFamily: "inherit",
  },
  status: { color: "#8A8A8E", fontSize: 14 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 18,
  },
  card: { cursor: "pointer", borderRadius: 12, padding: 8 },
  thumbWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 8,
    overflow: "hidden",
    background: "#151517",
    marginBottom: 10,
  },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  addBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(11,11,12,0.6)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  playBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "var(--veyra-gradient)",
    color: "#fff",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  duration: {
    position: "absolute",
    bottom: 8,
    left: 8,
    background: "#0B0B0Ccc",
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 4,
  },
  cardTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.35,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    padding: "0 4px",
  },
};
