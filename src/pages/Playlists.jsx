import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { playlistApi } from "../lib/api";
import { PlaylistIcon, PlusIcon, TrashIcon } from "../components/Icons";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPlaylists() {
    try {
      const data = await playlistApi.list();
      setPlaylists(data);
    } catch (err) {
      setError("Gagal memuat playlist.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await playlistApi.create(newName.trim());
      setNewName("");
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await playlistApi.remove(id);
      loadPlaylists();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 style={styles.title}>Playlist Saya</h1>

      <form onSubmit={handleCreate} style={styles.createForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nama playlist baru..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button style={styles.createBtn} type="submit">
          <PlusIcon size={16} />
          <span>Buat</span>
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.status}>Memuat...</p>}

      {!loading && playlists.length === 0 && (
        <div style={styles.empty}>
          <PlaylistIcon size={32} />
          <p style={styles.emptyText}>Belum ada playlist. Buat yang pertama di atas.</p>
        </div>
      )}

      <div style={styles.grid}>
        {playlists.map((pl) => (
          <div key={pl.id} style={styles.card}>
            <Link to={`/playlists/${pl.id}`} style={styles.cardLink}>
              <div style={styles.cardIcon}>
                <PlaylistIcon size={26} />
              </div>
              <p style={styles.cardTitle}>{pl.name}</p>
              <p style={styles.cardSub}>{pl.songCount} lagu</p>
            </Link>
            <button style={styles.deleteBtn} onClick={() => handleDelete(pl.id)}>
              <TrashIcon size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 24px 0" },
  createForm: { display: "flex", gap: 10, marginBottom: 28, maxWidth: 420 },
  input: {
    flex: 1,
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#F2F2F0",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  createBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#E5675A", fontSize: 13, marginBottom: 16 },
  status: { color: "#8A8A8E", fontSize: 14 },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "60px 0",
    color: "#8A8A8E",
  },
  emptyText: { fontSize: 14, margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
  },
  card: {
    position: "relative",
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 12,
  },
  cardLink: { display: "block", padding: 20, textDecoration: "none", color: "#F2F2F0" },
  cardIcon: { color: "#8A8A8E", marginBottom: 14 },
  cardTitle: { margin: "0 0 4px 0", fontSize: 14.5, fontWeight: 600 },
  cardSub: { margin: 0, fontSize: 12.5, color: "#8A8A8E" },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "none",
    border: "none",
    color: "#8A8A8E",
    cursor: "pointer",
    padding: 4,
  },
};
