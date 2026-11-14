/**
 * Modul: DOM-Rendering für das Heizungswasser-Dashboard nach VDI 2035 (waterQualityView.ts)
 * Zweck: Visualisiert interaktive VDI-2035-Grenzwerte (Härte, Leitfähigkeit, pH, O2, Optik),
 *   Aufbereitungsbauteile (Systemtrenner BA, Mischbettharz, Messkoffer) und eine Azubi-Befüllcheckliste.
 * Verantwortlichkeit: Manipuliert das DOM strikt über createElement und textContent (kein innerHTML).
 * Sicherheitsrelevanz: Vollständige XSS-Immunität durch typisierte DOM-APIs.
 */

import {
  WATER_EQUIPMENT,
  WATER_PRACTICE_STEPS,
  getWaterQualityMetrics
} from "../data/waterQuality";
import type {
  AppState,
  WaterSystemMaterial,
  WaterTreatmentMode
} from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

export interface WaterQualityDomElements {
  readonly btnMatNoAlu: HTMLButtonElement;
  readonly btnMatWithAlu: HTMLButtonElement;
  readonly btnTreatLowSalt: HTMLButtonElement;
  readonly btnTreatSaline: HTMLButtonElement;
  readonly metricsGrid: HTMLElement;
  readonly equipmentGrid: HTMLElement;
  readonly practiceGrid: HTMLElement;
}

const EQUIP_ICON_MAP: Readonly<Record<string, string>> = {
  systemtrenner: "shield",
  mischbettharz: "water_drop",
  enthaertung: "science",
  messkoffer: "checklist"
};

/**
 * Rendert das komplette Heizungswasser-Dashboard anhand von Werkstoff und Fahrweise.
 */
export function renderWaterQualityView(
  elements: WaterQualityDomElements,
  state: AppState
): void {
  const isAlu = state.waterMaterial === "withAluminum";
  const isLowSalt = state.waterTreatment === "lowSalt";

  elements.btnMatNoAlu.setAttribute("aria-selected", String(!isAlu));
  elements.btnMatWithAlu.setAttribute("aria-selected", String(isAlu));
  elements.btnTreatLowSalt.setAttribute("aria-selected", String(isLowSalt));
  elements.btnTreatSaline.setAttribute("aria-selected", String(!isLowSalt));

  // 1. VDI-2035-Sollwerte-Karten
  const metrics = getWaterQualityMetrics(state.waterMaterial, state.waterTreatment);
  const metricCards = metrics.map((metric) => {
    const card = document.createElement("article");
    card.className = "water-metric-card liquid-glass-card";

    const topRow = document.createElement("div");
    topRow.className = "water-metric-top";

    const title = document.createElement("h3");
    title.className = "water-metric-name";
    title.textContent = metric.name;

    const badge = document.createElement("span");
    badge.className = `state-chip is-${metric.color}`;
    badge.textContent = metric.symbol;

    topRow.appendChild(title);
    topRow.appendChild(badge);

    const valueEl = document.createElement("div");
    valueEl.className = "water-metric-value tabular";
    valueEl.textContent = metric.targetValue;

    const unitEl = document.createElement("div");
    unitEl.className = "water-metric-unit";
    unitEl.textContent = metric.unit;

    const descEl = document.createElement("p");
    descEl.className = "nice-summary";
    descEl.textContent = metric.explanation;

    const tipBox = document.createElement("div");
    tipBox.className = "nice-protip";

    const tipLabel = document.createElement("span");
    tipLabel.className = "nice-protip-label";
    tipLabel.textContent = "Azubi-Merksatz";

    const tipText = document.createElement("p");
    tipText.className = "nice-protip-text";
    tipText.textContent = metric.azubiTip;

    tipBox.appendChild(tipLabel);
    tipBox.appendChild(tipText);

    card.appendChild(topRow);
    card.appendChild(valueEl);
    card.appendChild(unitEl);
    card.appendChild(descEl);
    card.appendChild(tipBox);
    return card;
  });
  elements.metricsGrid.replaceChildren(...metricCards);

  // 2. Bauteile zur Wasseraufbereitung & Befüllung (einmalig rendern)
  if (elements.equipmentGrid.childElementCount !== WATER_EQUIPMENT.length) {
    const equipCards = WATER_EQUIPMENT.map((item) => {
      const card = document.createElement("article");
      card.className = "nice-card liquid-glass-card";

      const head = document.createElement("div");
      head.className = "nice-card-head";

      const iconWrap = document.createElement("div");
      iconWrap.className = "nice-icon-badge";
      iconWrap.setAttribute("aria-hidden", "true");
      iconWrap.appendChild(
        createMaterialIcon(EQUIP_ICON_MAP[item.id] ?? "water_drop", "sm")
      );

      const titleWrap = document.createElement("div");
      titleWrap.className = "nice-title-wrap";

      const norm = document.createElement("span");
      norm.className = "nice-category";
      norm.textContent = item.norm;

      const title = document.createElement("h3");
      title.className = "nice-title";
      title.textContent = item.name;

      titleWrap.appendChild(norm);
      titleWrap.appendChild(title);

      const chip = document.createElement("span");
      chip.className = `state-chip is-${item.color}`;
      chip.textContent = "Bauteil";

      head.appendChild(iconWrap);
      head.appendChild(titleWrap);
      head.appendChild(chip);

      const purpose = document.createElement("p");
      purpose.className = "nice-summary";
      purpose.textContent = item.purpose;

      const list = document.createElement("ul");
      list.className = "nice-facts";

      const liInstall = document.createElement("li");
      liInstall.textContent = `Einbau & Praxis: ${item.installRule}`;
      list.appendChild(liInstall);

      const tipBox = document.createElement("div");
      tipBox.className = "nice-protip";

      const tipLabel = document.createElement("span");
      tipLabel.className = "nice-protip-label";
      tipLabel.textContent = "Kontrolle auf der Baustelle";

      const tipText = document.createElement("p");
      tipText.className = "nice-protip-text";
      tipText.textContent = item.azubiCheck;

      tipBox.appendChild(tipLabel);
      tipBox.appendChild(tipText);

      card.appendChild(head);
      card.appendChild(purpose);
      card.appendChild(list);
      card.appendChild(tipBox);
      return card;
    });
    elements.equipmentGrid.replaceChildren(...equipCards);
  }

  // 3. Azubi-Checkliste Befüllen, Spülen & Schadensbilder (einmalig rendern)
  if (elements.practiceGrid.childElementCount !== WATER_PRACTICE_STEPS.length) {
    const practiceCards = WATER_PRACTICE_STEPS.map((step) => {
      const card = document.createElement("article");
      card.className = "nice-card liquid-glass-card";

      const head = document.createElement("div");
      head.className = "nice-card-head";

      const titleWrap = document.createElement("div");
      titleWrap.className = "nice-title-wrap";

      const kicker = document.createElement("span");
      kicker.className = "nice-category";
      kicker.textContent = step.stepBadge;

      const title = document.createElement("h3");
      title.className = "nice-title";
      title.textContent = step.title;

      titleWrap.appendChild(kicker);
      titleWrap.appendChild(title);
      head.appendChild(titleWrap);

      const summary = document.createElement("p");
      summary.className = "nice-summary";
      summary.textContent = step.summary;

      const bullets = document.createElement("ul");
      bullets.className = "nice-facts";
      step.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        bullets.appendChild(li);
      });

      const warnBox = document.createElement("div");
      warnBox.className = "detail-section defrost-note-box";

      const warnLabel = document.createElement("p");
      warnLabel.className = "section-label";
      warnLabel.textContent = "Achtung · Fehler vermeiden";

      const warnText = document.createElement("p");
      warnText.className = "detail-text";
      warnText.textContent = step.warning;

      warnBox.appendChild(warnLabel);
      warnBox.appendChild(warnText);

      card.appendChild(head);
      card.appendChild(summary);
      card.appendChild(bullets);
      card.appendChild(warnBox);
      return card;
    });
    elements.practiceGrid.replaceChildren(...practiceCards);
  }
}

export type { WaterSystemMaterial, WaterTreatmentMode };
