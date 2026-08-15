import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await register(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.brandMark} />
        <h1 style={styles.title}>Buat akun VEYRA</h1>
        <p style={styles.subtitle}>Mulai bangun playlist dan koleksi musikmu sendiri.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="3-20 karakter, huruf/angka/underscore"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input
              style={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p style={styles.footerText}>
          Sudah punya akun? <Link to="/login" style={styles.link}>Masuk</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0B0B0C",
    color: "#F2F2F0",
    fontFamily: "'Space Grotesk', sans-serif",
  },
  card: { width: 360, padding: "40px 32px" },
  brandMark: { width: 28, height: 28, background: "#F2F2F0", borderRadius: 7, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 700, margin: "0 0 6px 0" },
  subtitle: { fontSize: 13.5, color: "#8A8A8E", margin: "0 0 28px 0" },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12.5, color: "#8A8A8E", fontWeight: 500 },
  input: {
    background: "#151517",
    border: "1px solid #262628",
    borderRadius: 8,
    padding: "11px 14px",
    color: "#F2F2F0",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  error: { color: "#E5675A", fontSize: 13, margin: 0 },
  submitBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: 8,
    padding: "12px 0",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 6,
  },
  footerText: { fontSize: 13, color: "#8A8A8E", marginTop: 24 },
  link: { color: "#F2F2F0", fontWeight: 600, textDecoration: "none" },
};
