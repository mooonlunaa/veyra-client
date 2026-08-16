const KEY_PREFIX = "veyra_recent_";
const MAX_ITEMS = 14;

export function getRecentlyPlayed(username) {
  if (!username) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFIX + username)) || [];
  } catch {
    return [];
  }
}

export function pushRecentlyPlayed(username, track) {
  if (!username || !track?.id) return;
  const list = getRecentlyPlayed(username).filter((t) => t.id !== track.id);
  list.unshift({
    id: track.id,
    title: track.title,
    thumbnail: track.thumbnail,
    duration: track.duration,
  });
  localStorage.setItem(KEY_PREFIX + username, JSON.stringify(list.slice(0, MAX_ITEMS)));
}
