/**
 * Modul: Fachdaten für den Hydraulik- & Heizungswasserkreis (hydraulics.ts)
 * Zweck: Azubi-gerechte Beschreibung von Hydraulikschaltungen (Reihenpuffer vs. Parallelpuffer)
 *   und den 9 zentralen Hydraulik-Bauteilen rund um Wärmepumpe, Puffer und Heizkreis.
 * Verantwortlichkeit: Stellt Varianten-Konfigurationen und Bauteildaten für die Hydraulik-Ansicht bereit.
 * Sicherheitsrelevanz: Verhindert Montagefehler an Sicherheitsventil, MAG, Schlammabscheider und Überströmventil.
 */

import type { HydraulicComponentData, HydraulicsVariant } from "../types/circuit";

export interface HydraulicsVariantConfig {
  readonly id: HydraulicsVariant;
  readonly label: string;
  readonly bannerTitle: string;
  readonly bannerDesc: string;
  readonly badgeText: string;
  readonly badgeClass: string;
  readonly bannerClass: string;
}

export const HYDRAULICS_VARIANTS: Readonly<Record<HydraulicsVariant, HydraulicsVariantConfig>> = {
  series: {
    id: "series",
    label: "Reihenpuffer + Überströmventil",
    bannerTitle: "Reihenschaltung (Rücklaufpuffer) · Effizientester Standard für Wärmepumpen",
    bannerDesc:
      "Das Heizungswasser fließt direkt von der Wärmepumpe in den Heizkreis. Der kleine Reihenpuffer sitzt im Rücklauf und sichert die Abtauenergie sowie Mindestlaufzeiten. Ein Überströmventil hält bei geschlossenen Raumthermostaten den Mindestvolumenstrom über den Puffer aufrecht.",
    badgeText: "Reihenpuffer · Beste JAZ · 1 Pumpe",
    badgeClass: "r290",
    bannerClass: "is-r290"
  },
  parallel: {
    id: "parallel",
    label: "Parallelpuffer (Entkoppelt)",
    bannerTitle: "Parallelschaltung (Trennpuffer / Stichanbindung) · Hydraulische Entkopplung",
    bannerDesc:
      "Erzeuger- und Verbraucherkreis sind über den Parallelpuffer hydraulisch entkoppelt. Ideal bei Bestandsanlagen mit unbekannten Rohrquerschnitten, mehreren Heizkreisen (z. B. Heizkörper + FBH mit Mischer) oder stark schwankender Abnahme. Wichtig: Volumenströme von Primär- und Sekundärpumpe sauber abgleichen!",
    badgeText: "Trennpuffer · 2 Pumpen · Bestandsbau",
    badgeClass: "r32",
    bannerClass: "is-r32"
  }
};

export const HYDRAULIC_COMPONENTS: readonly HydraulicComponentData[] = [
  {
    id: 1,
    shortName: "Umwälzpumpe",
    name: "Hocheffizienz-Umwälzpumpe (Primär- / Heizkreispumpe)",
    location: {
      series: "Im Rücklauf oder Vorlauf der Wärmepumpe (einzige Hauptpumpe)",
      parallel: "Primärpumpe im Wärmepumpen-Rücklauf + Sekundärpumpe(n) nach dem Puffer"
    },
    badgeColor: "sky",
    metricBadge: "ΔT: 4–7 K (FBH) · 7–10 K (HK)",
    task:
      "Fördert das Heizungswasser mit dem vom Hersteller geforderten Nenn-Volumenstrom durch den Plattenwärmetauscher der Wärmepumpe bis zu den Heizflächen. Im Gegensatz zum alten Gaskessel arbeitet die Wärmepumpe mit kleiner Spreizung (ΔT = 5 K) und hohem Massenstrom.",
    azubiRule:
      "Merke für die Prüfung: Halbe Spreizung (5 K statt 10 K) bedeutet doppelter Volumenstrom! Bei 10 kW Heizleistung und ΔT = 5 K braucht die Pumpe ca. 1.720 l/h (Q = ṁ · c · ΔT).",
    commonMistake:
      "Pumpe auf ‚AutoAdapt‘ oder zu kleiner Konstantdruck-Kennlinie stehen lassen → Volumenstrom bricht ein, Wärmepumpe geht beim Heizen oder Abtauen auf Hochdruck- oder Durchflussstörung.",
    checkValue: "Mindest- & Nennvolumenstrom (l/h) laut Datenblatt prüfen; Pumpenachse immer waagerecht einbauen."
  },
  {
    id: 2,
    shortName: "3-Wege-Ventil",
    name: "3-Wege-Umschaltventil (Heizen ↔ Trinkwarmwasser)",
    location: {
      series: "Im Vorlauf nach der Wärmepumpe (Verzweigung Heizkreis / WW-Speicher)",
      parallel: "Im Vorlauf vor dem Trennpuffer (schaltet direkt auf den WW-Speicher um)"
    },
    badgeColor: "lavender",
    metricBadge: "Umschaltzeit: ca. 10–30 s",
    task:
      "Lenkt das erwärmte Heizungswasser bedarfsabhängig entweder in den Heizkreis (Vorlauf) oder in das Register des Trinkwarmwasserspeichers (WW-Ladebetrieb mit höherer Vorlauftemperatur).",
    azubiRule:
      "Merke: Port AB ist immer der gemeinsame Eingang (von der Wärmepumpe). Port A und B teilen sich auf Heizung und Warmwasser auf – beim Verdrahten und Aufsetzen des Stellantriebs exakt auf die Markierung achten!",
    commonMistake:
      "Ventileinsatz oder Stecker vertauscht: Bei WW-Anforderung werden die Heizkörper heiß, oder umgekehrt. Außerdem nie das Ventil ohne Druckausgleich mit Gewalt drehen.",
    checkValue: "Im Testbetrieb (Relaistest) prüfen, ob der richtige Abgang warm wird (Handprobe / Vorlauffühler)."
  },
  {
    id: 3,
    shortName: "Pufferspeicher",
    name: "Pufferspeicher (Reihen- vs. Parallelpuffer)",
    location: {
      series: "Im Rücklauf in Reihe (typ. 50–100 Liter für Abtauenergie)",
      parallel: "Zwischen Wärmepumpe und Heizkreis (typ. 100–300 Liter als hydraulische Weiche)"
    },
    badgeColor: "peach",
    metricBadge: "Richtwert: ca. 10–25 l / kW",
    task:
      "Speichert thermische Energie, verhindert häufiges Takten des Verdichters bei geringer Gebäude-Heizlast und liefert beim Abtauen der Außeneinheit die benötigte Mindest-Wassermenge ohne Auskühlen des Estrichs.",
    azubiRule:
      "Merke: Beim Reihenpuffer fließt das Wasser einfach durch (keine Temperaturvermischung → höchste Effizienz). Beim Parallelpuffer droht ohne exakten Abgleich von Primär- (V̇_WP) und Sekundärvolumenstrom (V̇_HK) eine Exergievernichtung durch Durchmischung: Die WP muss 2–5 K heißer fahren als nötig und die JAZ sinkt deutlich!",
    commonMistake:
      "Beim Parallelpuffer ist der Sekundär-Volumenstrom größer als der Primär-Volumenstrom → kaltes Rücklaufwasser wird in den Vorlauf beigemischt (Vorlauftemperatur sinkt, Wärmepumpe läuft unnötig heiß).",
    checkValue: "Temperaturen an Vorlauf WP, Vorlauf Heizkreis und Pufferfühler vergleichen (max. 1–2 K Verlust)."
  },
  {
    id: 4,
    shortName: "Überströmventil",
    name: "Überströmventil / Hydraulische Entkopplung",
    location: {
      series: "Bypass zwischen Vorlauf und Rücklauf direkt vor dem Reihenpuffer",
      parallel: "Im Trennpuffer integriert (Bypass entfällt; Entkopplung über Speicher)"
    },
    badgeColor: "butter",
    metricBadge: "Differenzdruck: 250–350 mbar",
    task:
      "Öffnet selbsttätig, wenn Einzelraumregler (ERR) schließen, und muss exakt auf den Mindestvolumenstrom der Wärmepumpe bei geschlossenen ERR eingestellt werden. Im Normalbetrieb darf es NICHT dauerhaft überströmen (sonst hydraulischer Kurzschluss, Rücklaufanhebung und Takten der WP).",
    azubiRule:
      "Merke: Das Überströmventil (ÜSV) wird exakt auf den Mindestvolumenstrom bei geschlossenen ERR einreguliert und muss im Normalbetrieb komplett geschlossen bleiben! Dauerhaftes Überströmen erzeugt einen hydraulischen Kurzschluss, hebt den Rücklauf an und lässt die WP takten.",
    commonMistake:
      "Überströmventil in Richtung des falschen Pfeils eingebaut oder auf zu niedrigen Druck (z. B. 100 mbar) gestellt → ständiger Kurzschluss im Heizbetrieb.",
    checkValue: "Bei voll geöffneten Heizkreisen darf die Rücklaufleitung hinter dem Überströmventil nicht wärmer werden."
  },
  {
    id: 5,
    shortName: "MAG",
    name: "Membran-Ausdehnungsgefäß (MAG) & Kappenventil",
    location: {
      series: "Kühlere Rücklaufseite vor der Umwälzpumpe (mit Kappenventil)",
      parallel: "Am Rücklauf des Wärmeerzeugers / Puffers (mit Kappenventil)"
    },
    badgeColor: "mint",
    metricBadge: "Vordruck p0 = H_stat/10 + 0,3 bar",
    task:
      "Nimmt die Volumenausdehnung des Heizungswassers bei Erwärmung auf (Wasser dehnt sich von 10 °C auf 60 °C um ca. 1,7 % aus) und hält den Anlagendruck konstant, damit kein Wasser über das Sicherheitsventil verloren geht und keine Luft eingesaugt wird.",
    azubiRule:
      "Merke die Faustformel: Statische Höhe (Keller bis höchster Heizkörper) in Metern durch 10 + 0,3 bar = Vordruck (p0). Anlagendruck (p_Anlage) im kalten Zustand immer ca. 0,3 bar über p0 einstellen! Kappenventil immer verplomben.",
    commonMistake:
      "Vordruck wird nie geprüft (Werksvordruck 1,5 bar belassen, obwohl Haus nur 6 m hoch ist) oder im befüllten Zustand gemessen! Zum Prüfen von p0 muss das Kappenventil zu und das MAG wasserseitig drucklos entleert sein.",
    checkValue: "Jährlich Kappenventil schließen, MAG entleeren, Stickstoff-/Luftvordruck am Ventil messen."
  },
  {
    id: 6,
    shortName: "Sicherheitsgruppe",
    name: "Sicherheitsgruppe (Sicherheitsventil, Manometer, Entlüfter)",
    location: {
      series: "Am höchsten Punkt oder direkt im Vorlauf-Abgang der Wärmepumpe",
      parallel: "Direkt am Wärmeerzeuger-Vorlauf (nicht absperrbar!)"
    },
    badgeColor: "rose",
    metricBadge: "Ansprechdruck: 2,5 oder 3,0 bar",
    task:
      "Schützt Kessel, Plattenwärmetauscher und Rohrleitungen zuverlässig vor unzulässigem Überdruck. Das Manometer zeigt den Betriebsdruck, der Schnellentlüfter führt freie Luftblasen ab.",
    azubiRule:
      "Absperrverbot! Zwischen Wärmeerzeuger (Wärmepumpe) und Sicherheitsventil darf niemals ein Absperrhahn, Rückschlagventil oder eine Verengung sitzen! Abblaseleitung mit freiem Gefälle sichtbar in einen Trichtersiphon führen.",
    commonMistake:
      "Abblaseleitung fehlt, hat einen Gegendruck (zu dünn/lang) oder führt nach oben. Außerdem tropft das Sicherheitsventil oft, weil das MAG defekt oder falsch vorgespannt ist – nie einfach nur das Ventil tauschen!",
    checkValue: "Sichtprüfung auf Tropfwasser; Sicherheitsventil nur kurz anlüften, wenn Ersatz griffbereit ist (Schmutz auf Dichtsitz)."
  },
  {
    id: 7,
    shortName: "Schlammabscheider",
    name: "Schlamm- & Magnetitabscheider",
    location: {
      series: "Im Haupt-Rücklauf unmittelbar vor Eintritt in die Wärmepumpe",
      parallel: "Im Rücklauf direkt vor der Wärmepumpe (schützt den Platten-WT)"
    },
    badgeColor: "aqua",
    metricBadge: "Durchfluss-Schutz: Platten-WT & Pumpe",
    task:
      "Filtert nicht-magnetischen Schmutz (Schweißperlen, Hanf, Sand) sowie magnetisches Eisenoxid (Magnetit/schwarzer Schlamm aus Stahlheizkörpern und alten Rohren) aus dem Heizungswasser.",
    azubiRule:
      "Merke: Magnetit wandert wie ein Magnet direkt auf den permanentmagnetischen Rotor der Hocheffizienz-Umwälzpumpe und frisst ihn fest! Zudem verstopft Schlamm die extrem engen Kanäle (1–2 mm) des Plattenwärmetauschers.",
    commonMistake:
      "Magnetabscheider im Vorlauf statt im Rücklauf eingebaut, falsche Einbaulage (Pfeilrichtung!) oder bei Wartungen wird nur der Ablasshahn geöffnet, ohne vorher die Magnet-Hülse herauszuziehen.",
    checkValue: "Bei Wartung Magnetmanschette abziehen/herausziehen und erst dann Ablasshahn kurz spülen."
  },
  {
    id: 8,
    shortName: "Mikroblasenabscheider",
    name: "Mikroblasenabscheider & Handentlüftung",
    location: {
      series: "An der heißesten und druckärmsten Stelle (Vorlauf nach Wärmepumpe)",
      parallel: "Im Vorlauf unmittelbar nach der Wärmepumpe vor dem Puffer"
    },
    badgeColor: "periwinkle",
    metricBadge: "Effekt: Kavitations- & Geräuschschutz",
    task:
      "Entfernt selbst kleinste im Wasser gelöste Gas- und Luftbläschen (Mikroblasen), die an normalen Automatikentlüftern vorbeiströmen würden. Nach dem Gesetz von Henry perlt Luft bei hoher Temperatur und niedrigem Druck am leichtesten aus.",
    azubiRule:
      "Merke den besten Einbauort: Vorlauf (heißestes Wasser) direkt hinter der Wärmepumpe! Dort sind die Bläschen am größten und lassen sich am besten abscheiden.",
    commonMistake:
      "Automatikentlüfter-Kappe im Betrieb fest zugedreht gelassen oder nach Erstbefüllung vergessen zu prüfen, ob der Entlüfter leckt. Im Unterdruckbereich (z. B. vor Pumpe) kann ein Schnellentlüfter sogar Luft INS System ziehen!",
    checkValue: "Funktionsprüfung bei Inbetriebnahme; bei Gluckern in Heizkörpern Vordruck und Entlüftung prüfen."
  },
  {
    id: 9,
    shortName: "Mess- & Rückschlagarmatur",
    name: "Volumenstromsensor, Rückschlagklappe & Schwerkraftbremse",
    location: {
      series: "Im Vor-/Rücklauf (Schwerkraftbremse am WW-Kreis, Sensor am WP-Eingang)",
      parallel: "Volumenstromsensor vor WP; Rückschlagklappen in Sekundärkreisen"
    },
    badgeColor: "lime",
    metricBadge: "Fehlzirkulation = Wärmeverlust",
    task:
      "Der Volumenstromsensor (z. B. Vortex-/Flügelrad- oder Ultraschall-Geber) überwacht den Mindestdurchfluss zum Schutz vor Einfrieren beim Abtauen. Schwerkraftbremsen verhindern unerwünschte Eigenzirkulation (z. B. Entladen des WW-Speichers über Nacht).",
    azubiRule:
      "Merke: Bei jeder Wärmepumpe ist der Durchflusssensor die Lebensversicherung für den Plattenwärmetauscher! Friert im Abtaubetrieb stehendes Wasser im Platten-WT ein, platzt der Wärmetauscher (Totalschaden).",
    commonMistake:
      "Schwerkraftbremse versehentlich auf ‚Offen / Aufstellen‘ stehen gelassen → nachts wird der Warmwasserspeicher über die kalte Wärmepumpe oder Heizkörper ausgekühlt. Bei Rückschlagklappen auf Strömungsrichtung achten!",
    checkValue: "Aktuellen Durchfluss (l/min oder l/h) im Regler-Servicemenü bei Heiz- und WW-Betrieb ablesen."
  }
];
