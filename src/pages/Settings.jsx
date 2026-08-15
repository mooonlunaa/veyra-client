import { useState, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { profileApi, VEYRA_API } from "../lib/api";

export default function Settings() {
  const { user, refresh } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  async function handleBackgroundChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    try {
      await profileApi.uploadBackground(file);
      await refresh();
      setMessage("Background berhasil diperbarui.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteBackground() {
    try {
      await profileApi.deleteBackground();
      await refresh();
      setMessage("Background dihapus, kembali ke default.");
    } catch (err) {
      setError(err.message);
    }
  }

  const bgPath = user?.settings?.background_path;

  return (
    <div>
      <h1 style={styles.title}>Pengaturan</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Background Tampilan</h2>
        <p style={styles.sectionDesc}>Background ini hanya berlaku untuk akunmu sendiri.</p>

        <div style={styles.bgPreview}>
          {bgPath ? (
            <img src={`${VEYRA_API}/uploads/backgrounds/${bgPath}`} alt="" style={styles.bgImg} />
          ) : (
            <span style={styles.bgPlaceholder}>Belum ada background</span>
          )}
        </div>

        <div style={styles.btnRow}>
          <button style={styles.smallBtn} onClick={() => fileInputRef.current?.click()}>
            Unggah Background
          </button>
          {bgPath && (
            <button style={styles.smallBtnOutline} onClick={handleDeleteBackground}>
              Hapus
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleBackgroundChange}
          style={{ display: "none" }}
        />

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}
      </section>
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 28px 0" },
  section: { maxWidth: 420 },
  sectionTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 4px 0" },
  sectionDesc: { fontSize: 13, color: "#8A8A8E", margin: "0 0 18px 0" },
  bgPreview: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 10,
    background: "#151517",
    border: "1px solid #262628",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 16,
  },
  bgImg: { width: "100%", height: "100%", objectFit: "cover" },
  bgPlaceholder: { color: "#8A8A8E", fontSize: 13 },
  btnRow: { display: "flex", gap: 8 },
  smallBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  smallBtnOutline: {
    background: "none",
    color: "#8A8A8E",
    border: "1px solid #262628",
    borderRadius: 6,
    padding: "9px 16px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { color: "#E5675A", fontSize: 13, marginTop: 12 },
  success: { color: "#6FCF97", fontSize: 13, marginTop: 12 },
};
