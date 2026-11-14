/**
 * Modul: Fachdaten der Kältekreis-Systemkonfigurationen (systems.ts)
 * Zweck: Definition der systemspezifischen Parameter für Wärmepumpen (Monoblock/Split) sowie Split-Klima & VRV/VRF.
 * Verantwortlichkeit: Enthält Kältemittel-Sicherheitsklassen, F-Gase-/EN-378-Hinweise und SVG-Zonengeometrie.
 * Sicherheitsrelevanz: Fachlich exakte Unterscheidung von A3 (brennbar, hermetisch), A2L/A1 (F-Gase-Sachkunde) und EN 378.
 */

import type { SystemConfig, SystemType } from "../types/circuit";

/**
 * Konfigurationsdaten für Wärmepumpen sowie Split-Klima- und VRV/VRF-Systeme.
 * Die Koordinaten spiegeln die Position der Wanddurchführung im SVG-Flussdiagramm wider.
 */
export const SYSTEMS: Record<SystemType, SystemConfig> = {
  monoblock: {
    category: "heatpump",
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
    indoorLabel: "GEBÄUDE / INNEN",
    refCondition: {
      heating: "Referenz: Heizbetrieb A2 / W35",
      cooling: "Referenz: Kühlbetrieb A35 / W18",
      defrost: "Referenz: Abtauphase (Kreislaufumkehr)"
    }
  },
  split: {
    category: "heatpump",
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
    indoorLabel: "INNENEINHEIT / HYDROMODUL",
    refCondition: {
      heating: "Referenz: Heizbetrieb A2 / W35",
      cooling: "Referenz: Kühlbetrieb A35 / W18",
      defrost: "Referenz: Abtauphase (Kreislaufumkehr)"
    }
  },
  klimasplit: {
    category: "hvac",
    name: "Split-Klimaanlage (Single / Multi)",
    refrigerant: "R32 (Difluormethan)",
    headerText: "Split-Klimaanlage · R32 (Direktverdampfung)",
    bannerTitle: "Split-Klimaanlage (Single-/Multi-Split) · Luft/Luft-Direktverdampfung",
    bannerDesc:
      "R32 (Sicherheitsgruppe A2L, GWP 675): Direkter Wärmeaustausch zwischen Kältemittel und Raumluft ohne Heizungswasserkreis. Das Expansionsventil (EEV) sitzt meist in der Außeneinheit; gedämmte Einspritz- und Saugleitung führen zum Wand-, Truhen- oder Kassettengerät. F-Gase-Sachkunde Pflicht.",
    badgeText: "R32 · A2L · F-Gase-Pflicht",
    badgeClass: "r32",
    bannerClass: "is-r32",
    boundaryX: 540,
    outdoorWidth: 518,
    indoorX: 556,
    indoorWidth: 348,
    outdoorLabel: "AUSSENEINHEIT (CONDENSING UNIT)",
    indoorLabel: "INNENGERÄT (DIREKTVERDAMPFER)",
    refCondition: {
      cooling: "Referenz: Kühlbetrieb A35 / R27",
      heating: "Referenz: Heizbetrieb A7 / R20",
      defrost: "Referenz: Abtauphase (Kreislaufumkehr)"
    }
  },
  vrv: {
    category: "hvac",
    name: "VRF-Klima-Großanlage",
    refrigerant: "R32 / R410A (VRF)",
    headerText: "VRF-System · Variabler Kältemittelmassenstrom",
    bannerTitle: "VRF-System (Variable Refrigerant Flow) · Mehrstrang-Direktverdampfung",
    bannerDesc:
      "Zentrale Außeneinheit mit Inverter-Scrollverdichtern und Unterkühler versorgt über ein verzweigtes Rohrnetz (Y-Abzweige) bis zu 64 Innengeräte. Jedes Innengerät besitzt ein eigenes elektronisches Expansionsventil (EEV) zur individuellen Leistungsregelung. Mindestraumvolumen & EN 378 Füllmengengrenzen beachten!",
    badgeText: "VRF · EN 378 · Multi-Zone",
    badgeClass: "vrv",
    bannerClass: "is-vrv",
    boundaryX: 540,
    outdoorWidth: 518,
    indoorX: 556,
    indoorWidth: 348,
    outdoorLabel: "VRF-AUSSENZENTRALE (INVERTER-SCROLL)",
    indoorLabel: "INNENGERÄTE-NETZ (Y-ABZWEIGE & DEZENTRALE EEVs)",
    refCondition: {
      cooling: "Referenz: Kühlbetrieb A35 / R27",
      heating: "Referenz: Heizbetrieb A7 / R20",
      defrost: "Referenz: Abtauphase (Kreislaufumkehr)"
    }
  }
};
