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
import type { AppState, OperationMode, SystemType, ViewType } from "./types/circuit";
import {
  renderComponentDetail,
  renderOperationMode,
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
  mode: "heating",
  view: "circuit",
  componentId: 0,
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
  componentList: requireElement<HTMLElement>("#componentAccordionList"),
  btnModeHeating: requireElement<HTMLButtonElement>("#btnModeHeating"),
  btnModeDefrost: requireElement<HTMLButtonElement>("#btnModeDefrost"),
  pipesHeating: requireElement<SVGGElement>("#pipesHeating"),
  pipesDefrost: requireElement<SVGGElement>("#pipesDefrost"),
  valvePathsHeating: requireElement<SVGGElement>("#valvePathsHeating"),
  valvePathsDefrost: requireElement<SVGGElement>("#valvePathsDefrost"),
  eevConesHeating: requireElement<SVGGElement>("#eevConesHeating"),
  eevConesDefrost: requireElement<SVGGElement>("#eevConesDefrost"),
  comp1Title: requireElement<SVGTextElement>("#comp1Title"),
  comp1Sub: requireElement<SVGTextElement>("#comp1Sub"),
  comp3Title: requireElement<SVGTextElement>("#comp3Title"),
  comp3Sub: requireElement<SVGTextElement>("#comp3Sub"),
  svgElement: requireElement<SVGSVGElement>("#circuitSvg")
};

// DOM-Elemente für die Fehleranalyse
const faultsElements: FaultsDomElements = {
  faultList: requireElement<HTMLElement>("#faultList")
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
const themeToggleIcon = requireElement<HTMLElement>("#themeToggleIcon");
const svgStageWrap = requireElement<HTMLElement>("#svgStageWrap");
const svgStage = requireElement<HTMLElement>("#svgStage");

/**
 * Aktualisiert die gleitenden Segmented-Control-Pills (.segmented-pill-indicator)
 * mittels GPU-beschleunigtem translate3d auf allen Segmented-Leisten.
 */
function syncAllSegmentedPills(): void {
  const containers = document.querySelectorAll<HTMLElement>(".segmented");
  containers.forEach((container) => {
    let pill = container.querySelector<HTMLElement>(".segmented-pill-indicator");
    if (!pill) {
      pill = document.createElement("span");
      pill.className = "segmented-pill-indicator t-tabs-pill";
      pill.setAttribute("aria-hidden", "true");
      container.insertBefore(pill, container.firstChild);
    }

    const activeBtn = container.querySelector<HTMLButtonElement>(
      '.segmented-btn[aria-selected="true"]'
    );
    if (!activeBtn || activeBtn.offsetWidth === 0) {
      container.classList.remove("has-pill");
      pill.style.opacity = "0";
      return;
    }

    container.classList.add("has-pill");
    pill.style.opacity = "1";
    pill.style.width = `${activeBtn.offsetWidth}px`;
    pill.style.height = `${activeBtn.offsetHeight}px`;
    pill.style.transform = `translate3d(${activeBtn.offsetLeft}px, ${activeBtn.offsetTop}px, 0)`;

    pill.classList.toggle("is-r290", activeBtn.dataset.system === "monoblock");
    pill.classList.toggle("is-r32", activeBtn.dataset.system === "split");
    pill.classList.toggle("is-defrost", activeBtn.dataset.mode === "defrost");
  });
}

let scrollRafPending = false;
let resizeRafPending = false;

/**
 * Aktualisiert die visuellen Wisch-Schatten links/rechts am mobilen SVG-Container
 * gedrosselt über requestAnimationFrame gegen Layout-Thrashing.
 */
function updateSvgScrollIndicators(): void {
  if (scrollRafPending) return;
  scrollRafPending = true;
  window.requestAnimationFrame(() => {
    scrollRafPending = false;
    const maxScroll = svgStage.scrollWidth - svgStage.clientWidth;
    if (maxScroll <= 4) {
      svgStageWrap.classList.remove("has-scroll-left", "has-scroll-right");
    } else {
      svgStageWrap.classList.toggle("has-scroll-left", svgStage.scrollLeft > 4);
      svgStageWrap.classList.toggle("has-scroll-right", svgStage.scrollLeft < maxScroll - 4);
    }
  });
}

/**
 * Synchronisiert Scroll-Indikatoren und Segmented-Pills bei Viewport-Änderungen.
 */
function handleViewportResize(): void {
  updateSvgScrollIndicators();
  if (resizeRafPending) return;
  resizeRafPending = true;
  window.requestAnimationFrame(() => {
    resizeRafPending = false;
    syncAllSegmentedPills();
  });
}

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
  syncAllSegmentedPills();
}

/**
 * Aktualisiert die visuelle Darstellung des 3-Stufen-Theme-Buttons mit sanftem Icon-Swap.
 */
function updateThemeButton(mode: ThemeMode, animate = false): void {
  const label = getThemeModeLabel(mode);
  const nextIcon = mode === "auto" ? "◐" : mode === "light" ? "☼" : "☾";

  if (animate) {
    themeToggleIcon.classList.add("is-swapping");
    window.setTimeout(() => {
      themeToggleIcon.textContent = nextIcon;
      themeToggleIcon.classList.remove("is-swapping");
    }, 90);
  } else {
    themeToggleIcon.textContent = nextIcon;
  }

  themeIconLabel.textContent = label;
  btnThemeToggle.setAttribute(
    "aria-label",
    `Darstellungsmodus umschalten (aktuell: ${label})`
  );
  btnThemeToggle.setAttribute("data-theme-state", mode);
}

/**
 * Führt einen Ansichts-Übergang über die native View Transitions API aus (mit Fallback
 * und A11y-Fokus-Routing gemäß modern-web-guidance: same-document-transitions).
 */
function runViewTransition(updateDom: () => void, focusTarget?: HTMLElement): void {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const docWithTransition = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  if (!docWithTransition.startViewTransition || prefersReducedMotion) {
    updateDom();
    if (!prefersReducedMotion && focusTarget) {
      focusTarget.classList.remove("is-fallback-enter");
      void focusTarget.offsetWidth;
      focusTarget.classList.add("is-fallback-enter");
    }
    focusTarget?.focus({ preventScroll: true });
    return;
  }

  const transition = docWithTransition.startViewTransition(() => {
    updateDom();
  });
  transition.finished.finally(() => {
    focusTarget?.focus({ preventScroll: true });
  });
}

/**
 * Klappt eine Bauteil-Karte auf oder zu (Accordion-Toggle).
 */
function handleSelectComponent(id: number): void {
  state.componentId = state.componentId === id ? 0 : id;
  renderComponentDetail(circuitElements, state, handleSelectComponent);
}

/**
 * Öffnet gezielt eine Bauteil-Karte (z. B. nach Klick im SVG-Schema) und scrollt sie nach
 * Anlaufen der Grid-Transition sanft in den sichtbaren Bereich.
 */
function handleOpenComponent(id: number): void {
  state.componentId = id;
  renderComponentDetail(circuitElements, state, handleSelectComponent);
  window.requestAnimationFrame(() => {
    const targetCard = document.getElementById(`comp-card-${id}`);
    if (!targetCard) return;
    const rect = targetCard.getBoundingClientRect();
    const isFullyVisible = rect.top >= 72 && rect.bottom <= window.innerHeight - 16;
    if (!isFullyVisible) {
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  });
}

/**
 * Klappt ein Störungsbild auf oder zu (Accordion-Toggle).
 */
function handleSelectFault(faultId: string): void {
  state.faultId = state.faultId === faultId ? "" : faultId;
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
  runViewTransition(() => {
    state.view = "circuit";
    state.componentId = componentId;
    renderViewSwitcher();
    renderComponentDetail(circuitElements, state, handleSelectComponent);
  }, btnViewCircuit);

  window.setTimeout(() => {
    document.getElementById(`comp-card-${componentId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 210);
}

/**
 * Schaltet das Wärmepumpensystem um (Monoblock vs. Split).
 */
function handleSetSystem(system: SystemType): void {
  if (state.system === system) return;
  state.system = system;
  renderSystemView(circuitElements, state, handleSelectComponent);
  syncAllSegmentedPills();
}

/**
 * Schaltet den Betriebsmodus um (Heizbetrieb vs. Abtauphase).
 */
function handleSetMode(mode: OperationMode): void {
  if (state.mode === mode) return;
  state.mode = mode;
  renderOperationMode(circuitElements, state, handleSelectComponent);
  syncAllSegmentedPills();
}

/**
 * Schaltet die aktive Ansicht flüssig um.
 */
function handleSetView(view: ViewType): void {
  if (state.view === view) return;
  const activeContainer =
    view === "circuit" ? viewCircuit : view === "faults" ? viewFaults : viewNiceToKnow;
  if (!activeContainer.hasAttribute("tabindex")) {
    activeContainer.setAttribute("tabindex", "-1");
  }

  runViewTransition(() => {
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
  }, activeContainer);
}

// -----------------------------------------------------------------------------
// Event-Registrierung
// -----------------------------------------------------------------------------

// System-Tabs
circuitElements.btnMonoblock.addEventListener("click", () => handleSetSystem("monoblock"));
circuitElements.btnSplit.addEventListener("click", () => handleSetSystem("split"));

// Betriebsmodus-Tabs (Heizbetrieb vs. Abtauphase)
circuitElements.btnModeHeating.addEventListener("click", () => handleSetMode("heating"));
circuitElements.btnModeDefrost.addEventListener("click", () => handleSetMode("defrost"));

// Ansichts-Tabs
btnViewCircuit.addEventListener("click", () => handleSetView("circuit"));
btnViewFaults.addEventListener("click", () => handleSetView("faults"));
btnViewNiceToKnow.addEventListener("click", () => handleSetView("niceToKnow"));

// 3-Stufen-Theme-Umschalter mit .t-icon-swap
btnThemeToggle.addEventListener("click", () => {
  currentTheme = cycleThemeMode(currentTheme);
  updateThemeButton(currentTheme, true);
});

// Wisch-Indikator beim horizontalen Scrollen des SVG-Schemas aktualisieren
svgStage.addEventListener("scroll", updateSvgScrollIndicators, { passive: true });
window.addEventListener("resize", handleViewportResize, { passive: true });

// SVG-Komponenten: Klick- und barrierefreie Tastaturbedienung (Enter / Leertaste)
const compNodes = circuitElements.svgElement.querySelectorAll<SVGGElement>(".svg-comp");
compNodes.forEach((node) => {
  const id = Number(node.getAttribute("data-comp"));
  node.addEventListener("click", () => handleOpenComponent(id));
  node.addEventListener("keydown", (evt: KeyboardEvent) => {
    if (evt.key === "Enter" || evt.key === " ") {
      evt.preventDefault();
      handleOpenComponent(id);
    }
  });
});

// -----------------------------------------------------------------------------
// Initiale Ausführung
// -----------------------------------------------------------------------------
updateThemeButton(currentTheme);
renderSystemView(circuitElements, state, handleSelectComponent);
renderOperationMode(circuitElements, state, handleSelectComponent);
renderViewSwitcher();
updateSvgScrollIndicators();
renderFaultsView(
  faultsElements,
  state,
  handleSelectFault,
  handleJumpToComponent
);
renderNiceToKnowView(niceGrid);
window.requestAnimationFrame(syncAllSegmentedPills);
