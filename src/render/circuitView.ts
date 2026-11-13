/**
 * Modul: DOM-Rendering der Kältekreis-Hauptansicht (circuitView.ts)
 * Zweck: Rendert interaktive Schaltschemadaten, SVG-Zonengrenzen und Bauteildetails.
 * Verantwortlichkeit: Manipuliert das DOM strikt über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Vollständige Immunität gegen XSS-Angriffe durch typisierte DOM-APIs ohne String-Injektion.
 */

import { COMPONENTS } from "../data/components";
import { SYSTEMS } from "../data/systems";
import type { AppState } from "../types/circuit";
import { createChevronSvg } from "./uiIcons";

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
  readonly componentList: HTMLElement;
  readonly btnModeHeating: HTMLButtonElement;
  readonly btnModeDefrost: HTMLButtonElement;
  readonly pipesHeating: SVGGElement;
  readonly pipesDefrost: SVGGElement;
  readonly valvePathsHeating: SVGGElement;
  readonly valvePathsDefrost: SVGGElement;
  readonly eevConesHeating: SVGGElement;
  readonly eevConesDefrost: SVGGElement;
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

const COMPONENT_BADGE_COLORS: Readonly<Record<number, string>> = {
  1: "linear-gradient(135deg, #64D2FF, #32ADE6)",
  2: "linear-gradient(135deg, #FF6961, #FF3B30)",
  3: "linear-gradient(135deg, #FF8A65, #FF6B35)",
  4: "linear-gradient(135deg, #FFB340, #FF9500)",
  5: "linear-gradient(135deg, #BF5AF2, #8944AB)",
  6: "linear-gradient(135deg, #4CD9C0, #2AC7B8)",
  7: "linear-gradient(135deg, #4CD964, #28CD41)",
  8: "linear-gradient(135deg, #60B5FF, #007AFF)",
  9: "linear-gradient(135deg, #FF7CA2, #FF2D55)"
};

/**
 * Erzeugt eine Thermo-Box (Eintritt oder Austritt) mit iOS-Gradient-Schimmer.
 */
function createThermoBox(
  direction: string,
  stateLabel: string,
  hexColor: string,
  metric: string,
  subText: string
): HTMLDivElement {
  const box = document.createElement("div");
  box.className = "thermo-box";
  box.style.background = `linear-gradient(135deg, ${hexToRgba(hexColor, 0.2)}, ${hexToRgba(hexColor, 0.05)})`;
  box.style.borderColor = hexToRgba(hexColor, 0.32);

  const head = document.createElement("div");
  head.className = "thermo-head";

  const dirEl = document.createElement("span");
  dirEl.className = "thermo-dir";
  dirEl.textContent = direction;

  const chipEl = document.createElement("span");
  chipEl.className = "state-chip";
  chipEl.textContent = stateLabel;
  chipEl.style.color = hexColor;
  chipEl.style.background = hexToRgba(hexColor, 0.18);
  chipEl.style.border = `1px solid ${hexToRgba(hexColor, 0.38)}`;

  head.appendChild(dirEl);
  head.appendChild(chipEl);

  const values = document.createElement("div");
  values.className = "thermo-values";

  const metricEl = document.createElement("span");
  metricEl.className = "thermo-metric tabular";
  metricEl.textContent = metric;

  const subEl = document.createElement("span");
  subEl.className = "thermo-sub";
  subEl.textContent = subText;

  values.appendChild(metricEl);
  values.appendChild(subEl);

  box.appendChild(head);
  box.appendChild(values);
  return box;
}

/**
 * Erzeugt eine kleine Detailsektion innerhalb einer aufgeklappten Bauteil-Karte.
 */
function createDetailSection(label: string, text: string, extraClass = ""): HTMLDivElement {
  const section = document.createElement("div");
  section.className = `detail-section${extraClass ? ` ${extraClass}` : ""}`;

  const labelEl = document.createElement("p");
  labelEl.className = "section-label";
  labelEl.textContent = label;

  const textEl = document.createElement("p");
  textEl.className = "section-text";
  textEl.textContent = text;

  section.appendChild(labelEl);
  section.appendChild(textEl);
  return section;
}

/**
 * Rendert alle 9 Kältekreis-Bauteile als aufklappbare iOS-Karten und synchronisiert das SVG-Highlight.
 */
export function renderComponentDetail(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const sysKey = state.system;
  const sysConfig = SYSTEMS[sysKey];
  const isDefrost = state.mode === "defrost";

  // SVG-Komponentengruppen visuell hervorheben
  const compNodes = elements.svgElement.querySelectorAll<SVGGElement>(".svg-comp");
  compNodes.forEach((node) => {
    const id = Number(node.getAttribute("data-comp"));
    const active = id === state.componentId;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });

  const cards: HTMLDivElement[] = COMPONENTS.map((comp) => {
    const isOpen = comp.id === state.componentId;
    const thermo = comp.thermo[sysKey];

    const displayName =
      isDefrost && comp.id === 1
        ? "Verflüssiger – Außenluft-WT (Abtau)"
        : isDefrost && comp.id === 3
          ? "Verdampfer – Platten-WT (Abtau)"
          : comp.name;

    // Im Abtaubetrieb tauschen Komponente 1 und 3 auch ihre Farbcodierung
    const badgeColorId =
      isDefrost && comp.id === 1 ? 3 : isDefrost && comp.id === 3 ? 1 : comp.id;
    const badgeBg =
      COMPONENT_BADGE_COLORS[badgeColorId] ?? "linear-gradient(135deg, #60B5FF, #007AFF)";

    const card = document.createElement("div");
    card.id = `comp-card-${comp.id}`;
    card.className = `comp-accordion-card${isOpen ? " is-open" : ""}`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `comp-card-btn press-card${isOpen ? " is-active" : ""}`;
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `comp-panel-${comp.id}`);

    const topRow = document.createElement("div");
    topRow.className = "comp-card-top";

    const lead = document.createElement("div");
    lead.className = "comp-card-lead";

    const badge = document.createElement("span");
    badge.className = "comp-icon-badge tabular";
    badge.style.background = badgeBg;
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = String(comp.id);

    const textCol = document.createElement("div");
    textCol.className = "comp-card-textcol";

    const titleEl = document.createElement("h3");
    titleEl.className = "comp-card-title";
    titleEl.textContent = displayName;

    const previewEl = document.createElement("p");
    previewEl.className = "comp-card-preview";
    previewEl.textContent = `${comp.location[sysKey]} · ${thermo.outMetric}`;

    textCol.appendChild(titleEl);
    textCol.appendChild(previewEl);
    lead.appendChild(badge);
    lead.appendChild(textCol);

    const chevron = document.createElement("span");
    chevron.className = "comp-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.appendChild(createChevronSvg());

    topRow.appendChild(lead);
    topRow.appendChild(chevron);
    trigger.appendChild(topRow);
    trigger.addEventListener("click", () => onSelectComponent(comp.id));

    // Aufklappbarer Detailbereich (.t-acc-panel)
    const panel = document.createElement("div");
    panel.id = `comp-panel-${comp.id}`;
    panel.className = `t-acc-panel${isOpen ? " is-open" : ""}`;
    panel.setAttribute("data-open", String(isOpen));

    const inner = document.createElement("div");
    inner.className = "t-acc-panel-inner";

    const body = document.createElement("div");
    body.className = "comp-acc-body";

    const metaRow = document.createElement("div");
    metaRow.className = "comp-acc-meta-row";

    const kicker = document.createElement("span");
    kicker.className = "detail-kicker";
    kicker.textContent = `Komponente ${comp.id} von 9 · ${sysConfig.refrigerant}${isDefrost ? " · Abtauphase" : ""}`;

    const locPill = document.createElement("span");
    locPill.className = "location-pill";
    locPill.textContent = `Einbauort: ${comp.location[sysKey]}`;

    metaRow.appendChild(kicker);
    metaRow.appendChild(locPill);
    body.appendChild(metaRow);

    // Hauptaufgabe
    body.appendChild(createDetailSection("Hauptaufgabe im Kältekreis", comp.task));

    // Thermodynamischer Zustand (Eintritt / Austritt)
    const thermoSection = document.createElement("div");
    thermoSection.className = "detail-section";

    const thermoLabel = document.createElement("p");
    thermoLabel.className = "section-label";
    thermoLabel.style.marginBottom = "10px";
    thermoLabel.textContent = "Thermodynamischer Zustand (Heizbetrieb A2/W35)";

    const thermoGrid = document.createElement("div");
    thermoGrid.className = "thermo-grid";
    thermoGrid.appendChild(
      createThermoBox("Eintritt", thermo.inState, thermo.inColor, thermo.inMetric, thermo.inSub)
    );
    thermoGrid.appendChild(
      createThermoBox("Austritt", thermo.outState, thermo.outColor, thermo.outMetric, thermo.outSub)
    );

    thermoSection.appendChild(thermoLabel);
    thermoSection.appendChild(thermoGrid);
    body.appendChild(thermoSection);

    // Abtauphasen-Hinweis (nur bei aktiver Abtauphase)
    if (isDefrost) {
      body.appendChild(
        createDetailSection(
          "Rolle in der Abtauphase (Kreislaufumkehr)",
          comp.defrostNote,
          "defrost-note-box"
        )
      );
    }

    // Service-Messgröße
    const serviceSection = createDetailSection(
      "Wichtige Messgröße für den Service",
      comp.service,
      "service-highlight"
    );
    const serviceBadge = document.createElement("span");
    serviceBadge.className = "service-metric tabular";
    serviceBadge.textContent = comp.serviceMetric;
    serviceSection.appendChild(serviceBadge);
    body.appendChild(serviceSection);

    inner.appendChild(body);
    panel.appendChild(inner);

    card.appendChild(trigger);
    card.appendChild(panel);
    return card;
  });

  elements.componentList.replaceChildren(...cards);
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
  elements.pipesHeating.classList.toggle("svg-layer-hidden", isDefrost);
  elements.pipesDefrost.classList.toggle("svg-layer-hidden", !isDefrost);
  elements.valvePathsHeating.classList.toggle("svg-layer-hidden", isDefrost);
  elements.valvePathsDefrost.classList.toggle("svg-layer-hidden", !isDefrost);
  elements.eevConesHeating.classList.toggle("svg-layer-hidden", isDefrost);
  elements.eevConesDefrost.classList.toggle("svg-layer-hidden", !isDefrost);

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
