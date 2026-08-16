import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { musicApi } from "../lib/api";
import { getSearchHistory, pushSearchHistory, removeSearchHistoryItem, clearSearchHistory } from "../lib/searchHistory";
import { SearchIcon, PlayIcon, PlusIcon } from "../components/Icons";
import AddToPlaylistMenu from "../components/AddToPlaylistMenu";

function formatDuration(sec) {
  if (!sec && sec !== 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Search({ onPlay }) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addTarget, setAddTarget] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [brokenIds, setBrokenIds] = useState(() => new Set());

  useEffect(() => {
    setHistory(getSearchHistory(user?.username));
  }, [user?.username]);

  // Dukung deep-link dari kartu mood di Home: /search?q=...
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      runSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function runSearch(q) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setShowHistory(false);
    try {
      const data = await musicApi.search(q);
      setResults(data);
      setBrokenIds(new Set());
    } catch (err) {
      setError("Gagal memuat hasil pencarian.");
    } finally {
      setLoading(false);
    }
    setHistory(pushSearchHistory(user?.username, q));
  }

  function handleSearch(e) {
    e.preventDefault();
    runSearch(query);
  }

  function handleHistoryClick(q) {
    setQuery(q);
    runSearch(q);
  }

  function handleRemoveHistory(q) {
    setHistory(removeSearchHistoryItem(user?.username, q));
  }

  function handleClearHistory() {
    clearSearchHistory(user?.username);
    setHistory([]);
  }

  function handleClearQuery() {
    setQuery("");
    setResults([]);
    setShowHistory(true);
  }

  return (
    <div className="veyra-fade-in">
      <h1 style={styles.title}>Cari Musik</h1>

      <form onSubmit={handleSearch} className="veyra-glass" style={styles.searchBar}>
        <SearchIcon size={17} />
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Cari judul lagu atau artis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (!query) setShowHistory(true); }}
        />
        {query && (
          <button type="button" style={styles.clearBtn} onClick={handleClearQuery} title="Bersihkan">✕</button>
        )}
      </form>

      {showHistory && (
        <div style={styles.historyBlock}>
          <div style={styles.historyHead}>
            <span style={styles.historyLabel}>Pencarian terakhir</span>
            {history.length > 0 && (
              <button style={styles.historyClearAll} onClick={handleClearHistory}>Hapus semua</button>
            )}
          </div>
          {history.length === 0 ? (
            <p style={styles.historyEmpty}>Belum ada riwayat pencarian.</p>
          ) : (
            <div style={styles.historyChips}>
              {history.map((q) => (
                <div key={q} className="veyra-history-chip veyra-glass" onClick={() => handleHistoryClick(q)}>
                  <span>{q}</span>
                  <button className="x" onClick={(e) => { e.stopPropagation(); handleRemoveHistory(q); }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && <p style={styles.status}>Mencari...</p>}
      {error && <p style={{ ...styles.status, color: "#E5675A" }}>{error}</p>}

      <div className="veyra-grid" style={styles.grid}>
        {results.map((track, i) => {
          const key = track.id + i;
          const broken = brokenIds.has(key);
          return (
            <div key={key} className="veyra-glass-card" style={styles.card}>
              <div className={`veyra-thumb-wrap${broken ? " broken" : ""}`} style={styles.thumbWrap}>
                <img
                  src={track.thumbnail}
                  alt=""
                  style={styles.thumb}
                  onError={() => setBrokenIds((prev) => new Set(prev).add(key))}
                />
                <div className="veyra-thumb-fallback">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                  <span>Sampul tidak tersedia</span>
                </div>
                <button style={styles.addBtn} onClick={(e) => { e.stopPropagation(); setAddTarget(track); }} title="Tambah ke playlist">
                  <PlusIcon size={14} />
                </button>
                <button style={styles.playBtn} onClick={() => onPlay(track, results, i)}>
                  <PlayIcon size={20} />
                </button>
                <span style={styles.duration}>{formatDuration(track.duration)}</span>
              </div>
              <p style={styles.cardTitle}>{track.title}</p>
            </div>
          );
        })}
      </div>

      {addTarget && <AddToPlaylistMenu track={addTarget} onClose={() => setAddTarget(null)} />}
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 20px 0" },
  searchBar: { display: "flex", alignItems: "center", gap: 10, borderRadius: "999px", padding: "13px 18px", maxWidth: 520, marginBottom: 6 },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#F2F2F0", fontSize: 14.5, fontFamily: "inherit" },
  clearBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", fontSize: 13, padding: 2 },
  historyBlock: { maxWidth: 640, margin: "16px 0 28px 0" },
  historyHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  historyLabel: { fontSize: 12.5, color: "#8A8A8E", fontWeight: 600 },
  historyClearAll: { background: "none", border: "none", color: "#8A8A8E", fontSize: 12, cursor: "pointer", textDecoration: "underline" },
  historyChips: { display: "flex", flexWrap: "wrap", gap: 8 },
  historyEmpty: { fontSize: 12.5, color: "#8A8A8E" },
  status: { color: "#8A8A8E", fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 18 },
  card: { cursor: "pointer", padding: 8 },
  thumbWrap: { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden", background: "#151517", marginBottom: 10 },
  thumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  addBtn: {
    position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%",
    background: "rgba(11,11,12,0.6)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  playBtn: {
    position: "absolute", bottom: 8, right: 8, width: 34, height: 34, borderRadius: "50%",
    background: "var(--veyra-gradient)", color: "#fff", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  duration: { position: "absolute", bottom: 8, left: 8, background: "#0B0B0Ccc", fontSize: 11, padding: "2px 6px", borderRadius: 4 },
  cardTitle: {
    margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 1.35,
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", padding: "0 4px",
  },
};
