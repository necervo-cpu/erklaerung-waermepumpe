/**
 * Modul: Fachdaten der Fehleranalyse & Störungsbilder (faults.ts)
 * Zweck: Praxiserprobte Fehlerdiagnose für Wärmepumpen (HD-, ND-, Heißgas- und Abtaufehler).
 * Verantwortlichkeit: Enthält Ursachen, Symptome, Prüfschritte und Zuordnungen zu Kältekreiskomponenten.
 * Sicherheitsrelevanz: Fachlich abgesicherte Diagnoseanleitungen zur Vermeidung von Verdichterschäden.
 */

import type { FaultData } from "../types/circuit";

export const FAULTS: readonly FaultData[] = [
  {
    id: "hd",
    code: "HD-Alarm",
    title: "Hochdruckstörung (HD-Störung)",
    severity: "Sicherheitsabschaltung HD",
    preview: "Verflüssigungsdruck & -temperatur steigen unzulässig hoch an.",
    symptoms:
      "Anlage schaltet über den Hochdruckpressostaten (HD) mit Störmeldung ab. Verflüssigungsdruck und Verflüssigungstemperatur schießen innerhalb kurzer Zeit steil nach oben, während die Wärme nicht ins Heizungssystem abgeführt wird.",
    causes: [
      "Fehlender Volumenstrom auf der Heizungsseite: Umwälzpumpe defekt oder blockiert, Luft im Plattenwärmetauscher, Schmutzfänger / Schlammabscheider zugesetzt, alle Heizkörper- bzw. FBH-Stellantriebe geschlossen.",
      "Plattenwärmetauscher (Verflüssiger) wasserseitig verkalkt oder verschlammt (schlechter Wärmeübergang).",
      "Kältemittelüberfüllung (z. B. nach fehlerhafter Nachfüllung bei Split-Anlagen).",
      "Nichtkondensierbare Gase (Luft oder Rest-Stickstoff durch mangelhafte Evakuierung) im Kältekreis."
    ],
    checks: [
      "Spreizung (ΔT) zwischen Heizungs-Vorlauf und -Rücklauf prüfen: Ist ΔT > 10–12 K, fehlt meist Wasserdurchfluss.",
      "Durchflusssensorik, Pumpenkennlinie, Schmutzfänger und Überströmventil kontrollieren.",
      "Unterkühlung am Verflüssigeraustritt messen: Stark erhöhte Unterkühlung (> 10 K) deutet auf Überfüllung; stark schwankender HD-Druck oft auf nichtkondensierbare Gase."
    ],
    relatedComponents: [3, 9]
  },
  {
    id: "nd",
    code: "ND-Alarm",
    title: "Niederdruckstörung (ND-Störung)",
    severity: "Sicherheitsabschaltung ND",
    preview: "Saugdruck fällt unter Grenzwert, Verdampfungstemperatur tief im Minus.",
    symptoms:
      "Der Saugdruck fällt unter den zulässigen Grenzwert, die Verdampfungstemperatur rutscht stark in den Minusbereich ab. Deutlicher Leistungsabfall und häufige Taktung oder ND-Störabschaltung.",
    causes: [
      "Kältemittelmangel / Leckage im Kältekreis (bei Split oft an Bördelverbindungen).",
      "Verdampfer stark vereist oder Lamellen durch Laub/Schmutz verstopft – zu wenig Wärmezufuhr aus der Außenluft.",
      "Ventilator am Außengerät defekt, schwergängig oder blockiert.",
      "Elektronisches Expansionsventil (EEV) öffnet nicht ausreichend oder Schrittmotor klemmt.",
      "Filtertrockner verstopft (Vorentspannung am Trockner)."
    ],
    checks: [
      "Sauggasüberhitzung prüfen: Bei Kältemittelmangel oder klemmendem EEV steigt die Überhitzung deutlich an (> 12–15 K).",
      "Unterkühlung messen und Schauglas beobachten: Niedrige Unterkühlung + Blasenbildung im Schauglas bestätigen Mangel.",
      "Temperaturdifferenz vor und nach dem Filtertrockner messen (> 1,5 K = verstopft).",
      "Luftvolumenstrom, Lamellen-Zustand und Abtaufunktion am Verdampfer kontrollieren."
    ],
    relatedComponents: [1, 4, 7, 8, 9]
  },
  {
    id: "hotgas",
    code: "Verdichterschutz",
    title: "Zu hohe Heißgastemperatur",
    severity: "Leistungsreduktion / Schutzabschaltung",
    preview: "Druckgastemperatur überschreitet Verdichter-Schutzgrenze.",
    symptoms:
      "Der Verdichter regelt seine Drehzahl zwangsweise herunter oder geht wegen zu hoher Druckgas-/Heißgastemperatur auf Störung.",
    causes: [
      "Zu hohe Sauggasüberhitzung durch Kältemittelmangel (Verdichter wird durch fehlendes kaltes Sauggas nicht mehr ausreichend gekühlt).",
      "Zu hohes Druckverhältnis: Sehr tiefe Außentemperatur bei gleichzeitig sehr hoher geforderter Vorlauftemperatur außerhalb der Einsatzgrenzen.",
      "EEV-Fehlregelung oder fehlerhafter Saugdruck-/Sauggasfühler, wodurch das Ventil zu weit schließt."
    ],
    checks: [
      "Heißgastemperaturfühler (NTC-Widerstandskennlinie) auf korrekte Anzeige prüfen.",
      "Sauggasüberhitzung im laufenden Betrieb bestimmen und auf Kältemittelmangel prüfen.",
      "Betriebspunkt im Einsatzgrenzen-Diagramm (Vorlauftemperatur vs. Außentemperatur) abgleichen."
    ],
    relatedComponents: [2, 4, 9]
  },
  {
    id: "ice",
    code: "Abtaufehler",
    title: "Starke Vereisung / Abtaufehler am Verdampfer",
    severity: "Wärmeübergang blockiert",
    preview: "Verdampfer wächst komplett zu, Abtauung startet nicht oder bricht ab.",
    symptoms:
      "Der Lamellenverdampfer vereist vollständig zu einem massiven Eisblock. Der Luftstrom bricht zusammen, die Abtauung startet gar nicht, läuft endlos oder bricht vorzeitig ab.",
    causes: [
      "4-Wege-Umschaltventil schaltet mechanisch nicht sauber um oder klemmt (kein heißes Kältemittel gelangt in den Verdampfer).",
      "Abtaufühler / Verdampferfühler dejustiert, abgerutscht oder mit falschem Widerstandswert.",
      "Zu geringe verfügbare Abtauenergie im Heizkreis (Mindestwasserumlaufmenge bzw. Reihenrücklaufspeicher fehlt, oder Überströmventil falsch eingestellt).",
      "Kondensatwanne bzw. Ablaufheizung defekt, sodass Tauwasser unten wieder festfriert und von unten hochwächst."
    ],
    checks: [
      "Umschaltgeräusch (deutliches Klacken) und Temperaturverlauf der 4 Rohre am 4-Wege-Ventil während der Abtauung prüfen.",
      "NTC-Widerstände von Verdampfer- und Außenluftfühler messen und mit Kennlinie vergleichen.",
      "Mindestvolumenstrom während der Kreislaufumkehr sicherstellen (alle Ventile/Pufferkreis prüfen)."
    ],
    relatedComponents: [1, 5, 3]
  }
];
