/**
 * Modul: Fachdaten aller 9 Kältekreiskomponenten (components.ts)
 * Zweck: Vollständige thermodynamische Kenndaten für Heizbetrieb A2/W35 für R290 und R32.
 * Verantwortlichkeit: Liefert Komponentendetails, Einbauorte, thermodynamische Zustände und Service-Messwerte.
 * Sicherheitsrelevanz: Fachgerechte Druckbereiche und Sicherheitsgrenzen (Heißgasgrenze, Überhitzung, ND-Abschaltung).
 */

import type { ComponentData, HeatpumpSystemType } from "../types/circuit";

export const COMPONENTS: readonly ComponentData<HeatpumpSystemType>[] = [
  {
    id: 1,
    shortName: "Verdampfer",
    name: "Verdampfer (Lamellenwärmetauscher)",
    location: {
      monoblock: "Außeneinheit (Außenluftseite)",
      split: "Außeneinheit (Außenluftseite)"
    },
    task:
      "Nimmt Umweltwärme aus der Außenluft auf. Das kalte, unter niedrigem Druck stehende Kältemittel siedet als Nassdampf in den Rohrschlangen, verdampft vollständig und wird am Verdampferaustritt (Sauggas) gezielt um 5–8 K überhitzt – als sicherer Flüssigkeitsschlag-Schutz für den Verdichter.",
    thermo: {
      monoblock: {
        inState: "Nassdampf",
        inColor: "aqua",
        inMetric: "ca. 3,1 bar ü · −5 °C",
        inSub: "Siedendes Flüssigkeits-Gas-Gemisch (R290)",
        outState: "Sauggas",
        outColor: "sky",
        outMetric: "ca. 3,0 bar ü · +1 °C",
        outSub: "Gasförmig, ca. 6 K überhitzt (Richtwert 5–8 K)"
      },
      split: {
        inState: "Nassdampf",
        inColor: "aqua",
        inMetric: "ca. 5,8 bar ü · −5 °C",
        inSub: "Siedendes Flüssigkeits-Gas-Gemisch (R32)",
        outState: "Sauggas",
        outColor: "sky",
        outMetric: "ca. 5,7 bar ü · +1 °C",
        outSub: "Gasförmig, ca. 6 K überhitzt (Richtwert 5–8 K)"
      }
    },
    service:
      "Überhitzung (Sauggastemperatur am Verdampferaustritt minus Verdampfungstemperatur aus dem ND-Manometer) sowie gleichmäßige Bereifung über die gesamte Lamellenfläche prüfen.",
    serviceMetric: "Soll-Überhitzung (Sauggas): 5 – 8 K · ΔT Luft: ca. 3 – 5 K",
    defrostNote:
      "Arbeitet in der Abtauphase kurzzeitig als Verflüssiger: Heißes Druckgas schmilzt den Eisansatz von innen ab, der Außenlüfter bleibt ausgeschaltet."
  },
  {
    id: 2,
    shortName: "Verdichter",
    name: "Verdichter / Kompressor",
    location: {
      monoblock: "Außeneinheit (schallgedämmtes Abteil)",
      split: "Außeneinheit (schallgedämmtes Abteil)"
    },
    task:
      "Saugt das kalte, überhitzte Sauggas an und verdichtet es drehzahlgeregelt (Inverter) auf das hohe Verflüssigungsdruckniveau. Durch die Kompressionsarbeit steigen Druck und Temperatur stark an – die Wärme wird auf Heizungsniveau nutzbar.",
    thermo: {
      monoblock: {
        inState: "Sauggas",
        inColor: "sky",
        inMetric: "ca. 3,0 bar ü · +1 °C",
        inSub: "Niederdruck, rein gasförmig (R290)",
        outState: "Heißgas",
        outColor: "rose",
        outMetric: "ca. 13,5 bar ü · +68 °C",
        outSub: "Hochdruck, heißes Druckgas"
      },
      split: {
        inState: "Sauggas",
        inColor: "sky",
        inMetric: "ca. 5,7 bar ü · +1 °C",
        inSub: "Niederdruck, rein gasförmig (R32)",
        outState: "Heißgas",
        outColor: "rose",
        outMetric: "ca. 23,8 bar ü · +78 °C",
        outSub: "Hochdruck, heißes Druckgas (R32 höher)"
      }
    },
    service:
      "Druckverhältnis (p_HD / p_ND), Stromaufnahme des Inverters und Heißgas-Endtemperatur überwachen. Bei R32 liegt das Heißgas typischerweise heißer als bei R290.",
    serviceMetric: "Max. Heißgas-Schutz: ~105–115 °C (modellabhängig)",
    defrostNote:
      "Läuft mit angepasster Drehzahl weiter und pumpt die aus dem Heizungswasser aufgenommene Energie als Heißgas direkt in den vereisten Verdampfer."
  },
  {
    id: 3,
    shortName: "Verflüssiger",
    name: "Verflüssiger / Kondensator (Plattenwärmetauscher)",
    location: {
      monoblock: "Außeneinheit (direkt an Vor-/Rücklauf-Wasserleitungen)",
      split: "Inneneinheit / Hydromodul (Gebäudeinneres, frostsicher)"
    },
    task:
      "Überträgt die thermische Energie (Enthitzung des Heißgases, Kondensation und Unterkühlung) im Gegenstrom auf das Heizungswasser. Am Verflüssigeraustritt (Flüssigkeitsleitung) wird das Kältemittel um 3–7 K unterkühlt, um Flashgas (Vorverdampfung) vor dem EEV sicher zu vermeiden.",
    thermo: {
      monoblock: {
        inState: "Heißgas",
        inColor: "rose",
        inMetric: "ca. 13,4 bar ü · +66 °C",
        inSub: "Heißes Druckgas (R290)",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 13,3 bar ü · +36 °C",
        outSub: "Flüssig, ca. 4 K unterkühlt (Richtwert 3–7 K)"
      },
      split: {
        inState: "Heißgas",
        inColor: "rose",
        inMetric: "ca. 23,6 bar ü · +74 °C",
        inSub: "Heißes Druckgas über Split-Leitung (R32)",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 23,5 bar ü · +36 °C",
        outSub: "Flüssig, ca. 4 K unterkühlt (Richtwert 3–7 K)"
      }
    },
    service:
      "Unterkühlung (Verflüssigungstemperatur aus HD-Manometer minus Temperatur an der Flüssigkeitsleitung am Verflüssigeraustritt) sowie wasserseitige Spreizung (Vorlauf minus Rücklauf) messen.",
    serviceMetric: "Soll-Unterkühlung: 3 – 7 K · Spreizung Wasser: 4 – 7 K",
    defrostNote:
      "Kehrt seine Funktion um und arbeitet als Verdampfer: Entzieht dem Heizungswasser für ca. 45–120 s Wärme. Ein gesicherter Mindestvolumenstrom (Puffer/Überströmventil) ist Pflicht; je nach Hersteller stützt ein elektrischer Zuheizer (z. B. Bosch) oder rein das Heizwasservolumen (z. B. Lambda)."
  },
  {
    id: 4,
    shortName: "EEV",
    name: "Elektronisches Expansionsventil (EEV)",
    location: {
      monoblock: "Außeneinheit (vor dem Verdampfer)",
      split: "Außeneinheit (vor dem Verdampfer)"
    },
    task:
      "Entspannt das unter Hochdruck stehende flüssige Kältemittel über einen Schrittmotor-gesteuerten Querschnitt schlagartig auf den Verdampfungsdruck. Regelt dynamisch den Kältemittelmassenstrom auf eine konstante Sauggasüberhitzung.",
    thermo: {
      monoblock: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 13,2 bar ü · +35 °C",
        inSub: "Hochdruck, blasenfrei flüssig",
        outState: "Nassdampf",
        outColor: "aqua",
        outMetric: "ca. 3,1 bar ü · −5 °C",
        outSub: "Flashgas + kalte Flüssigkeit"
      },
      split: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 23,4 bar ü · +35 °C",
        inSub: "Hochdruck, blasenfrei flüssig",
        outState: "Nassdampf",
        outColor: "aqua",
        outMetric: "ca. 5,8 bar ü · −5 °C",
        outSub: "Flashgas + kalte Flüssigkeit"
      }
    },
    service:
      "Schrittmotor-Öffnungsgrad (Steps / %) in der Regelung und Reaktion der Sauggasüberhitzung bei Lastwechsel prüfen.",
    serviceMetric: "Regelziel: Überhitzung 5 – 8 K · Spule: ca. 40–50 Ω",
    defrostNote:
      "Öffnet während der Abtauung weit (oder nutzt einen Abtau-Bypass), um das flüssige Kondensat aus dem Außen-Wärmetauscher zügig in Richtung Plattenwärmetauscher zu entspannen."
  },
  {
    id: 5,
    shortName: "4-Wege-Ventil",
    name: "4-Wege-Umschaltventil",
    location: {
      monoblock: "Außeneinheit (zentral zwischen Verdichter & Wärmetauschern)",
      split: "Außeneinheit (zentral zwischen Verdichter & Split-Abgang)"
    },
    task:
      "Kehrt die Strömungsrichtung des Kältemittels um. Im Heizbetrieb strömt Heißgas zum Verflüssiger; für die aktive Abtauung des Verdampfers (oder zur Gebäudekühlung) leitet es Heißgas direkt in den Außenluft-Verdampfer.",
    thermo: {
      monoblock: {
        inState: "HD + ND",
        inColor: "rose",
        inMetric: "HD ~13,5 bar · ND ~3,0 bar",
        inSub: "Heizbetrieb: Druckgas -> Verflüssiger",
        outState: "Umkehr",
        outColor: "sky",
        outMetric: "Abtauung: 45–120 s",
        outSub: "Heißgas kurzzeitig -> Verdampfer"
      },
      split: {
        inState: "HD + ND",
        inColor: "rose",
        inMetric: "HD ~23,8 bar · ND ~5,7 bar",
        inSub: "Heizbetrieb: Druckgas -> Inneneinheit",
        outState: "Umkehr",
        outColor: "sky",
        outMetric: "Abtauung: 45–120 s",
        outSub: "Heißgas kurzzeitig -> Verdampfer"
      }
    },
    service:
      "Magnetspule (230 V / 24 V) auf Ansteuerung prüfen und alle 4 Rohranschlüsse per IR-Thermometer/Handauflegen auf saubere Trennung (kein innerer Bypass) testen.",
    serviceMetric: "Druckdifferenz für Umschaltung: min. 3 – 4 bar",
    defrostNote:
      "Schaltet aktiv um und leitet Heißgas vom Verdichter zum Außen-Wärmetauscher sowie kaltes Sauggas vom Plattenwärmetauscher zurück zum Verdichter."
  },
  {
    id: 6,
    shortName: "Sammler",
    name: "Kältemittelsammler (Flüssigkeitsabscheider/-puffer)",
    location: {
      monoblock: "Außeneinheit (in der Flüssigkeitsleitung nach Verflüssiger)",
      split: "Außeneinheit (nimmt Füllstandsschwankungen langer Split-Leitungen auf)"
    },
    task:
      "Puffert flüssiges Kältemittel, da der Füllbedarf zwischen Heiz-, Kühl- und Abtaubetrieb sowie bei wechselnden Außentemperaturen stark schwankt. Stellt sicher, dass dem EEV stets reine Flüssigkeit zuläuft.",
    thermo: {
      monoblock: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 13,3 bar ü · +36 °C",
        inSub: "Aus Verflüssiger kommend",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 13,3 bar ü · +35,5 °C",
        outSub: "Puffervorrat blasenfrei"
      },
      split: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 23,5 bar ü · +36 °C",
        inSub: "Aus Inneneinheit zurückkommend",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 23,4 bar ü · +35 °C",
        outSub: "Puffervorrat für Zusatzfüllmenge"
      }
    },
    service:
      "Bei Split-Anlagen mit langen Rohrleitungen auf korrekte Zusatzfüllmenge (g/m) laut Hersteller achten, damit der Sammler weder leerläuft noch überfüllt wird.",
    serviceMetric: "Druckverlust: < 0,1 bar · Füllstand: Lastabhängig",
    defrostNote:
      "Gleicht die in der Abtauphase stark veränderten Flüssigkeitsvolumina zwischen Außen- und Innenwärmetauscher aus."
  },
  {
    id: 7,
    shortName: "Filtertrockner",
    name: "Filtertrockner",
    location: {
      monoblock: "Außeneinheit (Flüssigkeitsleitung vor EEV)",
      split: "Außeneinheit (Flüssigkeitsleitung vor EEV)"
    },
    task:
      "Bindet mittels Molekularsieb Restfeuchte im Kältekreis und hält Schmutzpartikel, Zunder oder Säuren zurück, bevor sie die feine Düse des Expansionsventils verstopfen oder Eisbildung verursachen.",
    thermo: {
      monoblock: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 13,2 bar ü · +35,5 °C",
        inSub: "Hochdruck, flüssig",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 13,2 bar ü · +35,5 °C",
        outSub: "Kein spürbarer Temperaturabfall"
      },
      split: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 23,4 bar ü · +35 °C",
        inSub: "Hochdruck, flüssig",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 23,4 bar ü · +35 °C",
        outSub: "Kein spürbarer Temperaturabfall"
      }
    },
    service:
      "Temperatur vor und nach dem Filtertrockner messen. Ein spürbarer Temperaturabfall (oder gar Vereisung dahinter) deutet auf eine Verstopfung und Vorentspannung hin.",
    serviceMetric: "Zulässiges ΔT Ein/Aus: < 1,5 K (sonst verstopft!)",
    defrostNote:
      "Wird beim Rückströmen des Kondensats in umgekehrter Richtung durchflossen (bei bi-flow Filtertrocknern für Wärmepumpen zugelassen)."
  },
  {
    id: 8,
    shortName: "Schauglas",
    name: "Schauglas mit Feuchtigkeitsindikator",
    location: {
      monoblock: "Außeneinheit (zwischen Filtertrockner und EEV)",
      split: "Außeneinheit (zwischen Filtertrockner und EEV)"
    },
    task:
      "Ermöglicht die optische Kontrolle auf Blasenfreiheit des flüssigen Kältemittels vor dem Expansionsventil sowie die Überwachung des Feuchtegehalts über einen Farbindikator.",
    thermo: {
      monoblock: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 13,2 bar ü · +35 °C",
        inSub: "Klar, blasenfrei im Normalbetrieb",
        outState: "Indikator",
        outColor: "lime",
        outMetric: "Grün = Trocken",
        outSub: "Gelb/Hell = Feuchtigkeit im Kreis"
      },
      split: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 23,4 bar ü · +35 °C",
        inSub: "Klar, blasenfrei im Normalbetrieb",
        outState: "Indikator",
        outColor: "lime",
        outMetric: "Grün = Trocken",
        outSub: "Gelb/Hell = Feuchtigkeit (Evakuierfehler)"
      }
    },
    service:
      "Dampfblasen im stationären Betrieb weisen meist auf Kältemittelmangel oder zu geringe Unterkühlung hin. Indikatorfarbe immer erst nach einigen Stunden Laufzeit beurteilen. Praxishinweis: In hermetisch verlöteten R290-Serien-Monoblocks (z. B. Bosch, Lambda) entfällt das Schauglas meist – die Bewertung erfolgt dort über Überhitzung/Unterkühlung per Sensorik.",
    serviceMetric: "Soll-Zustand: 100 % blasenfrei · Indikator Grün",
    defrostNote:
      "Während der kurzen Abtauumkehr sind vorübergehend Dampfblasen im Schauglas normal – eine Füllstandsbewertung erfolgt erst wieder im stationären Heizbetrieb."
  },
  {
    id: 9,
    shortName: "HD/ND-Sensoren",
    name: "Hochdruck- & Niederdruckpressostate (HD/ND)",
    location: {
      monoblock: "Außeneinheit (Druckleitung nach Verdichter & Saugleitung)",
      split: "Außeneinheit (Druckleitung nach Verdichter & Saugleitung)"
    },
    task:
      "Schützen den Verdichter und das gesamte System vor unzulässigen Drücken. Sie liefern elektronische Druckmesswerte für die Überhitzungs-/Unterkühlungsregelung und lösen bei Grenzwertverletzung eine Sicherheitsabschaltung aus.",
    thermo: {
      monoblock: {
        inState: "ND-Sensor",
        inColor: "aqua",
        inMetric: "Saug: ca. 3,0 bar ü",
        inSub: "Abschaltung ca. < 0,8 – 1,2 bar ü",
        outState: "HD-Sensor",
        outColor: "rose",
        outMetric: "Druck: ca. 13,5 bar ü",
        outSub: "HD-Schutzschalter ca. 28 – 30 bar ü"
      },
      split: {
        inState: "ND-Sensor",
        inColor: "aqua",
        inMetric: "Saug: ca. 5,7 bar ü",
        inSub: "Abschaltung ca. < 2,0 – 2,5 bar ü",
        outState: "HD-Sensor",
        outColor: "rose",
        outMetric: "Druck: ca. 23,8 bar ü",
        outSub: "HD-Schutzschalter ca. 41 – 43 bar ü"
      }
    },
    service:
      "Sensordrücke in der Steuerung mit einer Monteurhilfe (Manometer) plausibilisieren – in modernen R290-Monoblocks (z. B. Bosch, Lambda) arbeiten meist elektronische Drucktransmitter plus mechanischer HD-Begrenzer statt klassischer Schraubpressostate. Bei HD-Abschaltung zuerst die Wärmesenke (Heizungswasserdurchfluss) prüfen!",
    serviceMetric: "Plausibilität Manometer vs. Steuerung: ±0,3 bar",
    defrostNote:
      "Überwachen auch die Druckspitzen beim Umschalten des 4-Wege-Ventils und lösen bei Frostgefahr im Plattenwärmetauscher einen ND-Schutzstopp aus."
  }
];
