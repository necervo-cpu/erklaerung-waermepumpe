/**
 * Modul: Fachdaten „Nice to Know“ für Split-Klima & VRF (hvacNiceToKnow.ts)
 * Zweck: Praxiswissen zu Direktverdampfung, SEER/SCOP, Unterkühlung, Stickstofflöten, EN 378 und Hygiene.
 * Verantwortlichkeit: Bereitstellung von 7 Fachkarten für Klimaanlagen- und VRF-Betreiber und Monteure.
 * Sicherheitsrelevanz: Vermittelt verbindliche Sicherheitsregeln nach EN 378 (A2L), F-Gase-VO und VDI 6022.
 */

import type { NiceToKnowItem } from "../types/circuit";

export const HVAC_NICE_TO_KNOW: readonly NiceToKnowItem[] = [
  {
    id: "seer-scop",
    category: "Effizienz & Kennzahlen",
    title: "SEER, SCOP & gleitende Verdampfung (Te)",
    badge: "SEER & Te",
    summary:
      "Im Unterschied zu alten Ein/Aus-Geräten verbringen Inverter-Split- und VRF-Anlagen rund 80–90 % ihrer Laufzeit im hocheffizienten Teillastbetrieb.",
    keyFacts: [
      "SEER & SCOP: Saisonale Effizienzwerte nach EN 14825 über vier europäische Temperatur-Bins statt starrer Nennpunkt-Angaben (EER/COP).",
      "Gleitende Verdampfungstemperatur (Te): Moderne VRF-Systeme heben Te bei milder Last von ca. +6 °C auf +11 °C an – jedes Kelvin spart 2–3 % Strom.",
      "Komfortgewinn: Durch höhere Te im Teillastbetrieb strömt weniger kalte Zugluft aus dem Innengerät, bei leiserem Lüfterbetrieb."
    ],
    proTip:
      "Lassen Sie bei VRF-Anlagen die automatische Te-Anhebung im Regelmenü aktiv, außer ein Raum verlangt gezielt starke Entfeuchtung (z. B. Server-/Laborraum)."
  },
  {
    id: "subcooling-vrv",
    category: "VRF-Hydraulik & Physik",
    title: "VRF-Subcooler & Steighöhen bis 90 m",
    badge: "Subcooler",
    summary:
      "Ohne aktive Flüssigkeits-Unterkühlung würde Kältemittel in hohen Gebäuden durch den geodätischen Druckabfall bereits vor dem EEV ausgasen.",
    keyFacts: [
      "Hydrostatischer Druckverlust: Pro 10 m Steighöhe sinkt der Flüssigkeitsdruck um ca. 1,1 bar – ohne Reserve bilden sich Flashgas-Blasen.",
      "Platten-Unterkühler (Subcooler): Ein kleiner Teilstrom wird entspannt und kühlt die Hauptflüssigkeitsleitung um 12–15 K tief in den unterkühlten Bereich.",
      "Präzise EEV-Dosierung: Nur 100 % blasenfreie Flüssigkeit garantiert leise EEV-Regelung und volle Kälteleistung im obersten Stockwerk."
    ],
    proTip:
      "Prüfen Sie bei langen VRF-Steigleitungen stets die zulässige maximale Höhendifferenz (meist 50–90 m) und dämmen Sie auch die Flüssigkeitsleitung dampfdiffusionsdicht."
  },
  {
    id: "nitrogen-brazing",
    category: "Montage & Löttechnik",
    title: "Hartlöten unter Stickstoff (N₂) & Evakuierung",
    badge: "Stickstoff N₂",
    summary:
      "Bei VRF- und Split-Anlagen mit elektronischen Expansionsventilen ist sauerstofffreies Hartlöten unter Schutzgas überlebenswichtig.",
    keyFacts: [
      "Kupferzunder vermeiden: Beim Löten ohne Stickstoffspülung bildet sich im Rohrinneren schwarzes Kupferoxid, das abplatzt und EEV-Nadeln bzw. Kompressorlager zerstört.",
      "Schutzgas-Spülung: Während des Lötens strömt trockener Stickstoff mit minimalem Überdruck (ca. 0,1–0,2 bar) durch das Kupferrohr.",
      "Tiefe Evakuierung: Nach der Dichtheitsprüfung (bis 38–42 bar je nach R32/R410A) muss auf < 2–3 mbar (< 500 Micron) mit Steigtest evakuiert werden."
    ],
    proTip:
      "Verwenden Sie zur Trocknung und Druckprobe niemals Druckluft oder Sauerstoff, sondern ausschließlich zertifizierten trockenen Stickstoff (Klasse 4.0/5.0)."
  },
  {
    id: "en378-r32",
    category: "Normen & Sicherheit",
    title: "EN 378, A2L-Kältemittel & Mindestraumvolumen",
    badge: "EN 378 · A2L",
    summary:
      "Bei R32 (A2L, schwer entflammbar) darf eine Leckage im größten oder kleinsten angeschlossenen Raum die zulässige Konzentrationsgrenze nicht überschreiten.",
    keyFacts: [
      "Gesamtfüllmenge zählt: Im Fehlerfall könnte theoretisch die gesamte Kältemittelfüllung des Kreislaufs über ein einzelnes Innengerät austreten.",
      "R32-Sicherheitsmaßnahmen: Bei kleinen Räumen oder großen VRF-Füllmengen verlangt die EN 378 R32-Leckagedetektoren, Zwangsabluft oder Sicherheitsabsperrventile.",
      "Vorteil R410A (A1) vs. R32 (A2L): R32 senkt den GWP um rund 68 % (GWP 675 vs. 2088), erfordert aber präzise Raumgrößen-Prüfung bereits in der Planung."
    ],
    proTip:
      "Dokumentieren Sie bei jeder R32-Multi-Split- oder VRF-Anlage die Gesamtfüllmenge (Werksfüllung + Zusatzfüllung) im Vergleich zur kleinsten Raumgrundfläche im Anlagenbuch."
  },
  {
    id: "oil-return",
    category: "VRF-Betriebssicherheit",
    title: "Ölrückführung & Y-Verteiler-Einbaulage",
    badge: "Ölrückführung",
    summary:
      "Kältemittel transportiert das Kompressoröl durch das gesamte Gebäude. Falsche Rohrabzweige oder zu geringe Strömungsgeschwindigkeit lassen den Verdichter trockenlaufen.",
    keyFacts: [
      "Automatische Ölrückführung: Alle 6 bis 8 Betriebsstunden hebt die VRF-Steuerung Verdichterdrehzahl und EEV-Öffnung kurz an, um Öl zurückzuspülen.",
      "Y-Verteiler-Geometrie müssen exakt waagerecht oder streng senkrecht mit gerader Vorlaufstrecke (≥ 500 mm) eingelötet werden.",
      "Rohrdimensionierung: Zu große Saugleitungsdurchmesser reduzieren die Gasgeschwindigkeit im Teillastbetrieb – Öl steigt senkrechte Steigleitungen nicht mehr hoch."
    ],
    proTip:
      "Verwenden Sie bei VRF-Rohrnetzen niemals normale Sanitär-T-Stücke statt der herstellerspezifischen Y-Verteiler (Strangabzweige) – sonst wird das Öl ungleichmäßig verteilt."
  },
  {
    id: "dehumidification",
    category: "Raumklima & Komfort",
    title: "Kühlen vs. Entfeuchten & Kondensatführung",
    badge: "Entfeuchtung",
    summary:
      "Split-Klimageräte kühlen nicht nur die Luft, sondern senken gleichzeitig die relative Raumluftfeuchte – spürbar behaglicher schon bei moderater Raumtemperatur.",
    keyFacts: [
      "Taupunktunterschreitung: Am ca. +7 °C kalten Verdampferregister kondensiert Raumfeuchte zu Wasser und wird über Wanne und Kondensatpumpe abgeführt.",
      "Optimaler Temperatur-Delta: Eine Kühlung um 4–6 K unter Außentemperatur (z. B. 24–25 °C bei 32 °C außen) fühlt sich dank trockener Luft kühl an und spart Strom.",
      "Gefälle & Geruchsverschluss: Kondensatleitungen benötigen konstantes Gefälle und bei Anschluss an das Abwassernetz einen wartbaren Trockensiphon."
    ],
    proTip:
      "Stellen Sie das Innengerät im Sommer nicht dauerhaft auf 18 °C ein – das erhöht die Stromrechnung enorm und begünstigt Zugluft sowie Kondensatprobleme an den Luftauslässen."
  },
  {
    id: "hygiene-vdi6022",
    category: "Wartung & Hygiene",
    title: "Lufthygiene nach VDI 6022 & Register-Trocknung",
    badge: "VDI 6022",
    summary:
      "Feuchte Verdampferlamellen und warme Staubablagerungen sind ideale Nährböden für Schimmel und Bakterien, wenn Geräte falsch abgeschaltet werden.",
    keyFacts: [
      "Automatischer Trocknungsnachlauf: Nach dem Kühlbetrieb lässt die Nachlauffunktion den Innenlüfter 15–30 Minuten trockenlaufen, bevor das Gerät stoppt.",
      "Filter- & Walzenpflege: Grobstaubfilter alle 4–8 Wochen absaugen; die tieferliegende Querstrom-Lüfterwalze mindestens jährlich fachgerecht reinigen lassen.",
      "Kondensatwanne & Desinfektion: Bei gewerblichen Anlagen schreibt die VDI 6022 regelmäßige Hygiene-Inspektionen der wasserbenetzten Bauteile vor."
    ],
    proTip:
      "Aktivieren Sie die Auto-Clean-/Trocknungsfunktion an der Fernbedienung und prüfen Sie vor jeder Kühlsaison Kondensatpumpe, Schwimmerschalter und Lüfterwalze."
  }
];
