/**
 * Modul: Fachdaten für Aufstellung, R290-Schutzzonen & Schallschutz (installation.ts)
 * Zweck: Azubi-Leitfaden zur sicheren Standortwahl von Luft/Wasser- und Luft/Luft-Außeneinheiten
 *   nach R290-Sicherheitsregeln (A3), TA Lärm und Frostschutz-Regeln.
 * Verantwortlichkeit: Stellt System-Konfigurationen und 4 Praxis-Checkkarten bereit.
 * Sicherheitsrelevanz: Verhindert Zündgefahr bei R290-Leckagen (Schutzzonen um Fenster/Abflüsse) und Schallbeschwerden.
 */

import type { InstallSystemType } from "../types/circuit";

export interface InstallSystemConfig {
  readonly id: InstallSystemType;
  readonly label: string;
  readonly bannerTitle: string;
  readonly bannerDesc: string;
  readonly badgeText: string;
  readonly badgeColor: "mint" | "sky";
}

export interface InstallRuleCard {
  readonly id: string;
  readonly icon: string;
  readonly badge: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export const INSTALL_SYSTEMS: Readonly<Record<InstallSystemType, InstallSystemConfig>> = {
  r290: {
    id: "r290",
    label: "Luft/Wasser Monoblock (R290 · A3)",
    bannerTitle: "Aufstellung R290-Monoblock · Schutzzone & Kondensat beachten",
    bannerDesc:
      "R290 (Propan, Gruppe A3) ist schwerer als Luft und sinkt bei einer Leckage zu Boden. Schutzzone rund um die Außeneinheit frei von Öffnungen und Zündquellen halten!",
    badgeText: "R290 · A3 · Schutzzone 1 m",
    badgeColor: "mint"
  },
  r32: {
    id: "r32",
    label: "Luft/Luft Außeneinheit (R32 · A2L)",
    bannerTitle: "Aufstellung Split-Klima / VRF (R32) · Luftführung & Schallschutz",
    bannerDesc:
      "Bei Luft/Luft-Außeneinheiten stehen freier Ausblasweg, Schwingungsentkopplung (Wandkonsole / BigFoots) und sauberer Kondensatablauf im Vordergrund.",
    badgeText: "R32 · A2L · TA Lärm",
    badgeColor: "sky"
  }
};

export const INSTALL_RULES: readonly InstallRuleCard[] = [
  {
    id: "r290-zone",
    icon: "shield",
    badge: "Sicherheit · A3",
    title: "R290-Schutzbereich (mind. 1 m rundum)",
    summary:
      "Propan hat eine höhere Dichte als Luft und sammelt sich am Boden oder in Vertiefungen.",
    bullets: [
      "Keine zu öffnenden Fenster, Türen, Kellerlichtschächte oder Lüftungsschächte innerhalb der Hersteller-Schutzzone (meist 1 m seitlich/vorne).",
      "Keine ungeschützten Abflüsse, Gullys oder Zündquellen (Steckdosen, Lichtschalter, Gartenleuchten) im Schutzbereich.",
      "Abweichungen (z. B. Fenster oberhalb) nur nach exakt dokumentierter Herstellerfreigabe."
    ]
  },
  {
    id: "ta-laerm",
    icon: "volume_up",
    badge: "TA Lärm",
    title: "Schallschutz & Nachbarabstände",
    summary:
      "Gerade nachts sind tieffrequente Kompressor- und Lüftergeräusche eine häufige Beschwerdeursache.",
    bullets: [
      "Im reinen/allgemeinen Wohngebiet gelten nachts (22–06 Uhr) strenge Immissionsrichtwerte (oft 35–40 dB(A) am Nachbarfenster).",
      "Außeneinheit niemals in schallharte Mauerecken (Nischen) oder direkt unter Schlafzimmerfenster stellen (+3 bis +6 dB Reflexion!).",
      "Ausblasrichtung vom Nachbarfenster wegdrehen und Silent-/Nachtmodus in der Regelung aktivieren."
    ]
  },
  {
    id: "condensate",
    icon: "water_drop",
    badge: "Fundament & Frost",
    title: "Fundament, Entkopplung & Kondensat",
    summary:
      "Beim Abtauen fallen pro Tag 20–50 Liter Kondenswasser an – friert es ein, bildet sich eine Eisplatte.",
    bullets: [
      "Streifenfundament oder Betonplatten frostfrei gründen und Schwingungsdämpfer (Gummipuffer / BigFoots) montieren.",
      "Kondensat über ein Kies-/Sickerbett unterhalb der Frostgrenze (ca. 80 cm) abführen oder frostsicher mit Begleitheizung verlegen.",
      "Bei Wandkonsolen von Split-Geräten auf körperschallentkoppelte Dübel und Gummipuffer achten."
    ]
  },
  {
    id: "airflow",
    icon: "air",
    badge: "Luftführung",
    title: "Wandabstände & thermischer Kurzschluss",
    summary:
      "Saugt die Außeneinheit ihre eigene kalte Abluft (Heizbetrieb) oder heiße Abluft (Kühlbetrieb) wieder an, bricht die Effizienz ein.",
    bullets: [
      "Ansaugabstand zur Hauswand gemäß Hersteller einhalten (meist 30–50 cm) für ungehinderte Luftzufuhr.",
      "Ausblasseite frei halten (mind. 2–3 m keine dichte Hecke oder Mauer), damit die kalte Luft abströmen kann.",
      "Hauptwindrichtung beachten: Starke Gegenwinde gegen den Ventilator stören den Abtauvorgang."
    ]
  }
];
