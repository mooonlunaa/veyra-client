import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { ThemeProvider } from "./lib/ThemeContext";
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
import { pushRecentlyPlayed } from "./lib/recentlyPlayed";
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
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playToken, setPlayToken] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const audioRef = useRef(null);

  const current = currentIndex >= 0 ? queue[currentIndex] : null;

  function handlePlay(track, list, index) {
    setQueue(list);
    setCurrentIndex(index);
    setPlayToken((t) => t + 1);
    setIsPlaying(true);
    setExpanded(true);
  }

  function togglePlay() {
    if (!audioRef.current || !current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  function playNext() {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPlayToken((t) => t + 1);
      setIsPlaying(true);
    }
  }
  function playPrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPlayToken((t) => t + 1);
      setIsPlaying(true);
    }
  }
  function handleSeek(time) {
    if (audioRef.current) audioRef.current.currentTime = time;
  }
  function handleSelectQueueItem(index) {
    setCurrentIndex(index);
    setPlayToken((t) => t + 1);
    setIsPlaying(true);
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    el.pause();
    el.currentTime = 0;
    el.src = musicApi.streamUrl(current.id);
    el.load();
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    pushRecentlyPlayed(user?.username, current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playToken]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, queue]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home onPlay={handlePlay} /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search onPlay={handlePlay} /></ProtectedRoute>} />
        <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
        <Route path="/playlists/:id" element={<ProtectedRoute><PlaylistDetail onPlay={handlePlay} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>

      <audio ref={audioRef} />

      {current && (
        <div className="veyra-playerbar">
          <div style={styles.nowPlaying} onClick={() => setExpanded(true)}>
            <img src={current.thumbnail} alt="" style={styles.thumb} />
            <div style={{ minWidth: 0 }}>
              <p className="veyra-track-title" style={styles.trackTitle}>{current.title}</p>
              <p style={styles.trackTime}>
                {formatDuration(progress)} / {formatDuration(current.duration)}
              </p>
            </div>
          </div>
          <div style={styles.controls}>
            <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); playPrev(); }} disabled={currentIndex <= 0}>
              <PrevIcon />
            </button>
            <button style={styles.playBtn} onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
              {isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
            </button>
            <button style={styles.iconBtn} onClick={(e) => { e.stopPropagation(); playNext(); }} disabled={currentIndex >= queue.length - 1}>
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
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AuthRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const styles = {
  nowPlaying: { display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 },
  thumb: { width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 },
  trackTitle: {
    margin: "0 0 2px 0", fontSize: 13, fontWeight: 500, maxWidth: 260,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  trackTime: { margin: 0, fontSize: 11.5, color: "#8A8A8E" },
  controls: { display: "flex", alignItems: "center", gap: 14 },
  iconBtn: { background: "none", border: "none", color: "#F2F2F0", cursor: "pointer", padding: 4 },
  playBtn: {
    background: "var(--veyra-gradient)", color: "#fff", border: "none", borderRadius: "50%",
    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
};
