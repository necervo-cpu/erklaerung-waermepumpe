/**
 * Modul: Fachdaten & Berechnung der Heizkurve (heatingCurve.ts)
 * Zweck: Berechnet die Vorlauftemperatur in Abhängigkeit von Außentemperatur, Steilheit und Parallelverschiebung
 *   und liefert Azubi-Praxiswissen zu hydraulischem/thermischem Abgleich, Bivalenzpunkt und § 14a EnWG.
 * Verantwortlichkeit: Reine Berechnungs- und Datenlogik ohne DOM-Abhängigkeiten.
 * Sicherheitsrelevanz: Verhindert unrealistische Vorlauftemperaturen durch Begrenzung auf 20–75 °C.
 */

export interface HeatingCurvePreset {
  readonly id: string;
  readonly label: string;
  readonly slope: number;
  readonly shift: number;
}

export interface HeatingCurveRuleCard {
  readonly id: string;
  readonly icon: string;
  readonly badge: string;
  readonly title: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export const HEATING_CURVE_PRESETS: readonly [
  HeatingCurvePreset,
  HeatingCurvePreset,
  HeatingCurvePreset
] = [
  { id: "fbh", label: "Fußbodenheizung (0,35)", slope: 0.35, shift: 0 },
  { id: "lowTempHk", label: "Niedertemp.-Heizkörper (0,75)", slope: 0.75, shift: 0 },
  { id: "oldHk", label: "Altbau-Heizkörper (1,15)", slope: 1.15, shift: 1 }
];

/**
 * Berechnet die Soll-Vorlauftemperatur (°C) anhand einer praxisnahen Wärmepumpen-Heizkurve.
 * Basis-Raumsolltemperatur: 20 °C.
 */
export function calculateFlowTemp(
  outdoorTemp: number,
  slope: number,
  shift: number
): number {
  const roomTarget = 20 + shift;
  const delta = Math.max(0, roomTarget - outdoorTemp);
  // Leicht gekrümmter Heizkörper-/FBH-Exponent (1 / 1.2) für realistische Heizkennlinie
  const raw = roomTarget + slope * 1.18 * Math.pow(delta, 0.92);
  return Math.round(Math.min(75, Math.max(20, raw)) * 10) / 10;
}

export const HEATING_CURVE_RULES: readonly HeatingCurveRuleCard[] = [
  {
    id: "thermal-balance",
    icon: "tune",
    badge: "Thermischer Abgleich",
    title: "Heizkurve statt Thermostat-Drosselung",
    summary:
      "Eine Wärmepumpe arbeitet am sparsamsten, wenn alle Heizkreise möglichst offen sind und die Vorlauftemperatur exakt zum Wärmebedarf passt.",
    bullets: [
      "Erst hydraulischen Abgleich (Volumenströme pro Heizkreis) durchführen, danach Heizkurve schrittweise absenken.",
      "Wird es im Wohnzimmer zu warm: nicht den Thermostat zudrehen, sondern die Heizkurve um 1–2 K senken.",
      "Jedes Kelvin niedrigere Vorlauftemperatur verbessert den COP/JAZ um ca. 2,5 %."
    ]
  },
  {
    id: "bivalence",
    icon: "bolt",
    badge: "Bivalenzpunkt",
    title: "Bivalenzpunkt & elektrischer Heizstab",
    summary:
      "Der Bivalenzpunkt (meist -5 °C bis -10 °C) ist die Außentemperatur, ab der die Wärmepumpe den Heizstab zur Unterstützung zuschalten darf.",
    bullets: [
      "Der Heizstab hat COP = 1,0 (1 kWh Strom = 1 kWh Wärme) und darf im Normalwinter nicht dauerhaft mitlaufen.",
      "Steht der Bivalenzpunkt fälschlich auf +5 °C, explodieren die Stromkosten.",
      "Für die Notheizung / Estrichtrocknung bleibt der Heizstab als Reserve wichtig."
    ]
  },
  {
    id: "enwg-14a",
    icon: "electric_meter",
    badge: "§ 14a EnWG",
    title: "Netzorientierte Steuerung (Dimmung)",
    summary:
      "Seit 2024 sind Wärmepumpen > 4,2 kW elektrische Anschlussleistung steuerbare Verbrauchseinrichtungen nach § 14a EnWG.",
    bullets: [
      "Der Netzbetreiber darf bei Netzengpass die elektrische Leistungsaufnahme temporär auf mindestens 4,2 kW dimmen.",
      "Die Wärmepumpe läuft gedrosselt weiter (kein harter Total-Ausfall mehr wie bei alten EVU-Sperrzeiten).",
      "Steuerleitung / EEBUS-Schnittstelle bei Inbetriebnahme nach Vorgabe des Netzbetreibers anschließen und testen."
    ]
  },
  {
    id: "handover-errors",
    icon: "warning",
    badge: "Übergabe-Fehler",
    title: "Typische Fehler bei der Inbetriebnahme",
    summary:
      "Zu hohe Werkseinstellungen bei der Heizkurve sind einer der häufigsten Gründe für hohe Stromrechnungen im ersten Winter.",
    bullets: [
      "Werkseinstellung (oft Steilheit 1,0–1,2) bei Neubau-Fußbodenheizung nicht abgesenkt → Vorlauf zu heiß, ERR schließen, WP taktet.",
      "Heizgrenztemperatur (Sommer/Winter-Umschaltung) zu hoch eingestellt (z. B. 22 °C statt 15–17 °C).",
      "Nachtabsenkung zu stark gewählt: Morgens muss die WP mit hoher Vorlauftemperatur (schlechter COP) wieder aufholen."
    ]
  }
];
