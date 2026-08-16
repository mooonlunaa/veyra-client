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
  const [tab, setTab] = useState("theme");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  async function uploadBackground(file) {
    setError("");
    setMessage("");
    try {
      await profileApi.uploadBackground(file);
      await refresh();
      setMessage("Background berhasil diperbarui.");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleBackgroundChange(e) {
    const file = e.target.files[0];
    if (file) uploadBackground(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadBackground(file);
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

      <div style={styles.tabs}>
        <button className={`veyra-settings-tab${tab === "theme" ? " active" : ""}`} onClick={() => setTab("theme")}>
          Tema Warna
        </button>
        <button className={`veyra-settings-tab${tab === "bg" ? " active" : ""}`} onClick={() => setTab("bg")}>
          Background
        </button>
      </div>

      {tab === "theme" && (
        <section style={styles.pane}>
          <p style={styles.desc}>Atur gradasi warna aksen VEYRA — dipakai di navbar aktif, tombol putar, dan progress bar.</p>

          <div style={{ ...styles.previewBar, background: `linear-gradient(${theme.angle}deg, ${theme.color1}, ${theme.color2})` }} />

          <div style={styles.colorRow}>
            <label style={styles.colorField}>
              <input type="color" value={theme.color1} onChange={(e) => setTheme({ color1: e.target.value })} style={styles.colorInput} />
              <span>Warna 1</span>
            </label>
            <label style={styles.colorField}>
              <input type="color" value={theme.color2} onChange={(e) => setTheme({ color2: e.target.value })} style={styles.colorInput} />
              <span>Warna 2</span>
            </label>
          </div>

          <label style={styles.sliderField}>
            <span style={styles.sliderLabel}>Sudut gradasi: {theme.angle}°</span>
            <input type="range" min="0" max="360" value={theme.angle} onChange={(e) => setTheme({ angle: Number(e.target.value) })} style={styles.slider} />
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

          <button className="veyra-glass-btn" onClick={resetTheme}>Reset ke Default</button>
        </section>
      )}

      {tab === "bg" && (
        <section style={styles.pane}>
          <p style={styles.desc}>Background ini hanya berlaku untuk akunmu sendiri. Kaca navbar &amp; player otomatis menyesuaikan supaya tetap kebaca.</p>

          <div style={styles.bgPreview}>
            {bgPath ? (
              <img src={`${VEYRA_API}/uploads/backgrounds/${bgPath}`} alt="" style={styles.bgImg} />
            ) : (
              <span style={styles.bgEmptyLabel}>Belum ada background</span>
            )}
            <div className="veyra-glass" style={styles.miniDemo}>Contoh: navbar kaca di atas background ini</div>
          </div>

          <div
            className={`veyra-dropzone${dragOver ? " drag" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8A8A8E" strokeWidth="1.6" style={{ marginBottom: 10 }}>
              <path d="M12 16V4M12 4 7 9M12 4l5 5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p style={styles.dzMain}>Klik atau tarik gambar ke sini</p>
            <p style={styles.dzSub}>JPG atau PNG, maks 5MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleBackgroundChange} style={{ display: "none" }} />

          {bgPath && (
            <button className="veyra-glass-btn" onClick={handleDeleteBackground}>Hapus Background</button>
          )}

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}
        </section>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: 26, fontWeight: 700, margin: "0 0 20px 0" },
  tabs: { display: "flex", gap: 8, marginBottom: 26 },
  pane: { maxWidth: 460 },
  desc: { fontSize: 13, color: "#8A8A8E", margin: "0 0 20px 0" },
  previewBar: { width: "100%", height: 68, borderRadius: 14, marginBottom: 20, border: "1px solid rgba(255,255,255,0.1)" },
  colorRow: { display: "flex", gap: 22, marginBottom: 18 },
  colorField: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 12, color: "#8A8A8E" },
  colorInput: { width: 48, height: 48 },
  sliderField: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  sliderLabel: { fontSize: 12.5, color: "#8A8A8E" },
  slider: { width: "100%" },
  presetLabel: { fontSize: 12.5, color: "#8A8A8E", margin: "0 0 10px 0" },
  presetRow: { display: "flex", gap: 10, marginBottom: 20 },
  presetSwatch: { width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", padding: 0 },
  bgPreview: {
    position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden",
    marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center",
    background: "#151517", border: "1px solid rgba(255,255,255,0.1)",
  },
  bgImg: { width: "100%", height: "100%", objectFit: "cover" },
  bgEmptyLabel: { color: "#8A8A8E", fontSize: 13 },
  miniDemo: { position: "absolute", bottom: 10, left: 10, right: 10, padding: "10px 14px", borderRadius: 10, fontSize: 11, color: "#8A8A8E" },
  dzMain: { margin: "0 0 4px 0", color: "#F2F2F0", fontWeight: 600, fontSize: 13 },
  dzSub: { margin: 0, color: "#8A8A8E", fontSize: 12.5 },
  error: { color: "#E5675A", fontSize: 13, marginTop: 14 },
  success: { color: "#6FCF97", fontSize: 13, marginTop: 14 },
};
