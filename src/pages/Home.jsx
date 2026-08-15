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
          <SearchIcon size={22} />
          <span style={styles.actionLabel}>Cari Lagu</span>
        </Link>
        <Link to="/playlists" style={styles.actionCard}>
          <PlaylistIcon size={22} />
          <span style={styles.actionLabel}>Playlist Saya</span>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 28, fontWeight: 700, margin: "0 0 6px 0" },
  subtitle: { fontSize: 14, color: "#8A8A8E", margin: "0 0 32px 0" },
  cards: { display: "flex", gap: 16 },
  actionCard: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 12,
    padding: "24px",
    width: 180,
    color: "#F2F2F0",
    textDecoration: "none",
  },
  actionLabel: { fontSize: 14, fontWeight: 600 },
};
