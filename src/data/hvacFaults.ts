/**
 * Modul: Fachdaten der Fehleranalyse für Split-Klima & VRV (hvacFaults.ts)
 * Zweck: Praxiserprobte Fehlerdiagnose für Direktverdampfer-, Multi-Split- und VRV/VRF-Systeme
 *   (Kondensatstörung, Innengerät-Vereisung, Ölrückführung, EEV-Verteilung, Bus-Fehler, HD-Sommer, Hygiene).
 * Verantwortlichkeit: Enthält Ursachen, Symptome, Prüfschritte und Zuordnungen zu Komponenten (1..9).
 * Sicherheitsrelevanz: Fachlich geprüfte Diagnosepfade gegen Wasserschäden, Verdichterfresser und Fehladressierung.
 */

import type { FaultData } from "../types/circuit";

export const HVAC_FAULTS: readonly FaultData[] = [
  {
    id: "condensate",
    code: "Kondensat-Alarm",
    title: "Kondensatstörung / Schwimmerschalter ausgelöst",
    severity: "Innengerät gesperrt (Wasserschutz)",
    preview: "Kondensatwanne voll, Anlage sperrt Kühlbetrieb wegen Überlaufgefahr.",
    symptoms:
      "Innengerät stoppt den Kühlbetrieb mit Kondensat-Fehlercode oder tropft aus der Decke bzw. dem Wandgehäuse. Die Kondensatpumpe läuft dauerhaft oder gar nicht an.",
    causes: [
      "Schwimmerschalter klemmt durch Biofilm, Staub oder Schleimbildung in der Kondensatwanne.",
      "Kondensatpumpe defekt, Luftblase im Ansaugschlauch oder Rückschlagventil verklebt.",
      "Kondensatleitung ohne ausreichendes Gefälle (Siphon-Effekt / Wassersack) verlegt oder geknickt.",
      "Ablaufleitung durch Algen, Flusen oder Bauschutt verstopft."
    ],
    checks: [
      "Kondensatwanne öffnen, Wasserstand prüfen und Testwasser mit sauberer Sprühflasche einfüllen.",
      "Schaltkontakt des Schwimmerschalters (Öffner/Schließer) sowie Pumpenansteuerung prüfen.",
      "Kondensatleitung durchspülen und auf stetiges Gefälle (min. 1–2 %) ohne Gegensiphon kontrollieren."
    ],
    relatedComponents: [3, 9]
  },
  {
    id: "indoor_ice",
    code: "Vereisung Innen",
    title: "Vereisung am Innengerät-Register im Kühlbetrieb",
    severity: "Luftstrom & Verdampfung gestört",
    preview: "Lamellen am Innengerät frieren zu, Ausblasleistung bricht komplett ein.",
    symptoms:
      "Das Wärmetauscher-Register des Innengeräts überzieht sich im Sommerbetrieb mit Reif oder einer dicken Eisschicht. Nach dem Abschalten taut das Eis schlagartig ab und die Wanne läuft über.",
    causes: [
      "Starker Luftmangel durch zugesetzte Grobstaubfilter, verschmutzte Lüfterwalze oder defekten EC-Lüftermotor.",
      "Kältemittelmangel (oft an Bördelverbindungen): Verdampfungsdruck sinkt unter 0 °C ab.",
      "EEV des Innengeräts öffnet nicht weit genug oder Verdampfer-Eintrittssensor (R2T) meldet zu hohe Werte.",
      "Betrieb im Kühlmodus bei zu niedrigen Außentemperaturen (< 10 °C) ohne Low-Ambient-Regelung."
    ],
    checks: [
      "Luftfilter, Lüfterwalze und freien Ansaug-/Ausblasbereich am Innengerät unmittelbar kontrollieren.",
      "Verdampfungsdruck (Saugdruck) sowie Verdampfer-Rohrfühler (NTC) im Servicemenü auslesen.",
      "Sauggasüberhitzung prüfen: > 10–12 K bei gleichzeitig vereistem Registereinlauf deutet klar auf Kältemittelmangel hin."
    ],
    relatedComponents: [3, 4, 1]
  },
  {
    id: "vrv_oil",
    code: "VRV-Öl / Komp.",
    title: "Mangelnde Ölrückführung & Öl-/Flüssigkeitsmangel (VRV)",
    severity: "Hohes Verdichterschaden-Risiko",
    preview: "Verdichter überhitzt oder fällt im langen Teillastbetrieb wegen Ölmangel aus.",
    symptoms:
      "VRV-Außeneinheit meldet Ölausgleichs-Fehler, hohe Heißgastemperatur oder Verdichter-Überstrom nach längerem Betrieb mit nur wenigen aktiven Innengeräten.",
    causes: [
      "Zu lange Teillastphasen mit niedriger Gasgeschwindigkeit in groß dimensionierten Steigleitungen (Öl bleibt im Rohrnetz liegen).",
      "Rohrdimensionierung, Ölsäcke / Steigleitungsbögen oder Refnet-Einbaulage (waagerecht/senkrecht) nicht nach Herstellervorgabe.",
      "Ölrückführungszyklus durch zu kleine Luftmengen oder geschlossene EEVs blockiert.",
      "Defekter Ölabscheider oder verstopfte Rückführbohrung im Saugakkumulator."
    ],
    checks: [
      "Manuelle Ölrückführung im Servicemenü anstoßen und Ölstands- bzw. Druckverlauf beobachten.",
      "Heißgastemperatur und Verdichter-Stromaufnahme sowie Saugüberhitzung protokollieren.",
      "Refnet-Einbaulagen und Höhenunterschiede (> 50 m) anhand der Anlagenplanung gegenprüfen."
    ],
    relatedComponents: [2, 6, 9]
  },
  {
    id: "eev_branch",
    code: "EEV / Verteilung",
    title: "Klemmendes Innengerät-EEV oder verstopfter Strainer",
    severity: "Zonenstörung / Kältemittel-Fehlverteilung",
    preview: "Einzelne Räume kühlen nicht oder pfeifen laut im Aus-Zustand.",
    symptoms:
      "Ein einzelnes Innengerät bleibt warm trotz Kühlanforderung, oder ein ausgeschaltetes Gerät vereist bzw. zischt deutlich, weil flüssiges Kältemittel durch ein undichtes EEV strömt.",
    causes: [
      "Kupferzunder durch Hartlöten ohne Stickstoff-Schutzgas verstopft das Mikrosieb (Strainer) vor dem EEV.",
      "Schrittmotor-Spule des EEV defekt, Stecker korrodiert oder Ventilnadel mechanisch verklemmt.",
      "Verwechselte Kältemittel- bzw. Steuerleitungszuordnung bei Multi-Split-Anlagen (Kreuzverdrahtung)."
    ],
    checks: [
      "Vor- und Austrittstemperaturen direkt am EEV des betroffenen Innengeräts messen (hohes ΔT am Sieb = Verstopfung).",
      "Schrittmotor-Ansteuerung manuell über Servicetest (0 auf 500+ Pulse) anfahren und Klick-/Reaktionsverhalten testen.",
      "Bei Multi-Split: EEV-Stecker und Rohrleitungen paarweise einzeln per Starttest zuordnen."
    ],
    relatedComponents: [4, 7, 8]
  },
  {
    id: "comm_bus",
    code: "Bus-Störung",
    title: "Kommunikationsfehler F1/F2-Bus & Adressierung",
    severity: "Systemstopp / Teilausfall",
    preview: "Außen- und Innengeräte finden sich nicht oder melden Bus-Timeout.",
    symptoms:
      "Fehlercode für Übertragungsfehler zwischen Außeneinheit, Innengeräten oder Zentralsteuerung. Einzelne oder alle Zonen reagieren nicht mehr auf die Fernbedienung.",
    causes: [
      "Abgeschirmte Busleitung nicht korrekt geerdet oder zusammen mit 230/400-V-Lastkabeln parallel verlegt (EMV-Störungen).",
      "Sternförmige statt lineare Verkabelung bzw. doppelte Bus-Adressen bei VRV-Innengeräten.",
      "Einzelnes Innengerät im Strang stromlos geschaltet (Sicherungsautomat aus), wodurch die Bus-Topologie unterbrochen wird."
    ],
    checks: [
      "Spannungsversorgung aller Innengeräte (gleicher Stromkreis / FI) und Busspannung an F1/F2 prüfen.",
      "Automatische Adressierung / Systemscan an der Außenzentrale prüfen (Anzahl erkannter vs. verbauter Geräte).",
      "Schirmung, Aderquerschnitt (mind. 0,75–1,5 mm² verdrillt) und getrennte Leitungsführung zu Starkstrom kontrollieren."
    ],
    relatedComponents: [9, 4, 3]
  },
  {
    id: "hd_summer",
    code: "HD-Sommerhitze",
    title: "Hochdruckabschaltung im Kühlbetrieb bei Hitze (> 35 °C)",
    severity: "Sicherheitsabschaltung HD",
    preview: "Außeneinheit überhitzt an heißen Tagen und schaltet per HD-Pressostat ab.",
    symptoms:
      "Gerät läuft morgens unauffällig, geht aber nachmittags bei praller Sonneneinstrahlung und > 32 °C Außentemperatur mit Hochdruckfehler auf Störung.",
    causes: [
      "Luftkurzschluss am Aufstellort (Außengerät in enger Nische, Hinterlüftung unter Lamellenhaube oder hinter Sichtschutzwand).",
      "Lamellen des Außenverflüssigers durch Baustellenstaub, Pappelsamen oder Küchenabluft dicht zugesetzt.",
      "Kältemittelüberfüllung bei der Inbetriebnahme (zu viel Zusatzfüllmenge eingewogen).",
      "Subcooler-Zweig in der VRV-Zentrale regelt nicht oder EC-Außenlüfter reduziert nicht mehr sauber."
    ],
    checks: [
      "Außenregister gründlich von innen nach außen reinigen und Ansaugtemperatur direkt vor den Lamellen messen.",
      "Mindestabstände für Ansaugung und Ausblas (inkl. Ausblasumlenkhauben) kontrollieren.",
      "Unterkühlung am Verflüssigeraustritt sowie Verflüssigungsdruck (Tc) mit Monteurhilfe prüfen."
    ],
    relatedComponents: [1, 2, 9]
  },
  {
    id: "smell_hygiene",
    code: "Hygiene / VDI 6022",
    title: "Geruchsbildung, Biofilm & Zugluft am Innengerät",
    severity: "Raumluftqualität & Komfortmangel",
    preview: "Modriger Geruch beim Einschalten und Schimmelsporen auf der Lüfterwalze.",
    symptoms:
      "Beim Start des Kühl- oder Lüftungsbetriebs strömt ein säuerlicher oder muffiger Geruch aus dem Innengerät; sichtbarer dunkler Belag an Ausblaslamellen und Lüfterrad.",
    causes: [
      "Fehlende Trocknungs-/Nachlauffunktion nach dem Kühlbetrieb (feuchtes Register + Staub bildet Biofilm).",
      "Dauerhafter Trockenfallen des Siphons im Kondensatablauf (Kanalgase werden ins Gerät angesaugt).",
      "Stark verschmutzte Luftfilter und unregelmäßige Hygiene-Wartung nach VDI 6022."
    ],
    checks: [
      "Filter, Verdampferlamellen, Lüfterwalze und Kondensatwanne inspizieren und mit zugelassenem Klimareiniger desinfizieren.",
      "Kondensatsiphon bzw. Geruchsverschluss prüfen (ggf. Trockensiphon mit Kugelmembran nachrüsten).",
      "Automatische Register-Trocknungsfunktion und Luftleitlamellen-Stellung in der Regelung aktivieren."
    ],
    relatedComponents: [3, 1]
  }
];
