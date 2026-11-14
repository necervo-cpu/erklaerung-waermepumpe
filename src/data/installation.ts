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
    bannerTitle: "Aufstellung R290-Monoblock · Schutzzone & Kondensatsiphon beachten",
    bannerDesc:
      "R290 (Propan, Gruppe A3, UEG 1,7 Vol.-% / OEG 10,8 Vol.-%) ist schwerer als Luft und sinkt zu Boden. Schutzzone (am Gerät 1 m, am Boden kegel-/trapezförmig je nach Hersteller bis 1,5–3,0 m) frei von Öffnungen & Zündquellen halten! Wichtig: Kondensatleitung bei Kanalanschluss zwingend über einen frostsicheren Siphon (Geruchsverschluss) führen, damit kein Propan ins Abwassernetz gelangen kann!",
    badgeText: "R290 (A3) · Schutzbereich 1–3 m & Siphon-Pflicht",
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
    title: "R290-Schutzbereich (Kegel-/Trapezform bis 3 m)",
    summary:
      "R290 (Propan, Gruppe A3, schwerer als Luft, UEG 1,7 Vol.-% / OEG 10,8 Vol.-%) breitet sich im Leckagefall bodennah aus.",
    bullets: [
      "Die Schutzzone ist oft kegel-/trapezförmig: direkt am Gerät mind. 1 m, am Boden je nach Hersteller bis zu 1,5–3,0 m.",
      "Innerhalb der Zone sind Kellerschächte, Lichtschächte, Kellerfenster, Türen, ungesicherte Fallrohre sowie Zündquellen (Steckdosen, Lichtschalter, Klingeln) streng verboten.",
      "Abweichungen (z. B. Wandmontage oder Fenster oberhalb) nur exakt nach freigegebenem Hersteller-Schutzzonendiagramm."
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
      "Kondensat entweder frei ins frostfreie Kies-/Sickerbett (ca. 80 cm) abführen oder bei Anschluss an das Abwassernetz zwingend über einen frostsicheren Siphon (Geruchsverschluss) führen – damit bei R290-Leckage kein Propan in die Kanalisation strömt!",
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
