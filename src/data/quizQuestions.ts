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
  }
];
