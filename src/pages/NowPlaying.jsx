import {
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  ShuffleIcon,
  RepeatIcon,
  MoreIcon,
} from "../components/Icons";

function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NowPlaying({
  track,
  queue,
  currentIndex,
  isPlaying,
  progress,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onClose,
  onSelectQueueItem,
}) {
  if (!track) return null;

  const duration = track.duration || 0;
  const upNext = queue.slice(currentIndex + 1);

  function handleSeekClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(ratio * duration);
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <button style={styles.iconBtn} onClick={onClose}>
          <ChevronDownIcon size={22} />
        </button>
        <span style={styles.brandText}>VEYRA</span>
        <button style={styles.iconBtn}>
          <MoreIcon size={20} />
        </button>
      </div>

      <div style={styles.artWrap}>
        <img src={track.thumbnail} alt="" style={styles.art} />
      </div>

      <div style={styles.meta}>
        <p style={styles.title}>{track.title}</p>
        <p style={styles.subtitle}>Diputar dari VEYRA</p>
      </div>

      <div style={styles.progressRow} onClick={handleSeekClick}>
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${duration ? (progress / duration) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
      <div style={styles.timeRow}>
        <span style={styles.timeLabel}>{formatDuration(progress)}</span>
        <span style={styles.timeLabel}>{formatDuration(duration)}</span>
      </div>

      <div style={styles.controls}>
        <button style={styles.smallIconBtn}>
          <ShuffleIcon size={18} />
        </button>
        <button style={styles.iconBtn} onClick={onPrev} disabled={currentIndex <= 0}>
          <PrevIcon size={24} />
        </button>
        <button style={styles.playBtn} onClick={onTogglePlay}>
          {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </button>
        <button style={styles.iconBtn} onClick={onNext} disabled={currentIndex >= queue.length - 1}>
          <NextIcon size={24} />
        </button>
        <button style={styles.smallIconBtn}>
          <RepeatIcon size={18} />
        </button>
      </div>

      {upNext.length > 0 && (
        <div style={styles.upNextSection}>
          <p style={styles.upNextTitle}>Berikutnya</p>
          <div style={styles.upNextList}>
            {upNext.map((item, i) => (
              <div
                key={item.id + i}
                style={styles.upNextRow}
                onClick={() => onSelectQueueItem(currentIndex + 1 + i)}
              >
                <img src={item.thumbnail} alt="" style={styles.upNextThumb} />
                <p style={styles.upNextItemTitle}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: "fixed",
    inset: 0,
    background: "#0B0B0C",
    color: "#F2F2F0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 24px 32px",
    zIndex: 100,
    overflowY: "auto",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  brandText: { fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "#8A8A8E" },
  iconBtn: { background: "none", border: "none", color: "#F2F2F0", cursor: "pointer", padding: 6 },
  smallIconBtn: { background: "none", border: "none", color: "#8A8A8E", cursor: "pointer", padding: 6 },
  artWrap: {
    width: "100%",
    maxWidth: 360,
    aspectRatio: "1 / 1",
    margin: "0 auto 28px",
    borderRadius: 12,
    overflow: "hidden",
    background: "#151517",
  },
  art: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  meta: { textAlign: "center", marginBottom: 20 },
  title: { fontSize: 19, fontWeight: 700, margin: "0 0 4px 0" },
  subtitle: { fontSize: 13, color: "#8A8A8E", margin: 0 },
  progressRow: { maxWidth: 400, width: "100%", margin: "0 auto", cursor: "pointer", padding: "8px 0" },
  progressTrack: { height: 4, background: "#262628", borderRadius: 2, position: "relative" },
  progressFill: { height: "100%", background: "#F2F2F0", borderRadius: 2 },
  timeRow: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 400,
    width: "100%",
    margin: "0 auto 24px",
  },
  timeLabel: { fontSize: 11.5, color: "#8A8A8E" },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 22,
    marginBottom: 40,
  },
  playBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: "50%",
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  upNextSection: { maxWidth: 480, width: "100%", margin: "0 auto" },
  upNextTitle: { fontSize: 13, fontWeight: 600, color: "#8A8A8E", marginBottom: 12 },
  upNextList: { display: "flex", flexDirection: "column", gap: 10 },
  upNextRow: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
  upNextThumb: { width: 42, height: 42, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  upNextItemTitle: {
    margin: 0,
    fontSize: 13.5,
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
