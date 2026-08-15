import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NowPlaying from "./pages/NowPlaying";
import { musicApi } from "./lib/api";
import { PlayIcon, PauseIcon, NextIcon, PrevIcon } from "./components/Icons";

function formatDuration(sec = 0) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#8A8A8E", padding: 40 }}>Memuat...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);

  const current = currentIndex >= 0 ? queue[currentIndex] : null;

  function handlePlay(track, list, index) {
    setQueue(list);
    setCurrentIndex(index);
    setIsPlaying(true);
    setExpanded(true);
  }

  function togglePlay() {
    if (!audioRef.current || !current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function playNext() {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  }
  function playPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  }
  function handleSeek(time) {
    if (audioRef.current) audioRef.current.currentTime = time;
  }
  function handleSelectQueueItem(index) {
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = musicApi.streamUrl(current.id);
    audioRef.current.play().catch(() => {});
  }, [currentIndex]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.currentTime);
    const onEnded = () => playNext();
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, queue]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search onPlay={handlePlay} /></ProtectedRoute>} />
        <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
        <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistDetail onPlay={handlePlay} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>

      <audio ref={audioRef} />

      {current && (
        <div style={styles.playerBar}>
          <div style={styles.nowPlaying} onClick={() => setExpanded(true)}>
            <img src={current.thumbnail} alt="" style={styles.thumb} />
            <div style={{ minWidth: 0 }}>
              <p style={styles.trackTitle}>{current.title}</p>
              <p style={styles.trackTime}>
                {formatDuration(progress)} / {formatDuration(current.duration)}
              </p>
            </div>
          </div>
          <div style={styles.controls}>
            <button
              style={styles.iconBtn}
              onClick={(e) => { e.stopPropagation(); playPrev(); }}
              disabled={currentIndex <= 0}
            >
              <PrevIcon />
            </button>
            <button
              style={styles.playBtn}
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            >
              {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            </button>
            <button
              style={styles.iconBtn}
              onClick={(e) => { e.stopPropagation(); playNext(); }}
              disabled={currentIndex >= queue.length - 1}
            >
              <NextIcon />
            </button>
          </div>
        </div>
      )}

      {expanded && current && (
        <NowPlaying
          track={current}
          queue={queue}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          progress={progress}
          onTogglePlay={togglePlay}
          onNext={playNext}
          onPrev={playPrev}
          onSeek={handleSeek}
          onClose={() => setExpanded(false)}
          onSelectQueueItem={handleSelectQueueItem}
        />
      )}
    </Layout>
  );
}

function AuthRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#8A8A8E", padding: 40 }}>Memuat...</div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

const styles = {
  playerBar: {
    position: "fixed",
    bottom: 0,
    left: 220,
    right: 0,
    background: "#101012",
    borderTop: "1px solid #1C1C1E",
    padding: "12px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  nowPlaying: { display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 },
  thumb: { width: 40, height: 40, borderRadius: 6, objectFit: "cover", flexShrink: 0 },
  trackTitle: {
    margin: "0 0 2px 0",
    fontSize: 13,
    fontWeight: 500,
    maxWidth: 260,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  trackTime: { margin: 0, fontSize: 11.5, color: "#8A8A8E" },
  controls: { display: "flex", alignItems: "center", gap: 14 },
  iconBtn: { background: "none", border: "none", color: "#F2F2F0", cursor: "pointer", padding: 4 },
  playBtn: {
    background: "#F2F2F0",
    color: "#0B0B0C",
    border: "none",
    borderRadius: "50%",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};
