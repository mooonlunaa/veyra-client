export default function Aurora() {
  return (
    <div style={styles.wrap} aria-hidden="true">
      <span style={{ ...styles.blob, width: 520, height: 520, top: -180, left: -120, background: "var(--veyra-c1)" }} />
      <span style={{ ...styles.blob, width: 460, height: 460, top: "10%", right: -160, background: "var(--veyra-c2)", animationDelay: "-6s" }} />
      <span style={{ ...styles.blob, width: 380, height: 380, bottom: -160, left: "22%", background: "var(--veyra-c1)", opacity: 0.22, animationDelay: "-12s" }} />
    </div>
  );
}

const styles = {
  wrap: { position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" },
  blob: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.35,
    animation: "veyraDrift 22s ease-in-out infinite alternate",
  },
};
