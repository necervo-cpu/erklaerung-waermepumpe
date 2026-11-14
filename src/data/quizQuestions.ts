/**
 * Modul: Fachfragen für das Azubi-Prüfungstraining (quizQuestions.ts)
 * Zweck: 16 prüfungsnahe Multiple-Choice-Fragen (Gesellenprüfung Teil 1 & 2) rund um
 *   Luft/Wasser-Wärmepumpen (Kältekreis, Hydraulik, Pufferspeicher, VDI 2035) und
 *   Luft/Luft-Wärmepumpen (Split-Klima, Multi-Split, VRF, EN 378, Löttechnik).
 * Verantwortlichkeit: Liefert strukturierte Fragen mit Antwortoptionen, Erklärungen und Prüfungstipps.
 * Sicherheitsrelevanz: Vermittelt verbindliche Sicherheitsgrenzen (R290 A3, R32 A2L, VDI 2035, DIN EN 1717).
 */

import type { QuizQuestion } from "../types/circuit";

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  // --- LUFT/WASSER-WÄRMEPUMPEN (8 Fragen) ---
  {
    id: "lw-1",
    topic: "heatpump",
    badge: "Kältekreis · R290",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Welche Besonderheit gilt bei einer R290-Monoblock-Wärmepumpe (Propan, Sicherheitsgruppe A3) für die Aufstellung und Gebäudedurchführung?",
    options: [
      "Der Installateur muss vor Ort Kältemittelleitungen ins Gebäude löten und evakuieren.",
      "Der Kältekreis ist hermetisch in der Außeneinheit gekapselt; durch die Wand führen nur Heizungswasserrohre.",
      "R290 ist nicht brennbar und darf ohne Schutzabstand direkt unter Kellerfenstern aufgestellt werden.",
      "Ein Monoblock benötigt zwingend zwei getrennte Kältemittel-Sammler im Heizraum."
    ],
    correctIndex: 1,
    explanation:
      "Bei einer R290-Monoblock-Wärmepumpe bleibt der gesamte Kältekreis ab Werk hermetisch geschlossen im Außenbereich. Durch die Gebäudehülle laufen ausschließlich gedämmte Vor- und Rücklaufleitungen.",
    examTip:
      "R290 = Sicherheitsgruppe A3 (brennbar, schwerer als Luft). Schutzbereich rund um die Außeneinheit frei von Fenstern, Lichtschächten und Zündquellen halten!"
  },
  {
    id: "lw-2",
    topic: "heatpump",
    badge: "VDI 2035 · Werkstoffe",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "In einer Heizungsanlage ist ein Aluminium-Silizium-Wärmetauscher (AlSi) verbaut. Welcher pH-Wert-Bereich muss nach VDI 2035 zwingend eingehalten werden?",
    options: [
      "pH 6,0 bis 7,0 (leicht sauer)",
      "pH 8,2 bis 8,5 (strenges Aluminium-Fenster)",
      "pH 9,5 bis 11,0 (stark alkalisch)",
      "Der pH-Wert spielt bei Aluminium keine Rolle, solange enthärtet wird."
    ],
    correctIndex: 1,
    explanation:
      "Aluminium ist amphoter: Sowohl im sauren Bereich (< 8,2) als auch bei zu stark alkalischer Fahrweise (> 8,5) löst sich die schützende Aluminiumoxidschicht auf – es droht Lochfraß.",
    examTip:
      "Merke: Ohne Aluminium gilt pH 8,2–10,0; mit Aluminium zwingend pH 8,2–8,5!"
  },
  {
    id: "lw-3",
    topic: "heatpump",
    badge: "VDI 2035 · Aufbereitung",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Welche elektrische Leitfähigkeit sollte das Heizungswasser bei einer modernen Luft/Wasser-Wärmepumpe in salzarmer Fahrweise nach Erstbefüllung haben?",
    options: [
      "< 100 µS/cm (optimal 10–50 µS/cm über VE-Patrone)",
      "500 bis 1.500 µS/cm",
      "Mindestens 2.500 µS/cm für guten Wärmeübergang",
      "Genau 0,0 µS/cm wie im Labor"
    ],
    correctIndex: 0,
    explanation:
      "Die meisten Wärmepumpen-Hersteller fordern salzarmes Wasser (< 100 µS/cm) durch Vollentsalzung (Mischbettharz), um Korrosion an gelöteten Edelstahl-Plattenwärmetauschern zu verhindern.",
    examTip:
      "Reine Enthärtung (Ionentauscher) senkt nur die Härte (°dH), aber NICHT die Leitfähigkeit (µS/cm) – dafür braucht man eine VE-Patrone!"
  },
  {
    id: "lw-4",
    topic: "heatpump",
    badge: "Hydraulik · MAG",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Wie bestimmt man in der Praxis den richtigen Vordruck p₀ am Membran-Ausdehnungsgefäß (MAG) vor dem Befüllen der Anlage?",
    options: [
      "Immer pauschal 3,0 bar einstellen, passend zum Sicherheitsventil.",
      "Statische Anlagenhöhe (m) / 10 + 0,2 bis 0,3 bar Sicherheitszuschlag (im drucklosen Zustand).",
      "Im laufenden Heizbetrieb bei 60 °C Vorlauftemperatur mit dem Kompressor aufpumpen.",
      "Immer 0,5 bar unter dem statischen Wasserdruck."
    ],
    correctIndex: 1,
    explanation:
      "Der Vordruck p₀ muss die statische Wassersäule (10 m Höhe = 1 bar) plus ca. 0,2–0,3 bar Reserve überwinden, damit auch am höchsten Heizkörper kein Unterdruck entsteht. Messung immer wasserseitig drucklos über das Kappenventil!",
    examTip:
      "Beispiel: 7 m Anlagenhöhe → 0,7 bar + 0,3 bar = 1,0 bar Vordruck p₀; kalter Anlagendruck dann 1,3–1,5 bar."
  },
  {
    id: "lw-5",
    topic: "heatpump",
    badge: "Pufferspeicher",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Welche Pufferspeicher-Einbindung liefert bei einer Fußbodenheizung (1 Heizkreis) die höchste Jahresarbeitszahl (JAZ)?",
    options: [
      "Parallelpuffer (4-Leiter-Trennspeicher) mit maximaler Pumpendrehzahl",
      "Kombispeicher mit Entnahme des Heizkreis-Vorlaufs aus der obersten 55 °C-Zone",
      "Reihenpuffer im Rücklauf mit sauber eingestelltem Überströmventil",
      "Gar kein Speicher und alle Einzelraumregler dauerhaft geschlossen"
    ],
    correctIndex: 2,
    explanation:
      "Beim Reihenpuffer im Rücklauf strömt der Vorlauf ungemischt direkt von der Wärmepumpe in den Heizkreis. Es entstehen keine Exergie-/Mischungsverluste wie beim Parallelpuffer und es wird nur eine Pumpe benötigt.",
    examTip:
      "Wichtig bei Reihenschaltung: Überströmventil so einstellen, dass es im Normalbetrieb geschlossen bleibt und nur bei Abtauung oder geschlossenen ERR öffnet."
  },
  {
    id: "lw-6",
    topic: "heatpump",
    badge: "Hydraulik · Abscheider",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Wo werden Mikroblasenabscheider und Schlamm-/Magnetitabscheider in einem Wärmepumpen-Heizkreis richtig eingebaut?",
    options: [
      "Beide direkt in die Trinkwasser-Kaltwasserleitung vor den Systemtrenner.",
      "Mikroblasenabscheider an der heißesten Stelle (Vorlauf nach WP), Schlamm-/Magnetitabscheider im Rücklauf vor der WP.",
      "Schlammabscheider im Vorlauf und Mikroblasenabscheider am tiefsten Punkt im Keller.",
      "Zwischen Sicherheitsventil und Membran-Ausdehnungsgefäß."
    ],
    correctIndex: 1,
    explanation:
      "Im heißen Vorlauf ist die Gaslöslichkeit am geringsten – dort perlen Mikroblasen am besten aus. Der Schlamm-/Magnetitabscheider gehört unmittelbar vor den Wärmeerzeuger in den Rücklauf, um den Plattenwärmetauscher vor Magnetit zu schützen.",
    examTip:
      "Merksatz: Luft = heiß & oben (Vorlauf), Schlamm = vor der WP (Rücklauf)."
  },
  {
    id: "lw-7",
    topic: "heatpump",
    badge: "Sicherheit · Trinkwasser",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Welche Armatur ist nach DIN EN 1717 zwingend erforderlich, wenn eine Heizungsanlage dauerhaft oder temporär aus dem Trinkwassernetz befüllt wird?",
    options: [
      "Ein einfaches Rückschlagventil mit Schauglas",
      "Ein Systemtrenner Bauart BA (mindestens für Kategorie 3/4)",
      "Ein Überströmventil mit Skala in mbar",
      "Ein Schnellentlüfter mit Absperrautomat"
    ],
    correctIndex: 1,
    explanation:
      "Heizungswasser (besonders mit Inhibitoren/Korrosionsschutz) darf bei Druckabfall im Trinkwassernetz niemals zurückgesaugt werden. Ein Systemtrenner BA trennt die Netze mit einer belüfteten Mittelkammer sicher ab.",
    examTip:
      "Füllschlauch nach dem Befüllen trotzdem immer abnehmen, wenn kein fest installierter Systemtrenner BA mit Nachspeisestation verbaut ist!"
  },
  {
    id: "lw-8",
    topic: "heatpump",
    badge: "Störungsdiagnose · WP",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Eine Luft/Wasser-Wärmepumpe schaltet im Heizbetrieb regelmäßig mit Hochdruckstörung (HD) ab. Welche Ursache ist am wahrscheinlichsten?",
    options: [
      "Zu viel Volumenstrom in der Fußbodenheizung",
      "Zu geringer Heizwasser-Volumenstrom (Luft, verschmutzter Filter, geschlossene Ventile) am Verflüssiger",
      "Der Verdampfer im Freien ist nicht stark genug vereist",
      "Das Sicherheitsventil im Rücklauf ist zu groß dimensioniert"
    ],
    correctIndex: 1,
    explanation:
      "Kann der Verflüssiger (Plattenwärmetauscher) seine Wärme nicht an das Heizungswasser abführen, weil der Durchfluss stockt, steigen Verflüssigungstemperatur und Hochdruck stark an → HD-Pressostat schaltet ab.",
    examTip:
      "Bei HD-Störung im Heizbetrieb zuerst immer die Wärmesenke prüfen: Pumpe, Schmutzfänger, Luft, ERR-Ventile!"
  },

  // --- LUFT/LUFT-WÄRMEPUMPEN: SPLIT-KLIMA, MULTI-SPLIT & VRF (8 Fragen) ---
  {
    id: "ll-1",
    topic: "hvac",
    badge: "Luft/Luft · Aufbau",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Worin liegt der wesentliche hydraulische Unterschied zwischen einer 1:1 Split-Klimaanlage (Luft/Luft-WP) und einer Luft/Wasser-Wärmepumpe?",
    options: [
      "Die Split-Klimaanlage arbeitet mit Direktverdampfung: Kältemittel strömt direkt bis ins Innengerät ohne Heizungswasser.",
      "Die Split-Klimaanlage benötigt immer einen 300-Liter-Pufferspeicher im Keller.",
      "Bei Luft/Luft-WP wird im Innengerät ausschließlich Wasser erwärmt.",
      "Split-Klimaanlagen besitzen kein 4-Wege-Umschaltventil und können physikalisch nie heizen."
    ],
    correctIndex: 0,
    explanation:
      "Bei Luft/Luft-Wärmepumpen (Split, Multi-Split, VRF) tauscht das Kältemittel im Innengerät direkt mit der Raumluft Wärme aus (Direktverdampfer im Kühlbetrieb / Verflüssiger im Heizbetrieb). Es gibt keinen Wasserkreislauf.",
    examTip:
      "Auf den Innengeräte-Leitungen liegt je nach Betriebsart direkt Kältemittel an – dampfdiffusionsdichte Dämmung auf BEIDEN Rohren ist Pflicht!"
  },
  {
    id: "ll-2",
    topic: "hvac",
    badge: "Multi-Split vs. VRF",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Wie unterscheidet sich die Kältemittelverteilung einer Multi-Split-Anlage (2–5 Zonen) von einer VRF-Anlage?",
    options: [
      "Multi-Split nutzt eine Sternverteilung mit EEV-Batterie in der Außeneinheit; VRF nutzt eine 2-Leiter-Stammleitung mit Refnet-Y-Abzweigen und EEVs direkt an jedem Innengerät.",
      "Bei VRF dürfen maximal 2 Innengeräte angeschlossen werden, bei Multi-Split bis zu 64.",
      "Multi-Split funktioniert nur mit Wasser, VRF nur mit Propan.",
      "VRF-Anlagen besitzen keine elektronischen Expansionsventile (EEV)."
    ],
    correctIndex: 0,
    explanation:
      "Bei Multi-Split geht für jeden Raum ein eigenes Leitungspaar sternförmig von der Außeneinheit ab. Bei VRF laufen zwei Hauptleitungen (Flüssigkeit + Gas) durch das Gebäude und verzweigen über Refnet-Y-Stücke zu den Innengeräten mit eigenem EEV.",
    examTip:
      "VRF spart bei großen Gebäuden enorm viel Kupferrohr und Wanddurchbrüche durch das Stammleitungsprinzip."
  },
  {
    id: "ll-3",
    topic: "hvac",
    badge: "Löttechnik · Stickstoff",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Warum muss beim Hartlöten von Kältemittelleitungen (besonders bei VRF mit EEVs) zwingend trockener Stickstoff (N₂) durch das Rohr gespült werden?",
    options: [
      "Um das Kupferrohr schneller abzukühlen",
      "Um Zunderbildung (schwarzes Kupferoxid) im Rohrinneren zu verhindern, die EEV-Nadeln und Verdichterlager zerstört",
      "Weil Stickstoff als Kältemittel im Rohr verbleiben soll",
      "Um die Lötflamme heißer zu machen"
    ],
    correctIndex: 1,
    explanation:
      "Ohne Schutzgas reagiert der Luftsauerstoff bei Löttemperatur mit Kupfer zu schwarzem Kupferoxid (Zunder). Dieser blättert später ab und verstopft feinste EEV-Düsen, Siebe und Ölbohrungen im Kompressor.",
    examTip:
      "Stickstoff beim Löten nur mit minimalem Überdruck (ca. 0,1–0,2 bar) strömen lassen – niemals Druck aufbauen, sonst drückt es das Lot weg!"
  },
  {
    id: "ll-4",
    topic: "hvac",
    badge: "VRF · Unterkühlung",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Welche Aufgabe hat der Platten-Unterkühler (Subcooler) in der Außeneinheit einer VRF-Anlage?",
    options: [
      "Er erwärmt das Sauggas vor dem Verdichter auf 80 °C.",
      "Er kühlt das flüssige Kältemittel um 12–15 K tief in den unterkühlten Bereich, damit bei großen Steighöhen kein Flashgas vor den EEVs entsteht.",
      "Er trennt Öl vom Kältemittelgas.",
      "Er entfeuchtet die Raumluft im Innengerät."
    ],
    correctIndex: 1,
    explanation:
      "In hohen Gebäuden sinkt der Druck in der steigenden Flüssigkeitsleitung durch die geodätische Höhe (ca. 1,1 bar pro 10 m). Ohne starke Unterkühlung würde das Kältemittel vor den oberen EEVs teilweise verdampfen (Flashgas).",
    examTip:
      "Flashgas vor dem EEV erkennt man oft an zischenden Strömungsgeräuschen am Innengerät und schlechter Kühlleistung in den obersten Etagen."
  },
  {
    id: "ll-5",
    topic: "hvac",
    badge: "Sicherheit · EN 378",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Worauf muss bei der Planung einer R32-Multi-Split- oder R32-VRF-Anlage nach EN 378 besonders geachtet werden?",
    options: [
      "Nur auf die Größe des Flurs vor dem Technikraum",
      "Auf die Gesamtfüllmenge des Kreislaufs bezogen auf die Raumgrundfläche bzw. das Volumen des kleinsten angeschlossenen Raums",
      "Dass R32 niemals unter 100 bar Druck geprüft wird",
      "Dass alle Innengeräte zwingend im Freien montiert werden"
    ],
    correctIndex: 1,
    explanation:
      "R32 ist ein A2L-Kältemittel (schwer entflammbar). Bei einer Leckage könnte die gesamte Füllmenge des Kreislaufs in den kleinsten Raum austreten – wird der Grenzwert überschritten, sind z. B. Leckagesensoren oder Absperrventile nötig.",
    examTip:
      "Im Anlagenbuch immer Werksfüllung + Zusatzfüllung addieren und gegen den kleinsten Raum prüfen!"
  },
  {
    id: "ll-6",
    topic: "hvac",
    badge: "Inbetriebnahme · Vakuum",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Auf welchen Zieldruck sollte ein Kältekreis nach der Stickstoff-Druckprobe evakuiert werden, bevor die Absperrventile geöffnet werden?",
    options: [
      "Unter 500 mbar",
      "Unter 2–3 mbar (< 500 Micron) mit anschließendem Vakuum-Steigtest",
      "Genau 1,0 bar Überdruck",
      "Evakuieren ist bei R32 nicht mehr nötig"
    ],
    correctIndex: 1,
    explanation:
      "Nur bei tiefem Vakuum (< 500 Micron bzw. < 2–3 mbar) verdampft Restfeuchtigkeit im Rohrnetz vollständig und nicht-kondensierbare Gase (Luft) werden sicher entfernt. Der Steigtest beweist Dichtheit und Trockenheit.",
    examTip:
      "Feuchtigkeit im Kältekreis bildet mit Esteröl (POE) Säuren, zerstört die Kompressorwicklung und gefriert am EEV!"
  },
  {
    id: "ll-7",
    topic: "hvac",
    badge: "VRF · Ölrückführung",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Wie müssen Refnet-Y-Verteiler in einer VRF-Rohrleitung eingebaut werden, um Ölmangel und ungleiche Verteilung zu vermeiden?",
    options: [
      "In beliebiger Schräglage direkt nach einem 90°-Bogen",
      "Exakt waagerecht oder streng senkrecht mit mindestens 500 mm gerader Beruhigungsstrecke vor dem Abzweig",
      "Immer kopfüber mit Neigung zum Kompressor",
      "Nur mit Schraub-Quetschverbindungen ohne Löten"
    ],
    correctIndex: 1,
    explanation:
      "Liegt ein Y-Abzweig schräg oder direkt hinter einem Bogen, reißt die Schwerkraft bzw. Fliehkraft Öl und flüssiges Kältemittel bevorzugt in einen Strang – andere Innengeräte verhungern und der Verdichter läuft trocken.",
    examTip:
      "500 mm gerade Strecke vor jedem Refnet-Verteiler einplanen – eine der häufigsten Fehlerquellen auf Großbaustellen!"
  },
  {
    id: "ll-8",
    topic: "hvac",
    badge: "Störung · Innengerät",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Ein Split-Innengerät blinkt im Kühlbetrieb mit Störmeldung und schaltet ab, obwohl Lüfter und Außeneinheit funktionieren. Woran liegt es sehr häufig?",
    options: [
      "Der Heizungswasser-Systemtrenner ist verkalkt",
      "Der Schwimmerschalter in der Kondensatwanne hat wegen verstopftem Ablauf oder defekter Kondensatpumpe ausgelöst",
      "Das Überströmventil im Rücklaufpuffer steht auf 300 mbar",
      "Der pH-Wert des Kältemittels liegt über 8,5"
    ],
    correctIndex: 1,
    explanation:
      "Beim Kühlen entfeuchtet das Innengerät die Raumluft – es fällt viel Kondensat an. Ist der Ablauf verstopft oder die Kondensatpumpe defekt, löst der Schwimmerschalter als Wasserschadensschutz aus und stoppt das Gerät.",
    examTip:
      "Bei der Wartung immer Kondensatwanne reinigen, Ablauf mit Wasser fluten und Schwimmerschalter-Funktion testen!"
  },
  {
    id: "lw-9",
    topic: "heatpump",
    badge: "Rechenaufgabe · COP",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Rechenaufgabe: Eine Luft/Wasser-Wärmepumpe liefert bei A2/W35 eine thermische Heizleistung von 9,6 kW und nimmt dabei 2,4 kW elektrische Leistung auf. Wie groß ist der aktuelle COP?",
    options: ["COP = 3,2", "COP = 4,0", "COP = 4,8", "COP = 2,4"],
    correctIndex: 1,
    explanation:
      "Der COP (Coefficient of Performance) ist das Verhältnis aus abgegebener Wärmeleistung (Q̇_Heiz = 9,6 kW) zur aufgenommenen elektrischen Leistung (P_el = 2,4 kW): COP = 9,6 / 2,4 = 4,0.",
    examTip:
      "Formel merken: COP = Q̇_Heiz / P_el. Je kleiner die Temperaturdifferenz zwischen Quelle und Senke, desto höher der COP!"
  },
  {
    id: "lw-10",
    topic: "heatpump",
    badge: "Rechenaufgabe · Volumenstrom",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Rechenaufgabe: Eine Wärmepumpe hat 10 kW Heizleistung bei einer Spreizung ΔT = 5 K (c_Wasser ≈ 1,16 Wh/(kg·K)). Welcher Heizwasser-Volumenstrom wird benötigt?",
    options: ["ca. 860 l/h", "ca. 1.724 l/h", "ca. 3.450 l/h", "ca. 430 l/h"],
    correctIndex: 1,
    explanation:
      "Aus Q̇ = ṁ · c · ΔT folgt ṁ = Q̇ / (c · ΔT) = 10.000 W / (1,16 Wh/(kg·K) · 5 K) ≈ 1.724 kg/h ≈ 1.724 l/h. Bei ΔT = 10 K wäre es nur die Hälfte (862 l/h).",
    examTip:
      "Merksatz: Halbe Spreizung (5 K statt 10 K) bedeutet doppelter Volumenstrom – deshalb brauchen Wärmepumpen dickere Rohre als Gaskessel!"
  },
  {
    id: "lw-11",
    topic: "heatpump",
    badge: "Rechenaufgabe · Überhitzung",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Rechenaufgabe: Am ND-Manometer liest du für R290 eine Verdampfungstemperatur t₀ = −6 °C ab. Das Anlege-Thermometer am Verdampferaustritt (Sauggas) misst +1 °C. Wie groß ist die Überhitzung?",
    options: ["5 K (im Soll)", "7 K (im Soll)", "−5 K (Flüssigkeitsschlag)", "12 K (zu hoch)"],
    correctIndex: 1,
    explanation:
      "Überhitzung = Sauggastemperatur minus Verdampfungstemperatur: (+1 °C) − (−6 °C) = 7 K. Dieser Wert liegt genau im optimalen Sollbereich von 5–8 K.",
    examTip:
      "Bei negativen Verdampfungstemperaturen das Vorzeichen beachten: +1 °C minus (−6 °C) = +7 K!"
  },
  {
    id: "lw-12",
    topic: "heatpump",
    badge: "VDI 2035 & DIN EN 1717",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Welcher Systemtrenner nach DIN EN 1717 ist beim Nachfüllen von Heizungswasser mit Inhibitoren oder Glykol (Flüssigkeitskategorie 4) zwingend vorgeschrieben?",
    options: [
      "Einfacher Rückflussverhinderer EA",
      "Systemtrenner Typ CA",
      "Systemtrenner Typ BA",
      "Rohrtrenner ohne Ablauftrichter"
    ],
    correctIndex: 2,
    explanation:
      "Heizungswasser mit Inhibitoren/Frostschutz zählt zur Flüssigkeitskategorie 4 (gesundheitsgefährdende Stoffe) und erfordert zwingend einen Systemtrenner Typ BA. Ohne Zusätze (Kat. 3) reicht Typ CA (bzw. BA).",
    examTip:
      "Merke: Kategorie 4 (Zusätze/Inhibitoren) = BA; Kategorie 3 (reines Heizungswasser) = CA oder BA."
  },
  {
    id: "lw-13",
    topic: "heatpump",
    badge: "§ 14a EnWG",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Was passiert bei einer netzorientierten Steuerung nach § 14a EnWG im Netzengpass bei einer modernen EFH-Wärmepumpe?",
    options: [
      "Der Netzbetreiber schaltet die gesamte Wärmepumpe per Schütz für 2 Stunden komplett stromlos.",
      "Die elektrische Wirkleistung wird auf mindestens 4,2 kW gedimmt – der Verdichter läuft meist normal weiter, primär wird der Heizstab begrenzt.",
      "Die Vorlauftemperatur wird automatisch auf 70 °C angehoben.",
      "Die Anlage schaltet zwangsweise in den Kühlbetrieb um."
    ],
    correctIndex: 1,
    explanation:
      "§ 14a EnWG erlaubt keine harte Komplettabschaltung mehr! Es wird nur auf mindestens 4,2 kW elektrische Bezugsleistung gedimmt (über Steuerbox + EEBUS/Relais). Da der Verdichter im EFH meist deutlich unter 4,2 kW zieht, läuft er weiter.",
    examTip:
      "Alte EVU-Sperrzeiten = Komplett-Aus; neuer § 14a EnWG = Dimmung auf min. 4,2 kW elektrisch!"
  },
  {
    id: "lw-14",
    topic: "heatpump",
    badge: "Hydraulik · Puffer",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Welches Problem entsteht bei einem Parallelpuffer (hydraulische Weiche), wenn Primär- und Sekundärvolumenstrom nicht exakt abgeglichen sind?",
    options: [
      "Das Überströmventil öffnet dauerhaft.",
      "Exergievernichtung durch Durchmischung: Die Wärmepumpe muss 2–5 K heißer fahren als nötig und die JAZ sinkt.",
      "Der Kältemitteldruck fällt unter 0 bar ü.",
      "Der Systemtrenner BA löst sofort aus."
    ],
    correctIndex: 1,
    explanation:
      "Bei ungleichen Volumenströmen im Parallelpuffer mischt sich heißer Vorlauf mit kälterem Rücklauf. Durch diese Exergievernichtung muss die Wärmepumpe eine höhere Vorlauftemperatur bereitstellen, was pro Kelvin ca. 2,5 % Effizienz kostet.",
    examTip:
      "Bei Flächenheizungen ohne Mischer ist der Reihenpuffer im Rücklauf dem Parallelpuffer fast immer überlegen!"
  },
  {
    id: "ll-9",
    topic: "hvac",
    badge: "Rechenaufgabe · Unterkühlung",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Rechenaufgabe: Am HD-Manometer misst du eine Verflüssigungstemperatur t_c = +44 °C. Das Thermometer an der Flüssigkeitsleitung am Verflüssigeraustritt zeigt +39 °C. Wie groß ist die Unterkühlung?",
    options: ["5 K (im Soll 3–7 K)", "−5 K (Flashgas)", "83 K", "0 K (keine Unterkühlung)"],
    correctIndex: 0,
    explanation:
      "Unterkühlung = Verflüssigungstemperatur minus Flüssigkeitsleitungstemperatur: 44 °C − 39 °C = 5 K. Dieser Wert liegt ideal im Sollbereich von 3–7 K und verhindert Flashgas vor dem EEV.",
    examTip:
      "Überhitzung = T_Sauggas − t₀ (Verdampfer); Unterkühlung = t_c − T_Flüssig (Verflüssiger)!"
  },
  {
    id: "ll-10",
    topic: "hvac",
    badge: "Störungsdiagnose · EEV",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Eine Anlage zeigt zu tiefen Niederdruck (ND) und eine sehr hohe Überhitzung (> 15 K) – genau wie bei Kältemittelmangel. Die Unterkühlung vor dem EEV ist aber normal bis erhöht (6–8 K) und das Schauglas ist blasenfrei. Was ist die Ursache?",
    options: [
      "Kältemittelmangel durch Leckage",
      "Das Expansionsventil (EEV) klemmt zu weit zu oder der Filtertrockner vor dem EEV ist verstopft",
      "Der Plattenwärmetauscher ist wasserseitig verkalkt",
      "Der Verdichter läuft rückwärts"
    ],
    correctIndex: 1,
    explanation:
      "Bei Kältemittelmangel fehlt Kältemittel im Verflüssiger → Unterkühlung ist zu klein (< 2 K) und es entsteht Flashgas. Ist die Unterkühlung jedoch normal/hoch und der Verdampfer verhungert trotzdem, staut sich das flüssige Kältemittel vor dem klemmenden EEV oder einem verstopften Filtertrockner.",
    examTip:
      "Unterkühlung ist der Schlüssel zur Unterscheidung: KM-Mangel = niedrige Unterkühlung; klemmendes EEV = normale/hohe Unterkühlung!"
  },
  {
    id: "ll-11",
    topic: "hvac",
    badge: "Störungsdiagnose · EEV offen",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Was passiert im Kältekreis, wenn das EEV mechanisch zu weit offen klemmt?",
    options: [
      "ND steigt zu hoch an, Überhitzung fällt auf fast 0 K → nasse Verdichtung und akute Flüssigkeitsschlag-Gefahr",
      "ND fällt unter 0 bar ü und Überhitzung steigt auf 25 K",
      "Die Unterkühlung steigt auf 20 K",
      "Der Heizstab schaltet sofort ab"
    ],
    correctIndex: 0,
    explanation:
      "Ein zu weit geöffnetes EEV überflutet den Verdampfer: Zu viel Kältemittel strömt nach, der Saugdruck (ND) steigt, das Kältemittel verdampft nicht mehr vollständig und die Überhitzung bricht auf ~0 K ein. Flüssiges Kältemittel gelangt in den Verdichter.",
    examTip:
      "Überhitzung nahe 0 K bedeutet immer Lebensgefahr für den Verdichter (Flüssigkeitsschlag / Ölverdünnung)!"
  },
  {
    id: "ll-12",
    topic: "hvac",
    badge: "R290 · Schutzzone",
    examLevel: "Gesellenprüfung Teil 2",
    question:
      "Warum muss bei einer R290-Monoblock-Wärmepumpe der Kondensatanschluss ans Abwassernetz zwingend über einen frostsicheren Siphon geführt werden?",
    options: [
      "Um den Wasserdruck im Heizkreis auf 1,5 bar zu halten",
      "Damit im Leckagefall kein schwereres Propan (UEG 1,7 Vol.-%) über das Kondensatrohr in die Kanalisation strömen kann",
      "Um die Überhitzung am Verdampfer konstant auf 6 K zu halten",
      "Weil sonst die Umwälzpumpe Luft zieht"
    ],
    correctIndex: 1,
    explanation:
      "R290 (Propan, Gruppe A3) ist schwerer als Luft und sinkt zu Boden. Ohne Geruchsverschluss (Siphon) oder freie Versickerung ins Kiesbett könnte ausgetretenes Gas über den Kondensatablauf in die Kanalisation oder ins Gebäude wandern.",
    examTip:
      "Kellerfenster, Lichtschächte, ungesicherte Fallrohre und Zündquellen sind in der R290-Schutzzone (1 m am Gerät, bis 1,5–3,0 m am Boden) tabu!"
  },
  {
    id: "ll-13",
    topic: "hvac",
    badge: "Störung · Verflüssiger",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Die Anlage schaltet mit HD-Störung ab. Am Plattenwärmetauscher (Verflüssiger) misst du Vorlauf 48 °C und Rücklauf 36 °C (Spreizung ΔT = 12 K statt 5 K). Was liegt vor?",
    options: [
      "Zu geringer Wasserdurchfluss am PWT (z. B. Schmutzfänger zu, Pumpe zu schwach, ERR geschlossen) oder PWT verkalkt",
      "Kältemittelmangel im Verdampfer",
      "Außenventilator dreht zu schnell",
      "EEV klemmt zu weit offen"
    ],
    correctIndex: 0,
    explanation:
      "Wenn zu wenig Heizungswasser durch den Verflüssiger strömt oder die Platten verschmutzt/verkalkt sind, kann die Wärme nicht abgeführt werden. Die Spreizung steigt auf > 8–10 K und der Hochdruck (HD) schießt bis zur Sicherheitsabschaltung hoch.",
    examTip:
      "Hoher HD + große wasserseitige Spreizung (> 8–10 K) = Durchflussproblem oder verschmutzter PWT!"
  },
  {
    id: "ll-14",
    topic: "hvac",
    badge: "Heizkurve · Effizienz",
    examLevel: "Gesellenprüfung Teil 1",
    question:
      "Um wie viel Prozent sinkt der COP bzw. die JAZ einer Wärmepumpe ungefähr pro 1 Kelvin höherer Vorlauftemperatur?",
    options: ["ca. 0,2 %", "ca. 2,5 %", "ca. 10 %", "ca. 25 %"],
    correctIndex: 1,
    explanation:
      "Als wichtige Praxis-Faustformel gilt: Pro 1 K höherer Vorlauftemperatur sinkt der COP / die JAZ um ca. 2,5 %. Schon 4 K zu hohe Heizkurve kosten also rund 10 % Strom mehr!",
    examTip:
      "Genau deshalb wird beim thermischen Abgleich mit voll geöffneten ERR die Heizkurve so weit wie möglich abgesenkt."
  }
];
