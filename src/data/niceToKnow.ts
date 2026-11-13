/**
 * Modul: Fachdaten für den Wissensbereich „Nice to Know“ (niceToKnow.ts)
 * Zweck: Praxisnahes, thermodynamisches und heizungstechnisches Hintergrundwissen zur Wärmepumpe.
 * Verantwortlichkeit: Bereitstellung von 7 Fachkarten mit Effizienz-Regeln, Hydraulik-Tipps und Akustik-Richtlinien.
 * Sicherheitsrelevanz: Vermittelt korrekte Grenzwerte (Warmwassertemperaturen, Kältemittel-Sicherheitsgruppen, Bivalenzpunkt).
 */

import type { NiceToKnowItem } from "../types/circuit";

export const NICE_TO_KNOW: readonly NiceToKnowItem[] = [
  {
    id: "cop-jaz",
    category: "Effizienz & Kennzahlen",
    title: "COP vs. JAZ – Effizienz richtig verstehen",
    badge: "COP & JAZ",
    summary:
      "Der COP ist eine Labor-Momentaufnahme unter Idealbedingungen; die Jahresarbeitszahl (JAZ) misst die reale Effizienz über ein ganzes Kalenderjahr.",
    keyFacts: [
      "COP (Coefficient of Performance): Prüfstandsmessung bei fixen Normpunkten (z. B. A2/W35) nach DIN EN 14511 ohne reale Nebenaggregate.",
      "JAZ (Jahresarbeitszahl): Das reale Verhältnis aus erzeugter Gesamtwärme und eingesetztem Strom (inkl. Regelung, Pumpen und Heizstab) über 365 Tage.",
      "Faustformel der Thermodynamik: Jedes Kelvin (1 K) niedrigere Vorlauftemperatur spart rund 2,0 bis 2,5 % Strom über das gesamte Heizjahr."
    ],
    proTip:
      "Senken Sie die Vorlauftemperatur über eine flachere Heizkurve so weit wie möglich ab. Ein Betrieb bei 35 °C statt 45 °C spart bereits 20–25 % Strom."
  },
  {
    id: "heating-curve",
    category: "Regelung & Hydraulik",
    title: "Heizkurve statt Thermostat-Drosselung",
    badge: "Hydraulik",
    summary:
      "Wärmepumpen benötigen kontinuierlichen Heizwasserdurchfluss. Raumthermostate sollten den Volumenstrom nicht abwürgen.",
    keyFacts: [
      "Physikalischer Selbstregeleffekt: Steigt die Raumtemperatur durch Fremdwärme (Sonne, Kamin), sinkt die Wärmeabgabe der Heizflächen von selbst.",
      "Thermostat-Drosselung: Abgedrehte Einzelraumregler würgen den Umlauf ab, zwingen die Umwälzpumpe auf Hochdruck und verursachen Takten.",
      "Hydraulischer & thermischer Abgleich: Stellt sicher, dass alle Räume mit minimalem Druckverlust und gleicher Vorlauftemperatur versorgt werden."
    ],
    proTip:
      "Öffnen Sie Thermostatventile in Führungs- und Hauptwohnräumen dauerhaft ganz. Justieren Sie die Raumtemperatur allein über Neigung und Niveau der Heizkurve."
  },
  {
    id: "bivalence",
    category: "Betriebsstrategie",
    title: "Bivalenzpunkt & elektrischer Heizstab",
    badge: "Bivalenzpunkt",
    summary:
      "Der elektrische Heizstab ist kein technischer Fehler, sondern ein wirtschaftlich sinnvoll kalkulierter Not- und Spitzenlasthelfer für Extremfrost.",
    keyFacts: [
      "Bivalenzpunkt: Die Außentemperatur, ab der die Heizleistung der Wärmepumpe exakt der Gebäudeheizlast entspricht (meist zwischen -5 °C und -7 °C).",
      "Wirtschaftliche Dimensionierung: 100 % Deckung bei -14 °C Norm-Außentemperatur würde das Aggregat für 95 % des Jahres stark überdimensionieren.",
      "Heizstab-Anteil: In einer fachgerecht eingestellten Anlage liefert der Heizstab im Jahresmittel meist unter 2 bis maximal 5 % der Gesamtwärme."
    ],
    proTip:
      "Prüfen Sie im Regler, dass die Heizstab-Freigabe nicht fälschlich bei Plustemperaturen (z. B. +2 °C) aktiv ist. Optimal liegt der Bivalenzpunkt bei ca. -7 °C."
  },
  {
    id: "defrost",
    category: "Winterbetrieb",
    title: "Abtauen & „Rauch“ an der Außeneinheit",
    badge: "Abtauvorgang",
    summary:
      "Aufsteigender weißer Dampf und ein verändertes Betriebsgeräusch an der Außeneinheit im Winter sind kein Brand, sondern die notwendige Heißgas-Abtauung.",
    keyFacts: [
      "Physikalische Vereisung: Bei feuchter Außenluft zwischen -5 °C und +7 °C schlägt sich Kondensat an den kalten Verdampferlamellen nieder und gefriert.",
      "Kreislaufumkehr via 4-Wege-Ventil: Die Wärmepumpe kehrt die Flussrichtung kurzzeitig um, leitet Heißgas in den Verdampfer und schmilzt das Eis in 2–5 Minuten.",
      "Dampfbildung: Das schmelzende Eis verdampft teilweise an den warmen Rohren und erzeugt sichtbare, harmlose Kondensatnebelwolken."
    ],
    proTip:
      "Halten Sie den Kondensatablauf unter dem Außengerät stets laub- und eisfrei. Gefriert das Tauwasser am Boden zurück, kann das Eis in den Ventilator wachsen."
  },
  {
    id: "refrigerants",
    category: "Kältemittel & Umwelt",
    title: "R290 (Propan) vs. R32 im Überblick",
    badge: "R290 vs. R32",
    summary:
      "Natürliches R290 (Propan) punktet mit Zukunftsfähigkeit und hohen Vorlauftemperaturen, während R32 geringere Brennbarkeitsauflagen bei Split-Systemen hat.",
    keyFacts: [
      "GWP (Global Warming Potential): R290 besitzt einen GWP von nur 0,02 bis 3 (praktisch klimaneutral); R32 liegt bei GWP = 675 (F-Gas-reguliert).",
      "Sicherheitsgruppen nach EN 378: R290 ist Sicherheitsklasse A3 (brennbar, hermetischer Außenkreis); R32 ist Klasse A2L (schwer entflammbar).",
      "Thermodynamische Vorlauftemperaturen: R290 erreicht effizient bis zu 70–75 °C Vorlauf und eignet sich daher hervorragend für die Altbausanierung."
    ],
    proTip:
      "Monoblock-Systeme mit R290 erfordern im Gebäudeinneren keinen Kälteschein, da der Kältekreis hermetisch geschlossen komplett draußen verbleibt."
  },
  {
    id: "acoustics",
    category: "Planung & Akustik",
    title: "Aufstellung, Schallschutz & Nachtbetrieb",
    badge: "Schallschutz",
    summary:
      "Schallausbreitung ist reine Geometrie: Kluge Platzierung und schwingungsfreie Entkopplung vermeiden Nachbarschaftskonflikte von vornherein.",
    keyFacts: [
      "Reflexion an Wänden: Die Aufstellung direkt vor einer Hauswand verstärkt den Schall um +3 dB(A); in Mauerecken sogar um +6 dB(A).",
      "Körperschall-Entkopplung: Schwere Betonsockel mit Gummipuffern (Big Foots) und flexible Panzerschläuche verhindern Schwingungsübertragung ins Mauerwerk.",
      "Flüster- / Nachtbetrieb: Eine programmierte Leistungsbegrenzung senkt Drehzahl und Geräuschpegel in den empfindlichen Nachtstunden (22–6 Uhr) um 3–5 dB(A)."
    ],
    proTip:
      "Blasen Sie die Fortluft niemals direkt auf benachbarte Terrassen oder fremde Schlafzimmerfenster. Ein freier Ausblasweg verhindert zudem Schallreflexionen."
  },
  {
    id: "hot-water",
    category: "Trinkwasser & Hygiene",
    title: "Warmwasser & Legionellenschutz",
    badge: "Warmwasser",
    summary:
      "Warmwasserbereitung erfordert hohe Kältekreisdrücke. Ein durchdachtes Speicherkonzept balanciert maximale Hygiene und hohe Jahresarbeitszahl aus.",
    keyFacts: [
      "Effizientes Sollwertfenster: 48 °C bis 52 °C Speichertemperatur genügen für Duschkomfort und schonen den Verdichter vor extremen Hochdruckspitzen.",
      "Wärmetauscherfläche: Da das Heizungswasser kühler als bei Gasbrennern einströmt, benötigt der Wärmepumpenspeicher die 2- bis 3-fache Tauscherfläche.",
      "Zirkulationsverluste: Eine ungeregelte 24-Stunden-Zirkulationsleitung vernichtet oft 40–50 % der gesamten für Warmwasser aufgewendeten Energie."
    ],
    proTip:
      "Steuern Sie die Trinkwasser-Zirkulationspumpe über kurze Zeitprogramme (z. B. 3 Minuten zu den Duschzeiten) oder Strömungsschalter statt Dauerlauf."
  }
];
