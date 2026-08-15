import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { playlistApi } from "../lib/api";
import { PlayIcon, TrashIcon, PlusIcon } from "../components/Icons";
import AddToPlaylistMenu from "../components/AddToPlaylistMenu";

function formatDuration(sec) {
  if (!sec && sec !== 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistDetail({ onPlay }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState("");
  const [addTarget, setAddTarget] = useState(null);

  async function load() {
    try {
      const data = await playlistApi.get(id);
      setPlaylist(data);
    } catch (err) {
      setError("Playlist tidak ditemukan.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleRemoveSong(songRowId) {
    try {
      await playlistApi.removeSong(id, songRowId);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function handlePlayAll(startIndex) {
    if (!playlist) return;
    const queue = playlist.songs.map((s) => ({ id: s.song_id, title: s.title, thumbnail: s.thumbnail, duration: s.duration }));
    onPlay(queue[startIndex], queue, startIndex);
  }

  if (error) return <p style={styles.error}>{error}</p>;
  if (!playlist) return <p style={styles.status}>Memuat...</p>;

  return (
    <div className="veyra-fade-in">
      <button style={styles.backBtn} onClick={() => navigate("/playlists")}>
        Kembali
      </button>
      <h1 style={styles.title}>{playlist.name}</h1>
      <p style={styles.subtitle}>{playlist.songs.length} lagu</p>

      {playlist.songs.length === 0 && (
        <p style={styles.empty}>Belum ada lagu. Tambahkan dari halaman Cari.</p>
      )}

      <div style={styles.list}>
        {playlist.songs.map((song, i) => (
          <div key={song.id} className="veyra-glass-card" style={styles.row}>
            <button style={styles.playIconBtn} onClick={() => handlePlayAll(i)}>
              <PlayIcon size={15} />
            </button>
            <img src={song.thumbnail} alt="" style={styles.thumb} />
            <div style={styles.info}>
              <p style={styles.songTitle}>{song.title}</p>
              <p style={styles.songDuration}>{formatDuration(song.duration)}</p>
            </div>
            <button
              style={styles.addBtn}
              onClick={() => setAddTarget({ id: song.song_id, title: song.title, thumbnail: song.thumbnail, duration: song.duration })}
              title="Tambah ke playlist lain"
            >
              <PlusIcon size={14} />
            </button>
            <button style={styles.trashBtn} onClick={() => handleRemoveSong(song.id)}>
              <TrashIcon size={15} />
            </button>
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
  backBtn: {
    background: "none",
    border: "none",
    color: "#8A8A8E",
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 4px 0" },
  subtitle: { fontSize: 13.5, color: "#8A8A8E", margin: "0 0 28px 0" },
  status: { color: "#8A8A8E", fontSize: 14 },
  error: { color: "#E5675A", fontSize: 14 },
  empty: { color: "#8A8A8E", fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 6 },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 12px",
    borderRadius: 10,
  },
  playIconBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
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
  thumb: { width: 42, height: 42, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  info: { flex: 1, minWidth: 0 },
  songTitle: {
    margin: "0 0 2px 0",
    fontSize: 13.5,
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  songDuration: { margin: 0, fontSize: 12, color: "#8A8A8E" },
  addBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", padding: 4 },
  trashBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", padding: 4 },
};
