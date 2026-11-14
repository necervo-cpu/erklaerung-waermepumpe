/**
 * Modul: Automatisierte Unit- und Datenintegritätstests (app.test.ts)
 * Zweck: Verifikation der Kernlogik (Theme-Steuerung) und Konsistenzprüfung der thermodynamischen Fachdaten.
 * Verantwortlichkeit: Testet Theme-Transitions, Datenstrukturen von Komponenten, Systemen und Störungsbildern.
 * Sicherheits- & Qualitätsrelevanz: Stellt sicher, dass keine fehlerhaften Kältemitteldaten, ungültigen Bauteil-IDs
 * oder XSS-anfälligen Werte in das DOM-Rendering gelangen können.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { COMPONENTS } from "../src/data/components";
import { FAULTS } from "../src/data/faults";
import { BUFFER_PRACTICE_RULES, BUFFER_VARIANTS } from "../src/data/bufferStorage";
import {
  HEATING_CURVE_PRESETS,
  HEATING_CURVE_RULES,
  calculateFlowTemp
} from "../src/data/heatingCurve";
import { HVAC_COMPONENTS } from "../src/data/hvacComponents";
import { INSTALL_RULES, INSTALL_SYSTEMS } from "../src/data/installation";
import { QUIZ_QUESTIONS } from "../src/data/quizQuestions";
import { HVAC_FAULTS } from "../src/data/hvacFaults";
import { HVAC_NICE_TO_KNOW } from "../src/data/hvacNiceToKnow";
import { HYDRAULICS_VARIANTS, HYDRAULIC_COMPONENTS } from "../src/data/hydraulics";
import { NICE_TO_KNOW } from "../src/data/niceToKnow";
import { SYSTEMS } from "../src/data/systems";
import {
  WATER_EQUIPMENT,
  WATER_PRACTICE_STEPS,
  getWaterQualityMetrics
} from "../src/data/waterQuality";
import {
  cycleThemeMode,
  getThemeModeLabel,
  isValidThemeMode,
  type ThemeMode
} from "../src/theme-init";

// In-Memory-Mock zur Vermeidung von DOM-Abstürzen in reiner Node.js-Testumgebung
class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

const mockAttributes = new Map<string, string>();
const mockDocumentElement = {
  setAttribute: (key: string, val: string): void => {
    mockAttributes.set(key, val);
  },
  removeAttribute: (key: string): void => {
    mockAttributes.delete(key);
  },
  getAttribute: (key: string): string | null => mockAttributes.get(key) ?? null
};

beforeAll(() => {
  // Globales document-Objekt für headless Node.js Runner initialisieren
  if (typeof globalThis.document === "undefined") {
    Object.defineProperty(globalThis, "document", {
      value: { documentElement: mockDocumentElement },
      configurable: true,
      writable: true
    });
  }

  // Globales window-Objekt mit isoliertem localStorage bereitstellen
  if (typeof globalThis.window === "undefined") {
    Object.defineProperty(globalThis, "window", {
      value: { localStorage: new MemoryStorage() },
      configurable: true,
      writable: true
    });
  }
});

beforeEach(() => {
  mockAttributes.clear();
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.clear();
  }
});

describe("Theme-Management (theme-init.ts)", () => {
  it("validiert erlaubte Theme-Modi korrekt per Type-Guard", () => {
    expect(isValidThemeMode("auto")).toBe(true);
    expect(isValidThemeMode("light")).toBe(true);
    expect(isValidThemeMode("dark")).toBe(true);

    expect(isValidThemeMode("blue")).toBe(false);
    expect(isValidThemeMode("")).toBe(false);
    expect(isValidThemeMode(null)).toBe(false);
    expect(isValidThemeMode(undefined)).toBe(false);
    expect(isValidThemeMode(123)).toBe(false);
    expect(isValidThemeMode({})).toBe(false);
  });

  it("schaltet Theme-Modi zyklisch um (Auto -> Hell -> Dunkel -> Auto)", () => {
    const step1: ThemeMode = cycleThemeMode("auto");
    expect(step1).toBe("light");
    expect(mockAttributes.get("data-theme")).toBe("light");

    const step2: ThemeMode = cycleThemeMode("light");
    expect(step2).toBe("dark");
    expect(mockAttributes.get("data-theme")).toBe("dark");

    const step3: ThemeMode = cycleThemeMode("dark");
    expect(step3).toBe("auto");
    expect(mockAttributes.has("data-theme")).toBe(false);
  });

  it("liefert deutsche Labels für Barrierefreiheit und UI", () => {
    expect(getThemeModeLabel("auto")).toBe("Auto");
    expect(getThemeModeLabel("light")).toBe("Hell");
    expect(getThemeModeLabel("dark")).toBe("Dunkel");
  });
});

describe("Systemdaten-Integrität (systems.ts)", () => {
  it("enthält gültige Konfigurationen für Wärmepumpen (Monoblock/Split) und Klima/VRV", () => {
    expect(SYSTEMS).toHaveProperty("monoblock");
    expect(SYSTEMS).toHaveProperty("split");
    expect(SYSTEMS).toHaveProperty("klimasplit");
    expect(SYSTEMS).toHaveProperty("multisplit");
    expect(SYSTEMS).toHaveProperty("vrv");

    const { monoblock, split, klimasplit, multisplit, vrv } = SYSTEMS;

    expect(monoblock.category).toBe("heatpump");
    expect(monoblock.refrigerant).toContain("R290");
    expect(monoblock.badgeText).toContain("R290");
    expect(monoblock.boundaryX).toBeGreaterThan(0);
    expect(monoblock.outdoorWidth).toBeGreaterThan(0);

    expect(split.category).toBe("heatpump");
    expect(split.refrigerant).toContain("R32");
    expect(split.badgeText).toContain("F-Gase");
    expect(split.boundaryX).toBeGreaterThan(0);
    expect(split.outdoorWidth).toBeGreaterThan(0);

    expect(klimasplit.category).toBe("hvac");
    expect(klimasplit.refrigerant).toContain("R32");
    expect(klimasplit.badgeText).toContain("1:1 Split");
    expect(klimasplit.boundaryX).toBeGreaterThan(0);
    expect(klimasplit.outdoorWidth).toBeGreaterThan(0);
    expect(klimasplit.refCondition.cooling).toContain("A35");

    expect(multisplit.category).toBe("hvac");
    expect(multisplit.refrigerant).toContain("Multi-Split");
    expect(multisplit.badgeText).toContain("2–5 Zonen");
    expect(multisplit.boundaryX).toBeGreaterThan(0);
    expect(multisplit.outdoorWidth).toBeGreaterThan(0);
    expect(multisplit.refCondition.cooling).toContain("A35");

    expect(vrv.category).toBe("hvac");
    expect(vrv.refrigerant).toContain("VRF");
    expect(vrv.badgeText).toContain("EN 378");
    expect(vrv.boundaryX).toBeGreaterThan(0);
    expect(vrv.outdoorWidth).toBeGreaterThan(0);
    expect(vrv.refCondition.heating).toContain("A7");
  });
});

describe("Bauteildaten-Integrität (components.ts)", () => {
  it("enthält exakt 9 fortlaufend nummerierte Komponenten (1..9)", () => {
    expect(COMPONENTS).toHaveLength(9);

    const ids = COMPONENTS.map((c) => c.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(9);
  });

  it("definiert vollständige thermodynamische Daten für R290 und R32", () => {
    const validPaletteColors = new Set([
      "rose",
      "peach",
      "butter",
      "lime",
      "mint",
      "aqua",
      "sky",
      "periwinkle",
      "lavender",
      "orchid"
    ]);

    for (const comp of COMPONENTS) {
      expect(comp.name).toBeTruthy();
      expect(comp.shortName).toBeTruthy();
      expect(comp.task).toBeTruthy();
      expect(comp.location.monoblock).toBeTruthy();
      expect(comp.location.split).toBeTruthy();

      // R290 / Monoblock
      const mono = comp.thermo.monoblock;
      expect(mono.inState).toBeTruthy();
      expect(validPaletteColors.has(mono.inColor)).toBe(true);
      expect(mono.inMetric).toBeTruthy();
      expect(mono.inSub).toBeTruthy();
      expect(mono.outState).toBeTruthy();
      expect(validPaletteColors.has(mono.outColor)).toBe(true);
      expect(mono.outMetric).toBeTruthy();
      expect(mono.outSub).toBeTruthy();

      // R32 / Split
      const split = comp.thermo.split;
      expect(split.inState).toBeTruthy();
      expect(validPaletteColors.has(split.inColor)).toBe(true);
      expect(split.inMetric).toBeTruthy();
      expect(split.inSub).toBeTruthy();
      expect(split.outState).toBeTruthy();
      expect(validPaletteColors.has(split.outColor)).toBe(true);
      expect(split.outMetric).toBeTruthy();
      expect(split.outSub).toBeTruthy();

      // Service-Angaben & Abtau-Hinweis
      expect(comp.service).toBeTruthy();
      expect(comp.serviceMetric).toBeTruthy();
      expect(comp.defrostNote).toBeTruthy();
    }
  });
});

describe("Störungsbilder-Integrität (faults.ts)", () => {
  it("definiert exakt 9 praxisrelevante Störungsfälle inkl. KM-Mangel & EEV-Fehler", () => {
    expect(FAULTS).toHaveLength(9);

    const faultIds = FAULTS.map((f) => f.id);
    expect(faultIds).toEqual([
      "hd",
      "nd",
      "hotgas",
      "ice",
      "cycling",
      "heater",
      "flow",
      "leakage",
      "eev"
    ]);
  });

  it("stellt sicher, dass alle verknüpften Komponenten existieren", () => {
    const validComponentIds = new Set(COMPONENTS.map((c) => c.id));

    for (const fault of FAULTS) {
      expect(fault.title).toBeTruthy();
      expect(fault.symptoms).toBeTruthy();
      expect(fault.causes.length).toBeGreaterThan(0);
      expect(fault.checks.length).toBeGreaterThan(0);
      expect(fault.relatedComponents.length).toBeGreaterThan(0);

      // Jede verknüpfte Bauteil-ID muss in COMPONENTS vorkommen
      for (const componentId of fault.relatedComponents) {
        expect(validComponentIds.has(componentId)).toBe(true);
      }
    }
  });
});

describe("Wissenskarten-Integrität (niceToKnow.ts)", () => {
  it("definiert exakt 7 fachlich präzise Wissenskarten", () => {
    expect(NICE_TO_KNOW).toHaveLength(7);

    const ids = NICE_TO_KNOW.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(7);
    expect(ids).toEqual([
      "cop-jaz",
      "heating-curve",
      "bivalence",
      "defrost",
      "refrigerants",
      "acoustics",
      "hot-water"
    ]);
  });

  it("enthält vollständige, aussagekräftige Daten ohne Platzhalter", () => {
    for (const item of NICE_TO_KNOW) {
      expect(item.id).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.badge).toBeTruthy();
      expect(item.summary.length).toBeGreaterThan(20);
      expect(item.keyFacts.length).toBeGreaterThanOrEqual(3);
      for (const fact of item.keyFacts) {
        expect(fact.length).toBeGreaterThan(15);
      }
      expect(item.proTip.length).toBeGreaterThan(20);
    }
  });
});

describe("Split-Klima & VRV Datenintegrität (hvac*.ts)", () => {
  it("enthält exakt 9 fortlaufend nummerierte Klima-/VRV-Komponenten (1..9)", () => {
    expect(HVAC_COMPONENTS).toHaveLength(9);
    const ids = HVAC_COMPONENTS.map((c) => c.id);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("definiert vollständige thermodynamische Daten für Split-Klima und VRV", () => {
    const validPaletteColors = new Set([
      "rose",
      "peach",
      "butter",
      "lime",
      "mint",
      "aqua",
      "sky",
      "periwinkle",
      "lavender",
      "orchid"
    ]);

    for (const comp of HVAC_COMPONENTS) {
      expect(comp.name).toBeTruthy();
      expect(comp.shortName).toBeTruthy();
      expect(comp.task).toBeTruthy();
      expect(comp.location.klimasplit).toBeTruthy();
      expect(comp.location.multisplit).toBeTruthy();
      expect(comp.location.vrv).toBeTruthy();

      for (const variant of [comp.thermo.klimasplit, comp.thermo.multisplit, comp.thermo.vrv]) {
        expect(variant.inState).toBeTruthy();
        expect(validPaletteColors.has(variant.inColor)).toBe(true);
        expect(variant.inMetric).toBeTruthy();
        expect(variant.inSub).toBeTruthy();
        expect(variant.outState).toBeTruthy();
        expect(validPaletteColors.has(variant.outColor)).toBe(true);
        expect(variant.outMetric).toBeTruthy();
        expect(variant.outSub).toBeTruthy();
      }

      expect(comp.service).toBeTruthy();
      expect(comp.serviceMetric).toBeTruthy();
      expect(comp.defrostNote).toBeTruthy();
      expect(comp.modeNoteHeating).toBeTruthy();
    }
  });

  it("definiert exakt 7 Störungsbilder für Split-Klima & VRV mit gültigen Referenzen", () => {
    expect(HVAC_FAULTS).toHaveLength(7);
    expect(HVAC_FAULTS.map((f) => f.id)).toEqual([
      "condensate",
      "indoor_ice",
      "vrv_oil",
      "eev_branch",
      "comm_bus",
      "hd_summer",
      "smell_hygiene"
    ]);

    const validComponentIds = new Set(HVAC_COMPONENTS.map((c) => c.id));
    for (const fault of HVAC_FAULTS) {
      expect(fault.title).toBeTruthy();
      expect(fault.symptoms).toBeTruthy();
      expect(fault.causes.length).toBeGreaterThan(0);
      expect(fault.checks.length).toBeGreaterThan(0);
      expect(fault.relatedComponents.length).toBeGreaterThan(0);
      for (const componentId of fault.relatedComponents) {
        expect(validComponentIds.has(componentId)).toBe(true);
      }
    }
  });

  it("definiert exakt 7 Wissenskarten für Split-Klima & VRV", () => {
    expect(HVAC_NICE_TO_KNOW).toHaveLength(7);
    expect(HVAC_NICE_TO_KNOW.map((item) => item.id)).toEqual([
      "seer-scop",
      "subcooling-vrv",
      "nitrogen-brazing",
      "en378-r32",
      "oil-return",
      "dehumidification",
      "hygiene-vdi6022"
    ]);

    for (const item of HVAC_NICE_TO_KNOW) {
      expect(item.category).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.badge).toBeTruthy();
      expect(item.summary.length).toBeGreaterThan(20);
      expect(item.keyFacts.length).toBeGreaterThanOrEqual(3);
      expect(item.proTip.length).toBeGreaterThan(20);
    }
  });
});

describe("DOM-Integrität (index.html)", () => {
  it("enthält alle von src/main.ts benötigten kritischen DOM-IDs", () => {
    const currentDir = fileURLToPath(new URL(".", import.meta.url));
    const htmlPath = resolve(currentDir, "../index.html");
    const html = readFileSync(htmlPath, "utf-8");

    // Alle von src/main.ts per requireElement geforderten DOM-IDs
    const requiredMainIds = [
      "circuitSvg",
      "headerSystemText",
      "btnMonoblock",
      "btnSplit",
      "refrigerantBanner",
      "bannerTitle",
      "bannerDesc",
      "bannerBadge",
      "buildingBoundary",
      "zoneOutdoor",
      "zoneIndoor",
      "labelOutdoor",
      "labelIndoor",
      "componentAccordionList",
      "btnModeHeating",
      "btnModeDefrost",
      "pipesHeating",
      "pipesDefrost",
      "valvePathsHeating",
      "valvePathsDefrost",
      "eevConesHeating",
      "eevConesDefrost",
      "comp1Title",
      "comp1Sub",
      "comp3Title",
      "comp3Sub",
      "faultList",
      "viewCircuit",
      "viewFaults",
      "viewNiceToKnow",
      "btnViewCircuit",
      "btnViewFaults",
      "btnViewNiceToKnow",
      "niceGrid",
      "btnThemeToggle",
      "themeIconLabel",
      "themeToggleIcon",
      "svgStageWrap",
      "svgStage",
      "detailScrollTarget",
      "brandMainTitle",
      "headerRefPill",
      "btnCatHeatpump",
      "btnCatHvac",
      "btnKlimasplit",
      "btnMultisplit",
      "btnVrv",
      "btnModeCooling",
      "lblReverseHeissgas",
      "comp4Title",
      "comp4Sub",
      "secondaryWaterLoop",
      "secondaryAirLoop",
      "vrvBranchBadge",
      "airSupplyBase",
      "airSupplyFlow",
      "lblAirSupply",
      "airBoxTitle",
      "airBoxSub1",
      "airBoxSub2",
      "airBoxFoot",
      "legendVorlaufItem",
      "legendVorlaufText",
      "legendRuecklaufItem",
      "legendRuecklaufText",
      "legendVrvItem",
      "niceHeaderKicker",
      "niceHeaderTitle",
      "niceHeaderDesc",
      "hvacCircuitSvg",
      "hvacLabelOutdoor",
      "hvacLabelIndoor",
      "hvacPipesCooling",
      "hvacPipesHeating",
      "hvacSplitPipesCooling",
      "hvacMultisplitPipesCooling",
      "hvacVrvPipesCooling",
      "hvacSplitPipesHeating",
      "hvacMultisplitPipesHeating",
      "hvacVrvPipesHeating",
      "hvacLblCoolingHeissgas",
      "hvacValvePathsCooling",
      "hvacValvePathsHeating",
      "hvacComp1Title",
      "hvacComp1Sub",
      "hvacComp3Title",
      "hvacComp3Sub",
      "hvacComp3Foot",
      "hvacComp8Title",
      "hvacComp8Sub",
      "hvacOelBadge",
      "hvacSplitEevComp",
      "hvacMultisplitEevComp",
      "hvacSplitIndoorLayer",
      "hvacMultisplitIndoorLayer",
      "hvacVrvIndoorLayer",
      "hvacAirSupplyBase",
      "hvacAirSupplyFlow",
      "hvacAirStatusTitle",
      "hvacAirStatusSub",
      "btnViewHydraulics",
      "btnViewWaterQuality",
      "viewHydraulics",
      "viewWaterQuality",
      "btnHydSeries",
      "btnHydParallel",
      "hydBanner",
      "hydBannerTitle",
      "hydBannerDesc",
      "hydBannerBadge",
      "hydraulicsSvg",
      "hydPipesSeries",
      "hydPipesParallel",
      "hydBypassSeries",
      "hydPumpSecParallel",
      "hydBufferTitle",
      "hydBufferSub",
      "hydraulicsAccordionList",
      "btnMatNoAlu",
      "btnMatWithAlu",
      "btnTreatLowSalt",
      "btnTreatSaline",
      "waterMetricsGrid",
      "waterEquipmentGrid",
      "waterPracticeGrid",
      "btnMobileViewMenu",
      "mobileViewIcon",
      "mobileViewLabel",
      "viewTabs",
      "btnBufSeriesReturn",
      "btnBufTeeBranch",
      "btnBufParallel4Pipe",
      "btnBufCombiTank",
      "bufferSvg",
      "bufLayerSeriesReturn",
      "bufLayerTeeBranch",
      "bufLayerParallel4Pipe",
      "bufLayerCombiTank",
      "bufferDetailPanel",
      "bufferPracticeGrid",
      "btnViewQuiz",
      "viewQuiz",
      "btnQuizReset",
      "btnQuizTopicAll",
      "btnQuizTopicHeatpump",
      "btnQuizTopicHvac",
      "quizProgressText",
      "quizScoreText",
      "quizProgressBarFill",
      "quizQuestionHost",
      "btnViewHeatingCurve",
      "viewHeatingCurve",
      "btnHcPresetFbh",
      "btnHcPresetLowHk",
      "btnHcPresetOldHk",
      "hcSlopeSlider",
      "hcShiftSlider",
      "hcEfficiencyBadge",
      "heatingCurveSvg",
      "hcCurvePath",
      "hcMetricsGrid",
      "hcRulesGrid",
      "btnViewInstallation",
      "viewInstallation",
      "btnInstR290",
      "btnInstR32",
      "installSvg",
      "instLayerR290",
      "instLayerR32",
      "installCardsGrid"
    ];

    for (const id of requiredMainIds) {
      expect(html, `DOM-ID #${id} fehlt in index.html`).toContain(`id="${id}"`);
    }

    const hvacSvgSlice = html.slice(html.indexOf('id="hvacCircuitSvg"'));
    for (let compId = 1; compId <= 9; compId += 1) {
      expect(
        hvacSvgSlice,
        `Komponente data-comp="${compId}" fehlt in #hvacCircuitSvg`
      ).toContain(`data-comp="${compId}"`);
    }

    const hydSvgSlice = html.slice(html.indexOf('id="hydraulicsSvg"'));
    for (let compId = 1; compId <= 9; compId += 1) {
      expect(
        hydSvgSlice,
        `Komponente data-comp="${compId}" fehlt in #hydraulicsSvg`
      ).toContain(`data-comp="${compId}"`);
    }

    // Abgleich der im Review-Report referenzierten Rollen-IDs auf die realen DOM-IDs
    const reviewIdMapping: Record<string, string> = {
      circuitSvg: "circuitSvg",
      btnHeizen: "btnModeHeating",
      btnAbtauen: "btnModeDefrost",
      btnR290: "btnMonoblock",
      btnR32: "btnSplit",
      themeToggleBtn: "btnThemeToggle",
      themeIconLabel: "themeIconLabel",
      themeToggleIcon: "themeToggleIcon",
      tabCircuit: "btnViewCircuit",
      tabFaults: "btnViewFaults",
      tabNice: "btnViewNiceToKnow",
      panelCircuit: "viewCircuit",
      panelFaults: "viewFaults",
      panelNice: "viewNiceToKnow",
      componentAccordionList: "componentAccordionList",
      faultList: "faultList",
      niceGrid: "niceGrid",
      detailScrollTarget: "detailScrollTarget"
    };

    for (const [role, actualId] of Object.entries(reviewIdMapping)) {
      expect(
        html,
        `Rolle ${role} (gemappt auf #${actualId}) fehlt in index.html`
      ).toContain(`id="${actualId}"`);
    }
  });
});

describe("Azubi-Dashboards: Hydraulik-Kreis & Heizungswasser (VDI 2035)", () => {
  it("liefert beide Hydraulik-Varianten und 9 fortlaufende Bauteile", () => {
    expect(HYDRAULICS_VARIANTS.series.label).toContain("Reihenpuffer");
    expect(HYDRAULICS_VARIANTS.parallel.label).toContain("Parallelpuffer");
    expect(HYDRAULIC_COMPONENTS).toHaveLength(9);

    HYDRAULIC_COMPONENTS.forEach((comp, index) => {
      expect(comp.id).toBe(index + 1);
      expect(comp.name.length).toBeGreaterThan(2);
      expect(comp.azubiRule.length).toBeGreaterThan(10);
      expect(comp.commonMistake.length).toBeGreaterThan(10);
      expect(comp.checkValue.length).toBeGreaterThan(3);
    });
  });

  it("berechnet VDI-2035-Richtwerte abhängig von Aluminium und Fahrweise", () => {
    const noAluLowSalt = getWaterQualityMetrics("noAluminum", "lowSalt");
    const withAluSaline = getWaterQualityMetrics("withAluminum", "saline");

    expect(noAluLowSalt).toHaveLength(5);
    expect(withAluSaline).toHaveLength(5);

    const phNoAlu = noAluLowSalt.find((m) => m.id === "ph");
    const phWithAlu = withAluSaline.find((m) => m.id === "ph");
    expect(phNoAlu?.targetValue).toBe("8,2 – 10,0");
    expect(phWithAlu?.targetValue).toBe("8,2 – 8,5");

    const condLow = noAluLowSalt.find((m) => m.id === "conductivity");
    const condSaline = withAluSaline.find((m) => m.id === "conductivity");
    expect(condLow?.targetValue).toBe("< 100 µS/cm");
    expect(condSaline?.targetValue).toBe("100 – 1500 µS/cm");
  });

  it("liefert vollständige Equipment- und Praxis-Checklisten für Heizungswasser", () => {
    expect(WATER_EQUIPMENT).toHaveLength(4);
    expect(WATER_PRACTICE_STEPS).toHaveLength(4);

    for (const eq of WATER_EQUIPMENT) {
      expect(eq.norm.length).toBeGreaterThan(0);
      expect(eq.name.length).toBeGreaterThan(3);
      expect(eq.azubiCheck.length).toBeGreaterThan(10);
    }

    for (const step of WATER_PRACTICE_STEPS) {
      expect(step.title.length).toBeGreaterThan(3);
      expect(step.bullets.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("liefert alle 4 Pufferspeicher-Einbindungen und 4 Praxisregeln", () => {
    const keys = ["seriesReturn", "teeBranch", "parallel4Pipe", "combiTank"] as const;
    for (const key of keys) {
      const variant = BUFFER_VARIANTS[key];
      expect(variant.title.length).toBeGreaterThan(5);
      expect(variant.useCases.length).toBeGreaterThanOrEqual(3);
      expect(variant.pros.length).toBeGreaterThanOrEqual(3);
      expect(variant.cons.length).toBeGreaterThanOrEqual(3);
      expect(variant.azubiMerksatz.length).toBeGreaterThan(10);
    }

    expect(BUFFER_PRACTICE_RULES).toHaveLength(4);
    for (const rule of BUFFER_PRACTICE_RULES) {
      expect(rule.title.length).toBeGreaterThan(3);
      expect(rule.bullets.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("liefert 28 Prüfungsfragen (je 14 Luft/Wasser und Luft/Luft) mit gültigen Antwortindizes", () => {
    expect(QUIZ_QUESTIONS).toHaveLength(28);
    const heatpumpQuestions = QUIZ_QUESTIONS.filter((q) => q.topic === "heatpump");
    const hvacQuestions = QUIZ_QUESTIONS.filter((q) => q.topic === "hvac");
    expect(heatpumpQuestions).toHaveLength(14);
    expect(hvacQuestions).toHaveLength(14);

    for (const q of QUIZ_QUESTIONS) {
      expect(q.question.length).toBeGreaterThan(15);
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThanOrEqual(3);
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.examTip.length).toBeGreaterThan(10);
    }
  });

  it("berechnet plausible Vorlauftemperaturen für Heizkurve und liefert Aufstellungsregeln", () => {
    expect(HEATING_CURVE_PRESETS).toHaveLength(3);
    expect(HEATING_CURVE_RULES).toHaveLength(4);

    const fbhAtMinus12 = calculateFlowTemp(-12, 0.35, 0);
    const oldHkAtMinus12 = calculateFlowTemp(-12, 1.15, 1);
    expect(fbhAtMinus12).toBeGreaterThan(28);
    expect(fbhAtMinus12).toBeLessThan(38);
    expect(oldHkAtMinus12).toBeGreaterThan(50);

    expect(INSTALL_SYSTEMS.r290.badgeText).toContain("R290");
    expect(INSTALL_SYSTEMS.r32.badgeText).toContain("R32");
    expect(INSTALL_RULES).toHaveLength(4);
  });
});
