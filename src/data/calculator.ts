/**
 * Modul: Berechnungslogik für den Azubi- & Service-Praxis-Rechner (calculator.ts)
 * Zweck: Pure, DOM-freie Berechnungen für Heizwasser-Volumenstrom, Sauggasüberhitzung,
 *   Flüssigkeitsunterkühlung und momentanen COP inkl. Praxis-Ampel-Bewertung.
 * Verantwortlichkeit: Liefert exakte Messwerte und normgerechte Diagnose-Hinweise.
 * Sicherheitsrelevanz: Verhindert Division durch Null und begrenzt Eingabewerte auf praxisnahe Bereiche.
 */

export type TrafficColor = "mint" | "peach" | "rose" | "sky";

export interface VolumeFlowResult {
  readonly lPerHour: number;
  readonly lPerMin: number;
  readonly m3PerHour: number;
  readonly statusColor: TrafficColor;
  readonly statusLabel: string;
  readonly statusDetail: string;
}

export interface ThermoDeltaResult {
  readonly deltaK: number;
  readonly statusColor: TrafficColor;
  readonly statusLabel: string;
  readonly statusDetail: string;
}

export interface CopResult {
  readonly cop: number;
  readonly ambientKw: number;
  readonly ambientPct: number;
  readonly electricPct: number;
  readonly statusColor: TrafficColor;
  readonly statusLabel: string;
  readonly plausibilityNote: string;
}

/**
 * Berechnet den benötigten Heizwasser-Volumenstrom aus Heizleistung (kW) und Spreizung (K).
 * Basis: c_Wasser ≈ 1,163 Wh/(kg·K) → Faktor 860 (1000 / 1,163).
 */
export function calculateVolumeFlow(heatingKw: number, deltaTK: number): VolumeFlowResult {
  const safeQ = Math.min(25, Math.max(3, heatingKw));
  const safeDt = Math.min(10, Math.max(2, deltaTK));
  const lPerHour = (safeQ * 860) / safeDt;
  const lPerMin = lPerHour / 60;
  const m3PerHour = lPerHour / 1000;

  if (safeDt >= 4 && safeDt <= 6) {
    return {
      lPerHour,
      lPerMin,
      m3PerHour,
      statusColor: "mint",
      statusLabel: "Optimal",
      statusDetail: "Optimal für Wärmepumpen-Verflüssiger (idealer Wärmeübergang & niedriger Pumpenstrom)."
    };
  }
  if (safeDt > 7) {
    return {
      lPerHour,
      lPerMin,
      m3PerHour,
      statusColor: "rose",
      statusLabel: "Durchfluss zu gering",
      statusDetail:
        "Durchfluss zu gering! Gefahr von Hochdruckstörung & schlechtem COP – Schmutzfänger, Pumpe und Ventile prüfen."
    };
  }
  if (safeDt < 3.5) {
    return {
      lPerHour,
      lPerMin,
      m3PerHour,
      statusColor: "peach",
      statusLabel: "Sehr hoher Volumenstrom",
      statusDetail:
        "Sehr hoher Volumenstrom – Pumpenstromverbrauch und mögliche Fließgeräusche in den Leitungen prüfen."
    };
  }
  return {
    lPerHour,
    lPerMin,
    m3PerHour,
    statusColor: "sky",
    statusLabel: "Toleranzbereich",
    statusDetail: "Noch akzeptabel; optimaler WP-Auslegungsbereich liegt bei ΔT = 4–6 K."
  };
}

/**
 * Berechnet die Sauggasüberhitzung ΔT_ÜH = t_Saug − t_0 am Verdampferaustritt.
 */
export function calculateSuperheat(t0: number, tSuction: number): ThermoDeltaResult {
  const deltaK = Math.round((tSuction - t0) * 10) / 10;

  if (deltaK >= 5 && deltaK <= 8) {
    return {
      deltaK,
      statusColor: "mint",
      statusLabel: "Optimal (5–8 K)",
      statusDetail:
        "Optimal – sicherer Schutz vor Flüssigkeitsschlägen bei gleichzeitig guter Verdampfernutzung."
    };
  }
  if (deltaK < 4) {
    return {
      deltaK,
      statusColor: "rose",
      statusLabel: "Zu niedrig (< 4 K)",
      statusDetail:
        "Zu niedrig! Akute Gefahr von Flüssigkeitsschlägen / nasser Verdichtung am Verdichter."
    };
  }
  if (deltaK > 10) {
    return {
      deltaK,
      statusColor: "peach",
      statusLabel: "Zu hoch (> 10 K)",
      statusDetail:
        "Zu hoch! Hinweis auf Kältemittelmangel, zu stark drosselndes EEV oder schlechte Wärmeaufnahme."
    };
  }
  return {
    deltaK,
    statusColor: "sky",
    statusLabel: "Grenzbereich",
    statusDetail: "Knapp außerhalb des Idealbereichs (Sollwert: 5–8 K am Verdampferaustritt)."
  };
}

/**
 * Berechnet die Unterkühlung ΔT_UK = t_c − t_Flüss am Verflüssigeraustritt vor dem EEV.
 */
export function calculateSubcooling(tc: number, tLiquid: number): ThermoDeltaResult {
  const deltaK = Math.round((tc - tLiquid) * 10) / 10;

  if (deltaK >= 3 && deltaK <= 7) {
    return {
      deltaK,
      statusColor: "mint",
      statusLabel: "Optimal (3–7 K)",
      statusDetail:
        "Optimal – reine Flüssigkeit vor dem Expansionsventil, kein Flashgas."
    };
  }
  if (deltaK < 2) {
    return {
      deltaK,
      statusColor: "rose",
      statusLabel: "Zu gering (< 2 K)",
      statusDetail:
        "Zu gering! Gefahr von Dampfblasen / Flashgas vor dem EEV → Leistungsverlust, Kältemittelfüllmenge prüfen."
    };
  }
  if (deltaK > 10) {
    return {
      deltaK,
      statusColor: "peach",
      statusLabel: "Sehr hoch (> 10 K)",
      statusDetail:
        "Sehr hoch! Hinweis auf Kältemittel-Überfüllung oder Rückstau im Verflüssiger."
    };
  }
  return {
    deltaK,
    statusColor: "sky",
    statusLabel: "Grenzbereich",
    statusDetail: "Knapp außerhalb des Idealbereichs (Sollwert: 3–7 K vor dem EEV)."
  };
}

/**
 * Berechnet den momentanen COP sowie den Anteil kostenloser Umweltwärme vs. Antriebsstrom.
 */
export function calculateCopMetrics(heatingKw: number, electricKw: number): CopResult {
  const safeQ = Math.min(30, Math.max(1, heatingKw));
  const safeP = Math.min(15, Math.max(0.3, electricKw));
  const cop = safeQ / safeP;
  const ambientKw = Math.max(0, safeQ - safeP);
  const ambientPct = safeQ > 0 ? (ambientKw / safeQ) * 100 : 0;
  const electricPct = Math.max(0, 100 - ambientPct);

  let plausibilityNote = "";
  if (cop > 6.5) {
    plausibilityNote =
      "Praxis-Hinweis: Extrem hoher Wert – im realen Heizbetrieb liegen Luft/Wasser-Wärmepumpen meist zwischen COP 2,5 und 5,5.";
  } else if (cop < 1.5) {
    plausibilityNote =
      "Praxis-Hinweis: Extrem niedriger COP (< 1,5) – prüfe Messwerte, Abtauung, Heizstab-Einsatz oder Kältemittelverlust.";
  }

  if (cop >= 4.0) {
    return {
      cop,
      ambientKw,
      ambientPct,
      electricPct,
      statusColor: "mint",
      statusLabel: "Sehr effizient (COP ≥ 4,0)",
      plausibilityNote
    };
  }
  if (cop >= 3.0) {
    return {
      cop,
      ambientKw,
      ambientPct,
      electricPct,
      statusColor: "sky",
      statusLabel: "Guter Betriebspunkt",
      plausibilityNote
    };
  }
  return {
    cop,
    ambientKw,
    ambientPct,
    electricPct,
    statusColor: cop < 1.5 ? "rose" : "peach",
    statusLabel: "Niedriger COP (Vorlauf / Abtauung prüfen)",
    plausibilityNote
  };
}
