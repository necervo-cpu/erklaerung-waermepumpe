/**
 * Modul: Fachdaten für Pufferspeicher-Einbindungen (bufferStorage.ts)
 * Zweck: Azubi-Leitfaden zu den vier wichtigsten Pufferspeicher-Schaltungen an Luft/Wasser-Wärmepumpen:
 *   Reihenpuffer im Rücklauf, Stichanbindung (T-Stück), Parallelpuffer (4-Leiter) und Kombispeicher.
 * Verantwortlichkeit: Stellt Varianten-Daten, Effizienz-Bewertungen, Fühlerpositionen und Dimensionierungsregeln bereit.
 * Sicherheitsrelevanz: Verhindert Schichtungsschäden, Rücklaufanhebung und fehlerhafte Fühlerpositionierung.
 */

import type { BufferPracticeRule, BufferVariant, BufferVariantData } from "../types/circuit";

export const BUFFER_VARIANTS: Readonly<Record<BufferVariant, BufferVariantData>> = {
  seriesReturn: {
    id: "seriesReturn",
    shortLabel: "Reihenpuffer (Rücklauf)",
    title: "Reihenpuffer im Rücklauf + Überströmventil",
    subtitle: "Höchste Effizienz · Direkte Vorlauf-Versorgung ohne Mischverlust",
    efficiencyBadge: "JAZ-Optimum · 1 Pumpe",
    color: "mint",
    principle:
      "Das erwärmte Heizungswasser aus der Luft/Wasser-Wärmepumpe fließt direkt und ohne Umweg in den Heizkreis. Der Pufferspeicher sitzt in Reihe im Rücklauf und vergrößert das aktive Wasservolumen für die Abtauung sowie Mindestlaufzeiten.",
    sizingFormula: "10 – 15 Liter pro kW Nennwärmeleistung (typisch 50 – 150 Liter)",
    sensorPlacement:
      "Kein externer Pufferfühler nötig (Regelung über internen Vor- und Rücklauffühler der Wärmepumpe).",
    useCases: [
      "Neubau & sanierter Bestand mit Fußbodenheizung (offene Heizkreise)",
      "Modulierende Inverter-Luft/Wasser-Wärmepumpen",
      "Anlagen mit nur einem Heizkreis und geringem Platzbedarf"
    ],
    pros: [
      "Kein Temperatur- und Exergieverlust im Vorlauf (keine Vermischung)",
      "Nur eine Umwälzpumpe erforderlich – geringer Strombedarf",
      "Optimale Abtauenergie-Bereitstellung aus dem gesamten Systemvolumen"
    ],
    cons: [
      "Zwingend auf ein sauber eingestelltes Überströmventil angewiesen",
      "Nicht geeignet bei vielen verschiedenen Heizkreisen (z. B. gemischt + ungemischt)",
      "Bei stark drosselnden Einzelraumreglern (ERR) droht Taktung über den Bypass"
    ],
    azubiMistake:
      "Überströmventil zu niedrig eingestellt (z. B. auf 150 mbar statt 250–350 mbar): Heißes Vorlaufwasser schießt ständig durch den Bypass zurück in den Rücklauf → die Wärmepumpe schaltet zu früh ab und taktet.",
    azubiMerksatz:
      "Bei Fußbodenheizung immer erste Wahl: Der Vorlauf geht ungemischt direkt in den Estrich, der Puffer im Rücklauf sichert nur das Abtauvolumen!"
  },
  teeBranch: {
    id: "teeBranch",
    shortLabel: "Stichanbindung (T-Stück)",
    title: "Stichanbindung im Vorlauf (hydraulisch entkoppelt)",
    subtitle: "Guter Kompromiss · Entkopplung bei minimalem Mischverlust",
    efficiencyBadge: "Hohe JAZ · 2 Pumpen",
    color: "sky",
    principle:
      "Wärmepumpe und Heizkreis sind über ein T-Stück direkt im Vorlauf verbunden. Der Pufferspeicher hängt parallel am Stich: Nur die Differenzmenge zwischen Primär- (WP) und Sekundär-Volumenstrom (Heizkreis) strömt durch den Puffer.",
    sizingFormula: "15 – 25 Liter pro kW (typisch 100 – 300 Liter)",
    sensorPlacement:
      "Vorlauf-Systemfühler (Weichenfühler) im gemeinsamen Stich direkt hinter dem T-Stück Richtung Heizkreis.",
    useCases: [
      "Gebäude mit schwankender Wärmeabnahme (Heizkörper mit Thermostatventilen)",
      "Wenn eine externe, stärkere Heizkreispumpe benötigt wird",
      "Bestandsanlagen mit höherem hydraulischem Widerstand"
    ],
    pros: [
      "Bei abgeglichenen Volumenströmen nahezu null Mischungsverlust im Vorlauf",
      "Sichere hydraulische Entkopplung zwischen Wärmepumpe und Heizkreis",
      "Geringer Druckverlust für die Wärmepumpen-Primärpumpe"
    ],
    cons: [
      "Zwei Umwälzpumpen (Primär + Sekundär) erforderlich",
      "Bei zu hoher Sekundär-Pumpendrehzahl wird kaltes Rücklaufwasser aus dem Puffer beigemischt",
      "Exakter Volumenstrom-Abgleich bei Inbetriebnahme notwendig"
    ],
    azubiMistake:
      "Heizkreispumpe läuft auf 100 % (größerer Volumenstrom als die WP-Pumpe): Sie saugt kaltes Wasser von unten durch den Stich in den Vorlauf → die Raumtemperatur sinkt trotz heißer Wärmepumpe.",
    azubiMerksatz:
      "Primär- und Sekundärvolumenstrom sauber abgleichen! Wenn beide Pumpen gleich viel fördern, steht das Wasser im Stich nahezu still."
  },
  parallel4Pipe: {
    id: "parallel4Pipe",
    shortLabel: "Parallelpuffer (4-Leiter)",
    title: "Parallelpuffer (4-Leiter-Trennspeicher)",
    subtitle: "Maximale Betriebssicherheit · Mehrere Heizkreise & Altbau",
    efficiencyBadge: "Robust · 2+ Pumpen",
    color: "lavender",
    principle:
      "Die Wärmepumpe lädt oben heißes Wasser in den Speicher und saugt unten ab (Primärkreis). Der oder die Heizkreise entnehmen völlig unabhängig über eigene Anschlüsse und eigene Pumpen (Sekundärkreis). Der Speicher wirkt als große hydraulische Weiche.",
    sizingFormula: "20 – 35 Liter pro kW Nennleistung (bei Sperrzeiten / PV-Überhöhung bis 50 l/kW)",
    sensorPlacement:
      "Puffer-Oben-Fühler (Anforderung/Start) im oberen Drittel; Puffer-Unten-Fühler (Stopp/Rücklauf) im unteren Drittel.",
    useCases: [
      "Altbau mit mehreren gemischten und ungemischten Heizkreisen (HK + FBH)",
      "Anlagen mit EVU-Sperrzeiten oder gezielter PV-Wärmespeicherung",
      "Objekte mit häufig schließenden Thermostatventilen und unbekanntem Rohrnetz"
    ],
    pros: [
      "100 % hydraulische Entkopplung – Wärmepumpe erreicht immer ihren Mindestvolumenstrom",
      "Einfache Einbindung von 2, 3 oder mehr Heizkreisen über einen Verteilerbalken",
      "Überbrückt kurze Takt- oder EVU-Abschaltzeiten zuverlässig"
    ],
    cons: [
      "Exergievernichtung durch Durchmischung: Sind Primärvolumenstrom (V̇_WP) und Sekundärvolumenstrom (V̇_HK) nicht exakt abgeglichen, mischt sich das Wasser im Speicher und die WP muss 2–5 K heißer fahren als nötig (JAZ sinkt deutlich)",
      "Höherer Platzbedarf, mehr Verrohrung und zwei oder mehr Umwälzpumpen",
      "Schlechte JAZ, wenn Primär- und Sekundärströme nicht aufeinander abgestimmt sind"
    ],
    azubiMistake:
      "Anschlüsse vertauscht oder Prallbleche im Speicher ignoriert, oder zu hohe Pumpendrehzahl eingestellt: Das Speicherwasser wird komplett durchquirlt, die Temperaturschichtung bricht zusammen.",
    azubiMerksatz:
      "Der Problemlöser im schwierigen Altbau und bei Mehrkreisanlagen – aber Vorlauf-Überhöhung so klein wie möglich halten!"
  },
  combiTank: {
    id: "combiTank",
    shortLabel: "Kombispeicher (Heizung+TWW)",
    title: "Kombispeicher / Multifunktionsspeicher (Heizung + TWW)",
    subtitle: "Kompaktlösung · Obere TWW-Zone & untere Heizungszone",
    efficiencyBadge: "Platzsparend · Schichtung",
    color: "peach",
    principle:
      "Ein einziger gedämmter Behälter enthält zwei Temperaturzonen: Oben wird Wasser auf 50–55 °C für Trinkwarmwasser (über Edelstahl-Wellrohr oder Tank-in-Tank) vorgehalten, darunter liegt die kühlere Heizungszone (30–45 °C), getrennt durch ein Schichtleitblech.",
    sizingFormula: "300 – 800 Liter Gesamtvolumen (je nach Personenzahl + Heizkreis-Bedarf)",
    sensorPlacement:
      "TWW-Fühler exakt in der oberen TWW-Zone (am Wellrohr-Bereich); Heizungs-Pufferfühler in der mittleren/unteren Heizungszone.",
    useCases: [
      "Sehr beengte Technikräume ohne Platz für zwei getrennte Speicher",
      "Einfamilienhäuser mit Wunsch nach hygienischer TWW-Bereitung im Durchlauf (Wellrohr)",
      "Kombination mit Solarthermie oder zusätzlichem Heizstab in der Mitte/Oben"
    ],
    pros: [
      "Minimaler Stellflächenbedarf (nur ein Speicher im Hauswirtschaftsraum)",
      "Bei Wellrohr-/Hygienespeicher: geringstes Legionellenrisiko durch kleines TWW-Volumen",
      "Reduzierte Aufstellverluste gegenüber zwei separaten Behältern (bei guter Dämmung)"
    ],
    cons: [
      "Sehr empfindlich gegen Fehlverrohrung: Hohe Pumpenleistung zerstört die Schichtung sofort",
      "Thermischer Ausgleich zwischen heißer TWW-Zone und kühler Heizungszone kostet Effizienz",
      "Rückläufe aus der TWW-Beladung dürfen die Heizungszone nicht überhitzen"
    ],
    azubiMistake:
      "Heizkreis-Vorlauf aus Versehen an den obersten TWW-Stutzen angeschlossen: Die Fußbodenheizung zieht das teure 55 °C-Duschwasser leer und die Wärmepumpe lädt permanent mit schlechtem COP nach!",
    azubiMerksatz:
      "Anschlusshöhen sind heilig! Oben = TWW-Zone, Mitte = Heizkreis-Vorlauf, Unten = Rücklauf. Schichtleitbleche und Rückschlagklappen genau nach Herstellerplan setzen."
  },
  coparTank: {
    id: "coparTank",
    shortLabel: "Copar-Speicher (2-Zonen)",
    title: "Copar-Speicher (2-Zonen-Wärmepumpen-Kombispeicher)",
    subtitle: "100 % Zonentrennung · Integrierte TWW-Vorwärmung & Überströmkammer",
    efficiencyBadge: "2-Zonen · Hohe JAZ",
    color: "aqua",
    principle:
      "Zweigeteilter Wärmepumpen-Kombispeicher (z. B. Copar 500 / 800) mit 100 % thermischer Trennung zwischen oberer Warmwasserzone (50–55 °C) und unterer Heizungszone (30–45 °C). Kaltes Trinkwasser wird im Durchlauf zuerst im Heizungsteil vorgewärmt und erst danach im oberen TWW-Teil auf Endtemperatur gebracht; eine Überströmkammer verhindert Durchmischung im Heizungspuffer.",
    sizingFormula: "Copar 500 (~536 l) oder Copar 800 (~812 l) · für Wärmepumpen bis ca. 22 kW",
    sensorPlacement:
      "TWW-Fühler in der oberen Warmwasser-Kammer; Heizungs-Fühler in der thermisch getrennten unteren Heizungs-Kammer.",
    useCases: [
      "Einfamilien- und Zweifamilienhäuser mit Wunsch nach maximaler JAZ trotz Kombispeicher",
      "Sanierung & enge Kellerräume (Speicher lässt sich für die Einbringung in Ober- und Unterteil trennen)",
      "Hygienische Trinkwassererwärmung im Durchlauf mit minimalem Bereitschaftsverlust"
    ],
    pros: [
      "100 % thermische Zonentrennung verhindert Durchmischung zwischen TWW- und Heizungszone",
      "Vorwärmstufe im Heizungsteil senkt den Temperaturhub der Wärmepumpe und steigert die JAZ",
      "Überströmkammer stabilisiert den Heizungsvorlauf; teilbare Bauweise erleichtert den Transport"
    ],
    cons: [
      "Höhere Investitionskosten als ein einfacher Standard-Kombispeicher",
      "Mehrere Verrohrungsanschlüsse (Vorwärm- und Endstufe) erfordern saubere Beschriftung",
      "Hydraulischer Abgleich und korrekte Fühlerzuordnung beider Kammern zwingend erforderlich"
    ],
    azubiMistake:
      "Vorwärm- und Endstufe am Edelstahl-Wärmetauscher verwechseln oder die thermische Trennung zwischen Ober- und Unterteil bei der Montage nicht sauber abdichten und dämmen!",
    azubiMerksatz:
      "Kaltwasser erst durch den Heizungsteil vorwärmen, dann oben im TWW-Teil nachheizen – so spart die Wärmepumpe wertvolle Hochtemperatur-Laufzeit!"
  }
};

export const BUFFER_PRACTICE_RULES: readonly BufferPracticeRule[] = [
  {
    id: "sizing",
    icon: "straighten",
    badge: "Dimensionierung",
    title: "Speichergröße richtig auslegen (l/kW)",
    summary:
      "Ein zu kleiner Puffer verursacht Takten und Abtau-Störungen; ein zu großer Puffer erhöht Bereitschaftsverluste und kostet Platz.",
    bullets: [
      "Reihenpuffer (Abtau-Sicherheit): meist 10–15 l/kW Heizleistung (Hersteller-Mindestvolumen in der Anleitung prüfen!).",
      "Stich-/Parallelpuffer: ca. 20–35 l/kW; bei Nutzung von PV-Überschuss oder EVU-Sperrzeiten auch 40–50 l/kW.",
      "Tipp: Immer zuerst das wasserführende Rohrnetz (z. B. Estrich-FBH ohne ERR) gegenrechnen."
    ]
  },
  {
    id: "stratification",
    icon: "layers",
    badge: "Schichtung",
    title: "Temperaturschichtung im Puffer schützen",
    summary:
      "Warmes Wasser ist leichter als kaltes und steigt nach oben. Verwirbelungen machen aus 50 °C oben + 30 °C unten lauwarmes 38 °C-Mischwasser.",
    bullets: [
      "Anschlüsse strikt nach Temperaturhöhe sortieren (heiß oben, mittel in der Mitte, kalt unten).",
      "Speicher-Prallbleche oder Einschichtrohre nutzen, damit einströmendes Wasser den Speicher nicht durchrührt.",
      "Schwerkraftbremsen / Rückschlagklappen in ungenutzten Ladekreisen gegen Eigenzirkulation einbauen."
    ]
  },
  {
    id: "sensors",
    icon: "thermostat",
    badge: "Fühlertechnik",
    title: "Tauchhülsen & Fühlerpositionen",
    summary:
      "Ein um 20 cm falsch gesetzter Speicherfühler bringt die gesamte Wärmepumpenregelung aus dem Takt.",
    bullets: [
      "Wärmeleitpaste in der Tauchhülse verwenden und Fühler bis zum Anschlag einschieben (Zugentlastung!).",
      "TWW-Fühler niemals unterhalb des Heizungswärmetauschers setzen, sonst schaltet die WP nicht rechtzeitig ab.",
      "Bei Stichanbindung gehört der Systemfühler in den Vorlauf hinter das T-Stück – nicht in die Speicher-Mitte."
    ]
  },
  {
    id: "insulation",
    icon: "shield",
    badge: "Wärmeschutz",
    title: "Dämmung & Mikrozirkulation (Thermosiphon)",
    summary:
      "Ungenutzte oder ungedämmte Stutzen am Pufferspeicher wirken wie eine Dauerheizung für den Keller.",
    bullets: [
      "Alle abgehenden Rohre am Speicher direkt als Thermosiphon (ca. 15–20 cm nach unten führen) ausbilden.",
      "Blindstopfen, Entlüfter-Stutzen und Flansche lückenlos nach GEG (100 % Dämmstärke) mitdämmen.",
      "Abstellräume / Technikräume nicht durch ungedämmte Pufferspeicher-Armaturen aufheizen."
    ]
  }
];
