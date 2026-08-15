import { useState, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { profileApi, VEYRA_API } from "../lib/api";
import { UserIcon } from "../components/Icons";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    try {
      await profileApi.uploadAvatar(file);
      await refresh();
      setMessage("Avatar berhasil diperbarui.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteAvatar() {
    try {
      await profileApi.deleteAvatar();
      await refresh();
      setMessage("Avatar dihapus.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUsernameSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await profileApi.updateUsername(newUsername);
      await refresh();
      setMessage("Username berhasil diperbarui.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 style={styles.title}>Profil</h1>

      <div style={styles.avatarSection}>
        <div style={styles.avatarWrap} onClick={() => fileInputRef.current?.click()}>
          {user?.avatar_path ? (
            <img src={`${VEYRA_API}/uploads/avatars/${user.avatar_path}`} alt="" style={styles.avatarImg} />
          ) : (
            <UserIcon size={30} />
          )}
        </div>
        <div>
          <button style={styles.smallBtn} onClick={() => fileInputRef.current?.click()}>
            Ganti Foto
          </button>
          {user?.avatar_path && (
            <button style={styles.smallBtnOutline} onClick={handleDeleteAvatar}>
              Hapus
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
      </div>

      <form onSubmit={handleUsernameSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
        <button style={styles.submitBtn} type="submit">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 28px 0" },
  avatarSection: { display: "flex", alignItems: "center", gap: 20, marginBottom: 36 },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#151517",
    border: "1px solid #262628",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#8A8A8E",
    cursor: "pointer",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  smallBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    marginRight: 8,
  },
  smallBtnOutline: {
    background: "none",
    color: "#8A8A8E",
    border: "1px solid #262628",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  form: { display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12.5, color: "#8A8A8E", fontWeight: 500 },
  input: {
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#F2F2F0",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  error: { color: "#E5675A", fontSize: 13, margin: 0 },
  success: { color: "#6FCF97", fontSize: 13, margin: 0 },
  submitBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: 8,
    padding: "11px 0",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
