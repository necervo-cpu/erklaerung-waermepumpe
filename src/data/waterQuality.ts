/**
 * Modul: Fachdaten für Heizungswasser-Qualität & Aufbereitung nach VDI 2035 (waterQuality.ts)
 * Zweck: Azubigerechte Übersicht zu Sollwerten (Härte, Leitfähigkeit, pH, O2), Aufbereitungsbauteilen
 *   (Systemtrenner BA, Mischbettharz, Messgeräte) sowie Schritt-für-Schritt-Befüllung & Schadensbildern.
 * Verantwortlichkeit: Berechnet dynamische VDI-2035-Zielwerte abhängig von Werkstoff und Fahrweise.
 * Sicherheitsrelevanz: Schutz des Trinkwassers (DIN EN 1717) und Verhinderung von Korrosion/Verkalkung.
 */

import type {
  WaterEquipmentItem,
  WaterPracticeItem,
  WaterQualityMetric,
  WaterSystemMaterial,
  WaterTreatmentMode
} from "../types/circuit";

/**
 * Liefert die VDI-2035-Zielwerte abhängig von Werkstoff-Mix und Aufbereitungsart.
 */
export function getWaterQualityMetrics(
  material: WaterSystemMaterial,
  treatment: WaterTreatmentMode
): readonly WaterQualityMetric[] {
  const isAlu = material === "withAluminum";
  const isLowSalt = treatment === "lowSalt";

  const phRange = isAlu ? "8,2 – 8,5" : "8,2 – 10,0";
  const phTip = isAlu
    ? "Achtung Aluminium / AlSi! Über pH 8,5 löst sich die schützende Oxidschicht auf (starke Korrosion & Wasserstoffbildung)."
    : "Ohne Aluminium darf sich das Heizungswasser selbst alkalisieren (Eigenalkalisierung auf pH 8,2–10,0 schützt Stahlrohre).";

  return [
    {
      id: "hardness",
      name: "Gesamthärte (Erdalkalien)",
      symbol: "°dH / mmol/l",
      color: "peach",
      targetValue: isLowSalt ? "< 0,11 °dH" : "< 0,11 – 0,3 °dH",
      unit: "< 0,02 mmol/l",
      explanation:
        "Calcium- und Magnesium-Ionen fallen bei Erwärmung als Kalk (Kesselstein) aus – genau dort, wo das Wasser am heißesten ist: direkt auf den Platten des Wärmetauschers.",
      azubiTip:
        "Schon 1 mm Kalkbelag auf dem Plattenwärmetauscher senkt die Wärmeübertragung spürbar und treibt die Verflüssigungstemperatur (Hochdruck) nach oben!"
    },
    {
      id: "conductivity",
      name: "Elektrische Leitfähigkeit",
      symbol: "µS/cm (bei 25 °C)",
      color: isLowSalt ? "aqua" : "butter",
      targetValue: isLowSalt ? "< 100 µS/cm" : "100 – 1500 µS/cm",
      unit: isLowSalt ? "Salzarme Fahrweise (Standard WP)" : "Salzhaltige Fahrweise (O₂-frei!)",
      explanation: isLowSalt
        ? "Durch Vollentsalzung (Mischbettharz) werden sowohl Kationen als auch Anionen (z. B. Chlorid, Sulfat) entfernt. Ohne leitfähige Salze kann kaum noch elektrochemische Korrosion ablaufen."
        : "Bei reiner Enthärtung bleiben Natrium-, Chlorid- und Sulfat-Ionen im Wasser (Leitfähigkeit bleibt wie Leitungswasser!). Dann muss das System zwingend sauerstoffdicht sein.",
      azubiTip: isLowSalt
        ? "Die meisten Wärmepumpen-Hersteller verlangen heute zwingend salzarmes Wasser (< 100 µS/cm, optimal 10–50 µS/cm nach Erstbefüllung)!"
        : "Salzhaltiges Wasser + Sauerstoff (z. B. durch defektes MAG oder nicht diffusionsdichte Fußbodenrohre) führt sehr schnell zu Lochfraß-Korrosion!"
    },
    {
      id: "ph",
      name: "pH-Wert",
      symbol: "pH (25 °C)",
      color: isAlu ? "rose" : "mint",
      targetValue: phRange,
      unit: isAlu ? "Strenges Alu-Fenster!" : "Alkalischer Schutzbereich",
      explanation:
        "Gibt an, wie sauer oder basisch das Heizungswasser ist. Leicht alkalisches Wasser bildet auf Stahl eine schützende Passivschicht (Magnetit-Schutzfilm).",
      azubiTip: phTip
    },
    {
      id: "oxygen",
      name: "Sauerstoffgehalt & Dichtheit",
      symbol: "O₂ (mg/l)",
      color: "sky",
      targetValue: isLowSalt ? "< 0,1 mg/l" : "< 0,02 mg/l",
      unit: "Geschlossenes System",
      explanation:
        "Gelöster Sauerstoff ist der Haupttreiber für Rost (Schlamm/Magnetit) und Lochfraß. Ein geschlossener Heizkreis verbraucht seinen Anfangs-Sauerstoff innerhalb weniger Tage – solange keine neue Luft nachkommt.",
      azubiTip:
        "Typische Sauerstoff-Lecks: Alte FBH-Kunststoffrohre vor 1990 ohne EVOH-Sperrschicht (DIN 4726), falscher MAG-Vordruck (Unterdruck!) oder undichte Automatikentlüfter."
    },
    {
      id: "appearance",
      name: "Optik, Trübung & Magnetit",
      symbol: "Sichtprüfung",
      color: "periwinkle",
      targetValue: "Klar & geruchlos",
      unit: "Frei von absetzbaren Stoffen",
      explanation:
        "Sauberes Heizungswasser ist im Glas klar (maximal leicht bernsteinfarben). Schwarze Schwebstoffe deuten auf Magnetit, brauner Schlamm auf Rost und Sauerstoffzutritt hin.",
      azubiTip:
        "Immer beim Spülen am Abfluss ein weißes Tuch oder ein klares Glas drunterhalten – erst wenn das Wasser glasklar bleibt, über die Aufbereitungspatrone füllen!"
    }
  ];
}

export const WATER_EQUIPMENT: readonly WaterEquipmentItem[] = [
  {
    id: "systemtrenner",
    name: "Systemtrenner Typ BA (DIN EN 1717)",
    norm: "Pflicht bei jeder Befüllverbindung!",
    color: "rose",
    purpose:
      "Trennt das Trinkwassernetz sicher vom Heizungswasser (Flüssigkeitskategorie 3 bzw. 4 bei Inhibitoren). Verhindert bei Druckabfall im Trinkwassernetz zuverlässig das Rücksaugen von Heizungswasser.",
    installRule:
      "Immer zwischen Trinkwasser-Zapfstelle und Befüllschlauch bzw. in der festen Nachfüllstation einbauen. Niemals nur einen einfachen Rückflussverhinderer nutzen – und Füllschlauch nach dem Befüllen abklemmen, falls kein fester Systemtrenner installiert ist!",
    azubiCheck: "Abfluss-Trichter unter dem Systemtrenner BA frei? Jährliche Wartung der drei Kammern (Vor-, Mittel-, Hinterdruckzone) beachten."
  },
  {
    id: "mischbettharz",
    name: "Vollentsalzungs-Patrone (Mischbettharz)",
    norm: "Salzarm nach VDI 2035 (< 100 µS/cm)",
    color: "aqua",
    purpose:
      "Enthält sowohl Kationen- als auch Anionenaustauscher-Harz. Sie tauscht nicht nur Calcium/Magnesium gegen Natrium, sondern entfernt ALLE gelösten Salze komplett aus dem Wasser (reines VE-Wasser).",
    installRule:
      "Fließrichtung (Pfeil auf der Patrone!) einhalten und Durchfluss auf max. 3–6 l/min begrenzen, damit das Harz genug Kontaktzeit hat. Zu schnelles Füllen lässt Leitfähigkeit durchrutschen!",
    azubiCheck: "Leitfähigkeit am Auslauf der Patrone messen! Sobald der Wert über 100 µS/cm (oder Herstellervorgabe) steigt, ist die Harzpatrone erschöpft und muss getauscht werden."
  },
  {
    id: "enthaertung",
    name: "Enthärtungs-Patrone (Neutralaustausch)",
    norm: "Nur Härte weg – Salze bleiben!",
    color: "butter",
    purpose:
      "Tauscht Härtebildner (Calcium/Magnesium) gegen Natrium-Ionen aus. Der Kalk ist zwar weg, aber die elektrische Leitfähigkeit bleibt fast genauso hoch wie beim Ausgangs-Trinkwasser.",
    installRule:
      "Darf nur verwendet werden, wenn der Wärmepumpen-Hersteller ausdrücklich ‚salzhaltiges, enthärtetes Wasser‘ zulässt und alle Werkstoffe sowie die Sauerstoffdichtheit passen.",
    azubiCheck: "Auf der Baustelle nie Enthärtung mit Vollentsalzung verwechseln! Im Zweifel immer zur Mischbettharz-Vollentsalzung greifen."
  },
  {
    id: "messkoffer",
    name: "Messgeräte & Nachfüll-Logbuch (Anlagenbuch)",
    norm: "Dokumentationspflicht VDI 2035",
    color: "mint",
    purpose:
      "Leitfähigkeitsmessgerät (µS/cm), pH-Meter (oder präzise Teststreifen/Tropfen) und Härte-Tropftest weisen bei der Übergabe nach, dass das Wasser normgerecht ist – wichtig für die Herstellergarantie!",
    installRule:
      "Heizungswasser vor dem Messen auf Raumtemperatur (~20–25 °C) abkühlen lassen und erst messen, nachdem die Umwälzpumpe das Wasser mindestens 1 Stunde im gesamten Netz durchmischt hat.",
    azubiCheck: "Jeden Nachfüllvorgang (Datum, Zählerstand in Litern, µS/cm, pH, °dH) ins Anlagenbuch am Kessel/Speicher eintragen."
  }
];

export const WATER_PRACTICE_STEPS: readonly WaterPracticeItem[] = [
  {
    id: "step-flush",
    stepBadge: "Schritt 1 · Spülen",
    title: "Anlage vor der Befüllung sauber spülen (DIN EN 14336)",
    summary:
      "Besonders im Altbau oder nach Lötarbeiten sitzen Flussmittel, Hanf, Metallspäne und alter Schlamm in den Rohren – das darf niemals in den Plattenwärmetauscher der Wärmepumpe gelangen.",
    bullets: [
      "Wärmepumpe beim ersten Spülen möglichst über einen Bypass oder Absperrhähne vom alten Rohrnetz trennen, bis klares Wasser kommt.",
      "Jeden Heizkreis einzeln (Kreis für Kreis am Verteiler) mit ausreichend Druck und Luft-Wasser-Spülkompressor oder Frischwasser spülen.",
      "Erst wenn am Spül-Auslauf (weißer Eimer/Tuch) keinerlei Partikel oder Trübungen mehr sichtbar sind, ist das Netz bereit."
    ],
    warning: "Nie direkt über die Wärmepumpe den alten Heizkreis-Schmutz durchdrücken – sonst sitzt der Platten-WT schon bei der ersten Inbetriebnahme zu!"
  },
  {
    id: "step-fill",
    stepBadge: "Schritt 2 · Befüllen",
    title: "Langsam, druckkontrolliert & über VE-Patrone befüllen",
    summary:
      "Vollentsalztes Wasser (VE-Wasser) braucht Kontaktzeit im Mischbettharz. Zu schnelles Aufdrehen des KFE-Hahns ruiniert die Wasserqualität.",
    bullets: [
      "Trinkwasser → Systemtrenner BA → VE-Mischbettharzpatrone → Leitfähigkeits-Messzelle → KFE-Füllhahn im Rücklauf.",
      "Durchfluss am KFE-Hahn auf ca. 3–5 Liter pro Minute drosseln und während des Füllens regelmäßig die Auslauf-Leitfähigkeit (< 50 µS/cm ideal) prüfen.",
      "Fülldruck auf ca. 0,3 bar über dem gemessenen MAG-Vordruck (p0) einstellen (meist 1,5–1,8 bar im Einfamilienhaus)."
    ],
    warning: "Mischbettharz-Patrone niemals über 50 °C heißem Rücklaufwasser aussetzen oder rückwärts durchströmen!"
  },
  {
    id: "step-check",
    stepBadge: "Schritt 3 · Kontrolle",
    title: "Entlüften, Umwälzen & Nachkontrolle nach 4–8 Wochen",
    summary:
      "Nach der Erstbefüllung stellt sich der endgültige pH-Wert erst durch die sogenannte Eigenalkalisierung im System ein.",
    bullets: [
      "Entlüftungsprogramm der Wärmepumpe starten und alle Heizkörper / FBH-Heizkreisverteiler einzeln entlüften.",
      "Nach 1–2 Stunden Umwälzung eine Wasserprobe entnehmen, abkühlen lassen und Leitfähigkeit, Härte sowie pH-Wert protokollieren.",
      "Nach 4–8 Wochen Heizbetrieb erneut pH-Wert prüfen (Eigenalkalisierung auf 8,2–9,5 bzw. max. 8,5 bei Alu) und Schlammsammler kontrollieren."
    ],
    warning: "Muss eine Anlage ständig nachgefüllt werden (Druckverlust!), liegt ein Leck oder ein defektes MAG vor – niemals einfach unaufbereitetes Wasser nachkippen!"
  },
  {
    id: "step-damage",
    stepBadge: "Praxiswissen · Schäden",
    title: "Was passiert bei falschem Heizungswasser?",
    summary:
      "Hersteller lehnen Garantieansprüche an Plattenwärmetauschern und Umwälzpumpen fast immer ab, wenn kein VDI-2035-Protokoll vorliegt.",
    bullets: [
      "Zu hartes Wasser (> 3 °dH): Kalkschicht auf dem Platten-WT → Hochdruck-Störung, schlechte JAZ, im Extremfall Durchfrieren beim Abtauen.",
      "Hohe Leitfähigkeit + Sauerstoff: Elektrochemische Lochfraß-Korrosion an Heizkörpern, Stahlrohren und Wärmetauschern + schwarzer Magnetit-Schlamm.",
      "pH > 8,5 bei Aluminium/AlSi: Auflösung der Schutzschicht → weißer Alu-Schlamm (Hydroxid), Gasbildung im System und Lochfraß."
    ],
    warning: "Keine ‚Wundermittel‘ / chemischen Inhibitoren unkontrolliert mischen – bei salzarmem VE-Wasser (< 100 µS/cm) sind im geschlossenen Netz meist gar keine Zusätze nötig!"
  }
];
