import { useState, useEffect } from "react";
import { playlistApi } from "../lib/api";
import { PlusIcon, PlaylistIcon, CloseIcon } from "./Icons";

export default function AddToPlaylistMenu({ track, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedTo, setAddedTo] = useState(() => new Set());
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    playlistApi
      .list()
      .then(setPlaylists)
      .catch(() => setError("Gagal memuat playlist."))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(pl) {
    if (addedTo.has(pl.id)) return;
    try {
      await playlistApi.addSong(pl.id, track);
      setAddedTo((prev) => new Set(prev).add(pl.id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateAndAdd(e) {
    e.preventDefault();
    if (!newName.trim() || creating) return;
    setCreating(true);
    setError("");
    try {
      const pl = await playlistApi.create(newName.trim());
      await playlistApi.addSong(pl.id, track);
      setPlaylists((prev) => [{ ...pl, songCount: 1 }, ...prev]);
      setAddedTo((prev) => new Set(prev).add(pl.id));
      setNewName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ minWidth: 0 }}>
            <p style={styles.title}>Tambah ke Playlist</p>
            <p style={styles.trackName}>{track.title}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleCreateAndAdd} style={styles.createRow}>
          <input
            style={styles.input}
            placeholder="Buat playlist baru..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button style={styles.createBtn} type="submit" disabled={creating}>
            <PlusIcon size={15} />
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
        {loading && <p style={styles.status}>Memuat playlist...</p>}
        {!loading && playlists.length === 0 && (
          <p style={styles.status}>Belum ada playlist. Buat satu di atas.</p>
        )}

        <div style={styles.list}>
          {playlists.map((pl) => {
            const added = addedTo.has(pl.id);
            return (
              <button
                key={pl.id}
                style={styles.row}
                onClick={() => handleAdd(pl)}
                disabled={added}
              >
                <span style={styles.rowIcon}>
                  <PlaylistIcon size={16} />
                </span>
                <span style={styles.rowName}>{pl.name}</span>
                <span style={added ? styles.addedBadge : styles.addBadge}>
                  {added ? "Ditambahkan" : "Tambah"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 200,
  },
  sheet: {
    width: "100%",
    maxWidth: 420,
    maxHeight: "70vh",
    background: "rgba(20,20,23,0.92)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px 18px 0 0",
    padding: "18px 18px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    color: "#F2F2F0",
  },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  title: { margin: "0 0 2px 0", fontSize: 15, fontWeight: 700 },
  trackName: {
    margin: 0,
    fontSize: 12.5,
    color: "#8A8A8E",
    maxWidth: 280,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "none",
    borderRadius: "50%",
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#F2F2F0",
    cursor: "pointer",
    flexShrink: 0,
  },
  createRow: { display: "flex", gap: 8 },
  input: {
    flex: 1,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "10px 12px",
    color: "#F2F2F0",
    fontSize: 13.5,
    outline: "none",
    fontFamily: "inherit",
  },
  createBtn: {
    background: "var(--veyra-gradient)",
    border: "none",
    borderRadius: 8,
    width: 40,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  error: { color: "#E5675A", fontSize: 12.5, margin: 0 },
  status: { color: "#8A8A8E", fontSize: 13, margin: 0 },
  list: { display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "none",
    border: "none",
    borderRadius: 8,
    padding: "10px 8px",
    color: "#F2F2F0",
    cursor: "pointer",
    textAlign: "left",
  },
  rowIcon: { color: "#8A8A8E", flexShrink: 0 },
  rowName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  addBadge: { fontSize: 11.5, fontWeight: 600, color: "#8A8A8E" },
  addedBadge: { fontSize: 11.5, fontWeight: 600, color: "#6FCF97" },
};
