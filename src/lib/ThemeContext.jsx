import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "veyra_theme";

const DEFAULT_THEME = {
  color1: "#7F00FF",
  color2: "#E100FF",
  angle: 135,
};

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_THEME, ...JSON.parse(saved) };
  } catch {
    // storage rusak, pakai default
  }
  return DEFAULT_THEME;
}

function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.style.setProperty("--veyra-c1", theme.color1);
  root.style.setProperty("--veyra-c2", theme.color2);
  root.style.setProperty("--veyra-angle", `${theme.angle}deg`);
  root.style.setProperty(
    "--veyra-gradient",
    `linear-gradient(${theme.angle}deg, ${theme.color1}, ${theme.color2})`
  );
}

export function hexToRgba(hex, alpha = 1) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(loadTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  function setTheme(patch) {
    setThemeState((prev) => ({ ...prev, ...patch }));
  }

  function resetTheme() {
    setThemeState(DEFAULT_THEME);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam ThemeProvider");
  return ctx;
    }
