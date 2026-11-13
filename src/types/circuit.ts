/**
 * Modul: Typdefinitionen für das Kältekreis-Fachschema (circuit.ts)
 * Zweck: Zentrale TypeScript-Typdeklarationen für Wärmepumpen-Bauarten, Komponenten,
 *   thermodynamische Zustände, Störungsbilder und den reaktiven Anwendungs-State.
 * Verantwortlichkeit: Garantiert strikte Typsicherheit ohne any und typisierte Systemgrenzen.
 * Sicherheitsrelevanz: Verhindert Laufzeitfehler bei ungültigen Komponenten- oder Bauart-IDs.
 */

export type SystemType = "monoblock" | "split";

export type OperationMode = "heating" | "defrost";

export type ViewType = "circuit" | "faults" | "niceToKnow";

/**
 * Thermodynamische Zustandsgrößen an Ein- und Austritt einer Kältekreiskomponente.
 */
export interface ThermodynamicState {
  readonly inState: string;
  readonly inColor: string;
  readonly inMetric: string;
  readonly inSub: string;
  readonly outState: string;
  readonly outColor: string;
  readonly outMetric: string;
  readonly outSub: string;
}

/**
 * Fachdaten einer Kältekreiskomponente inkl. Einbauort je nach Bauart.
 */
export interface ComponentData {
  readonly id: number;
  readonly shortName: string;
  readonly name: string;
  readonly location: Record<SystemType, string>;
  readonly task: string;
  readonly thermo: Record<SystemType, ThermodynamicState>;
  readonly service: string;
  readonly serviceMetric: string;
  readonly defrostNote: string;
}

/**
 * Konfiguration der Wärmepumpen-Bauart (Monoblock vs. Split) mit Geometrie der SVG-Systemgrenze.
 */
export interface SystemConfig {
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
  system: SystemType;
  mode: OperationMode;
  view: ViewType;
  componentId: number;
  faultId: string;
}
