# Projekt-Design-Guideline (`DESIGN.md`)

> **Design-System:** Apple Human Interface Guidelines (HIG) & Apple Liquid Glass  
> **Darstellungsmodi:** 3-Stufen-System (`Auto` / `Hell` / `Dunkel`)

---

## 1. Farben (Color Palette)

### Marken- & Akzentfarben
- **Primär- / Akzentfarbe (`--brand-accent`):** `#0071E3` (Hell) / `#2997FF` (Dunkel)
- **Akzent-Text / Kontrast (`--brand-accent-text`):** `#0051A8` (Hell) / `#64B5F6` (Dunkel)
- **Tonal Tile / Badge (`--tile`):** `rgba(0, 113, 227, 0.10)` (Hell) / `rgba(41, 151, 255, 0.16)` (Dunkel)

### Zustandsfarben Kältekreis
- **Heißgas (HD, gasförmig, heiß):** `#FF3B30`
- **Flüssigkeitsleitung (HD, flüssig, unterkühlt):** `#FF9500`
- **Nassdampf (ND, Gemisch, kalt):** `#32ADE6`
- **Sauggas (ND, gasförmig, überhitzt):** `#007AFF`
- **Heizungswasser Rücklauf:** `#2AC7B8`
- **Heizungswasser Vorlauf:** `#FF6B35`

### Oberflächen & Glas-Schichten (Hell-Modus)
- **Basis-Hintergrund (`--bg`):** `#F5F5F7`
- **Glas-Karte (`--glass`):** `rgba(255, 255, 255, 0.72)`
- **Hero- / Dock-Glas (`--glass-hero`):** `rgba(255, 255, 255, 0.84)`
- **Eingabefeld / Sub-Well (`--input-bg`):** `rgba(255, 255, 255, 0.56)`
- **Primärtext (`--ink`):** `#1D1D1F`
- **Sekundärtext (`--muted`):** `#515154`

### Oberflächen & Glas-Schichten (Dunkel-Modus)
- **Basis-Hintergrund (`--bg`):** `#0D0D0F`
- **Glas-Karte (`--glass`):** `rgba(28, 28, 32, 0.68)`
- **Hero- / Dock-Glas (`--glass-hero`):** `rgba(18, 18, 22, 0.82)`
- **Eingabefeld / Sub-Well (`--input-bg`):** `rgba(18, 18, 22, 0.65)`
- **Primärtext (`--ink`):** `#F5F5F7`
- **Sekundärtext (`--muted`):** `#A1A1A6`

---

## 2. Schriften (Typography)

- **UI- & Fließtext (`--font-sans`):** `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Plus Jakarta Sans", "Segoe UI", sans-serif`
- **Zahlen, Messwerte & Code (`--font-mono`):** `"SF Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
- **Zahlen-Formatierung:** Alle Druck-, Temperatur- und Differenzwerte nutzen `font-variant-numeric: tabular-nums`.
