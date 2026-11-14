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
  readonly btnMultisplit: HTMLButtonElement;
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
  readonly hvacSvgElement: SVGSVGElement;
  readonly hvacLabelOutdoor: SVGTextElement;
  readonly hvacLabelIndoor: SVGTextElement;
  readonly hvacPipesCooling: SVGGElement;
  readonly hvacPipesHeating: SVGGElement;
  readonly hvacSplitPipesCooling: SVGGElement;
  readonly hvacMultisplitPipesCooling: SVGGElement;
  readonly hvacVrvPipesCooling: SVGGElement;
  readonly hvacSplitPipesHeating: SVGGElement;
  readonly hvacMultisplitPipesHeating: SVGGElement;
  readonly hvacVrvPipesHeating: SVGGElement;
  readonly hvacLblCoolingHeissgas: SVGTextElement;
  readonly hvacValvePathsCooling: SVGGElement;
  readonly hvacValvePathsHeating: SVGGElement;
  readonly hvacComp1Title: SVGTextElement;
  readonly hvacComp1Sub: SVGTextElement;
  readonly hvacComp3Title: SVGTextElement;
  readonly hvacComp3Sub: SVGTextElement;
  readonly hvacComp3Foot: SVGTextElement;
  readonly hvacComp8Title: SVGTextElement;
  readonly hvacComp8Sub: SVGTextElement;
  readonly hvacOelBadge: SVGGElement;
  readonly hvacSplitEevComp: SVGGElement;
  readonly hvacMultisplitEevComp: SVGGElement;
  readonly hvacSplitIndoorLayer: SVGGElement;
  readonly hvacMultisplitIndoorLayer: SVGGElement;
  readonly hvacVrvIndoorLayer: SVGGElement;
  readonly hvacAirSupplyBase: SVGPathElement;
  readonly hvacAirSupplyFlow: SVGPathElement;
  readonly hvacAirStatusTitle: SVGTextElement;
  readonly hvacAirStatusSub: SVGTextElement;
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
    state.mode === "defrost"
      ? "Thermodynamischer Zustand (Abtauphase)"
      : state.category === "hvac"
        ? isHvacHeating
          ? "Thermodynamischer Zustand (Heizbetrieb A7/R20)"
          : "Thermodynamischer Zustand (Kühlbetrieb A35/R27)"
        : "Thermodynamischer Zustand (Heizbetrieb A2/W35)";

  // SVG-Komponentengruppen in beiden Schemata visuell hervorheben
  const syncSvgHighlights = (svg: SVGSVGElement): void => {
    const compNodes = svg.querySelectorAll<SVGGElement>(".svg-comp");
    compNodes.forEach((node) => {
      const id = Number(node.getAttribute("data-comp"));
      const active = id === state.componentId;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", String(active));
    });
  };
  syncSvgHighlights(elements.svgElement);
  syncSvgHighlights(elements.hvacSvgElement);

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

        const thermoHeadingEl = card.querySelector<HTMLElement>(".thermo-heading-label");
        if (thermoHeadingEl) thermoHeadingEl.textContent = thermoHeadingText;

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
    thermoLabel.className = "section-label thermo-heading-label";
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
 * Aktualisiert Leitungsfluss, 4-Wege-Ventil und Raumluft-Status im dedizierten Split-Klima/VRV-SVG.
 */
function syncHvacDedicatedSvgMode(elements: CircuitDomElements, state: AppState): void {
  const isHeating = state.mode === "heating";
  const isDefrost = state.mode === "defrost";
  const isReverseFlow = !isHeating; // Kühlbetrieb und Abtauung nutzen Verdichter -> Außen-WT

  elements.hvacPipesCooling.classList.toggle("svg-layer-hidden", !isReverseFlow);
  elements.hvacPipesHeating.classList.toggle("svg-layer-hidden", isReverseFlow);
  elements.hvacValvePathsCooling.classList.toggle("svg-layer-hidden", !isReverseFlow);
  elements.hvacValvePathsHeating.classList.toggle("svg-layer-hidden", isReverseFlow);
  elements.hvacLblCoolingHeissgas.textContent = isDefrost ? "Heißgas (Abtauen)" : "Heißgas (HD)";

  if (isHeating) {
    elements.hvacComp1Title.textContent = "Verdampfer";
    elements.hvacComp1Sub.textContent = "Außenluft-Wärmetauscher";
    elements.hvacComp3Title.textContent = "Verflüssiger (Innengerät)";
    elements.hvacComp3Sub.textContent = "Heizregister · Querstromlüfter";
    elements.hvacComp3Foot.textContent = "Warmstart-Regelung Raumluft";
  } else if (isDefrost) {
    elements.hvacComp1Title.textContent = "Verflüssiger (Abtau)";
    elements.hvacComp1Sub.textContent = "Außenluft-WT taut ab";
    elements.hvacComp3Title.textContent = "Verdampfer (Innengerät)";
    elements.hvacComp3Sub.textContent = "Cold Draft Prevention";
    elements.hvacComp3Foot.textContent = "Innenlüfter gestoppt";
  } else {
    elements.hvacComp1Title.textContent = "Verflüssiger";
    elements.hvacComp1Sub.textContent = "Außenluft-Wärmetauscher";
    elements.hvacComp3Title.textContent = "Verdampfer (Innengerät)";
    elements.hvacComp3Sub.textContent = "Direktverdampfer · Querstromlüfter";
    elements.hvacComp3Foot.textContent = "Raumluft-Wärmetauscher + Ablauf";
  }

  // Split-Raumluft-Anzeige (Zuluft)
  if (isHeating) {
    elements.hvacAirSupplyBase.setAttribute("stroke", "var(--c-vorlauf)");
    elements.hvacAirSupplyFlow.setAttribute("stroke", "var(--c-vorlauf)");
    elements.hvacAirSupplyFlow.setAttribute("marker-end", "url(#hvacArrowVorlauf)");
    elements.hvacAirStatusTitle.setAttribute("fill", "var(--c-vorlauf)");
    elements.hvacAirStatusTitle.textContent = "Zuluft (warm · Heizbetrieb)";
    elements.hvacAirStatusSub.textContent = "Raumluft R20 → Ausblas ~38 °C";
  } else if (isDefrost) {
    elements.hvacAirSupplyBase.setAttribute("stroke", "var(--c-sauggas)");
    elements.hvacAirSupplyFlow.setAttribute("stroke", "var(--c-sauggas)");
    elements.hvacAirSupplyFlow.setAttribute("marker-end", "url(#hvacArrowSaug)");
    elements.hvacAirStatusTitle.setAttribute("fill", "var(--c-sauggas)");
    elements.hvacAirStatusTitle.textContent = "Lüfter Stopp (Abtauphase)";
    elements.hvacAirStatusSub.textContent = "Kein Kaltluftzug im Raum";
  } else {
    elements.hvacAirSupplyBase.setAttribute("stroke", "var(--c-nassdampf)");
    elements.hvacAirSupplyFlow.setAttribute("stroke", "var(--c-nassdampf)");
    elements.hvacAirSupplyFlow.setAttribute("marker-end", "url(#hvacArrowNass)");
    elements.hvacAirStatusTitle.setAttribute("fill", "var(--c-nassdampf)");
    elements.hvacAirStatusTitle.textContent = "Zuluft (kalt · entfeuchtet)";
    elements.hvacAirStatusSub.textContent = "Raumluft R27 → Ausblas ~12 °C";
  }

  // VRF- und Multi-Split-Zonenkarten im SVG synchronisieren
  const zoneRoles = elements.hvacSvgElement.querySelectorAll<SVGTextElement>(
    ".hvac-vrv-unit-role, .hvac-ms-unit-role"
  );
  const zoneAirs = elements.hvacSvgElement.querySelectorAll<SVGTextElement>(
    ".hvac-vrv-unit-air, .hvac-ms-unit-air"
  );
  zoneRoles.forEach((el) => {
    el.textContent = isHeating
      ? "Verflüssiger (Heizen)"
      : isDefrost
        ? "Verdampfer (Abtau)"
        : "Direktverdampfer (Kühlen)";
  });
  zoneAirs.forEach((el) => {
    if (isHeating) {
      el.setAttribute("fill", "var(--c-vorlauf)");
      el.textContent = "Warmluft → Raum aktiv";
    } else if (isDefrost) {
      el.setAttribute("fill", "var(--c-sauggas)");
      el.textContent = "Lüfter Stopp (Kein Kaltzug)";
    } else {
      el.setAttribute("fill", "var(--c-nassdampf)");
      el.textContent = "Kaltluft → Entfeuchtung aktiv";
    }
  });
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
    syncHvacDedicatedSvgMode(elements, state);
  } else {
    elements.comp1Title.textContent = isDefrost ? "Verflüssiger" : "Verdampfer";
    elements.comp1Sub.textContent = isDefrost
      ? "Außenluft-WT (taut ab)"
      : "Außenluft-Wärmetauscher";
    elements.comp3Title.textContent = isDefrost ? "Verdampfer" : "Verflüssiger";
    elements.comp3Sub.textContent = isDefrost
      ? "Platten-WT (Entzug)"
      : "Plattenwärmetauscher";
  }

  const sys = SYSTEMS[state.system];
  elements.headerRefPill.textContent = sys.refCondition[state.mode];

  // Farblegende dynamisch an Kategorie, Bauart und Betriebsmodus anpassen
  const isVrv = state.system === "vrv";
  const showVorlaufLegend = !isHvac || isHeating;
  elements.legendVorlaufItem.classList.toggle("hidden", !showVorlaufLegend);
  elements.legendVorlaufItem.hidden = !showVorlaufLegend;
  elements.legendVorlaufText.textContent = isHvac
    ? "Zuluft (warm · Heizbetrieb)"
    : "Heizung Vorlauf";
  elements.legendRuecklaufItem.classList.toggle("hidden", isHvac);
  elements.legendRuecklaufItem.hidden = isHvac;
  elements.legendVrvItem.classList.toggle("hidden", !isVrv);
  elements.legendVrvItem.hidden = !isVrv;

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
  const isKlimasplit = state.system === "klimasplit";
  const isMultisplit = state.system === "multisplit";
  const isVrv = state.system === "vrv";

  // Haupt-Reiter & Kopfbereich synchronisieren
  elements.btnCatHeatpump.setAttribute("aria-selected", String(!isHvac));
  elements.btnCatHvac.setAttribute("aria-selected", String(isHvac));
  elements.brandMainTitle.textContent = isHvac
    ? "Luft/Luft-Wärmepumpe (Split & VRF)"
    : "Luft/Wasser-Wärmepumpe";

  // Bauart-Tabs je Kategorie ein- bzw. ausblenden
  elements.btnMonoblock.classList.toggle("hidden", isHvac);
  elements.btnSplit.classList.toggle("hidden", isHvac);
  elements.btnKlimasplit.classList.toggle("hidden", !isHvac);
  elements.btnMultisplit.classList.toggle("hidden", !isHvac);
  elements.btnVrv.classList.toggle("hidden", !isHvac);

  elements.btnMonoblock.setAttribute("aria-selected", String(state.system === "monoblock"));
  elements.btnSplit.setAttribute("aria-selected", String(state.system === "split"));
  elements.btnKlimasplit.setAttribute("aria-selected", String(isKlimasplit));
  elements.btnMultisplit.setAttribute("aria-selected", String(isMultisplit));
  elements.btnVrv.setAttribute("aria-selected", String(isVrv));

  elements.headerSystemText.textContent = sys.headerText;
  elements.headerRefPill.textContent = sys.refCondition[state.mode];

  // Banner-Klassen und Inhalte setzen
  elements.refrigerantBanner.className = `refrigerant-banner ${sys.bannerClass}`;
  elements.bannerTitle.textContent = sys.bannerTitle;
  elements.bannerDesc.textContent = sys.bannerDesc;
  elements.bannerBadge.className = `badge-tag ${sys.badgeClass}`;
  elements.bannerBadge.textContent = sys.badgeText;

  // Zwischen Wärmepumpen-SVG und dediziertem Split-Klima-/Multi-Split-/VRF-SVG umschalten
  elements.svgElement.classList.toggle("hidden", isHvac);
  elements.hvacSvgElement.classList.toggle("hidden", !isHvac);

  // SVG-Systemgrenze, Sekundärkreis, Multi-Split-Sternnetz und VRF-Y-Verteiler anpassen
  if (isHvac) {
    elements.hvacSplitIndoorLayer.classList.toggle("svg-layer-hidden", !isKlimasplit);
    elements.hvacMultisplitIndoorLayer.classList.toggle("svg-layer-hidden", !isMultisplit);
    elements.hvacVrvIndoorLayer.classList.toggle("svg-layer-hidden", !isVrv);

    elements.hvacSplitPipesCooling.classList.toggle("svg-layer-hidden", !isKlimasplit);
    elements.hvacMultisplitPipesCooling.classList.toggle("svg-layer-hidden", !isMultisplit);
    elements.hvacVrvPipesCooling.classList.toggle("svg-layer-hidden", !isVrv);

    elements.hvacSplitPipesHeating.classList.toggle("svg-layer-hidden", !isKlimasplit);
    elements.hvacMultisplitPipesHeating.classList.toggle("svg-layer-hidden", !isMultisplit);
    elements.hvacVrvPipesHeating.classList.toggle("svg-layer-hidden", !isVrv);

    elements.hvacSplitEevComp.classList.toggle("svg-layer-hidden", !isKlimasplit);
    elements.hvacMultisplitEevComp.classList.toggle("svg-layer-hidden", !isMultisplit);
    elements.hvacOelBadge.classList.toggle("svg-layer-hidden", !isVrv);

    elements.hvacLabelOutdoor.textContent = isVrv
      ? "VRF-AUSSENEINHEIT (VERFLÜSSIGER / SUBCOOLER)"
      : isMultisplit
        ? "MULTI-SPLIT-AUSSENEINHEIT (EEV-BATTERIE)"
        : "AUSSENEINHEIT (INVERTER / EEV)";
    elements.hvacLabelIndoor.textContent = isVrv
      ? "GEBÄUDE / Y-VERTEILER-ZONEN (1…64 INNENGERÄTE)"
      : isMultisplit
        ? "GEBÄUDE / SEPARATE RAUMSTRÄNGE (2–5 ZONEN)"
        : "GEBÄUDE / RAUMLUFT (DIREKTVERDAMPFUNG)";
    elements.hvacComp8Title.textContent = isVrv ? "Subcooler" : "Schauglas";
    elements.hvacComp8Sub.textContent = isVrv ? "Bypass +12–15 K" : "Feuchte-Indikator";
  } else {
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
    elements.comp4Title.textContent = "EEV";
    elements.comp4Sub.textContent = "Expansionsventil";
  }

  // Farblegende an Sekundärkreis und Betriebsmodus anpassen
  const showVorlaufLegend = !isHvac || state.mode === "heating";
  elements.legendVorlaufItem.classList.toggle("hidden", !showVorlaufLegend);
  elements.legendVorlaufItem.hidden = !showVorlaufLegend;
  elements.legendVorlaufText.textContent = isHvac
    ? "Zuluft (warm · Heizbetrieb)"
    : "Heizung Vorlauf";
  elements.legendRuecklaufItem.classList.toggle("hidden", isHvac);
  elements.legendRuecklaufItem.hidden = isHvac;
  elements.legendVrvItem.classList.toggle("hidden", !isVrv);
  elements.legendVrvItem.hidden = !isVrv;

  renderOperationMode(elements, state, onSelectComponent);
}
