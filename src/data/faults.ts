/**
 * Modul: Fachdaten der Fehleranalyse & Störungsbilder (faults.ts)
 * Zweck: Praxiserprobte Fehlerdiagnose für Wärmepumpen (HD-, ND-, Heißgas- und Abtaufehler
 *   sowie typische Alltagsstörungen: Taktung, Heizstab-Dauerbetrieb und Durchflussstörungen).
 * Verantwortlichkeit: Enthält Ursachen, Symptome, Prüfschritte und Zuordnungen zu Kältekreiskomponenten.
 * Sicherheitsrelevanz: Fachlich abgesicherte Diagnoseanleitungen zur Vermeidung von Verdichterschäden und Effizienzverlusten.
 */

import type { FaultData } from "../types/circuit";

export const FAULTS: readonly FaultData[] = [
  {
    id: "hd",
    code: "HD-Alarm",
    title: "Verflüssiger verschmutzt / Wasserdurchfluss am PWT zu gering",
    severity: "Sicherheitsabschaltung HD",
    preview: "HD extrem hoch bis zur HD-Störung, Spreizung ΔT wasserseitig > 8–10 K statt 5 K.",
    symptoms:
      "Hochdruck (HD) steigt extrem steil bis zur HD-Störabschaltung. Die wasserseitige Spreizung ΔT zwischen Vorlauf und Rücklauf am Plattenwärmetauscher (PWT) liegt deutlich über 8–10 K (Sollwert ca. 5 K). Unterkühlung oft normal bis leicht erhöht, Überhitzung unauffällig.",
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
    title: "Verdampfer vereist / Lüfter defekt",
    severity: "Wärmeübergang blockiert",
    preview: "ND fällt stark ab, Sauggastemperatur sinkt, Überhitzung bricht ein → Gefahr von Flüssigkeitsschlägen!",
    symptoms:
      "Der Niederdruck (ND) fällt stark ab, die Sauggastemperatur sinkt und die Überhitzung bricht ein (oft < 2–3 K) → akute Gefahr von Flüssigkeitsschlägen am Verdichter! Der Lamellenverdampfer vereist zum massiven Eisblock, der Luftstrom bricht zusammen.",
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
  },
  {
    id: "cycling",
    code: "Taktung",
    title: "Häufiges Takten (Kurzzeitbetrieb)",
    severity: "Verschleiß & Effizienzverlust",
    preview: "Verdichter schaltet ständig ein und aus, erreicht keine stabilen Laufzeiten.",
    symptoms:
      "Ständige Verdichterstarts innerhalb weniger Minuten, extrem kurze Laufzeiten (< 10–15 Minuten pro Takt), drastisch erhöhter mechanischer Verschleiß, unruhige Raumtemperaturen und spürbarer Einbruch der Jahresarbeitszahl (JAZ).",
    causes: [
      "Einzelraumregler (ERR) bzw. Thermostatventile abgedreht oder gedrosselt (Mindestvolumenstrom bricht weg).",
      "Fehlender oder mangelhafter hydraulischer Abgleich im Heizsystem.",
      "Zu geringes wirksames Heizungswasservolumen (fehlender oder zu kleiner Pufferspeicher / Reihenrücklaufspeicher).",
      "Wärmepumpe für das Gebäude stark überdimensioniert (minimale Modulationsgrenze des Inverters liegt über der Heizlast).",
      "Zu kleine Schalthysterese (Einschalt- bzw. Ausschaltschwelle im Regler zu eng parametriert)."
    ],
    checks: [
      "Verdichterstarts und mittlere Laufzeit pro Start in der Wärmepumpensteuerung auslesen (Sollwert: > 20–30 min/Takt, < 15–20 Starts/Tag).",
      "Thermostatventile testweise vollständig öffnen, um vollen Anlagendurchfluss freizugeben.",
      "Spreizung (ΔT) und tatsächlichen Volumenstrom (l/min) während des Betriebs mit den Hersteller-Mindestwerten abgleichen."
    ],
    relatedComponents: [2, 3]
  },
  {
    id: "heater",
    code: "Heizstab-Aktiv",
    title: "Zu hohe Stromkosten / Heizstab-Dauerbetrieb",
    severity: "Hoher Stromverbrauch / JAZ-Einbruch",
    preview: "Elektrischer Heizstab schaltet unbemerkt zu früh oder dauerhaft zu.",
    symptoms:
      "Unerwartet hohe Stromrechnung, drastischer Einbruch der Jahresarbeitszahl (JAZ). Heizstab-Symbol in der Fachanzeige leuchtet auch bei milden Plustemperaturen dauerhaft oder sehr häufig.",
    causes: [
      "Heizkurve zu steil eingestellt: Wärmepumpe kann die geforderte hohe Vorlauftemperatur verdichterseitig nicht mehr allein erreichen.",
      "Bivalenzpunkt im Regler zu hoch parametriert (z. B. bereits bei +5 °C statt -5 °C bis -7 °C).",
      "Freigabestufe / Verzögerungszeit des elektrischen Zuheizers (Heizstabs) falsch oder zu kurz parametriert.",
      "Dauerhafte Warmwasser-Zirkulation ohne Zeitfenster (Zirkulationspumpe kühlt den Speicher permanent aus)."
    ],
    checks: [
      "Betriebsstunden und Schaltimpulse des elektrischen Heizstabs in der Reglerstatistik auslesen.",
      "Soll-Vorlauftemperatur und Heizkurven-Neigung prüfen sowie stufenweise absenken (z. B. auf 35 °C bei FBH bzw. 45–50 °C bei Radiatoren).",
      "Bivalenztemperatur und Hysteresen in den Fachhandwerker-Einstellungen kontrollieren.",
      "Laufzeiten der Warmwasser-Zirkulationspumpe zeitlich auf Bedarfszeiten (z. B. morgens/abends) begrenzen."
    ],
    relatedComponents: [3, 2]
  },
  {
    id: "flow",
    code: "Durchflussfehler",
    title: "Durchflussstörung / Luft & Schlamm",
    severity: "Volumenstrom blockiert",
    preview: "Zu geringer Heizwasser-Durchfluss führt zu Störabschaltung oder ungleichmäßiger Erwärmung.",
    symptoms:
      "Durchflussfehler (z. B. Fehlercode Durchflusssensor / Strömungswächter) im Display, Heizkörper oder Fußbodenheizkreise bleiben kalt, gluckernde Strömungsgeräusche, häufige Hochdruckabschaltungen beim Start des Verdichters.",
    causes: [
      "Schmutzfänger oder Magnetitschlammabscheider im Rücklauf mit Partikeln / Magnetit zugesetzt.",
      "Luftpolster im Plattenwärmetauscher oder in den oberen Verteilerebenen des Heizkreises.",
      "Zu geringer Anlagendruck durch Druckverlust oder defektes / druckloses Membran-Druckausdehnungsgefäß (MAG).",
      "Heizkreispumpe schwergängig, defekt oder auf zu geringer fester Drehzahlstufe arretiert."
    ],
    checks: [
      "Anlagendruck manometerseitig im kalten und warmen Zustand prüfen (Sollwert meist 1,5–2,0 bar).",
      "Magnetit- und Schlammabscheider fachgerecht abschiebern, spülen und Siebe reinigen.",
      "Heizkreis und Plattenwärmetauscher über Schnellentlüfter gründlich entlüften.",
      "Pumpen-Durchflusswert in der Regelung (l/min bzw. m³/h) ablesen und mit dem Mindestvolumenstrom der Wärmepumpe vergleichen."
    ],
    relatedComponents: [3, 9]
  },
  {
    id: "leakage",
    code: "KM-Mangel",
    title: "Kältemittelmangel / Leckage",
    severity: "Leistungsverlust & Verdichterüberhitzung",
    preview: "ND zu tief, HD zu tief, Überhitzung zu hoch, Unterkühlung zu klein / Flashgas im Schauglas.",
    symptoms:
      "Sowohl Niederdruck (ND) als auch Hochdruck (HD) sind zu tief. Die Sauggasüberhitzung steigt stark an (> 12–15 K, dadurch hohe Heißgastemperatur), während die Unterkühlung am Verflüssigeraustritt zu klein ist (< 1–2 K) und im Schauglas Blasenbildung (Flashgas) sichtbar wird.",
    causes: [
      "Undichtigkeit im Kältekreis (z. B. Bördelverbindungen bei Split-Anlagen, Schraderventile, Lötstellen oder Schwingungsrisse).",
      "Schleichender Kältemittelverlust über längere Betriebszeit ohne fachgerechte Dichtheitsprüfung nach F-Gase-VO."
    ],
    checks: [
      "Überhitzung (zu hoch) und Unterkühlung (zu klein) parallel messen und Schauglas auf Flashgas prüfen.",
      "Anlage drucklos mit trockenem Stickstoff (OFN) abdrücken und Lecksuchspray / elektronischen Lecksucher einsetzen.",
      "Leckage beheben, evakuieren (< 0,3 mbar) und Kältemittel exakt nach Typenschild-Gewicht neu befüllen (bei R290/R32 Sicherheitsvorschriften beachten)."
    ],
    relatedComponents: [1, 2, 4, 8, 9]
  },
  {
    id: "eev",
    code: "EEV-Fehler",
    title: "Expansionsventil (EEV) klemmt zu weit zu vs. zu weit offen",
    severity: "Fehlregelung Überhitzung",
    preview: "Zu weit zu: wie KM-Mangel, aber normale/hohe Unterkühlung. Zu weit offen: ND zu hoch, Überhitzung ~0 K.",
    symptoms:
      "Klemmt das EEV zu weit zu (Mangel-Speisung): ND zu tief, Überhitzung extrem hoch (> 15 K) – genau wie bei KM-Mangel, ABER die Unterkühlung vor dem EEV ist normal bis erhöht (> 5 K, kein Flashgas!). Klemmt das EEV zu weit offen (Überflutung): ND zu hoch, Überhitzung fällt auf fast 0 K → nasse Verdichtung und akute Flüssigkeitsschlag-Gefahr.",
    causes: [
      "Schrittmotor des EEV defekt, Spule durchgebrannt oder Steckverbindung zur Platine korrodiert.",
      "Verschmutzung / Späne im Ventilsitz (fehlender oder zugesetzter Filtertrockner).",
      "Defekter Sauggas-NTC oder Saugdrucktransmitter liefert falsche Überhitzungswerte an den EEV-Treiber."
    ],
    checks: [
      "Spulenwiderstand des EEV-Schrittmotors (meist 40–50 Ω je Wicklung) und Ansteuerimpulse prüfen.",
      "Unterkühlung vs. Überhitzung gegeneinander abgleichen (Unterscheidung KM-Mangel vs. klemmendes EEV!).",
      "Sauggas-Temperaturfühler (korrekte Rohranlage + Wärmeleitpaste) und Drucktransmitter auf Plausibilität prüfen."
    ],
    relatedComponents: [4, 7, 1, 2]
  }
];
