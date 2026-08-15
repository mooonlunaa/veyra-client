const API_BASE = "https://music.ranzxhosting.my.id"; // API musik (search/stream)
const VEYRA_API = "https://api.ranzxhosting.my.id"; // Backend VEYRA

async function request(base, path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

export const authApi = {
  register: (username, password) =>
    request(VEYRA_API, "/api/auth/register", { method: "POST", body: JSON.stringify({ username, password }) }),
  login: (username, password) =>
    request(VEYRA_API, "/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request(VEYRA_API, "/api/auth/logout", { method: "POST" }),
  me: () => request(VEYRA_API, "/api/auth/me"),
};

export const profileApi = {
  get: () => request(VEYRA_API, "/api/profile"),
  updateUsername: (username) =>
    request(VEYRA_API, "/api/profile/username", { method: "PATCH", body: JSON.stringify({ username }) }),
  uploadAvatar: async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const res = await fetch(`${VEYRA_API}/api/profile/avatar`, { method: "POST", credentials: "include", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal upload");
    return data;
  },
  deleteAvatar: () => request(VEYRA_API, "/api/profile/avatar", { method: "DELETE" }),
  uploadBackground: async (file) => {
    const form = new FormData();
    form.append("background", file);
    const res = await fetch(`${VEYRA_API}/api/profile/background`, { method: "POST", credentials: "include", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal upload");
    return data;
  },
  deleteBackground: () => request(VEYRA_API, "/api/profile/background", { method: "DELETE" }),
};

export const playlistApi = {
  list: () => request(VEYRA_API, "/api/playlists"),
  get: (id) => request(VEYRA_API, `/api/playlists/${id}`),
  create: (name) => request(VEYRA_API, "/api/playlists", { method: "POST", body: JSON.stringify({ name }) }),
  rename: (id, name) => request(VEYRA_API, `/api/playlists/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
  remove: (id) => request(VEYRA_API, `/api/playlists/${id}`, { method: "DELETE" }),
  addSong: (id, song) =>
    request(VEYRA_API, `/api/playlists/${id}/songs`, {
      method: "POST",
      body: JSON.stringify({ songId: song.id, title: song.title, thumbnail: song.thumbnail, duration: song.duration }),
    }),
  removeSong: (id, songRowId) =>
    request(VEYRA_API, `/api/playlists/${id}/songs/${songRowId}`, { method: "DELETE" }),
};

export const musicApi = {
  search: async (q) => {
    const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error("Gagal mencari lagu");
    return res.json();
  },
  streamUrl: (id) => `${API_BASE}/api/stream/${id}`,
};

export { VEYRA_API, API_BASE };
