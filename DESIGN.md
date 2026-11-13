# Projekt-Design-Guideline (`DESIGN.md`)

> **Design-System:** Apple Human Interface Guidelines (HIG) & Apple Liquid Glass  
> **Farbstandard:** Verbindliche globale Farbpalette `FARBPALETTE.md` (Pastell auf Schwarz)  
> **Darstellungsmodi:** 3-Stufen-System (`Auto` / `Hell` / `Dunkel`) – Dunkel-Modus ist Standard (`#000000`)

---

## 1. Farben (Color Palette)

Gemäß globaler `FARBPALETTE.md`. Dunkel-Modus ist Standard mit reinem OLED-Schwarz (`#000000`).
Neutrale Flächen (Karten, Felder, Hover) sind einfarbige Grautöne ohne Verlauf. Pastellfarben und Verläufe (135° für Flächen, 90° für Fortschrittsbalken) dienen ausschließlich Akzenten und Hervorhebungen.
Text auf Pastellflächen oder Verläufen ist immer dunkel (`#1C1C1E`, `--text-on-accent`), in beiden Modi.

### 1.1 Neutrale Flächen & Text

| Rolle | Token | Dunkel (Standard) | Hell (`data-theme="light"`) |
| :--- | :--- | :--- | :--- |
| Hintergrund | `--bg` | `#000000` | `#F2F2F7` |
| Karte | `--surface-card` | `#1C1C1E` | `#FFFFFF` |
| Feld / Sub-Well | `--surface-field` | `#2C2C2E` | `#F2F2F7` |
| Hover | `--surface-hover` | `#3A3A3C` | `#E5E5EA` |
| Gedrückt | `--surface-active` | `#48484A` | `#D1D1D6` |
| Kartenrand | `--border` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.06)` |
| Kartenschatten | `--shadow-card` | `none` | `0 1px 3px rgba(0, 0, 0, 0.08)` |
| Text primär | `--text-primary` | `#FFFFFF` | `#000000` |
| Text sekundär | `--text-secondary` | `rgba(235, 235, 245, 0.6)` | `rgba(60, 60, 67, 0.7)` |
| Text tertiär | `--text-tertiary` | `rgba(235, 235, 245, 0.3)` | `rgba(60, 60, 67, 0.3)` |
| Text auf Akzent | `--text-on-accent` | `#1C1C1E` | `#1C1C1E` |

### 1.2 Die 10 Pastellfarben

| Nr. | Name | Token | Hex |
| :--- | :--- | :--- | :--- |
| 1 | Rosé | `--pastel-rose` | `#F7B8C4` |
| 2 | Pfirsich | `--pastel-peach` | `#F9C6A5` |
| 3 | Butter | `--pastel-butter` | `#F6E3A1` |
| 4 | Limette | `--pastel-lime` | `#D3EBA4` |
| 5 | Minze | `--pastel-mint` | `#A8E6C3` |
| 6 | Aqua | `--pastel-aqua` | `#A0E3E0` |
| 7 | Himmel | `--pastel-sky` | `#A9D4F5` |
| 8 | Periwinkle | `--pastel-periwinkle` | `#B3BDF7` |
| 9 | Lavendel | `--pastel-lavender` | `#CDB5F5` |
| 10 | Orchidee | `--pastel-orchid` | `#EDB4E6` |

### 1.3 Die 10 Verläufe (Fläche 135°, Balken 90°)

| Nr. | Name | Token | Verlauf |
| :--- | :--- | :--- | :--- |
| 1 | Sunrise | `--gradient-sunrise` | `#F7B8C4` → `#F9C6A5` |
| 2 | Honig | `--gradient-honey` | `#F9C6A5` → `#F6E3A1` |
| 3 | Frühling | `--gradient-spring` | `#F6E3A1` → `#D3EBA4` |
| 4 | Wiese | `--gradient-meadow` | `#D3EBA4` → `#A8E6C3` |
| 5 | Lagune | `--gradient-lagoon` | `#A8E6C3` → `#A0E3E0` → `#A9D4F5` |
| 6 | Ozean | `--gradient-ocean` | `#A0E3E0` → `#B3BDF7` |
| 7 | Dämmerung | `--gradient-dusk` | `#A9D4F5` → `#CDB5F5` |
| 8 | Iris | `--gradient-iris` | `#B3BDF7` → `#EDB4E6` |
| 9 | Blüte | `--gradient-blossom` | `#CDB5F5` → `#F7B8C4` |
| 10 | Sorbet | `--gradient-sorbet` | `#F6E3A1` → `#F7B8C4` → `#CDB5F5` |

### 1.4 Akzent als Textfarbe (`--accent-text-*`)

WCAG-AA-konform (mindestens 4,9:1 auf `#F2F2F7` und 5,1:1 auf `#FFFFFF` im Hell-Modus):

| Name | Token | Dunkel | Hell |
| :--- | :--- | :--- | :--- |
| Rosé | `--accent-text-rose` | `#F7B8C4` | `#B8405A` |
| Pfirsich | `--accent-text-peach` | `#F9C6A5` | `#A35320` |
| Butter | `--accent-text-butter` | `#F6E3A1` | `#7D620A` |
| Limette | `--accent-text-lime` | `#D3EBA4` | `#527018` |
| Minze | `--accent-text-mint` | `#A8E6C3` | `#1F7A4D` |
| Aqua | `--accent-text-aqua` | `#A0E3E0` | `#177A76` |
| Himmel | `--accent-text-sky` | `#A9D4F5` | `#1F6AA8` |
| Periwinkle | `--accent-text-periwinkle` | `#B3BDF7` | `#4553C4` |
| Lavendel | `--accent-text-lavender` | `#CDB5F5` | `#7046C2` |
| Orchidee | `--accent-text-orchid` | `#EDB4E6` | `#A53A98` |

### 1.5 Zuordnung der Kältekreis-Zustandsfarben

- **Heißgas (HD, gasförmig, heiß):** `--pastel-rose` (Fläche) / `--accent-text-rose` (Text, Linien, Marker)
- **Flüssigkeitsleitung (HD, flüssig, unterkühlt):** `--pastel-peach` (Fläche) / `--accent-text-peach` (Text, Linien, Marker)
- **Nassdampf (ND, Gemisch, kalt):** `--pastel-aqua` (Fläche) / `--accent-text-aqua` (Text, Linien, Marker)
- **Sauggas (ND, gasförmig, überhitzt):** `--pastel-sky` (Fläche) / `--accent-text-sky` (Text, Linien, Marker)
- **Heizungswasser Vorlauf:** `--pastel-butter` (Fläche) / `--accent-text-butter` (Text, Linien, Marker)
- **Heizungswasser Rücklauf:** `--pastel-mint` (Fläche) / `--accent-text-mint` (Text, Linien, Marker)
- **Indikator / OK (Schauglas, Monoblock R290):** `--pastel-lime` (Fläche) / `--accent-text-lime` (Text, Linien, Marker)

---

## 2. Schriften (Typography)

- **UI- & Fließtext (`--font-sans`):** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Segoe UI", sans-serif`
- **Zahlen, Messwerte & Code (`--font-mono`):** `"SF Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
- **Zahlen-Formatierung:** Alle Druck-, Temperatur- und Differenzwerte nutzen `font-variant-numeric: tabular-nums`.

---

## 3. Icons (Antigravity Icon Guideline)

- **Symbol-Set:** Ausschließlich **Google Material Symbols Rounded** über den Google-Fonts-Import in `index.html` und Text-Ligatur `<span class="ag-icon">...</span>`. Keine fremden Icon-Bibliotheken, Emojis oder handgezeichneten Inline-`<svg>`-Icons (technische Fachdiagramme wie `#circuitSvg` ausgenommen).
- **4 feste Größen:** `.ag-icon--xs` (`16px`, `opsz 20`), `.ag-icon--sm` (`20px`, `opsz 20`), `.ag-icon` Standard (`24px`, `opsz 24`), `.ag-icon--lg` (`32px`, `opsz 40`).
- **4 Google-Achsen:** `wght` `300` (Standard) / `400` (Hover & Active), `FILL` `0` (Inaktiv) / `1` (Aktiv), `GRAD` `-25` (Dark Mode) / `0` (Light Mode), `opsz` passend zur Größenstufe.
- **Glow:** Ausschließlich `filter: drop-shadow(...)` auf aktiven Icons (`.ag-icon--active`), niemals `box-shadow`. Basis-CSS liegt in [liquid-glass-tokens.css](file:///Users/necervo/Desktop/Erkl%C3%A4rung%20K%C3%A4ltekreis/src/styles/liquid-glass-tokens.css).
