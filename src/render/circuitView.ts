/**
 * Modul: DOM-Rendering der Kältekreis-Hauptansicht (circuitView.ts)
 * Zweck: Rendert interaktive Schaltschemadaten, SVG-Zonengrenzen und Bauteildetails.
 * Verantwortlichkeit: Manipuliert das DOM strikt über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Vollständige Immunität gegen XSS-Angriffe durch typisierte DOM-APIs ohne String-Injektion.
 */

import { COMPONENTS } from "../data/components";
import { SYSTEMS } from "../data/systems";
import type { AppState } from "../types/circuit";

export interface CircuitDomElements {
  readonly headerSystemText: HTMLElement;
  readonly btnMonoblock: HTMLButtonElement;
  readonly btnSplit: HTMLButtonElement;
  readonly refrigerantBanner: HTMLElement;
  readonly bannerTitle: HTMLElement;
  readonly bannerDesc: HTMLElement;
  readonly bannerBadge: HTMLElement;
  readonly buildingBoundary: SVGElement;
  readonly zoneOutdoor: SVGElement;
  readonly zoneIndoor: SVGElement;
  readonly labelOutdoor: SVGElement;
  readonly labelIndoor: SVGElement;
  readonly quickNav: HTMLElement;
  readonly detailKicker: HTMLElement;
  readonly detailTitle: HTMLElement;
  readonly detailLocation: HTMLElement;
  readonly detailTask: HTMLElement;
  readonly inStateChip: HTMLElement;
  readonly inMetric: HTMLElement;
  readonly inSub: HTMLElement;
  readonly outStateChip: HTMLElement;
  readonly outMetric: HTMLElement;
  readonly outSub: HTMLElement;
  readonly detailService: HTMLElement;
  readonly detailServiceBadge: HTMLElement;
  readonly defrostNoteBox: HTMLElement;
  readonly defrostNoteText: HTMLElement;
  readonly btnModeHeating: HTMLButtonElement;
  readonly btnModeDefrost: HTMLButtonElement;
  readonly pipesHeating: SVGGElement;
  readonly pipesDefrost: SVGGElement;
  readonly valvePathsHeating: SVGGElement;
  readonly valvePathsDefrost: SVGGElement;
  readonly comp1Title: SVGTextElement;
  readonly comp1Sub: SVGTextElement;
  readonly comp3Title: SVGTextElement;
  readonly comp3Sub: SVGTextElement;
  readonly svgElement: SVGSVGElement;
}

/**
 * Konvertiert einen Hex-Farbcode in einen transparenten RGBA-Farbwert.
 */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Weist einem Zustands-Chip Farbe, Hintergrund und Rahmen zu.
 */
function applyChipStyle(chipEl: HTMLElement, text: string, hexColor: string): void {
  chipEl.textContent = text;
  chipEl.style.color = hexColor;
  chipEl.style.background = hexToRgba(hexColor, 0.16);
  chipEl.style.border = `1px solid ${hexToRgba(hexColor, 0.36)}`;
}

/**
 * Aktualisiert die Bauteil-Schnellwahlleiste (1–9).
 */
export function renderQuickNav(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const isDefrost = state.mode === "defrost";
  const buttons: HTMLButtonElement[] = COMPONENTS.map((comp) => {
    const labelName =
      isDefrost && comp.id === 1
        ? "Verflüssiger (Abtau)"
        : isDefrost && comp.id === 3
          ? "Verdampfer (Abtau)"
          : comp.shortName;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `quick-pill press-btn${comp.id === state.componentId ? " is-active" : ""}`;
    btn.textContent = `${comp.id}. ${labelName}`;
    btn.setAttribute("aria-label", `Bauteil ${comp.id}: ${labelName}`);
    btn.setAttribute("aria-pressed", String(comp.id === state.componentId));
    btn.addEventListener("click", () => onSelectComponent(comp.id));
    return btn;
  });

  elements.quickNav.replaceChildren(...buttons);
}

/**
 * Rendert das Detailpanel der ausgewählten Komponente und hebt diese im SVG hervor.
 */
export function renderComponentDetail(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const comp =
    COMPONENTS.find((c) => c.id === state.componentId) ?? COMPONENTS[0];
  if (!comp) return;

  const sysKey = state.system;
  const sysConfig = SYSTEMS[sysKey];
  const thermo = comp.thermo[sysKey];

  // SVG-Komponentengruppen visuell hervorheben
  const compNodes = elements.svgElement.querySelectorAll<SVGGElement>(".svg-comp");
  compNodes.forEach((node) => {
    const id = Number(node.getAttribute("data-comp"));
    node.classList.toggle("is-active", id === comp.id);
    node.setAttribute("aria-pressed", String(id === comp.id));
  });

  // Schnellwahlleiste synchronisieren
  renderQuickNav(elements, state, onSelectComponent);

  // Detailtexte befüllen
  const isDefrost = state.mode === "defrost";
  elements.detailKicker.textContent = `Komponente ${comp.id} von 9 · ${sysConfig.refrigerant}${isDefrost ? " · Abtauphase" : ""}`;
  elements.detailTitle.textContent =
    isDefrost && comp.id === 1
      ? "Verflüssiger – Außenluft-WT (Abtauphase)"
      : isDefrost && comp.id === 3
        ? "Verdampfer – Platten-WT (Abtauphase)"
        : comp.name;
  elements.detailLocation.textContent = `Einbauort: ${comp.location[sysKey]}`;
  elements.detailTask.textContent = comp.task;

  // Thermodynamische Ein-/Austrittszustände
  applyChipStyle(elements.inStateChip, thermo.inState, thermo.inColor);
  elements.inMetric.textContent = thermo.inMetric;
  elements.inSub.textContent = thermo.inSub;

  applyChipStyle(elements.outStateChip, thermo.outState, thermo.outColor);
  elements.outMetric.textContent = thermo.outMetric;
  elements.outSub.textContent = thermo.outSub;

  // Abtauphasen-Hinweis je nach aktivem Betriebsmodus ein-/ausblenden
  elements.defrostNoteBox.classList.toggle("hidden", !isDefrost);
  elements.defrostNoteText.textContent = comp.defrostNote;

  // Service-Hinweise
  elements.detailService.textContent = comp.service;
  elements.detailServiceBadge.textContent = comp.serviceMetric;
}

/**
 * Schaltet die animierten Kältekreis-Leitungen zwischen Heizbetrieb und Abtauphase (Kreislaufumkehr).
 */
export function renderOperationMode(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const isDefrost = state.mode === "defrost";
  elements.btnModeHeating.setAttribute("aria-selected", String(!isDefrost));
  elements.btnModeDefrost.setAttribute("aria-selected", String(isDefrost));
  elements.pipesHeating.classList.toggle("hidden", isDefrost);
  elements.pipesDefrost.classList.toggle("hidden", !isDefrost);
  elements.valvePathsHeating.classList.toggle("hidden", isDefrost);
  elements.valvePathsDefrost.classList.toggle("hidden", !isDefrost);

  // Im Abtaubetrieb tauschen Außen-Wärmetauscher und Plattenwärmetauscher ihre Rollen
  elements.comp1Title.textContent = isDefrost ? "Verflüssiger" : "Verdampfer";
  elements.comp1Sub.textContent = isDefrost
    ? "Außenluft-WT (taut ab)"
    : "Außenluft-Wärmetauscher";
  elements.comp3Title.textContent = isDefrost ? "Verdampfer" : "Verflüssiger";
  elements.comp3Sub.textContent = isDefrost
    ? "Platten-WT (Wärmeentzug)"
    : "Plattenwärmetauscher";

  renderComponentDetail(elements, state, onSelectComponent);
}

/**
 * Rendert das gewählte System (Monoblock vs. Split) samt Banner und SVG-Grenzen.
 */
export function renderSystemView(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const sys = SYSTEMS[state.system];
  const isMono = state.system === "monoblock";

  elements.btnMonoblock.setAttribute("aria-selected", String(isMono));
  elements.btnSplit.setAttribute("aria-selected", String(!isMono));
  elements.headerSystemText.textContent = sys.headerText;

  // Banner-Klassen und Inhalte setzen
  elements.refrigerantBanner.className = `refrigerant-banner ${sys.bannerClass}`;
  elements.bannerTitle.textContent = sys.bannerTitle;
  elements.bannerDesc.textContent = sys.bannerDesc;
  elements.bannerBadge.className = `badge-tag ${sys.badgeClass}`;
  elements.bannerBadge.textContent = sys.badgeText;

  // SVG-Systemgrenze und Zonen-Geometrie anpassen
  elements.buildingBoundary.setAttribute("transform", `translate(${sys.boundaryX}, 16)`);
  elements.zoneOutdoor.setAttribute("width", String(sys.outdoorWidth));
  elements.zoneIndoor.setAttribute("x", String(sys.indoorX));
  elements.zoneIndoor.setAttribute("width", String(sys.indoorWidth));
  elements.labelOutdoor.textContent = sys.outdoorLabel;
  elements.labelIndoor.setAttribute("x", String(sys.indoorX + 14));
  elements.labelIndoor.textContent = sys.indoorLabel;

  // Komponentendetails für neues Kältemittel aktualisieren
  renderComponentDetail(elements, state, onSelectComponent);
}
