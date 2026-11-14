/**
 * Modul: Einstiegspunkt der Anwendung (main.ts)
 * Zweck: Initialisiert State, DOM-Events, Kategorie-Wechsel (Wärmepumpe / Split-Klima & VRV),
 *   3-Stufen-Theme-Umschaltung und koordinierte Render-Zyklen.
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
import type {
  AppState,
  BufferVariant,
  CategoryType,
  InstallSystemType,
  OperationMode,
  QuizTopic,
  SystemType,
  ViewType,
  WaterSystemMaterial,
  WaterTreatmentMode
} from "./types/circuit";
import { HEATING_CURVE_PRESETS } from "./data/heatingCurve";
import {
  attachCalculatorListeners,
  type CalculatorDomElements
} from "./render/calculatorView";
import {
  renderHeatingCurveView,
  type HeatingCurveDomElements
} from "./render/heatingCurveView";
import {
  renderInstallationView,
  type InstallationDomElements
} from "./render/installationView";
import {
  getFilteredQuizQuestions,
  renderQuizView,
  type QuizCallbacks,
  type QuizDomElements
} from "./render/quizView";
import {
  renderBufferStorageView,
  type BufferStorageDomElements
} from "./render/bufferStorageView";
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
import {
  renderHydraulicsView,
  type HydraulicsDomElements
} from "./render/hydraulicsView";
import {
  renderNiceToKnowView,
  type NiceToKnowDomElements
} from "./render/niceToKnowView";
import {
  renderWaterQualityView,
  type WaterQualityDomElements
} from "./render/waterQualityView";

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
 * Merkt sich zuletzt aktive Bauart, Betriebsmodus und Störungs-ID je Hauptkategorie.
 */
const categoryMemory: Record<
  CategoryType,
  { system: SystemType; mode: OperationMode; faultId: string }
> = {
  heatpump: { system: "monoblock", mode: "heating", faultId: "hd" },
  hvac: { system: "klimasplit", mode: "cooling", faultId: "condensate" }
};

/**
 * Reaktiv gehaltener Zustand der Fachanwendung.
 */
const state: AppState = {
  category: "heatpump",
  system: "monoblock",
  mode: "heating",
  view: "circuit",
  componentId: 2,
  faultId: "hd",
  hydraulicsVariant: "series",
  hydraulicComponentId: 3,
  bufferVariant: "seriesReturn",
  waterMaterial: "noAluminum",
  waterTreatment: "lowSalt",
  hcSlope: 0.35,
  hcShift: 0,
  installSystem: "r290",
  quizTopic: "all",
  quizIndex: 0,
  quizAnswers: {}
};

let currentTheme: ThemeMode = getStoredThemeMode();

// DOM-Elemente für den Kältekreis
const circuitElements: CircuitDomElements = {
  brandMainTitle: requireElement<HTMLElement>("#brandMainTitle"),
  headerSystemText: requireElement<HTMLElement>("#headerSystemText"),
  headerRefPill: requireElement<HTMLElement>("#headerRefPill"),
  btnCatHeatpump: requireElement<HTMLButtonElement>("#btnCatHeatpump"),
  btnCatHvac: requireElement<HTMLButtonElement>("#btnCatHvac"),
  btnMonoblock: requireElement<HTMLButtonElement>("#btnMonoblock"),
  btnSplit: requireElement<HTMLButtonElement>("#btnSplit"),
  btnKlimasplit: requireElement<HTMLButtonElement>("#btnKlimasplit"),
  btnMultisplit: requireElement<HTMLButtonElement>("#btnMultisplit"),
  btnVrv: requireElement<HTMLButtonElement>("#btnVrv"),
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
  btnModeCooling: requireElement<HTMLButtonElement>("#btnModeCooling"),
  btnModeHeating: requireElement<HTMLButtonElement>("#btnModeHeating"),
  btnModeDefrost: requireElement<HTMLButtonElement>("#btnModeDefrost"),
  pipesHeating: requireElement<SVGGElement>("#pipesHeating"),
  pipesDefrost: requireElement<SVGGElement>("#pipesDefrost"),
  lblReverseHeissgas: requireElement<SVGTextElement>("#lblReverseHeissgas"),
  valvePathsHeating: requireElement<SVGGElement>("#valvePathsHeating"),
  valvePathsDefrost: requireElement<SVGGElement>("#valvePathsDefrost"),
  eevConesHeating: requireElement<SVGGElement>("#eevConesHeating"),
  eevConesDefrost: requireElement<SVGGElement>("#eevConesDefrost"),
  comp1Title: requireElement<SVGTextElement>("#comp1Title"),
  comp1Sub: requireElement<SVGTextElement>("#comp1Sub"),
  comp3Title: requireElement<SVGTextElement>("#comp3Title"),
  comp3Sub: requireElement<SVGTextElement>("#comp3Sub"),
  comp4Title: requireElement<SVGTextElement>("#comp4Title"),
  comp4Sub: requireElement<SVGTextElement>("#comp4Sub"),
  secondaryWaterLoop: requireElement<SVGGElement>("#secondaryWaterLoop"),
  secondaryAirLoop: requireElement<SVGGElement>("#secondaryAirLoop"),
  vrvBranchBadge: requireElement<SVGGElement>("#vrvBranchBadge"),
  airSupplyBase: requireElement<SVGPathElement>("#airSupplyBase"),
  airSupplyFlow: requireElement<SVGPathElement>("#airSupplyFlow"),
  lblAirSupply: requireElement<SVGTextElement>("#lblAirSupply"),
  airBoxTitle: requireElement<SVGTextElement>("#airBoxTitle"),
  airBoxSub1: requireElement<SVGTextElement>("#airBoxSub1"),
  airBoxSub2: requireElement<SVGTextElement>("#airBoxSub2"),
  airBoxFoot: requireElement<SVGTextElement>("#airBoxFoot"),
  legendVorlaufItem: requireElement<HTMLElement>("#legendVorlaufItem"),
  legendVorlaufText: requireElement<HTMLElement>("#legendVorlaufText"),
  legendRuecklaufItem: requireElement<HTMLElement>("#legendRuecklaufItem"),
  legendRuecklaufText: requireElement<HTMLElement>("#legendRuecklaufText"),
  legendVrvItem: requireElement<HTMLElement>("#legendVrvItem"),
  svgElement: requireElement<SVGSVGElement>("#circuitSvg"),
  hvacSvgElement: requireElement<SVGSVGElement>("#hvacCircuitSvg"),
  hvacLabelOutdoor: requireElement<SVGTextElement>("#hvacLabelOutdoor"),
  hvacLabelIndoor: requireElement<SVGTextElement>("#hvacLabelIndoor"),
  hvacPipesCooling: requireElement<SVGGElement>("#hvacPipesCooling"),
  hvacPipesHeating: requireElement<SVGGElement>("#hvacPipesHeating"),
  hvacSplitPipesCooling: requireElement<SVGGElement>("#hvacSplitPipesCooling"),
  hvacMultisplitPipesCooling: requireElement<SVGGElement>("#hvacMultisplitPipesCooling"),
  hvacVrvPipesCooling: requireElement<SVGGElement>("#hvacVrvPipesCooling"),
  hvacSplitPipesHeating: requireElement<SVGGElement>("#hvacSplitPipesHeating"),
  hvacMultisplitPipesHeating: requireElement<SVGGElement>("#hvacMultisplitPipesHeating"),
  hvacVrvPipesHeating: requireElement<SVGGElement>("#hvacVrvPipesHeating"),
  hvacLblCoolingHeissgas: requireElement<SVGTextElement>("#hvacLblCoolingHeissgas"),
  hvacValvePathsCooling: requireElement<SVGGElement>("#hvacValvePathsCooling"),
  hvacValvePathsHeating: requireElement<SVGGElement>("#hvacValvePathsHeating"),
  hvacComp1Title: requireElement<SVGTextElement>("#hvacComp1Title"),
  hvacComp1Sub: requireElement<SVGTextElement>("#hvacComp1Sub"),
  hvacComp3Title: requireElement<SVGTextElement>("#hvacComp3Title"),
  hvacComp3Sub: requireElement<SVGTextElement>("#hvacComp3Sub"),
  hvacComp3Foot: requireElement<SVGTextElement>("#hvacComp3Foot"),
  hvacComp8Title: requireElement<SVGTextElement>("#hvacComp8Title"),
  hvacComp8Sub: requireElement<SVGTextElement>("#hvacComp8Sub"),
  hvacOelBadge: requireElement<SVGGElement>("#hvacOelBadge"),
  hvacSplitEevComp: requireElement<SVGGElement>("#hvacSplitEevComp"),
  hvacMultisplitEevComp: requireElement<SVGGElement>("#hvacMultisplitEevComp"),
  hvacSplitIndoorLayer: requireElement<SVGGElement>("#hvacSplitIndoorLayer"),
  hvacMultisplitIndoorLayer: requireElement<SVGGElement>("#hvacMultisplitIndoorLayer"),
  hvacVrvIndoorLayer: requireElement<SVGGElement>("#hvacVrvIndoorLayer"),
  hvacAirSupplyBase: requireElement<SVGPathElement>("#hvacAirSupplyBase"),
  hvacAirSupplyFlow: requireElement<SVGPathElement>("#hvacAirSupplyFlow"),
  hvacAirStatusTitle: requireElement<SVGTextElement>("#hvacAirStatusTitle"),
  hvacAirStatusSub: requireElement<SVGTextElement>("#hvacAirStatusSub")
};

// DOM-Elemente für die Fehleranalyse
const faultsElements: FaultsDomElements = {
  faultList: requireElement<HTMLElement>("#faultList")
};

// DOM-Elemente für „Nice to Know“
const niceElements: NiceToKnowDomElements = {
  grid: requireElement<HTMLElement>("#niceGrid"),
  headerKicker: requireElement<HTMLElement>("#niceHeaderKicker"),
  headerTitle: requireElement<HTMLElement>("#niceHeaderTitle"),
  headerDesc: requireElement<HTMLElement>("#niceHeaderDesc")
};

// DOM-Elemente für das Hydraulik-Dashboard
const hydraulicsElements: HydraulicsDomElements = {
  hydBanner: requireElement<HTMLElement>("#hydBanner"),
  hydBannerTitle: requireElement<HTMLElement>("#hydBannerTitle"),
  hydBannerDesc: requireElement<HTMLElement>("#hydBannerDesc"),
  hydBannerBadge: requireElement<HTMLElement>("#hydBannerBadge"),
  hydraulicsSvg: requireElement<SVGSVGElement>("#hydraulicsSvg"),
  hydPipesSeries: requireElement<SVGGElement>("#hydPipesSeries"),
  hydPipesParallel: requireElement<SVGGElement>("#hydPipesParallel"),
  hydBypassSeries: requireElement<SVGGElement>("#hydBypassSeries"),
  hydPumpSecParallel: requireElement<SVGGElement>("#hydPumpSecParallel"),
  hydBufferTitle: requireElement<SVGTextElement>("#hydBufferTitle"),
  hydBufferSub: requireElement<SVGTextElement>("#hydBufferSub"),
  accordionList: requireElement<HTMLElement>("#hydraulicsAccordionList")
};

// DOM-Elemente für das Heizungswasser-Dashboard (VDI 2035)
const waterQualityElements: WaterQualityDomElements = {
  btnMatNoAlu: requireElement<HTMLButtonElement>("#btnMatNoAlu"),
  btnMatWithAlu: requireElement<HTMLButtonElement>("#btnMatWithAlu"),
  btnTreatLowSalt: requireElement<HTMLButtonElement>("#btnTreatLowSalt"),
  btnTreatSaline: requireElement<HTMLButtonElement>("#btnTreatSaline"),
  metricsGrid: requireElement<HTMLElement>("#waterMetricsGrid"),
  equipmentGrid: requireElement<HTMLElement>("#waterEquipmentGrid"),
  practiceGrid: requireElement<HTMLElement>("#waterPracticeGrid")
};

// DOM-Elemente für das Pufferspeicher-Dashboard
const bufferElements: BufferStorageDomElements = {
  btnSeriesReturn: requireElement<HTMLButtonElement>("#btnBufSeriesReturn"),
  btnTeeBranch: requireElement<HTMLButtonElement>("#btnBufTeeBranch"),
  btnParallel4Pipe: requireElement<HTMLButtonElement>("#btnBufParallel4Pipe"),
  btnCombiTank: requireElement<HTMLButtonElement>("#btnBufCombiTank"),
  detailContainer: requireElement<HTMLElement>("#bufferDetailPanel"),
  practiceGrid: requireElement<HTMLElement>("#bufferPracticeGrid")
};

// DOM-Elemente für das Azubi-Prüfungstraining
const quizElements: QuizDomElements = {
  btnTopicAll: requireElement<HTMLButtonElement>("#btnQuizTopicAll"),
  btnTopicHeatpump: requireElement<HTMLButtonElement>("#btnQuizTopicHeatpump"),
  btnTopicHvac: requireElement<HTMLButtonElement>("#btnQuizTopicHvac"),
  btnReset: requireElement<HTMLButtonElement>("#btnQuizReset"),
  progressText: requireElement<HTMLElement>("#quizProgressText"),
  scoreText: requireElement<HTMLElement>("#quizScoreText"),
  progressBarFill: requireElement<HTMLElement>("#quizProgressBarFill"),
  questionHost: requireElement<HTMLElement>("#quizQuestionHost")
};

// DOM-Elemente für Heizkurve & Thermischen Abgleich
const heatingCurveElements: HeatingCurveDomElements = {
  btnPresetFbh: requireElement<HTMLButtonElement>("#btnHcPresetFbh"),
  btnPresetLowHk: requireElement<HTMLButtonElement>("#btnHcPresetLowHk"),
  btnPresetOldHk: requireElement<HTMLButtonElement>("#btnHcPresetOldHk"),
  slopeSlider: requireElement<HTMLInputElement>("#hcSlopeSlider"),
  shiftSlider: requireElement<HTMLInputElement>("#hcShiftSlider"),
  slopeValue: requireElement<HTMLElement>("#hcSlopeValue"),
  shiftValue: requireElement<HTMLElement>("#hcShiftValue"),
  curvePath: requireElement<SVGPathElement>("#hcCurvePath"),
  dot10: requireElement<SVGCircleElement>("#hcDot10"),
  dot0: requireElement<SVGCircleElement>("#hcDot0"),
  dotMinus12: requireElement<SVGCircleElement>("#hcDotMinus12"),
  label10: requireElement<SVGTextElement>("#hcLabel10"),
  label0: requireElement<SVGTextElement>("#hcLabel0"),
  labelMinus12: requireElement<SVGTextElement>("#hcLabelMinus12"),
  efficiencyBadge: requireElement<HTMLElement>("#hcEfficiencyBadge"),
  metricsGrid: requireElement<HTMLElement>("#hcMetricsGrid"),
  rulesGrid: requireElement<HTMLElement>("#hcRulesGrid")
};

// DOM-Elemente für Aufstellung, R290-Schutzzonen & Schallschutz
const installationElements: InstallationDomElements = {
  btnR290: requireElement<HTMLButtonElement>("#btnInstR290"),
  btnR32: requireElement<HTMLButtonElement>("#btnInstR32"),
  bannerTitle: requireElement<HTMLElement>("#instBannerTitle"),
  bannerDesc: requireElement<HTMLElement>("#instBannerDesc"),
  bannerBadge: requireElement<HTMLElement>("#instBannerBadge"),
  layerR290: requireElement<SVGGElement>("#instLayerR290"),
  layerR32: requireElement<SVGGElement>("#instLayerR32"),
  cardsGrid: requireElement<HTMLElement>("#installCardsGrid")
};

// Globale Layout-Elemente
const viewCircuit = requireElement<HTMLElement>("#viewCircuit");
const viewHydraulics = requireElement<HTMLElement>("#viewHydraulics");
const viewWaterQuality = requireElement<HTMLElement>("#viewWaterQuality");
const viewHeatingCurve = requireElement<HTMLElement>("#viewHeatingCurve");
const viewCalculator = requireElement<HTMLElement>("#viewCalculator");
const viewInstallation = requireElement<HTMLElement>("#viewInstallation");
const viewFaults = requireElement<HTMLElement>("#viewFaults");
const viewNiceToKnow = requireElement<HTMLElement>("#viewNiceToKnow");
const viewQuiz = requireElement<HTMLElement>("#viewQuiz");
const btnViewCircuit = requireElement<HTMLButtonElement>("#btnViewCircuit");
const btnViewHydraulics = requireElement<HTMLButtonElement>("#btnViewHydraulics");
const btnViewWaterQuality = requireElement<HTMLButtonElement>("#btnViewWaterQuality");
const btnViewHeatingCurve = requireElement<HTMLButtonElement>("#btnViewHeatingCurve");
const btnViewCalculator = requireElement<HTMLButtonElement>("#btnViewCalculator");
const btnViewInstallation = requireElement<HTMLButtonElement>("#btnViewInstallation");
const btnViewFaults = requireElement<HTMLButtonElement>("#btnViewFaults");
const btnViewNiceToKnow = requireElement<HTMLButtonElement>("#btnViewNiceToKnow");
const btnViewQuiz = requireElement<HTMLButtonElement>("#btnViewQuiz");
const btnMobileViewMenu = requireElement<HTMLButtonElement>("#btnMobileViewMenu");
const mobileViewIcon = requireElement<HTMLElement>("#mobileViewIcon");
const mobileViewLabel = requireElement<HTMLElement>("#mobileViewLabel");
const viewTabs = requireElement<HTMLElement>("#viewTabs");
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
      '.segmented-btn[aria-selected="true"]:not(.hidden)'
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
    pill.classList.toggle(
      "is-r32",
      activeBtn.dataset.system === "split" || activeBtn.dataset.system === "klimasplit"
    );
    pill.classList.toggle("is-multisplit", activeBtn.dataset.system === "multisplit");
    pill.classList.toggle("is-vrv", activeBtn.dataset.system === "vrv");
    pill.classList.toggle("is-cooling", activeBtn.dataset.mode === "cooling");
    pill.classList.toggle("is-defrost", activeBtn.dataset.mode === "defrost");
    pill.classList.toggle("is-category-hvac", activeBtn.dataset.category === "hvac");
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
const VIEW_META: Readonly<Record<ViewType, { readonly icon: string; readonly label: string }>> = {
  circuit: { icon: "ac_unit", label: "Kältekreis" },
  hydraulics: { icon: "plumbing", label: "Hydraulik & Puffer" },
  waterQuality: { icon: "water_drop", label: "Heizungswasser" },
  heatingCurve: { icon: "show_chart", label: "Heizkurve" },
  calculator: { icon: "calculate", label: "Praxis-Rechner" },
  installation: { icon: "home_work", label: "Aufstellung" },
  faults: { icon: "warning", label: "Störungen (9)" },
  niceToKnow: { icon: "lightbulb", label: "Nice to Know" },
  quiz: { icon: "quiz", label: "Prüfung" }
};

function renderViewSwitcher(): void {
  const isCircuit = state.view === "circuit";
  const isHydraulics = state.view === "hydraulics";
  const isWater = state.view === "waterQuality";
  const isHeatingCurve = state.view === "heatingCurve";
  const isCalculator = state.view === "calculator";
  const isInstallation = state.view === "installation";
  const isFaults = state.view === "faults";
  const isNice = state.view === "niceToKnow";
  const isQuiz = state.view === "quiz";

  btnViewCircuit.setAttribute("aria-selected", String(isCircuit));
  btnViewHydraulics.setAttribute("aria-selected", String(isHydraulics));
  btnViewWaterQuality.setAttribute("aria-selected", String(isWater));
  btnViewHeatingCurve.setAttribute("aria-selected", String(isHeatingCurve));
  btnViewCalculator.setAttribute("aria-selected", String(isCalculator));
  btnViewInstallation.setAttribute("aria-selected", String(isInstallation));
  btnViewFaults.setAttribute("aria-selected", String(isFaults));
  btnViewNiceToKnow.setAttribute("aria-selected", String(isNice));
  btnViewQuiz.setAttribute("aria-selected", String(isQuiz));

  viewCircuit.classList.toggle("hidden", !isCircuit);
  viewHydraulics.classList.toggle("hidden", !isHydraulics);
  viewWaterQuality.classList.toggle("hidden", !isWater);
  viewHeatingCurve.classList.toggle("hidden", !isHeatingCurve);
  viewCalculator.classList.toggle("hidden", !isCalculator);
  viewInstallation.classList.toggle("hidden", !isInstallation);
  viewFaults.classList.toggle("hidden", !isFaults);
  viewNiceToKnow.classList.toggle("hidden", !isNice);
  viewQuiz.classList.toggle("hidden", !isQuiz);

  const meta = VIEW_META[state.view];
  mobileViewIcon.textContent = meta.icon;
  mobileViewLabel.textContent = meta.label;
  viewTabs.classList.remove("is-mobile-open");
  btnMobileViewMenu.setAttribute("aria-expanded", "false");

  syncAllSegmentedPills();
}

/**
 * Aktualisiert die visuelle Darstellung des 3-Stufen-Theme-Buttons mit sanftem Icon-Swap.
 */
function updateThemeButton(mode: ThemeMode, animate = false): void {
  const label = getThemeModeLabel(mode);
  const nextIcon =
    mode === "auto" ? "contrast" : mode === "light" ? "light_mode" : "dark_mode";

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
 * Schaltet die übergeordnete Anlagenkategorie (Wärmepumpe vs. Split-Klima & VRV) um.
 */
function handleSetCategory(category: CategoryType): void {
  if (state.category === category) return;

  categoryMemory[state.category] = {
    system: state.system,
    mode: state.mode,
    faultId: state.faultId
  };

  const restored = categoryMemory[category];
  const triggerBtn =
    category === "hvac" ? circuitElements.btnCatHvac : circuitElements.btnCatHeatpump;

  runViewTransition(() => {
    state.category = category;
    state.system = restored.system;
    state.mode = restored.mode;
    state.faultId = restored.faultId;
    state.componentId = 2;

    document.title =
      category === "hvac"
        ? "Azubi-Portal Luft/Luft-WP (Split & VRF) – Kältekreis & Fehleranalyse"
        : "Azubi-Portal Luft/Wasser-WP – Kältekreis, Hydraulik & VDI 2035";

    renderSystemView(circuitElements, state, handleSelectComponent);
    renderFaultsView(faultsElements, state, handleSelectFault, handleJumpToComponent);
    renderNiceToKnowView(niceElements, state.category);
    syncAllSegmentedPills();
  }, triggerBtn);
}

/**
 * Schaltet die System-Bauart innerhalb der aktiven Kategorie um.
 */
function handleSetSystem(system: SystemType): void {
  if (state.system === system) return;
  state.system = system;
  renderSystemView(circuitElements, state, handleSelectComponent);
  syncAllSegmentedPills();
}

/**
 * Schaltet den Betriebsmodus um (Kühlbetrieb / Heizbetrieb / Abtauphase).
 */
function handleSetMode(mode: OperationMode): void {
  if (state.mode === mode) return;
  state.mode = mode;
  renderOperationMode(circuitElements, state, handleSelectComponent);
  syncAllSegmentedPills();
}

function handleSelectHydraulicComponent(id: number): void {
  state.hydraulicComponentId = state.hydraulicComponentId === id ? 0 : id;
  renderHydraulicsView(hydraulicsElements, state, handleSelectHydraulicComponent);
}

function handleOpenHydraulicComponent(id: number): void {
  state.hydraulicComponentId = id;
  renderHydraulicsView(hydraulicsElements, state, handleSelectHydraulicComponent);

  window.setTimeout(() => {
    document.getElementById(`hyd-card-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, 140);
}

function handleSetBufferVariant(variant: BufferVariant): void {
  if (state.bufferVariant === variant) return;
  state.bufferVariant = variant;
  renderHydraulicsView(hydraulicsElements, state, handleSelectHydraulicComponent);
  renderBufferStorageView(bufferElements, state);
  syncAllSegmentedPills();
}

function handleSetWaterMaterial(material: WaterSystemMaterial): void {
  if (state.waterMaterial === material) return;
  state.waterMaterial = material;
  renderWaterQualityView(waterQualityElements, state);
  syncAllSegmentedPills();
}

function handleSetWaterTreatment(treatment: WaterTreatmentMode): void {
  if (state.waterTreatment === treatment) return;
  state.waterTreatment = treatment;
  renderWaterQualityView(waterQualityElements, state);
  syncAllSegmentedPills();
}

/**
 * Schaltet die aktive Ansicht flüssig um.
 */
const quizCallbacks: QuizCallbacks = {
  onAnswer(questionId: string, optionIndex: number): void {
    state.quizAnswers = { ...state.quizAnswers, [questionId]: optionIndex };
    renderQuizView(quizElements, state, quizCallbacks);
  },
  onPrev(): void {
    state.quizIndex = Math.max(0, state.quizIndex - 1);
    renderQuizView(quizElements, state, quizCallbacks);
  },
  onNext(): void {
    const total = getFilteredQuizQuestions(state.quizTopic).length;
    state.quizIndex = Math.min(total - 1, state.quizIndex + 1);
    renderQuizView(quizElements, state, quizCallbacks);
  },
  onReset(): void {
    state.quizAnswers = {};
    state.quizIndex = 0;
    renderQuizView(quizElements, state, quizCallbacks);
  }
};

function handleSetQuizTopic(topic: QuizTopic): void {
  if (state.quizTopic === topic) return;
  state.quizTopic = topic;
  state.quizIndex = 0;
  renderQuizView(quizElements, state, quizCallbacks);
  syncAllSegmentedPills();
}

function handleSetInstallSystem(sys: InstallSystemType): void {
  if (state.installSystem === sys) return;
  state.installSystem = sys;
  renderInstallationView(installationElements, state);
  syncAllSegmentedPills();
}

function handleSetView(view: ViewType): void {
  if (state.view === view) return;
  const viewContainerMap: Readonly<Record<ViewType, HTMLElement>> = {
    circuit: viewCircuit,
    hydraulics: viewHydraulics,
    waterQuality: viewWaterQuality,
    heatingCurve: viewHeatingCurve,
    calculator: viewCalculator,
    installation: viewInstallation,
    faults: viewFaults,
    niceToKnow: viewNiceToKnow,
    quiz: viewQuiz
  };
  const activeContainer = viewContainerMap[view];
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
      renderNiceToKnowView(niceElements, state.category);
    }
  }, activeContainer);
}

/**
 * Aktiviert Pfeiltasten-Navigation (Links/Rechts/Pos1/Ende) auf ARIA-Tablists gemäß WCAG.
 */
function attachTablistKeyboardNavigation(): void {
  const tablists = document.querySelectorAll<HTMLElement>('[role="tablist"]');
  tablists.forEach((tablist) => {
    tablist.addEventListener("keydown", (evt: KeyboardEvent) => {
      const visibleTabs = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(.hidden)')
      );
      if (visibleTabs.length === 0) return;

      const currentIdx = visibleTabs.indexOf(document.activeElement as HTMLButtonElement);
      if (currentIdx === -1) return;

      let nextIdx = -1;
      if (evt.key === "ArrowRight") nextIdx = (currentIdx + 1) % visibleTabs.length;
      else if (evt.key === "ArrowLeft")
        nextIdx = (currentIdx - 1 + visibleTabs.length) % visibleTabs.length;
      else if (evt.key === "Home") nextIdx = 0;
      else if (evt.key === "End") nextIdx = visibleTabs.length - 1;

      if (nextIdx !== -1) {
        evt.preventDefault();
        const targetTab = visibleTabs[nextIdx];
        if (targetTab) {
          targetTab.focus();
          targetTab.click();
        }
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Event-Registrierung
// -----------------------------------------------------------------------------

// Haupt-Kategorie-Reiter (Wärmepumpe vs. Split-Klima & VRV)
circuitElements.btnCatHeatpump.addEventListener("click", () => handleSetCategory("heatpump"));
circuitElements.btnCatHvac.addEventListener("click", () => handleSetCategory("hvac"));

// System-Tabs
circuitElements.btnMonoblock.addEventListener("click", () => handleSetSystem("monoblock"));
circuitElements.btnSplit.addEventListener("click", () => handleSetSystem("split"));
circuitElements.btnKlimasplit.addEventListener("click", () => handleSetSystem("klimasplit"));
circuitElements.btnMultisplit.addEventListener("click", () => handleSetSystem("multisplit"));
circuitElements.btnVrv.addEventListener("click", () => handleSetSystem("vrv"));

// Betriebsmodus-Tabs (Kühlbetrieb / Heizbetrieb / Abtauphase)
circuitElements.btnModeCooling.addEventListener("click", () => handleSetMode("cooling"));
circuitElements.btnModeHeating.addEventListener("click", () => handleSetMode("heating"));
circuitElements.btnModeDefrost.addEventListener("click", () => handleSetMode("defrost"));

// Ansichts-Tabs & Mobile-Menü
btnMobileViewMenu.addEventListener("click", () => {
  const isOpen = viewTabs.classList.toggle("is-mobile-open");
  btnMobileViewMenu.setAttribute("aria-expanded", String(isOpen));
});

btnViewCircuit.addEventListener("click", () => handleSetView("circuit"));
btnViewHydraulics.addEventListener("click", () => handleSetView("hydraulics"));
btnViewWaterQuality.addEventListener("click", () => handleSetView("waterQuality"));
btnViewHeatingCurve.addEventListener("click", () => handleSetView("heatingCurve"));
btnViewCalculator.addEventListener("click", () => handleSetView("calculator"));
btnViewInstallation.addEventListener("click", () => handleSetView("installation"));
btnViewFaults.addEventListener("click", () => handleSetView("faults"));

// Heizkurve: Presets & Slider
const [presetFbh, presetLowHk, presetOldHk] = HEATING_CURVE_PRESETS;
heatingCurveElements.btnPresetFbh.addEventListener("click", () => {
  state.hcSlope = presetFbh.slope;
  state.hcShift = presetFbh.shift;
  renderHeatingCurveView(heatingCurveElements, state);
  syncAllSegmentedPills();
});
heatingCurveElements.btnPresetLowHk.addEventListener("click", () => {
  state.hcSlope = presetLowHk.slope;
  state.hcShift = presetLowHk.shift;
  renderHeatingCurveView(heatingCurveElements, state);
  syncAllSegmentedPills();
});
heatingCurveElements.btnPresetOldHk.addEventListener("click", () => {
  state.hcSlope = presetOldHk.slope;
  state.hcShift = presetOldHk.shift;
  renderHeatingCurveView(heatingCurveElements, state);
  syncAllSegmentedPills();
});
heatingCurveElements.slopeSlider.addEventListener("input", () => {
  state.hcSlope = Number(heatingCurveElements.slopeSlider.value);
  renderHeatingCurveView(heatingCurveElements, state);
  syncAllSegmentedPills();
});
heatingCurveElements.shiftSlider.addEventListener("input", () => {
  state.hcShift = Number(heatingCurveElements.shiftSlider.value);
  renderHeatingCurveView(heatingCurveElements, state);
  syncAllSegmentedPills();
});

// Aufstellung & Schall: Systemumschalter
installationElements.btnR290.addEventListener("click", () => handleSetInstallSystem("r290"));
installationElements.btnR32.addEventListener("click", () => handleSetInstallSystem("r32"));
btnViewNiceToKnow.addEventListener("click", () => handleSetView("niceToKnow"));
btnViewQuiz.addEventListener("click", () => handleSetView("quiz"));

// Quiz-Themenfilter & Reset
quizElements.btnTopicAll.addEventListener("click", () => handleSetQuizTopic("all"));
quizElements.btnTopicHeatpump.addEventListener("click", () => handleSetQuizTopic("heatpump"));
quizElements.btnTopicHvac.addEventListener("click", () => handleSetQuizTopic("hvac"));
quizElements.btnReset.addEventListener("click", () => quizCallbacks.onReset());

// Pufferspeicher-Einbindungs-Tabs
bufferElements.btnSeriesReturn.addEventListener("click", () =>
  handleSetBufferVariant("seriesReturn")
);
bufferElements.btnTeeBranch.addEventListener("click", () =>
  handleSetBufferVariant("teeBranch")
);
bufferElements.btnParallel4Pipe.addEventListener("click", () =>
  handleSetBufferVariant("parallel4Pipe")
);
bufferElements.btnCombiTank.addEventListener("click", () =>
  handleSetBufferVariant("combiTank")
);

// Hydraulik-SVG-Klicks
hydraulicsElements.hydraulicsSvg
  .querySelectorAll<SVGGElement>(".svg-comp")
  .forEach((node) => {
    const id = Number(node.getAttribute("data-comp"));
    node.addEventListener("click", () => handleOpenHydraulicComponent(id));
    node.addEventListener("keydown", (evt: KeyboardEvent) => {
      if (evt.key === "Enter" || evt.key === " ") {
        evt.preventDefault();
        handleOpenHydraulicComponent(id);
      }
    });
  });

// Heizungswasser VDI-2035 Filter-Tabs
waterQualityElements.btnMatNoAlu.addEventListener("click", () =>
  handleSetWaterMaterial("noAluminum")
);
waterQualityElements.btnMatWithAlu.addEventListener("click", () =>
  handleSetWaterMaterial("withAluminum")
);
waterQualityElements.btnTreatLowSalt.addEventListener("click", () =>
  handleSetWaterTreatment("lowSalt")
);
waterQualityElements.btnTreatSaline.addEventListener("click", () =>
  handleSetWaterTreatment("saline")
);

// 3-Stufen-Theme-Umschalter mit .t-icon-swap
btnThemeToggle.addEventListener("click", () => {
  currentTheme = cycleThemeMode(currentTheme);
  updateThemeButton(currentTheme, true);
});

// Wisch-Indikator beim horizontalen Scrollen des SVG-Schemas aktualisieren
svgStage.addEventListener("scroll", updateSvgScrollIndicators, { passive: true });
window.addEventListener("resize", handleViewportResize, { passive: true });

// SVG-Komponenten in beiden Schemata: Klick- und barrierefreie Tastaturbedienung (Enter / Leertaste)
const attachSvgComponentListeners = (svg: SVGSVGElement): void => {
  const compNodes = svg.querySelectorAll<SVGGElement>(".svg-comp");
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
};

attachSvgComponentListeners(circuitElements.svgElement);
attachSvgComponentListeners(circuitElements.hvacSvgElement);

attachTablistKeyboardNavigation();

// Großansicht / Fokus-Modus für alle Fließbilder (.workspace-grid)
document
  .querySelectorAll<HTMLButtonElement>("[data-toggle-schema-expand]")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      const grid = btn.closest<HTMLElement>(".workspace-grid");
      if (!grid) return;
      const expanded = grid.classList.toggle("is-schema-expanded");
      btn.setAttribute("aria-pressed", String(expanded));
      const icon = btn.querySelector<HTMLElement>(".ag-icon");
      const label = btn.querySelector<HTMLElement>("[data-expand-label]");
      if (icon) {
        icon.textContent = expanded ? "close_fullscreen" : "open_in_full";
      }
      if (label) {
        label.textContent = expanded ? "Normalansicht" : "Großansicht";
      }
      window.requestAnimationFrame(updateSvgScrollIndicators);
    });
  });

// DOM-Elemente für den Praxis-Rechner
const calculatorElements: CalculatorDomElements = {
  flowQRange: requireElement<HTMLInputElement>("#calcFlowQRange"),
  flowQInput: requireElement<HTMLInputElement>("#calcFlowQInput"),
  flowDtRange: requireElement<HTMLInputElement>("#calcFlowDtRange"),
  flowDtInput: requireElement<HTMLInputElement>("#calcFlowDtInput"),
  flowResultLph: requireElement<HTMLElement>("#calcFlowResultLph"),
  flowResultLpm: requireElement<HTMLElement>("#calcFlowResultLpm"),
  flowResultM3h: requireElement<HTMLElement>("#calcFlowResultM3h"),
  flowBadge: requireElement<HTMLElement>("#calcFlowBadge"),
  flowNote: requireElement<HTMLElement>("#calcFlowNote"),
  shT0Range: requireElement<HTMLInputElement>("#calcShT0Range"),
  shT0Input: requireElement<HTMLInputElement>("#calcShT0Input"),
  shTsaugRange: requireElement<HTMLInputElement>("#calcShTsaugRange"),
  shTsaugInput: requireElement<HTMLInputElement>("#calcShTsaugInput"),
  shValue: requireElement<HTMLElement>("#calcShValue"),
  shBadge: requireElement<HTMLElement>("#calcShBadge"),
  shNote: requireElement<HTMLElement>("#calcShNote"),
  scTcRange: requireElement<HTMLInputElement>("#calcScTcRange"),
  scTcInput: requireElement<HTMLInputElement>("#calcScTcInput"),
  scTliqRange: requireElement<HTMLInputElement>("#calcScTliqRange"),
  scTliqInput: requireElement<HTMLInputElement>("#calcScTliqInput"),
  scValue: requireElement<HTMLElement>("#calcScValue"),
  scBadge: requireElement<HTMLElement>("#calcScBadge"),
  scNote: requireElement<HTMLElement>("#calcScNote"),
  copQRange: requireElement<HTMLInputElement>("#calcCopQRange"),
  copQInput: requireElement<HTMLInputElement>("#calcCopQInput"),
  copPRange: requireElement<HTMLInputElement>("#calcCopPRange"),
  copPInput: requireElement<HTMLInputElement>("#calcCopPInput"),
  copValue: requireElement<HTMLElement>("#calcCopValue"),
  copBadge: requireElement<HTMLElement>("#calcCopBadge"),
  copAmbientText: requireElement<HTMLElement>("#calcCopAmbientText"),
  copElectricText: requireElement<HTMLElement>("#calcCopElectricText"),
  copAmbientBar: requireElement<HTMLElement>("#calcCopAmbientBar"),
  copPlausibilityNote: requireElement<HTMLElement>("#calcCopPlausibilityNote")
};

// -----------------------------------------------------------------------------
// Initiale Ausführung nach DOMContentLoaded (inkl. Farblegenden-Filterung)
// -----------------------------------------------------------------------------
function initApp(): void {
  updateThemeButton(currentTheme);
  renderSystemView(circuitElements, state, handleSelectComponent);
  renderHydraulicsView(hydraulicsElements, state, handleSelectHydraulicComponent);
  renderBufferStorageView(bufferElements, state);
  renderWaterQualityView(waterQualityElements, state);
  renderHeatingCurveView(heatingCurveElements, state);
  attachCalculatorListeners(calculatorElements);
  renderInstallationView(installationElements, state);
  renderQuizView(quizElements, state, quizCallbacks);
  renderViewSwitcher();
  updateSvgScrollIndicators();
  renderFaultsView(
    faultsElements,
    state,
    handleSelectFault,
    handleJumpToComponent
  );
  renderNiceToKnowView(niceElements, state.category);
  window.requestAnimationFrame(syncAllSegmentedPills);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
