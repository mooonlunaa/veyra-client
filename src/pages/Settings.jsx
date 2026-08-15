import { useState, useRef } from "react";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import { profileApi, VEYRA_API } from "../lib/api";

const PRESETS = [
  { name: "Aurora", c1: "#7F00FF", c2: "#E100FF" },
  { name: "Sunset", c1: "#FF5F6D", c2: "#FFC371" },
  { name: "Ocean", c1: "#00C9FF", c2: "#92FE9D" },
  { name: "Emerald", c1: "#00B09B", c2: "#96C93D" },
  { name: "Berry", c1: "#4568DC", c2: "#B06AB3" },
  { name: "Flame", c1: "#F857A6", c2: "#FF5858" },
];

export default function Settings() {
  const { user, refresh } = useAuth();
  const { theme, setTheme, resetTheme } = useTheme();
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
    <div className="veyra-fade-in">
      <h1 style={styles.title}>Pengaturan</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Tema Warna</h2>
        <p style={styles.sectionDesc}>
          Atur gradasi warna aksen VEYRA (navbar aktif, tombol putar, progress bar) sesuai selera kamu.
        </p>

        <div
          style={{
            ...styles.themePreview,
            background: `linear-gradient(${theme.angle}deg, ${theme.color1}, ${theme.color2})`,
          }}
        />

        <div style={styles.colorRow}>
          <label style={styles.colorField}>
            <input
              type="color"
              value={theme.color1}
              onChange={(e) => setTheme({ color1: e.target.value })}
              style={styles.colorInput}
            />
            <span>Warna 1</span>
          </label>
          <label style={styles.colorField}>
            <input
              type="color"
              value={theme.color2}
              onChange={(e) => setTheme({ color2: e.target.value })}
              style={styles.colorInput}
            />
            <span>Warna 2</span>
          </label>
        </div>

        <label style={styles.sliderField}>
          <span style={styles.sliderLabel}>Sudut gradasi: {theme.angle}°</span>
          <input
            type="range"
            min="0"
            max="360"
            value={theme.angle}
            onChange={(e) => setTheme({ angle: Number(e.target.value) })}
            style={styles.slider}
          />
        </label>

        <p style={styles.presetLabel}>Preset cepat</p>
        <div style={styles.presetRow}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              style={{ ...styles.presetSwatch, background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
              onClick={() => setTheme({ color1: p.c1, color2: p.c2 })}
              title={p.name}
            />
          ))}
        </div>

        <button style={styles.smallBtnOutline} onClick={resetTheme}>
          Reset ke Default
        </button>
      </section>

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
  section: { maxWidth: 420, marginBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 4px 0" },
  sectionDesc: { fontSize: 13, color: "#8A8A8E", margin: "0 0 18px 0" },
  themePreview: { width: "100%", height: 64, borderRadius: 12, marginBottom: 18, border: "1px solid rgba(255,255,255,0.1)" },
  colorRow: { display: "flex", gap: 20, marginBottom: 18 },
  colorField: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 12, color: "#8A8A8E" },
  colorInput: { width: 48, height: 48 },
  sliderField: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  sliderLabel: { fontSize: 12.5, color: "#8A8A8E" },
  slider: { width: "100%" },
  presetLabel: { fontSize: 12.5, color: "#8A8A8E", margin: "0 0 10px 0" },
  presetRow: { display: "flex", gap: 10, marginBottom: 20 },
  presetSwatch: { width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", padding: 0 },
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
  smallBtn: { background: "var(--veyra-gradient)", color: "#fff", border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  smallBtnOutline: { background: "none", color: "#8A8A8E", border: "1px solid #262628", borderRadius: 6, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" },
  error: { color: "#E5675A", fontSize: 13, marginTop: 12 },
  success: { color: "#6FCF97", fontSize: 13, marginTop: 12 },
};
