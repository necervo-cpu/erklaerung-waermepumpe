/**
 * Modul: 3-Stufen-Darstellungsmodus Initialisierung & Steuerung (theme-init.ts)
 * Zweck: FOUC-freie Initialisierung und zyklische Steuerung des Apple Liquid Glass Themes ('auto' | 'light' | 'dark').
 * Verantwortlichkeit: Liest und persistiert die Nutzerwahl in localStorage und synchronisiert das data-theme-Attribut auf <html>.
 * Sicherheits- & Stabilitätsrelevanz:
 *   1. Komplett ohne Inline-Skripte ausführbar (erlaubt strikte CSP ohne 'unsafe-inline').
 *   2. Strikte Whitelist-Validierung des gespeicherten Wertes (Type-Guard gegen DOM-Manipulation).
 *   3. Gekapselte try/catch-Zugriffe auf localStorage (verhindert Abstürze im iOS Safari Privatmodus).
 */

export type ThemeMode = "auto" | "light" | "dark";

const THEME_STORAGE_KEY = "app-theme-mode-v2";

/**
 * Prüft per Type-Guard, ob ein unbekannter Wert ein gültiger ThemeMode ist.
 */
export function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === "auto" || value === "light" || value === "dark";
}

/**
 * Liest den gespeicherten Darstellungsmodus aus localStorage.
 * Fällt bei deaktiviertem Storage (z. B. iOS Privatmodus) oder Erstaufruf sicher auf 'dark' (#000000) zurück.
 */
export function getStoredThemeMode(): ThemeMode {
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isValidThemeMode(raw) ? raw : "dark";
  } catch {
    // Im iOS Safari Privatmodus oder bei restriktiver CSP auf Fallback zurückfallen
    return "dark";
  }
}

/**
 * Wendet den übergebenen Darstellungsmodus auf das Wurzelelement (<html>) an
 * und speichert die Einstellung fehlerresistent.
 */
export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Im iOS Safari Privatmodus oder bei blockierten Cookies wird nur der In-Memory-DOM-Zustand genutzt
  }
}

/**
 * Zyklischer Wechsel für den 3-Stufen-Header-Button: Auto -> Hell -> Dunkel -> Auto.
 */
export function cycleThemeMode(current: ThemeMode): ThemeMode {
  const next: ThemeMode =
    current === "auto" ? "light" : current === "light" ? "dark" : "auto";
  applyThemeMode(next);
  return next;
}

/**
 * Ermittelt das lesbare Label für den Theme-Umschalter.
 */
export function getThemeModeLabel(mode: ThemeMode): string {
  switch (mode) {
    case "light":
      return "Hell";
    case "dark":
      return "Dunkel";
    case "auto":
    default:
      return "Auto";
  }
}

// Sofortige FOUC-Vermeidung beim Modulstart
if (typeof document !== "undefined") {
  applyThemeMode(getStoredThemeMode());
}
