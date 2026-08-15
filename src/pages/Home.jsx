import { useAuth } from "../lib/AuthContext";
import { Link } from "react-router-dom";
import { SearchIcon, PlaylistIcon } from "../components/Icons";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1 style={styles.title}>Halo, {user?.username}</h1>
      <p style={styles.subtitle}>Mau dengarkan apa hari ini?</p>

      <div style={styles.cards}>
        <Link to="/search" style={styles.actionCard}>
          <div style={styles.actionIconWrap}>
            <SearchIcon size={24} />
          </div>
          <div>
            <p style={styles.actionLabel}>Cari Lagu</p>
            <p style={styles.actionDesc}>Telusuri koleksi musik</p>
          </div>
        </Link>
        <Link to="/playlists" style={styles.actionCard}>
          <div style={styles.actionIconWrap}>
            <PlaylistIcon size={24} />
          </div>
          <div>
            <p style={styles.actionLabel}>Playlist Saya</p>
            <p style={styles.actionDesc}>Lihat semua playlist</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" },
  subtitle: { fontSize: 14, color: "#8A8A8E", margin: "0 0 28px 0" },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 14,
  },
  actionCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#151517",
    border: "1px solid #1F1F21",
    borderRadius: 10,
    padding: "16px 18px",
    color: "#F2F2F0",
    textDecoration: "none",
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 8,
    background: "#1F1F21",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  actionLabel: { margin: "0 0 2px 0", fontSize: 14.5, fontWeight: 700 },
  actionDesc: { margin: 0, fontSize: 12, color: "#8A8A8E" },
};
