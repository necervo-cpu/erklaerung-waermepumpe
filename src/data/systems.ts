/**
 * Modul: Fachdaten der Wärmepumpen-Systemkonfigurationen (systems.ts)
 * Zweck: Definition der systemspezifischen Parameter für Monoblock (R290) und Split (R32/R410A).
 * Verantwortlichkeit: Enthält Kältemittel-Sicherheitsklassen, F-Gase-Hinweise und SVG-Zonengeometrie.
 * Sicherheitsrelevanz: Fachlich exakte Unterscheidung von A3 (brennbar, hermetisch) und A2L/A1 (F-Gase-Sachkunde).
 */

import type { SystemConfig, SystemType } from "../types/circuit";

/**
 * Konfigurationsdaten für Monoblock- und Split-Wärmepumpen.
 * Die Koordinaten spiegeln die Position der Wanddurchführung im SVG-Flussdiagramm wider.
 */
export const SYSTEMS: Record<SystemType, SystemConfig> = {
  monoblock: {
    name: "Monoblock-Wärmepumpe",
    refrigerant: "R290 (Propan)",
    headerText: "Monoblock-Bauart · R290 (Propan)",
    bannerTitle: "Monoblock-Wärmepumpe · Kältekreis komplett in der Außeneinheit",
    bannerDesc:
      "R290 (Propan, Sicherheitsgruppe A3): Hermetisch geschlossener Kältekreis ab Werk. Schutzzone / Sicherheitsabstände im Außenbereich einhalten. Kein Eingriff am Kältekreis bei der Montage – nur Heizungswasser (Vorlauf/Rücklauf) führt durch die Gebäudehülle.",
    badgeText: "R290 · A3 · Hermetisch",
    badgeClass: "r290",
    bannerClass: "is-r290",
    boundaryX: 735,
    outdoorWidth: 714,
    indoorX: 752,
    indoorWidth: 152,
    outdoorLabel: "AUSSENEINHEIT (KOMPLETTER KÄLTEKREIS)",
    indoorLabel: "GEBÄUDE / INNEN"
  },
  split: {
    name: "Split-Wärmepumpe",
    refrigerant: "R32 / R410A",
    headerText: "Split-Bauart · R32 / R410A",
    bannerTitle: "Split-Wärmepumpe · Trennung in Außeneinheit & Inneneinheit (Hydromodul)",
    bannerDesc:
      "R32 (A2L) / R410A (A1): F-Gase-Sachkunde zwingend erforderlich. Heißgas- und Flüssigkeitsleitung werden bauseits über Bördel- oder Lötverbindungen durch die Gebäudehülle verlegt. Stickstoff-Druckprüfung & Evakuierung bei Inbetriebnahme.",
    badgeText: "R32/R410A · F-Gase-Pflicht",
    badgeClass: "r32",
    bannerClass: "is-r32",
    boundaryX: 540,
    outdoorWidth: 518,
    indoorX: 556,
    indoorWidth: 348,
    outdoorLabel: "AUSSENEINHEIT",
    indoorLabel: "INNENEINHEIT / HYDROMODUL"
  }
};
