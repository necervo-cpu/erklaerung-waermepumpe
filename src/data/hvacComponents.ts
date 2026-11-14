/**
 * Modul: Fachdaten aller 9 Split-Klima- & VRF-Komponenten (hvacComponents.ts)
 * Zweck: Thermodynamische Kenndaten für den Referenz-Kühlbetrieb A35/R27 (R32 & VRF)
 *   sowie Rollen im Heiz- und Abtaubetrieb.
 * Verantwortlichkeit: Liefert Komponentendetails, Einbauorte, Zustandsgrößen und Service-Messwerte.
 * Sicherheitsrelevanz: Fachgerechte Druckgrenzen, Ölrückführung, Stickstoff-Löten und EN-378-Füllgrenzen.
 */

import type { ComponentData, HvacSystemType } from "../types/circuit";

export const HVAC_COMPONENTS: readonly ComponentData<HvacSystemType>[] = [
  {
    id: 1,
    shortName: "Außen-WT",
    name: "Außenluft-Wärmetauscher (Verflüssiger / Verdampfer)",
    location: {
      klimasplit: "Außeneinheit (Lamellenregister, Außenluftseite)",
      multisplit: "Multi-Split-Außeneinheit (zentrales Lamellenregister)",
      vrv: "VRF-Außenzentrale (Hochleistungs-Lamellenregister)"
    },
    task:
      "Gibt im Kühlbetrieb (Regelbetrieb) die aus dem Gebäude aufgenommene Wärme plus Verdichterarbeit an die Außenluft ab. Im Heizbetrieb kehrt sich die Aufgabe um und das Register entzieht der Außenluft Umweltwärme.",
    thermo: {
      klimasplit: {
        inState: "Heißgas",
        inColor: "rose",
        inMetric: "ca. 26,9 bar ü · +82 °C",
        inSub: "Druckgas vom Verdichter (Kühlbetrieb A35)",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,7 bar ü · +40 °C",
        outSub: "Flüssig, ca. 5 K unterkühlt (R32)"
      },
      multisplit: {
        inState: "Heißgas",
        inColor: "rose",
        inMetric: "ca. 26,9 bar ü · +82 °C",
        inSub: "Druckgas vom Verdichter (Summe der Zonen)",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,7 bar ü · +40 °C",
        outSub: "Flüssig zum EEV-Verteilerblock (ca. 5 K UK)"
      },
      vrv: {
        inState: "Heißgas",
        inColor: "rose",
        inMetric: "ca. 26,9 bar ü · +84 °C",
        inSub: "Moduliertes Druckgas (Teillast/Volllast)",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,7 bar ü · +39 °C",
        outSub: "Vorlauf zum VRF-Unterkühler (Subcooler)"
      }
    },
    service:
      "Lamellen auf Verschmutzung (Pollen, Fett, Laub), freien Ausblas ohne thermischen Kurzschluss und Drehzahl des drehzahlgeregelten EC-Außenlüfters prüfen.",
    serviceMetric: "Soll-Verflüssigung Tc: +42 – +48 °C bei 35 °C Außenluft",
    modeNoteHeating:
      "Arbeitet im Heizbetrieb (A7/R20) als Verdampfer: Das kalte Kältemittel siedet bei ca. 5–7 bar ü und nimmt Wärme aus der Außenluft auf.",
    defrostNote:
      "Arbeitet in der Abtauphase kurzzeitig wieder als Verflüssiger: Heißgas schmilzt Reif von innen ab; der Außenlüfter bleibt ausgeschaltet."
  },
  {
    id: 2,
    shortName: "Verdichter",
    name: "Inverter-Verdichter (Rollkolben / VRF-Scroll)",
    location: {
      klimasplit: "Außeneinheit (schallgedämmter Verdichterraum)",
      multisplit: "Multi-Split-Außeneinheit (Twin-Rotary Inverter-Verdichter)",
      vrv: "VRF-Außenzentrale (Inverter-Scroll + Ölabscheider)"
    },
    task:
      "Saugt das kalte Sauggas aus den Innengeräten an und verdichtet es drehzahlgeregelt auf Hochdruckniveau. In VRF-Anlagen passt die Inverter-Steuerung den Massenstrom stufenlos an die Summe aller aktiven Innengeräte an und führt abgeschiedenes Kältemaschinenöl zurück.",
    thermo: {
      klimasplit: {
        inState: "Sauggas",
        inColor: "sky",
        inMetric: "ca. 9,1 bar ü · +13 °C",
        inSub: "Niederdruck, ca. 6 K überhitzt (R32)",
        outState: "Heißgas",
        outColor: "rose",
        outMetric: "ca. 26,9 bar ü · +82 °C",
        outSub: "Hochdruck, heißes Druckgas"
      },
      multisplit: {
        inState: "Sauggas",
        inColor: "sky",
        inMetric: "ca. 9,0 bar ü · +13 °C",
        inSub: "Misch-Sauggas aus aktiven Raumsträngen",
        outState: "Heißgas",
        outColor: "rose",
        outMetric: "ca. 26,9 bar ü · +82 °C",
        outSub: "Drehzahlanpassung an aktive Zonen"
      },
      vrv: {
        inState: "Sauggas",
        inColor: "sky",
        inMetric: "ca. 9,0 bar ü · +13 °C",
        inSub: "Niederdruck aus Sammelstrang (VRF)",
        outState: "Heißgas",
        outColor: "rose",
        outMetric: "ca. 26,9 bar ü · +84 °C",
        outSub: "Hochdruck über integrierten Ölabscheider"
      }
    },
    service:
      "Inverterfrequenz, Stromaufnahme, Heißgas-Endtemperatur sowie Ölausgleichs- und Ölrückführzyklen bei VRF-Anlagen prüfen.",
    serviceMetric: "Max. Heißgas-Schutz: ~105 – 115 °C · Ölrückführung alle 6–8 h",
    modeNoteHeating:
      "Verdichtet im Heizbetrieb das kühlere Sauggas vom Außenverdampfer auf das höhere Temperaturniveau für die Innengeräte.",
    defrostNote:
      "Läuft mit angepasster Drehzahl weiter und pumpt Heißgas aus der Gebäude-/Restwärme direkt in das vereiste Außenregister."
  },
  {
    id: 3,
    shortName: "Innengerät",
    name: "Innengerät-Wärmetauscher (Direktverdampfer)",
    location: {
      klimasplit: "Innenraum (Wand-, Truhen- oder Deckenkassette)",
      multisplit: "2–5 separate Räume (je eigenes Leitungspaar ab Außeneinheit)",
      vrv: "Gebäudezonen (1…64 Innengeräte am Y-Verteilernetz)"
    },
    task:
      "Verdampft im Kühlbetrieb direkt in der Raumluft (Luft/Kältemittel ohne Wasser-Zwischenkreis), senkt die Raumtemperatur und entfeuchtet die Luft am Taupunkt. Das anfallende Kondensat wird über Wanne und Kondensatpumpe abgeleitet.",
    thermo: {
      klimasplit: {
        inState: "Nassdampf",
        inColor: "aqua",
        inMetric: "ca. 9,2 bar ü · +7 °C",
        inSub: "Kaltes Gemisch (Kühl- & Entfeuchtungsbetrieb)",
        outState: "Sauggas",
        outColor: "sky",
        outMetric: "ca. 9,1 bar ü · +13 °C",
        outSub: "Gasförmig, ca. 6 K überhitzt"
      },
      multisplit: {
        inState: "Nassdampf",
        inColor: "aqua",
        inMetric: "ca. 9,1 bar ü · +6,5 °C",
        inSub: "Separates gedämmtes Leitungspaar je Raum",
        outState: "Sauggas",
        outColor: "sky",
        outMetric: "ca. 9,0 bar ü · +12 °C",
        outSub: "Rücklauf zur Sammel-Saugbrücke (4–7 K ÜH)"
      },
      vrv: {
        inState: "Nassdampf",
        inColor: "aqua",
        inMetric: "ca. 9,2 bar ü · +7…+11 °C",
        inSub: "Gleitende Verdampfung Te (VRF-Komfortregelung)",
        outState: "Sauggas",
        outColor: "sky",
        outMetric: "ca. 9,0 bar ü · +13…+17 °C",
        outSub: "Individuell je Zone überhitzt geregelt"
      }
    },
    service:
      "Luftfilter, Lüfterwalze, Kondensatwanne, Schwimmerschalter und Kondensatpumpe prüfen sowie Ausblastemperatur (ΔT Luft ca. 10–14 K) messen.",
    serviceMetric: "Soll-Überhitzung: 5 – 8 K · Zuluft Kühlbetrieb: +10 – +14 °C",
    modeNoteHeating:
      "Arbeitet im Heizbetrieb als Verflüssiger (Heizregister): Warmstart verzögert den Innenlüfter, bis das Register > 30 °C erreicht.",
    defrostNote:
      "Entzieht während der Abtauung kurz Wärme bei gestopptem Innenlüfter, sodass kein kalter Luftzug in den Raum gelangt."
  },
  {
    id: 4,
    shortName: "EEV",
    name: "Elektronisches Expansionsventil (EEV / PMV)",
    location: {
      klimasplit: "Außeneinheit (zentral oder je Multi-Split-Abgang)",
      multisplit: "Außeneinheit (EEV-Batterie: 1 eigenes EEV je Raumstrang)",
      vrv: "Dezentral direkt an jedem VRF-Innengerät (+ Außen-EEV)"
    },
    task:
      "Entspannt die unterkühlte Hochdruckflüssigkeit präzise auf Verdampfungsdruck. Bei Split-Klima sitzt das EEV meist in der Außeneinheit (gedämmte Einspritzleitung); bei VRF dosiert ein eigenes EEV an jedem Innengerät exakt nach Raumbedarf.",
    thermo: {
      klimasplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39 °C",
        inSub: "Hochdruck flüssig vor Ventil",
        outState: "Nassdampf",
        outColor: "aqua",
        outMetric: "ca. 9,2 bar ü · +7 °C",
        outSub: "Einspritzung in gedämmte Leitung"
      },
      multisplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39,5 °C",
        inSub: "Gemeinsamer Flüssigkeitsverteiler außen",
        outState: "Nassdampf",
        outColor: "aqua",
        outMetric: "ca. 9,1 bar ü · +6,5 °C",
        outSub: "Individuelle Dosierung je Raumstrang (0 Pulse = Aus)"
      },
      vrv: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,4 bar ü · +28 °C",
        inSub: "Stark unterkühlt nach VRF-Subcooler",
        outState: "Nassdampf",
        outColor: "aqua",
        outMetric: "ca. 9,2 bar ü · +7 °C",
        outSub: "Dezentrale Dosierung je Innengerät (0–2000 Pulse)"
      }
    },
    service:
      "EEV-Öffnungsschritte (Pulse), Spulenwiderstand sowie Kältemittel-Ein- und Austrittstemperatur je Innengerät (inkl. Dichtschluss im Aus-Zustand) prüfen.",
    serviceMetric: "Regelziel Überhitzung: 4 – 7 K · Schließt im Standby auf 0 Pulse",
    modeNoteHeating:
      "Regelt im Heizbetrieb über das Außen-EEV die Verdampfung und am Innengerät-EEV die optimale Unterkühlung (ca. 5–8 K).",
    defrostNote:
      "Öffnet während der Abtauung weit, damit sich die Drücke schnell ausgleichen und Heißgas zum Außen-WT strömen kann."
  },
  {
    id: 5,
    shortName: "4-Wege-Ventil",
    name: "4-Wege-Umschaltventil",
    location: {
      klimasplit: "Außeneinheit (zwischen Verdichter & Wärmetauschern)",
      multisplit: "Multi-Split-Außeneinheit (schaltet alle Stränge gemeinsam)",
      vrv: "VRF-Außenzentrale (Hauptumschaltventil)"
    },
    task:
      "Schaltet den gesamten Kältekreislauf zwischen Sommer-Kühlbetrieb und Winter-Heizbetrieb um und leitet bei Bedarf kurzzeitig Heißgas zur Enteisung in das Außenregister.",
    thermo: {
      klimasplit: {
        inState: "HD + ND",
        inColor: "rose",
        inMetric: "HD ~26,9 bar · ND ~9,1 bar",
        inSub: "Kühlbetrieb: Heißgas -> Außen-WT",
        outState: "Umkehr",
        outColor: "sky",
        outMetric: "Heizen / Abtauen",
        outSub: "Heißgas -> Innengerät bzw. Außen-WT"
      },
      multisplit: {
        inState: "Kühlen",
        inColor: "sky",
        inMetric: "Alle Stränge: Kühlen",
        inSub: "Kein Mischbetrieb (Kühlen/Heizen gleichzeitig)",
        outState: "Umkehr",
        outColor: "lavender",
        outMetric: "Alle Stränge: Heizen/Abtau",
        outSub: "Zentrales Umschalten der gesamten Anlage"
      },
      vrv: {
        inState: "HD + ND",
        inColor: "rose",
        inMetric: "HD ~26,9 bar · ND ~9,0 bar",
        inSub: "Kühlbetrieb: Heißgas -> Außenregister",
        outState: "Umkehr",
        outColor: "sky",
        outMetric: "Heizen / Ölrückführung",
        outSub: "Wechselt Strömung der großen Gasleitung"
      }
    },
    service:
      "Ansteuerung der Magnetspule sowie Oberflächentemperaturen aller 4 Rohrstutzen auf saubere Trennung ohne inneren Heißgas-Bypass prüfen.",
    serviceMetric: "Mindest-Druckdifferenz für Umschaltung: ca. 3 – 4 bar",
    modeNoteHeating:
      "Zieht im Heizbetrieb an und leitet Heißgas über die größere Gasleitung direkt ins Gebäude zu den Innengeräten.",
    defrostNote:
      "Fährt für 3–6 Minuten in die Kühlstellung zurück, sodass das Außenregister mit Heißgas abgetaut wird."
  },
  {
    id: 6,
    shortName: "Sammler / Akku",
    name: "Akkumulator (Flüssigkeitsabscheider) & Sammler",
    location: {
      klimasplit: "Außeneinheit (Saugakkumulator vor Verdichter)",
      multisplit: "Multi-Split-Außeneinheit (Sammel-Saugakkumulator)",
      vrv: "VRF-Außenzentrale (Saugakkumulator + Hochdrucksammler)"
    },
    task:
      "Trennt flüssige Kältemittelreste zuverlässig vor dem Verdichtereintritt ab und puffert bei VRF-Anlagen große Füllmengenschwankungen zwischen Kühl-, Heiz- und Teillastbetrieb.",
    thermo: {
      klimasplit: {
        inState: "Flüssig / Saug",
        inColor: "peach",
        inMetric: "ca. 26,7 bar ü · +40 °C",
        inSub: "Puffer für schwankende Leitungsvolumina",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,6 bar ü · +39,5 °C",
        outSub: "Trockenes Sauggas zum Verdichter"
      },
      multisplit: {
        inState: "Sammler",
        inColor: "periwinkle",
        inMetric: "ca. 9,0 bar ü · +12 °C",
        inSub: "Sammelt Rücklauf aus 2–5 Strängen",
        outState: "Gasförmig",
        outColor: "sky",
        outMetric: "ca. 9,0 bar ü · +13 °C",
        outSub: "Puffert Teillast & schützt den Verdichter"
      },
      vrv: {
        inState: "Flüssig / Saug",
        inColor: "peach",
        inMetric: "ca. 26,7 bar ü · +39 °C",
        inSub: "Ausgleich bis zu 64 ab-/zugeschalteter Geräte",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,6 bar ü · +39 °C",
        outSub: "Verdichterschutz über integrierte Ölbohrung"
      }
    },
    service:
      "Zusatzfüllmenge (kg/m nach Flüssigkeitsleitungs-Durchmesser) bei Inbetriebnahme exakt mit Waage dokumentieren; verstopfte Ölbohrung im Akku prüfen.",
    serviceMetric: "Druckverlust: < 0,1 bar · Zusatzfüllung nach Leitungslänge",
    modeNoteHeating:
      "Puffert im Heizbetrieb das geringere Speichervolumen der Flüssigkeitsleitung im Vergleich zum Kühlbetrieb.",
    defrostNote:
      "Fängt Umschaltstöße mit flüssigem Kältemittel zuverlässig ab und verhindert Flüssigkeitsschläge am Verdichter."
  },
  {
    id: 7,
    shortName: "Filter / Sieb",
    name: "Bi-Flow-Filtertrockner & EEV-Schmutzfilter (Strainer)",
    location: {
      klimasplit: "Außeneinheit (Flüssigkeitsstrang vor EEV)",
      multisplit: "Außeneinheit (Hauptstrang + Siebe je EEV-Abgang)",
      vrv: "VRF-Außenzentrale + Mikrosiebe vor jedem Innengerät-EEV"
    },
    task:
      "Entzieht Restfeuchte mittels Molekularsieb und hält Kupferzunder sowie Schmutzpartikel von den hochpräzisen Schrittmotor-Nadeln der EEVs fern.",
    thermo: {
      klimasplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39,5 °C",
        inSub: "Hochdruck, flüssig",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,6 bar ü · +39,5 °C",
        outSub: "Kein spürbarer Temperaturabfall"
      },
      multisplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39,5 °C",
        inSub: "Vor EEV-Verteilerblock",
        outState: "Rein",
        outColor: "mint",
        outMetric: "Δp < 0,1 bar",
        outSub: "Schützt alle 2–5 EEV-Düsen vor Partikeln"
      },
      vrv: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39 °C",
        inSub: "Vor Subcooler & Abzweigsträngen",
        outState: "Flüssig",
        outColor: "peach",
        outMetric: "ca. 26,6 bar ü · +39 °C",
        outSub: "Zunderfreiheit nur durch Stickstoff-Löten"
      }
    },
    service:
      "Bei Temperaturabfall (> 1,5 K) oder Vereisung nach einem Sieb auf Zunder durch Hartlöten ohne Schutzgas-Stickstoff prüfen.",
    serviceMetric: "Zulässiges ΔT Ein/Aus: < 1,5 K · Hartlöten nur mit N₂-Spülung",
    modeNoteHeating:
      "Wird im Heizbetrieb in entgegengesetzter Richtung durchströmt – Filtertrockner und Strainer müssen bi-flow-geeignet sein.",
    defrostNote:
      "Schützt die Ventilsitze während des schnellen Abtaubetriebs zuverlässig vor gelösten Partikeln."
  },
  {
    id: 8,
    shortName: "Subcooler",
    name: "Schauglas & VRF-Unterkühler (Subcooler)",
    location: {
      klimasplit: "Außeneinheit (Flüssigkeitsleitung vor EEV)",
      multisplit: "Außeneinheit (Sammelleitung vor der EEV-Verteilung)",
      vrv: "VRF-Außenzentrale (Platten-Subcooler am Flüssigkeitsabgang)"
    },
    task:
      "Gewährleistet eine blasenfreie Flüssigkeitsvorlage. Bei VRF-Anlagen kühlt ein eigener Bypass-Plattenwärmetauscher die Flüssigkeit tief unter den Kondensationspunkt, damit trotz langer Steigleitungen kein Flashgas vor den EEVs entsteht.",
    thermo: {
      klimasplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39 °C",
        inSub: "Ca. 5 K Unterkühlung (blasenfrei)",
        outState: "Indikator",
        outColor: "lime",
        outMetric: "Blasenfrei · 5 K",
        outSub: "Ausreichend für typische Split-Längen"
      },
      multisplit: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,6 bar ü · +39,5 °C",
        inSub: "Gemeinsamer Flüssigkeitsstrang außen",
        outState: "Unterkühlt",
        outColor: "mint",
        outMetric: "Blasenfrei · 5 K",
        outSub: "Stabile Flüssigkeitsvorlage für alle EEVs"
      },
      vrv: {
        inState: "Flüssig",
        inColor: "peach",
        inMetric: "ca. 26,5 bar ü · +39 °C",
        inSub: "Flüssig nach Verflüssiger",
        outState: "Unterkühlt",
        outColor: "lime",
        outMetric: "ca. 26,4 bar ü · +28 °C",
        outSub: "12 – 15 K Unterkühlung (bis 90 m Steighöhe)"
      }
    },
    service:
      "Unterkühlung am Flüssigkeitsaustritt und Funktion des Subcooler-EEVs bei großen VRF-Höhenunterschieden kontrollieren.",
    serviceMetric: "Soll-Unterkühlung: 4–6 K (Split) · 12–15 K (VRF-Subcooler)",
    modeNoteHeating:
      "Im Heizbetrieb ist der VRF-Subcooler meist reduziert oder überbrückt; geregelt wird direkt über die Unterkühlung am Innengerät.",
    defrostNote:
      "Während der Abtauphase treten vorübergehend Blasen auf; Bewertung immer erst im stabilen Kühlbetrieb vornehmen."
  },
  {
    id: 9,
    shortName: "Sensorik / EN 378",
    name: "HD-/ND-Sensoren, Te/Tc-Regelung & EN-378-Schutz",
    location: {
      klimasplit: "Außeneinheit (HD/ND) + Raumtemperaturfühler Innen",
      multisplit: "Außeneinheit (HD/ND + Abgangsfühler je Strang) + Raumfühler",
      vrv: "VRF-Zentrale + je Innengerät + EN-378-Raumsensorik"
    },
    task:
      "Überwachen Druck- und Temperaturgrenzen, steuern bei VRF die gleitende Verdampfungstemperatur (Te-Optimierung für hohe Teillasteffizienz) und sichern bei A2L-Kältemitteln (R32) die Einhaltung der EN-378-Füllmengengrenzen ab.",
    thermo: {
      klimasplit: {
        inState: "ND-Sensor",
        inColor: "aqua",
        inMetric: "Saug: ca. 9,1 bar ü",
        inSub: "Vereisungsschutz < ca. 5,8 bar ü",
        outState: "HD-Sensor",
        outColor: "rose",
        outMetric: "Druck: ca. 26,9 bar ü",
        outSub: "HD-Abschaltung ca. 41 – 43 bar ü"
      },
      multisplit: {
        inState: "Strang-Fühler",
        inColor: "periwinkle",
        inMetric: "2–5 Gas-/Flüssig-NTCs",
        inSub: "Überwacht Überhitzung je angeschlossenem Raum",
        outState: "HD / ND",
        outColor: "rose",
        outMetric: "Druck: ca. 26,9 bar ü",
        outSub: "Abschaltung ca. 41,5 bar ü · EN-378-Schutz"
      },
      vrv: {
        inState: "Gleitend Te",
        inColor: "aqua",
        inMetric: "Saug: 9,0 – 10,5 bar ü",
        inSub: "Te-Anhebung spart bis 25 % Teillaststrom",
        outState: "HD + EN 378",
        outColor: "rose",
        outMetric: "Druck: ca. 26,9 bar ü",
        outSub: "Leckageüberwachung / Absperrventile bei Bedarf"
      }
    },
    service:
      "Drucktransmitter gegen Monteurhilfe plausibilisieren und bei R32-Multisplit/VRF das kleinste Raumvolumen gemäß EN 378 (mit/ohne Leckagesensor & Sicherheitsabsperrung) prüfen.",
    serviceMetric: "Plausibilität: ±0,3 bar · R32 Mindestraumfläche nach EN 378",
    modeNoteHeating:
      "Steuert im Heizbetrieb die gleitende Verflüssigungstemperatur (Tc) je nach Raumsollwert und schützt vor Hochdruck bei Teilabschaltung.",
    defrostNote:
      "Startet die Abtauung bedarfsgeführt aus Verdampfer-NTC zu Außentemperatur und begrenzt Umschalt-Druckspitzen."
  }
];
