/**
 * Modul: DOM-Rendering der Kältekreis-Hauptansicht (circuitView.ts)
 * Zweck: Rendert interaktive Schaltschemadaten, SVG-Zonengrenzen, Sekundärkreise und Bauteildetails
 *   sowohl für Wärmepumpen (Monoblock/Split) als auch für Split-Klima & VRV/VRF.
 * Verantwortlichkeit: Manipuliert das DOM strikt über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Vollständige Immunität gegen XSS-Angriffe durch typisierte DOM-APIs ohne String-Injektion.
 */

import { COMPONENTS } from "../data/components";
import { HVAC_COMPONENTS } from "../data/hvacComponents";
import { SYSTEMS } from "../data/systems";
import type {
  AppState,
  CategoryType,
  ComponentData,
  HeatpumpSystemType,
  HvacSystemType,
  PaletteColorKey,
  SystemType,
  ThermodynamicState
} from "../types/circuit";
import { createChevronIcon } from "./uiIcons";

export type AnyComponentData =
  | ComponentData<HeatpumpSystemType>
  | ComponentData<HvacSystemType>;

export interface CircuitDomElements {
  readonly brandMainTitle: HTMLElement;
  readonly headerSystemText: HTMLElement;
  readonly headerRefPill: HTMLElement;
  readonly btnCatHeatpump: HTMLButtonElement;
  readonly btnCatHvac: HTMLButtonElement;
  readonly btnMonoblock: HTMLButtonElement;
  readonly btnSplit: HTMLButtonElement;
  readonly btnKlimasplit: HTMLButtonElement;
  readonly btnVrv: HTMLButtonElement;
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
  readonly btnModeCooling: HTMLButtonElement;
  readonly btnModeHeating: HTMLButtonElement;
  readonly btnModeDefrost: HTMLButtonElement;
  readonly pipesHeating: SVGGElement;
  readonly pipesDefrost: SVGGElement;
  readonly lblReverseHeissgas: SVGTextElement;
  readonly valvePathsHeating: SVGGElement;
  readonly valvePathsDefrost: SVGGElement;
  readonly eevConesHeating: SVGGElement;
  readonly eevConesDefrost: SVGGElement;
  readonly comp1Title: SVGTextElement;
  readonly comp1Sub: SVGTextElement;
  readonly comp3Title: SVGTextElement;
  readonly comp3Sub: SVGTextElement;
  readonly comp4Title: SVGTextElement;
  readonly comp4Sub: SVGTextElement;
  readonly secondaryWaterLoop: SVGGElement;
  readonly secondaryAirLoop: SVGGElement;
  readonly vrvBranchBadge: SVGGElement;
  readonly airSupplyBase: SVGPathElement;
  readonly airSupplyFlow: SVGPathElement;
  readonly lblAirSupply: SVGTextElement;
  readonly airBoxTitle: SVGTextElement;
  readonly airBoxSub1: SVGTextElement;
  readonly airBoxSub2: SVGTextElement;
  readonly airBoxFoot: SVGTextElement;
  readonly legendVorlaufItem: HTMLElement;
  readonly legendVorlaufText: HTMLElement;
  readonly legendRuecklaufItem: HTMLElement;
  readonly legendRuecklaufText: HTMLElement;
  readonly legendVrvItem: HTMLElement;
  readonly svgElement: SVGSVGElement;
}

const COMPONENT_BADGE_COLORS: Readonly<Record<number, string>> = {
  1: "var(--gradient-ocean)",
  2: "var(--gradient-blossom)",
  3: "var(--gradient-honey)",
  4: "var(--gradient-sunrise)",
  5: "var(--gradient-iris)",
  6: "var(--gradient-spring)",
  7: "var(--gradient-meadow)",
  8: "var(--gradient-lagoon)",
  9: "var(--gradient-dusk)"
};

/**
 * Liefert die 9 passenden Bauteile für die gewählte Anlagenkategorie.
 */
export function getComponentsForCategory(category: CategoryType): readonly AnyComponentData[] {
  return category === "hvac" ? HVAC_COMPONENTS : COMPONENTS;
}

function isHeatpumpSystem(system: SystemType): system is HeatpumpSystemType {
  return system === "monoblock" || system === "split";
}

function isHeatpumpComponent(comp: AnyComponentData): comp is ComponentData<HeatpumpSystemType> {
  return "monoblock" in comp.thermo;
}

/**
 * Löst Einbauort und thermodynamischen Zustand typsicher anhand von System und Bauteil auf.
 */
function resolveComponentSystemData(
  comp: AnyComponentData,
  system: SystemType
): { readonly location: string; readonly thermo: ThermodynamicState } {
  if (isHeatpumpSystem(system) && isHeatpumpComponent(comp)) {
    return {
      location: comp.location[system],
      thermo: comp.thermo[system]
    };
  }
  if (!isHeatpumpSystem(system) && !isHeatpumpComponent(comp)) {
    return {
      location: comp.location[system],
      thermo: comp.thermo[system]
    };
  }
  if (isHeatpumpComponent(comp)) {
    return {
      location: comp.location.monoblock,
      thermo: comp.thermo.monoblock
    };
  }
  return {
    location: comp.location.klimasplit,
    thermo: comp.thermo.klimasplit
  };
}

/**
 * Bestimmt Titel und Farb-ID einer Bauteil-Karte abhängig von Kategorie und Betriebsmodus.
 */
function resolveComponentPresentation(
  comp: AnyComponentData,
  state: AppState
): { readonly displayName: string; readonly badgeColorId: number } {
  if (state.category === "hvac") {
    if (state.mode === "cooling") {
      if (comp.id === 1) return { displayName: "Verflüssiger – Außenluft-WT (Kühlbetrieb)", badgeColorId: 3 };
      if (comp.id === 3) return { displayName: "Verdampfer – Innengerät (Direktverdampfer)", badgeColorId: 1 };
    } else if (state.mode === "heating") {
      if (comp.id === 1) return { displayName: "Verdampfer – Außenluft-WT (Heizbetrieb)", badgeColorId: 1 };
      if (comp.id === 3) return { displayName: "Verflüssiger – Innengerät (Heizregister)", badgeColorId: 3 };
    } else {
      if (comp.id === 1) return { displayName: "Verflüssiger – Außenluft-WT (Abtau)", badgeColorId: 3 };
      if (comp.id === 3) return { displayName: "Verdampfer – Innengerät (Lüfter Stopp)", badgeColorId: 1 };
    }
    return { displayName: comp.name, badgeColorId: comp.id };
  }

  const isDefrost = state.mode === "defrost";
  const displayName =
    isDefrost && comp.id === 1
      ? "Verflüssiger – Außenluft-WT (Abtau)"
      : isDefrost && comp.id === 3
        ? "Verdampfer – Platten-WT (Abtau)"
        : comp.name;
  const badgeColorId =
    isDefrost && comp.id === 1 ? 3 : isDefrost && comp.id === 3 ? 1 : comp.id;

  return { displayName, badgeColorId };
}

/**
 * Erzeugt eine Thermo-Box (Eintritt oder Austritt) mit semantischem Pastell-Styling nach FARBPALETTE.md.
 */
function createThermoBox(
  direction: string,
  stateLabel: string,
  color: PaletteColorKey,
  metric: string,
  subText: string
): HTMLDivElement {
  const box = document.createElement("div");
  box.className = `thermo-box is-${color}`;

  const head = document.createElement("div");
  head.className = "thermo-head";

  const dirEl = document.createElement("span");
  dirEl.className = "thermo-dir";
  dirEl.textContent = direction;

  const chipEl = document.createElement("span");
  chipEl.className = `state-chip is-${color}`;
  chipEl.textContent = stateLabel;

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
 * Erzeugt eine kompakte Detailsektion innerhalb einer aufgeklappten Bauteil-Karte.
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
 * Liefert das Suffix für den Detail-Kicker im aktuellen Betriebsmodus.
 */
function getModeKickerSuffix(state: AppState): string {
  if (state.mode === "defrost") return " · Abtauphase";
  if (state.category === "hvac" && state.mode === "heating") return " · Heizbetrieb";
  if (state.category === "hvac" && state.mode === "cooling") return " · Kühlbetrieb";
  return "";
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
  const activeComponents = getComponentsForCategory(state.category);
  const isDefrost = state.mode === "defrost";
  const isHvacHeating = state.category === "hvac" && state.mode === "heating";
  const thermoHeadingText =
    state.category === "hvac"
      ? "Thermodynamischer Zustand (Kühlbetrieb A35/R27)"
      : "Thermodynamischer Zustand (Heizbetrieb A2/W35)";

  // SVG-Komponentengruppen visuell hervorheben
  const compNodes = elements.svgElement.querySelectorAll<SVGGElement>(".svg-comp");
  compNodes.forEach((node) => {
    const id = Number(node.getAttribute("data-comp"));
    const active = id === state.componentId;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });

  // In-Place-Update innerhalb derselben Kategorie erhält laufende Accordion-Transitionen (.t-acc-panel)
  if (
    elements.componentList.dataset.renderedCategory === state.category &&
    elements.componentList.childElementCount === activeComponents.length
  ) {
    const systemOrModeChanged =
      elements.componentList.dataset.renderedSystem !== sysKey ||
      elements.componentList.dataset.renderedMode !== state.mode;

    activeComponents.forEach((comp) => {
      const isOpen = comp.id === state.componentId;
      const card = document.getElementById(`comp-card-${comp.id}`);
      const trigger = card?.querySelector<HTMLButtonElement>(".comp-card-btn");
      const panel = document.getElementById(`comp-panel-${comp.id}`);
      card?.classList.toggle("is-open", isOpen);
      trigger?.classList.toggle("is-active", isOpen);
      trigger?.setAttribute("aria-expanded", String(isOpen));
      panel?.classList.toggle("is-open", isOpen);
      panel?.setAttribute("data-open", String(isOpen));

      if (systemOrModeChanged && card) {
        const { location, thermo } = resolveComponentSystemData(comp, sysKey);
        const { displayName, badgeColorId } = resolveComponentPresentation(comp, state);
        const badgeBg = COMPONENT_BADGE_COLORS[badgeColorId] ?? "var(--gradient-dusk)";

        const badgeEl = card.querySelector<HTMLElement>(".comp-icon-badge");
        if (badgeEl) badgeEl.style.background = badgeBg;

        const titleEl = card.querySelector<HTMLElement>(".comp-card-title");
        if (titleEl) titleEl.textContent = displayName;

        const previewEl = card.querySelector<HTMLElement>(".comp-card-preview");
        if (previewEl) previewEl.textContent = location;

        const metricPill = card.querySelector<HTMLElement>(".comp-metric-pill");
        if (metricPill) metricPill.textContent = thermo.outMetric;

        const kickerEl = card.querySelector<HTMLElement>(".detail-kicker");
        if (kickerEl) {
          kickerEl.textContent = `Komponente ${comp.id} von 9 · ${sysConfig.refrigerant}${getModeKickerSuffix(state)}`;
        }

        const locPill = card.querySelector<HTMLElement>(".location-pill");
        if (locPill) locPill.textContent = `Einbauort: ${location}`;

        const thermoGrid = card.querySelector<HTMLElement>(".thermo-grid");
        if (thermoGrid) {
          thermoGrid.replaceChildren(
            createThermoBox("Eintritt", thermo.inState, thermo.inColor, thermo.inMetric, thermo.inSub),
            createThermoBox("Austritt", thermo.outState, thermo.outColor, thermo.outMetric, thermo.outSub)
          );
        }

        card.querySelector<HTMLElement>(".heating-note-box")?.classList.toggle("hidden", !isHvacHeating);
        card.querySelector<HTMLElement>(".defrost-note-box")?.classList.toggle("hidden", !isDefrost);
      }
    });

    elements.componentList.dataset.renderedSystem = sysKey;
    elements.componentList.dataset.renderedMode = state.mode;
    return;
  }

  const cards: HTMLDivElement[] = activeComponents.map((comp) => {
    const isOpen = comp.id === state.componentId;
    const { location, thermo } = resolveComponentSystemData(comp, sysKey);
    const { displayName, badgeColorId } = resolveComponentPresentation(comp, state);
    const badgeBg = COMPONENT_BADGE_COLORS[badgeColorId] ?? "var(--gradient-dusk)";

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
    previewEl.textContent = location;

    const metricPill = document.createElement("span");
    metricPill.className = "comp-metric-pill tabular";
    metricPill.textContent = thermo.outMetric;

    textCol.appendChild(titleEl);
    textCol.appendChild(previewEl);
    textCol.appendChild(metricPill);
    lead.appendChild(badge);
    lead.appendChild(textCol);

    const chevron = document.createElement("span");
    chevron.className = "comp-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.appendChild(createChevronIcon());

    topRow.appendChild(lead);
    topRow.appendChild(chevron);
    trigger.appendChild(topRow);
    trigger.addEventListener("click", () => onSelectComponent(comp.id));

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
    kicker.textContent = `Komponente ${comp.id} von 9 · ${sysConfig.refrigerant}${getModeKickerSuffix(state)}`;

    const locPill = document.createElement("span");
    locPill.className = "location-pill";
    locPill.textContent = `Einbauort: ${location}`;

    metaRow.appendChild(kicker);
    metaRow.appendChild(locPill);
    body.appendChild(metaRow);

    body.appendChild(createDetailSection("Hauptaufgabe im Kältekreis", comp.task));

    const thermoSection = document.createElement("div");
    thermoSection.className = "detail-section";

    const thermoLabel = document.createElement("p");
    thermoLabel.className = "section-label";
    thermoLabel.style.marginBottom = "10px";
    thermoLabel.textContent = thermoHeadingText;

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

    if (comp.modeNoteHeating) {
      body.appendChild(
        createDetailSection(
          "Rolle im Heizbetrieb (Kreislaufumkehr)",
          comp.modeNoteHeating,
          `heating-note-box${isHvacHeating ? "" : " hidden"}`
        )
      );
    }

    body.appendChild(
      createDetailSection(
        "Rolle in der Abtauphase (Kreislaufumkehr)",
        comp.defrostNote,
        `defrost-note-box${isDefrost ? "" : " hidden"}`
      )
    );

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
  elements.componentList.dataset.renderedCategory = state.category;
  elements.componentList.dataset.renderedSystem = sysKey;
  elements.componentList.dataset.renderedMode = state.mode;
}

/**
 * Aktualisiert die Sekundärluft-Darstellung für Split-Klima & VRV im SVG-Schema.
 */
function syncSecondaryAirLoop(elements: CircuitDomElements, state: AppState): void {
  const isVrv = state.system === "vrv";
  elements.airBoxTitle.textContent = isVrv ? "Raumzonen (1…n)" : "Raumzone";

  if (state.mode === "heating") {
    elements.airSupplyBase.setAttribute("stroke", "var(--c-vorlauf)");
    elements.airSupplyFlow.setAttribute("stroke", "var(--c-vorlauf)");
    elements.airSupplyFlow.setAttribute("marker-end", "url(#arrowVorlauf)");
    elements.lblAirSupply.setAttribute("fill", "var(--c-vorlauf)");
    elements.lblAirSupply.textContent = "Zuluft (warm)";
    elements.airBoxSub1.textContent = "Heizregister-Betrieb";
    elements.airBoxSub2.textContent = "Raumluft (R20)";
    elements.airBoxFoot.textContent = "Warmstart-Regelung";
  } else if (state.mode === "defrost") {
    elements.airSupplyBase.setAttribute("stroke", "var(--c-sauggas)");
    elements.airSupplyFlow.setAttribute("stroke", "var(--c-sauggas)");
    elements.airSupplyFlow.setAttribute("marker-end", "url(#arrowSaug)");
    elements.lblAirSupply.setAttribute("fill", "var(--c-sauggas)");
    elements.lblAirSupply.textContent = "Lüfter Stopp";
    elements.airBoxSub1.textContent = "Abtauung Außen-WT";
    elements.airBoxSub2.textContent = "Kein Kaltluftzug";
    elements.airBoxFoot.textContent = "Innenlüfter Aus";
  } else {
    elements.airSupplyBase.setAttribute("stroke", "var(--c-nassdampf)");
    elements.airSupplyFlow.setAttribute("stroke", "var(--c-nassdampf)");
    elements.airSupplyFlow.setAttribute("marker-end", "url(#arrowNass)");
    elements.lblAirSupply.setAttribute("fill", "var(--c-nassdampf)");
    elements.lblAirSupply.textContent = "Zuluft (kalt)";
    elements.airBoxSub1.textContent = "Direktverdampfung";
    elements.airBoxSub2.textContent = "Raumluft (R27)";
    elements.airBoxFoot.textContent = "Kondensat-Ablauf";
  }
}

/**
 * Schaltet die animierten Kältekreis-Leitungen und Bauteilrollen zwischen den Betriebsmodi um.
 */
export function renderOperationMode(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const isHvac = state.category === "hvac";
  const isCooling = state.mode === "cooling";
  const isHeating = state.mode === "heating";
  const isDefrost = state.mode === "defrost";
  const isReverseFlow = isCooling || isDefrost;

  elements.btnModeCooling.classList.toggle("hidden", !isHvac);
  elements.btnModeHeating.textContent = isHvac
    ? "Heizbetrieb (Umkehr)"
    : "Heizbetrieb (Regelbetrieb)";

  elements.btnModeCooling.setAttribute("aria-selected", String(isCooling));
  elements.btnModeHeating.setAttribute("aria-selected", String(isHeating));
  elements.btnModeDefrost.setAttribute("aria-selected", String(isDefrost));

  elements.pipesHeating.classList.toggle("svg-layer-hidden", isReverseFlow);
  elements.pipesDefrost.classList.toggle("svg-layer-hidden", !isReverseFlow);
  elements.valvePathsHeating.classList.toggle("svg-layer-hidden", isReverseFlow);
  elements.valvePathsDefrost.classList.toggle("svg-layer-hidden", !isReverseFlow);
  elements.eevConesHeating.classList.toggle("svg-layer-hidden", isReverseFlow);
  elements.eevConesDefrost.classList.toggle("svg-layer-hidden", !isReverseFlow);

  elements.lblReverseHeissgas.textContent = isCooling
    ? "Heißgas (HD)"
    : "Heißgas (Abtauen)";

  if (isHvac) {
    if (isCooling) {
      elements.comp1Title.textContent = "Verflüssiger";
      elements.comp1Sub.textContent = "Außenluft-Wärmetauscher";
      elements.comp3Title.textContent = "Verdampfer";
      elements.comp3Sub.textContent = "Direktverdampfer · Raumluft";
    } else if (isHeating) {
      elements.comp1Title.textContent = "Verdampfer";
      elements.comp1Sub.textContent = "Außenluft-Wärmetauscher";
      elements.comp3Title.textContent = "Verflüssiger";
      elements.comp3Sub.textContent = "Heizregister · Raumluft";
    } else {
      elements.comp1Title.textContent = "Verflüssiger";
      elements.comp1Sub.textContent = "Außenluft-WT (taut ab)";
      elements.comp3Title.textContent = "Verdampfer";
      elements.comp3Sub.textContent = "Innengerät (Lüfter Stopp)";
    }
    syncSecondaryAirLoop(elements, state);
  } else {
    elements.comp1Title.textContent = isDefrost ? "Verflüssiger" : "Verdampfer";
    elements.comp1Sub.textContent = isDefrost
      ? "Außenluft-WT (taut ab)"
      : "Außenluft-Wärmetauscher";
    elements.comp3Title.textContent = isDefrost ? "Verdampfer" : "Verflüssiger";
    elements.comp3Sub.textContent = isDefrost
      ? "Platten-WT (Wärmeentzug)"
      : "Plattenwärmetauscher";
  }

  const sys = SYSTEMS[state.system];
  elements.headerRefPill.textContent = sys.refCondition[state.mode];

  renderComponentDetail(elements, state, onSelectComponent);
}

/**
 * Rendert die gewählte Anlagenkategorie und Bauart samt Banner, Sekundärkreis und SVG-Grenzen.
 */
export function renderSystemView(
  elements: CircuitDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const sys = SYSTEMS[state.system];
  const isHvac = state.category === "hvac";
  const isVrv = state.system === "vrv";

  // Haupt-Reiter & Kopfbereich synchronisieren
  elements.btnCatHeatpump.setAttribute("aria-selected", String(!isHvac));
  elements.btnCatHvac.setAttribute("aria-selected", String(isHvac));
  elements.brandMainTitle.textContent = isHvac
    ? "Kältekreislauf Split-Klima & VRV"
    : "Kältekreislauf Wärmepumpe";

  // Bauart-Tabs je Kategorie ein- bzw. ausblenden
  elements.btnMonoblock.classList.toggle("hidden", isHvac);
  elements.btnSplit.classList.toggle("hidden", isHvac);
  elements.btnKlimasplit.classList.toggle("hidden", !isHvac);
  elements.btnVrv.classList.toggle("hidden", !isHvac);

  elements.btnMonoblock.setAttribute("aria-selected", String(state.system === "monoblock"));
  elements.btnSplit.setAttribute("aria-selected", String(state.system === "split"));
  elements.btnKlimasplit.setAttribute("aria-selected", String(state.system === "klimasplit"));
  elements.btnVrv.setAttribute("aria-selected", String(isVrv));

  elements.headerSystemText.textContent = sys.headerText;
  elements.headerRefPill.textContent = sys.refCondition[state.mode];

  // Banner-Klassen und Inhalte setzen
  elements.refrigerantBanner.className = `refrigerant-banner ${sys.bannerClass}`;
  elements.bannerTitle.textContent = sys.bannerTitle;
  elements.bannerDesc.textContent = sys.bannerDesc;
  elements.bannerBadge.className = `badge-tag ${sys.badgeClass}`;
  elements.bannerBadge.textContent = sys.badgeText;

  // SVG-Systemgrenze, Sekundärkreis und VRV-Refnet anpassen
  elements.buildingBoundary.setAttribute("transform", `translate(${sys.boundaryX}, 16)`);
  elements.buildingBoundary.style.transform = `translate3d(${sys.boundaryX}px, 16px, 0)`;
  elements.zoneOutdoor.setAttribute("width", String(sys.outdoorWidth));
  elements.zoneIndoor.setAttribute("x", String(sys.indoorX));
  elements.zoneIndoor.setAttribute("width", String(sys.indoorWidth));
  elements.labelOutdoor.textContent = sys.outdoorLabel;
  elements.labelIndoor.setAttribute("x", String(sys.indoorX + 14));
  elements.labelIndoor.textContent = sys.indoorLabel;

  elements.secondaryWaterLoop.classList.toggle("svg-layer-hidden", isHvac);
  elements.secondaryAirLoop.classList.toggle("svg-layer-hidden", !isHvac);
  elements.vrvBranchBadge.classList.toggle("svg-layer-hidden", !isVrv);

  elements.comp4Title.textContent = isVrv ? "EEV (1…n)" : "EEV";
  elements.comp4Sub.textContent = isVrv ? "Je Innengerät" : "Expansionsventil";

  // Farblegende an Sekundärkreis anpassen
  elements.legendVorlaufText.textContent = isHvac ? "Zuluft (Heizbetrieb)" : "Heizung Vorlauf";
  elements.legendRuecklaufItem.classList.toggle("hidden", isHvac);
  elements.legendVrvItem.classList.toggle("hidden", !isVrv);

  renderOperationMode(elements, state, onSelectComponent);
}
