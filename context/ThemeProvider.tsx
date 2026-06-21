"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "dl-theme";

interface ThemeContextValue {
  theme: ThemeChoice;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function apply(resolved: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Initialise from storage on mount.
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      (localStorage.getItem(STORAGE_KEY) as ThemeChoice | null)) || "system";
    setThemeState(stored);
  }, []);

  // Resolve + apply whenever the choice changes; track system changes too.
  useEffect(() => {
    const resolve = (): ResolvedTheme =>
      theme === "system" ? (systemPrefersDark() ? "dark" : "light") : theme;

    const update = () => {
      const r = resolve();
      setResolvedTheme(r);
      apply(r);
    };
    update();

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
  }, [theme]);

  const setTheme = useCallback((t: ThemeChoice) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/**
 * Inline script (run before paint in <head>) to set data-theme and avoid a
 * flash of the wrong theme. Stringified and injected via dangerouslySetInnerHTML.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;el.setAttribute('data-theme',d?'dark':'light');el.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
