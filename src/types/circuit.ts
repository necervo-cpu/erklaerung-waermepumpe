/**
 * Modul: Typdefinitionen für das Kältekreis-Fachschema (circuit.ts)
 * Zweck: Zentrale TypeScript-Typdeklarationen für Wärmepumpen-Bauarten, Komponenten,
 *   thermodynamische Zustände, Störungsbilder und den reaktiven Anwendungs-State.
 * Verantwortlichkeit: Garantiert strikte Typsicherheit ohne any und typisierte Systemgrenzen.
 * Sicherheitsrelevanz: Verhindert Laufzeitfehler bei ungültigen Komponenten- oder Bauart-IDs.
 */

export type CategoryType = "heatpump" | "hvac";

export type HeatpumpSystemType = "monoblock" | "split";

export type HvacSystemType = "klimasplit" | "vrv";

export type SystemType = HeatpumpSystemType | HvacSystemType;

export type OperationMode = "heating" | "cooling" | "defrost";

export type ViewType = "circuit" | "faults" | "niceToKnow";

/**
 * Erlaubte semantische Pastell-Farbkeys gemäß FARBPALETTE.md.
 */
export type PaletteColorKey =
  | "rose"
  | "peach"
  | "butter"
  | "lime"
  | "mint"
  | "aqua"
  | "sky"
  | "periwinkle"
  | "lavender"
  | "orchid";

/**
 * Thermodynamische Zustandsgrößen an Ein- und Austritt einer Kältekreiskomponente.
 */
export interface ThermodynamicState {
  readonly inState: string;
  readonly inColor: PaletteColorKey;
  readonly inMetric: string;
  readonly inSub: string;
  readonly outState: string;
  readonly outColor: PaletteColorKey;
  readonly outMetric: string;
  readonly outSub: string;
}

/**
 * Fachdaten einer Kältekreiskomponente inkl. Einbauort je nach Bauart.
 */
export interface ComponentData<S extends SystemType = SystemType> {
  readonly id: number;
  readonly shortName: string;
  readonly name: string;
  readonly location: Record<S, string>;
  readonly task: string;
  readonly thermo: Record<S, ThermodynamicState>;
  readonly service: string;
  readonly serviceMetric: string;
  readonly defrostNote: string;
  readonly modeNoteHeating?: string;
}

/**
 * Konfiguration einer Anlagen-Bauart (Wärmepumpe oder Split-Klima/VRV) mit SVG-Systemgrenze.
 */
export interface SystemConfig {
  readonly category: CategoryType;
  readonly name: string;
  readonly refrigerant: string;
  readonly headerText: string;
  readonly bannerTitle: string;
  readonly bannerDesc: string;
  readonly badgeText: string;
  readonly badgeClass: string;
  readonly bannerClass: string;
  readonly boundaryX: number;
  readonly outdoorWidth: number;
  readonly indoorX: number;
  readonly indoorWidth: number;
  readonly outdoorLabel: string;
  readonly indoorLabel: string;
  readonly refCondition: Record<OperationMode, string>;
}

/**
 * Fachdaten eines Störungsbildes mit Diagnosepfad und betroffenen Komponenten.
 */
export interface FaultData {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly severity: string;
  readonly preview: string;
  readonly symptoms: string;
  readonly causes: readonly string[];
  readonly checks: readonly string[];
  readonly relatedComponents: readonly number[];
}

/**
 * Fachdaten einer Wissenskarte für den Bereich „Nice to Know“.
 */
export interface NiceToKnowItem {
  readonly id: string;
  readonly category: string;
  readonly title: string;
  readonly badge: string;
  readonly summary: string;
  readonly keyFacts: readonly string[];
  readonly proTip: string;
}

/**
 * Gesamtzustand der Fachanwendung.
 */
export interface AppState {
  category: CategoryType;
  system: SystemType;
  mode: OperationMode;
  view: ViewType;
  componentId: number;
  faultId: string;
}
