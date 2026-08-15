import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { VEYRA_API } from "../lib/api";
import { HomeIcon, SearchIcon, PlaylistIcon, UserIcon, SettingsIcon, LogoutIcon } from "./Icons";

const navItems = [
  { to: "/", label: "Beranda", icon: HomeIcon },
  { to: "/search", label: "Cari", icon: SearchIcon },
  { to: "/playlists", label: "Playlist", icon: PlaylistIcon },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div style={styles.shell}>
      <aside className="veyra-sidebar">
        <div style={styles.brand}>
          <img src="/logo.jpg" alt="VEYRA" style={styles.brandMark} />
          <span style={styles.brandText}>VEYRA</span>
        </div>

        <nav style={styles.nav}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.libraryCard}>
          <p style={styles.libraryTitle}>Playlist Kamu</p>
          <p style={styles.libraryDesc}>Semua koleksi lagu tersimpan di satu tempat.</p>
          <NavLink to="/playlists" style={styles.libraryBtn}>
            Buka Playlist
          </NavLink>
        </div>

        {user && (
          <div style={styles.userBox}>
            <button style={styles.userRow} onClick={() => navigate("/profile")}>
              <div style={styles.avatarPlaceholder}>
                {user.avatar_path ? (
                  <img
                    src={`${VEYRA_API}/uploads/avatars/${user.avatar_path}`}
                    alt=""
                    style={styles.avatarImg}
                  />
                ) : (
                  <UserIcon size={16} />
                )}
              </div>
              <span style={styles.username}>{user.username}</span>
            </button>
            <div style={{ display: "flex", gap: 2 }}>
              <button style={styles.iconOnlyBtn} onClick={() => navigate("/settings")} title="Pengaturan">
                <SettingsIcon size={17} />
              </button>
              <button style={styles.iconOnlyBtn} onClick={handleLogout} title="Keluar">
                <LogoutIcon size={17} />
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="veyra-main">{children}</main>

      <nav className="veyra-bottomnav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              ...styles.bottomNavItem,
              color: isActive ? "#F2F2F0" : "#6C6C70",
            })}
          >
            <Icon size={21} />
            <span style={styles.bottomNavLabel}>{label}</span>
          </NavLink>
        ))}
        <button style={styles.bottomNavItem} onClick={() => navigate("/profile")}>
          <UserIcon size={21} />
          <span style={styles.bottomNavLabel}>Profil</span>
        </button>
        <button style={styles.bottomNavItem} onClick={() => navigate("/settings")}>
          <SettingsIcon size={21} />
          <span style={styles.bottomNavLabel}>Atur</span>
        </button>
      </nav>
    </div>
  );
}

const styles = {
  shell: { display: "flex", minHeight: "100vh", background: "#0B0B0C", color: "#F2F2F0" },
  brand: { display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", marginBottom: 24 },
  brandMark: { width: 26, height: 26, borderRadius: 6, objectFit: "cover" },
  brandText: { fontSize: 18, fontWeight: 700, letterSpacing: "0.06em" },
  nav: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 12px",
    borderRadius: 8,
    color: "#A7A7AB",
    textDecoration: "none",
    fontSize: 14.5,
    fontWeight: 600,
  },
  navItemActive: { background: "#181818", color: "#F2F2F0" },
  libraryCard: {
    background: "#151517",
    borderRadius: 10,
    padding: "16px",
    marginBottom: 16,
  },
  libraryTitle: { margin: "0 0 6px 0", fontSize: 13.5, fontWeight: 700 },
  libraryDesc: { margin: "0 0 14px 0", fontSize: 12, color: "#A7A7AB", lineHeight: 1.4 },
  libraryBtn: {
    display: "inline-block",
    background: "#F2F2F0",
    color: "#0B0B0C",
    fontSize: 12.5,
    fontWeight: 700,
    padding: "8px 16px",
    borderRadius: 20,
    textDecoration: "none",
  },
  userBox: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
    borderTop: "1px solid #1C1C1E",
    paddingTop: 14,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#1C1C1E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8A8A8E",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  username: {
    fontSize: 13,
    fontWeight: 600,
    color: "#F2F2F0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  iconOnlyBtn: { background: "none", border: "none", color: "#A7A7AB", cursor: "pointer", padding: 6 },
  bottomNavItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    background: "none",
    border: "none",
    textDecoration: "none",
    padding: "4px 8px",
    cursor: "pointer",
  },
  bottomNavLabel: { fontSize: 10, fontWeight: 500 },
};
