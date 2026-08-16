const KEY_PREFIX = "veyra_search_history_";
const MAX_ITEMS = 8;

export function getSearchHistory(username) {
  if (!username) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY_PREFIX + username)) || [];
  } catch {
    return [];
  }
}

export function pushSearchHistory(username, query) {
  const q = query.trim();
  if (!username || !q) return getSearchHistory(username);
  let list = getSearchHistory(username).filter((x) => x.toLowerCase() !== q.toLowerCase());
  list.unshift(q);
  list = list.slice(0, MAX_ITEMS);
  localStorage.setItem(KEY_PREFIX + username, JSON.stringify(list));
  return list;
}

export function removeSearchHistoryItem(username, query) {
  if (!username) return [];
  const list = getSearchHistory(username).filter((x) => x !== query);
  localStorage.setItem(KEY_PREFIX + username, JSON.stringify(list));
  return list;
}

export function clearSearchHistory(username) {
  if (!username) return;
  localStorage.setItem(KEY_PREFIX + username, JSON.stringify([]));
}
