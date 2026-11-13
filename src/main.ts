/**
 * Modul: Einstiegspunkt der Anwendung (main.ts)
 * Zweck: Initialisiert State, DOM-Events, 3-Stufen-Theme-Umschaltung und koordinierte Render-Zyklen.
 * Verantwortlichkeit: Verbindet Fachdaten, Benutzereingaben und DOM-Renderer typsicher ohne any.
 * Sicherheitsrelevanz: Strikte Validierung der DOM-Elemente über requireElement zur Vermeidung von Null-Pointer-Exceptions.
 */

// theme-init muss als allererstes ausgeführt werden, um FOUC zu verhindern
import "./theme-init";
import "./styles/liquid-glass-tokens.css";
import "./styles/app.css";

import {
  cycleThemeMode,
  getStoredThemeMode,
  getThemeModeLabel,
  type ThemeMode
} from "./theme-init";
import type { AppState, SystemType, ViewType } from "./types/circuit";
import {
  renderComponentDetail,
  renderSystemView,
  type CircuitDomElements
} from "./render/circuitView";
import {
  renderFaultsView,
  type FaultsDomElements
} from "./render/faultsView";
import { renderNiceToKnowView } from "./render/niceToKnowView";

/**
 * Typsicherer DOM-Helper, der ein Element anfordert oder einen aussagekräftigen Fehler wirft.
 */
function requireElement<T extends Element>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) {
    throw new Error(`Kritisches DOM-Element nicht gefunden: ${selector}`);
  }
  return el;
}

/**
 * Reaktiv gehaltener Zustand der Fachanwendung.
 */
const state: AppState = {
  system: "monoblock",
  view: "circuit",
  componentId: 1,
  faultId: "hd"
};

let currentTheme: ThemeMode = getStoredThemeMode();

// DOM-Elemente für den Kältekreis
const circuitElements: CircuitDomElements = {
  headerSystemText: requireElement<HTMLElement>("#headerSystemText"),
  btnMonoblock: requireElement<HTMLButtonElement>("#btnMonoblock"),
  btnSplit: requireElement<HTMLButtonElement>("#btnSplit"),
  refrigerantBanner: requireElement<HTMLElement>("#refrigerantBanner"),
  bannerTitle: requireElement<HTMLElement>("#bannerTitle"),
  bannerDesc: requireElement<HTMLElement>("#bannerDesc"),
  bannerBadge: requireElement<HTMLElement>("#bannerBadge"),
  buildingBoundary: requireElement<SVGElement>("#buildingBoundary"),
  zoneOutdoor: requireElement<SVGElement>("#zoneOutdoor"),
  zoneIndoor: requireElement<SVGElement>("#zoneIndoor"),
  labelOutdoor: requireElement<SVGElement>("#labelOutdoor"),
  labelIndoor: requireElement<SVGElement>("#labelIndoor"),
  quickNav: requireElement<HTMLElement>("#quickNav"),
  detailKicker: requireElement<HTMLElement>("#detailKicker"),
  detailTitle: requireElement<HTMLElement>("#detailTitle"),
  detailLocation: requireElement<HTMLElement>("#detailLocation"),
  detailTask: requireElement<HTMLElement>("#detailTask"),
  inStateChip: requireElement<HTMLElement>("#inStateChip"),
  inMetric: requireElement<HTMLElement>("#inMetric"),
  inSub: requireElement<HTMLElement>("#inSub"),
  outStateChip: requireElement<HTMLElement>("#outStateChip"),
  outMetric: requireElement<HTMLElement>("#outMetric"),
  outSub: requireElement<HTMLElement>("#outSub"),
  detailService: requireElement<HTMLElement>("#detailService"),
  detailServiceBadge: requireElement<HTMLElement>("#detailServiceBadge"),
  svgElement: requireElement<SVGSVGElement>("#circuitSvg")
};

// DOM-Elemente für die Fehleranalyse
const faultsElements: FaultsDomElements = {
  faultList: requireElement<HTMLElement>("#faultList"),
  faultTitle: requireElement<HTMLElement>("#faultTitle"),
  faultSeverity: requireElement<HTMLElement>("#faultSeverity"),
  faultSymptoms: requireElement<HTMLElement>("#faultSymptoms"),
  faultCauses: requireElement<HTMLUListElement>("#faultCauses"),
  faultChecks: requireElement<HTMLUListElement>("#faultChecks"),
  faultActions: requireElement<HTMLElement>("#faultActions")
};

// Globale Layout-Elemente
const viewCircuit = requireElement<HTMLElement>("#viewCircuit");
const viewFaults = requireElement<HTMLElement>("#viewFaults");
const viewNiceToKnow = requireElement<HTMLElement>("#viewNiceToKnow");
const btnViewCircuit = requireElement<HTMLButtonElement>("#btnViewCircuit");
const btnViewFaults = requireElement<HTMLButtonElement>("#btnViewFaults");
const btnViewNiceToKnow = requireElement<HTMLButtonElement>("#btnViewNiceToKnow");
const niceGrid = requireElement<HTMLElement>("#niceGrid");
const btnThemeToggle = requireElement<HTMLButtonElement>("#btnThemeToggle");
const themeIconLabel = requireElement<HTMLElement>("#themeIconLabel");

/**
 * Aktualisiert die Ansichtsauswahl (Kältekreis vs. Störungsbilder vs. Nice to Know).
 */
function renderViewSwitcher(): void {
  const isCircuit = state.view === "circuit";
  const isFaults = state.view === "faults";
  const isNice = state.view === "niceToKnow";

  btnViewCircuit.setAttribute("aria-selected", String(isCircuit));
  btnViewFaults.setAttribute("aria-selected", String(isFaults));
  btnViewNiceToKnow.setAttribute("aria-selected", String(isNice));

  viewCircuit.classList.toggle("hidden", !isCircuit);
  viewFaults.classList.toggle("hidden", !isFaults);
  viewNiceToKnow.classList.toggle("hidden", !isNice);
}

/**
 * Aktualisiert die visuelle Darstellung des 3-Stufen-Theme-Buttons.
 */
function updateThemeButton(mode: ThemeMode): void {
  const label = getThemeModeLabel(mode);
  themeIconLabel.textContent = label;
  btnThemeToggle.setAttribute(
    "aria-label",
    `Darstellungsmodus umschalten (aktuell: ${label})`
  );
  btnThemeToggle.setAttribute("data-theme-state", mode);
}

/**
 * Wählt eine Kältekreiskomponente aus und aktualisiert das Detailpanel.
 */
function handleSelectComponent(id: number): void {
  state.componentId = id;
  renderComponentDetail(circuitElements, state, handleSelectComponent);
}

/**
 * Wählt ein Störungsbild aus und aktualisiert die Fehlerdetails.
 */
function handleSelectFault(faultId: string): void {
  state.faultId = faultId;
  renderFaultsView(
    faultsElements,
    state,
    handleSelectFault,
    handleJumpToComponent
  );
}

/**
 * Springt von einem Störungsbild direkt zu einer betroffenen Komponente im Schema.
 */
function handleJumpToComponent(componentId: number): void {
  state.view = "circuit";
  state.componentId = componentId;
  renderViewSwitcher();
  renderComponentDetail(circuitElements, state, handleSelectComponent);
}

/**
 * Schaltet das Wärmepumpensystem um (Monoblock vs. Split).
 */
function handleSetSystem(system: SystemType): void {
  state.system = system;
  renderSystemView(circuitElements, state, handleSelectComponent);
}

/**
 * Schaltet die aktive Ansicht um.
 */
function handleSetView(view: ViewType): void {
  state.view = view;
  renderViewSwitcher();
  if (view === "faults") {
    renderFaultsView(
      faultsElements,
      state,
      handleSelectFault,
      handleJumpToComponent
    );
  } else if (view === "niceToKnow") {
    renderNiceToKnowView(niceGrid);
  }
}

// -----------------------------------------------------------------------------
// Event-Registrierung
// -----------------------------------------------------------------------------

// System-Tabs
circuitElements.btnMonoblock.addEventListener("click", () => handleSetSystem("monoblock"));
circuitElements.btnSplit.addEventListener("click", () => handleSetSystem("split"));

// Ansichts-Tabs
btnViewCircuit.addEventListener("click", () => handleSetView("circuit"));
btnViewFaults.addEventListener("click", () => handleSetView("faults"));
btnViewNiceToKnow.addEventListener("click", () => handleSetView("niceToKnow"));

// 3-Stufen-Theme-Umschalter mit .t-icon-swap
btnThemeToggle.addEventListener("click", () => {
  currentTheme = cycleThemeMode(currentTheme);
  updateThemeButton(currentTheme);
});

// SVG-Komponenten: Klick- und barrierefreie Tastaturbedienung (Enter / Leertaste)
const compNodes = circuitElements.svgElement.querySelectorAll<SVGGElement>(".svg-comp");
compNodes.forEach((node) => {
  const id = Number(node.getAttribute("data-comp"));
  node.addEventListener("click", () => handleSelectComponent(id));
  node.addEventListener("keydown", (evt: KeyboardEvent) => {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      handleSelectComponent(id);
    }
  });
});

// -----------------------------------------------------------------------------
// Initiale Ausführung
// -----------------------------------------------------------------------------
updateThemeButton(currentTheme);
renderSystemView(circuitElements, state, handleSelectComponent);
renderViewSwitcher();
renderFaultsView(
  faultsElements,
  state,
  handleSelectFault,
  handleJumpToComponent
);
renderNiceToKnowView(niceGrid);
