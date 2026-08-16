import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { VEYRA_API } from "../lib/api";
import Aurora from "./Aurora";
import { HomeIcon, SearchIcon, PlaylistIcon, UserIcon, SettingsIcon, LogoutIcon } from "./Icons";

const navItems = [
  { to: "/", label: "Beranda", icon: HomeIcon },
  { to: "/search", label: "Cari", icon: SearchIcon },
  { to: "/playlists", label: "Playlist", icon: PlaylistIcon },
  { to: "/profile", label: "Profil", icon: UserIcon },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  useTheme(); // memastikan provider terpasang & CSS var ter-set sebelum render
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const bgPath = user?.settings?.background_path;
  const shellStyle = {
    ...styles.shell,
    backgroundImage: bgPath
      ? `linear-gradient(180deg, rgba(11,11,12,0.55), rgba(11,11,12,0.9)), url(${VEYRA_API}/uploads/backgrounds/${bgPath})`
      : "none",
    backgroundSize: bgPath ? "cover" : "auto",
    backgroundPosition: "center",
    backgroundAttachment: bgPath ? "fixed" : "scroll",
    backgroundColor: "#0B0B0C",
  };

  return (
    <>
      {/* Aurora dimatikan kalau user sudah pasang background sendiri, biar gak numpuk */}
      {!bgPath && <Aurora />}

      <div style={shellStyle}>
        <aside className="veyra-sidebar">
          <div style={styles.brand}>
            <img src="/logo.jpg" alt="VEYRA" style={styles.brandMark} />
            <span style={{ ...styles.brandText, backgroundImage: "var(--veyra-gradient)" }}>VEYRA</span>
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
                    <img src={`${VEYRA_API}/uploads/avatars/${user.avatar_path}`} alt="" style={styles.avatarImg} />
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

        <main className="veyra-main">{children}</main>

        <nav className="veyra-bottomnav veyra-glass">
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
          <button style={styles.bottomNavItem} onClick={() => navigate("/settings")}>
            <SettingsIcon size={21} />
            <span style={styles.bottomNavLabel}>Atur</span>
          </button>
        </nav>
      </div>
    </>
  );
}

const styles = {
  shell: { display: "flex", minHeight: "100vh", color: "#F2F2F0", position: "relative", zIndex: 1 },
  brand: { display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 },
  brandMark: { width: 22, height: 22, borderRadius: 6, objectFit: "cover" },
  brandText: {
    fontSize: 17, fontWeight: 700, letterSpacing: "0.06em",
    backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8,
    color: "#8A8A8E", textDecoration: "none", fontSize: 14, fontWeight: 500,
    transition: "background 0.18s ease, color 0.18s ease",
  },
  navItemActive: { background: "var(--veyra-gradient)", color: "#fff" },
  userBox: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 12,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  avatarPlaceholder: {
    width: 30, height: 30, borderRadius: "50%", background: "#1C1C1E",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#8A8A8E", overflow: "hidden", flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  username: { fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  logoutBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", padding: 6 },
  bottomNavItem: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    background: "none", border: "none", textDecoration: "none", padding: "4px 10px", cursor: "pointer",
  },
  bottomNavLabel: { fontSize: 10.5, fontWeight: 500 },
};
