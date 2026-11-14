/**
 * Modul: Typdefinitionen für das Kältekreis-Fachschema (circuit.ts)
 * Zweck: Zentrale TypeScript-Typdeklarationen für Wärmepumpen-Bauarten, Komponenten,
 *   thermodynamische Zustände, Störungsbilder und den reaktiven Anwendungs-State.
 * Verantwortlichkeit: Garantiert strikte Typsicherheit ohne any und typisierte Systemgrenzen.
 * Sicherheitsrelevanz: Verhindert Laufzeitfehler bei ungültigen Komponenten- oder Bauart-IDs.
 */

export type CategoryType = "heatpump" | "hvac";

export type HeatpumpSystemType = "monoblock" | "split";

export type HvacSystemType = "klimasplit" | "multisplit" | "vrv";

export type SystemType = HeatpumpSystemType | HvacSystemType;

export type OperationMode = "heating" | "cooling" | "defrost";

export type ViewType =
  | "circuit"
  | "hydraulics"
  | "waterQuality"
  | "heatingCurve"
  | "calculator"
  | "installation"
  | "faults"
  | "niceToKnow"
  | "quiz";

export type QuizTopic = "all" | "heatpump" | "hvac";

export type InstallSystemType = "r290" | "r32";

export type HydraulicsVariant = "series" | "parallel";

export type BufferVariant = "seriesReturn" | "teeBranch" | "parallel4Pipe" | "combiTank";

export type WaterSystemMaterial = "noAluminum" | "withAluminum";

export type WaterTreatmentMode = "lowSalt" | "saline";

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
 * Fachdaten einer Hydraulik-Komponente im Heizungswasserkreis (Azubi-Leitfaden).
 */
export interface HydraulicComponentData {
  readonly id: number;
  readonly shortName: string;
  readonly name: string;
  readonly location: Record<HydraulicsVariant, string>;
  readonly badgeColor: PaletteColorKey;
  readonly metricBadge: string;
  readonly task: string;
  readonly azubiRule: string;
  readonly commonMistake: string;
  readonly checkValue: string;
}

/**
 * Kennwert nach VDI 2035 für das Heizungswasser-Dashboard.
 */
export interface WaterQualityMetric {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly color: PaletteColorKey;
  readonly targetValue: string;
  readonly unit: string;
  readonly explanation: string;
  readonly azubiTip: string;
}

/**
 * Bauteil oder Armatur für Befüllung, Schutz und Aufbereitung von Heizungswasser.
 */
export interface WaterEquipmentItem {
  readonly id: string;
  readonly name: string;
  readonly norm: string;
  readonly color: PaletteColorKey;
  readonly purpose: string;
  readonly installRule: string;
  readonly azubiCheck: string;
}

/**
 * Schritt-für-Schritt-Praxisanleitung oder Schadensbild für Azubis.
 */
export interface WaterPracticeItem {
  readonly id: string;
  readonly stepBadge: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
  readonly warning: string;
}

/**
 * Fachdaten einer Pufferspeicher-Einbindung für Luft/Wasser-Wärmepumpen.
 */
export interface BufferVariantData {
  readonly id: BufferVariant;
  readonly shortLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly efficiencyBadge: string;
  readonly color: PaletteColorKey;
  readonly principle: string;
  readonly sizingFormula: string;
  readonly sensorPlacement: string;
  readonly useCases: readonly string[];
  readonly pros: readonly string[];
  readonly cons: readonly string[];
  readonly azubiMistake: string;
  readonly azubiMerksatz: string;
}

/**
 * Allgemeine Praxis- & Dimensionierungsregel für Pufferspeicher.
 */
export interface BufferPracticeRule {
  readonly id: string;
  readonly icon: string;
  readonly badge: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

/**
 * Prüfungsfrage für das Azubi-Prüfungstraining (Luft/Wasser & Luft/Luft).
 */
export interface QuizQuestion {
  readonly id: string;
  readonly topic: "heatpump" | "hvac";
  readonly badge: string;
  readonly examLevel: string;
  readonly question: string;
  readonly options: readonly [string, string, string, string];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly explanation: string;
  readonly examTip: string;
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
  hydraulicsVariant: HydraulicsVariant;
  hydraulicComponentId: number;
  bufferVariant: BufferVariant;
  waterMaterial: WaterSystemMaterial;
  waterTreatment: WaterTreatmentMode;
  hcSlope: number;
  hcShift: number;
  installSystem: InstallSystemType;
  quizTopic: QuizTopic;
  quizIndex: number;
  quizAnswers: Record<string, number>;
}
