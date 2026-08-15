import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { VEYRA_API } from "../lib/api";
import { HomeIcon, SearchIcon, PlaylistIcon, UserIcon, SettingsIcon, LogoutIcon } from "./Icons";

const navItems = [
  { to: "/", label: "Beranda", icon: HomeIcon },
  { to: "/search", label: "Cari", icon: SearchIcon },
  { to: "/playlists", label: "Playlist", icon: PlaylistIcon },
  { to: "/profile", label: "Profil", icon: UserIcon },
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
      <aside style={styles.sidebar}>
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
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        {user && (
          <div style={styles.userBox}>
            <div style={styles.userRow}>
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
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              <button style={styles.logoutBtn} onClick={() => navigate("/settings")} title="Pengaturan">
                <SettingsIcon size={16} />
              </button>
              <button style={styles.logoutBtn} onClick={handleLogout} title="Keluar">
                <LogoutIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  shell: { display: "flex", minHeight: "100vh", background: "#0B0B0C", color: "#F2F2F0" },
  sidebar: {
    width: 220,
    borderRight: "1px solid #1C1C1E",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    position: "sticky",
    top: 0,
    height: "100vh",
  },
  brand: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 },
  brandMark: { width: 22, height: 22, borderRadius: 5, objectFit: "cover" },
  brandText: { fontSize: 17, fontWeight: 700, letterSpacing: "0.06em" },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 8,
    color: "#8A8A8E",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
  },
  navItemActive: { background: "#1C1C1E", color: "#F2F2F0" },
  userBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 8px",
    borderTop: "1px solid #1C1C1E",
    marginTop: 12,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
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
  username: { fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  logoutBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", padding: 6 },
  main: { flex: 1, padding: "32px 40px", overflowY: "auto", paddingBottom: 100 },
};
