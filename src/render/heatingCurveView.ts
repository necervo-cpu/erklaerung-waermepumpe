/**
 * Modul: Rendering des Heizkurven-Dashboards (heatingCurveView.ts)
 * Zweck: Zeichnet die interaktive Heizkurve in #heatingCurveSvg, aktualisiert Live-Vorlauftemperaturen
 *   (+10 °C, 0 °C, -12 °C) sowie die COP-Effizienzbewertung und die 4 Abgleich-Praxiskarten.
 * Verantwortlichkeit: Berechnet SVG-Kurvenpfad und Marker-Koordinaten typsicher.
 * Sicherheitsrelevanz: Ausschließliche Verwendung von textContent und sicheren SVG-Attributen.
 */

import {
  HEATING_CURVE_PRESETS,
  HEATING_CURVE_RULES,
  calculateFlowTemp,
  type HeatingCurveRuleCard
} from "../data/heatingCurve";
import type { AppState } from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

export interface HeatingCurveDomElements {
  readonly btnPresetFbh: HTMLButtonElement;
  readonly btnPresetLowHk: HTMLButtonElement;
  readonly btnPresetOldHk: HTMLButtonElement;
  readonly slopeSlider: HTMLInputElement;
  readonly shiftSlider: HTMLInputElement;
  readonly slopeValue: HTMLElement;
  readonly shiftValue: HTMLElement;
  readonly curvePath: SVGPathElement;
  readonly dot10: SVGCircleElement;
  readonly dot0: SVGCircleElement;
  readonly dotMinus12: SVGCircleElement;
  readonly label10: SVGTextElement;
  readonly label0: SVGTextElement;
  readonly labelMinus12: SVGTextElement;
  readonly efficiencyBadge: HTMLElement;
  readonly metricsGrid: HTMLElement;
  readonly rulesGrid: HTMLElement;
}

// Koordinatenmapping im 640×320-SVG-Koordinatensystem (X: +20..-16 °C, Y: 20..70 °C)
function mapX(outdoorTemp: number): number {
  const ratio = (20 - outdoorTemp) / 36;
  return Math.round((68 + ratio * 532) * 10) / 10;
}

function mapY(flowTemp: number): number {
  const clamped = Math.min(70, Math.max(20, flowTemp));
  const ratio = (clamped - 20) / 50;
  return Math.round((270 - ratio * 226) * 10) / 10;
}

function createMetricCard(
  title: string,
  value: string,
  badge: string,
  color: "mint" | "sky" | "peach" | "rose",
  desc: string
): HTMLElement {
  const card = document.createElement("article");
  card.className = "water-metric-card liquid-glass-card";

  const top = document.createElement("div");
  top.className = "water-metric-top";

  const h3 = document.createElement("h3");
  h3.className = "water-metric-name";
  h3.textContent = title;

  const tag = document.createElement("span");
  tag.className = "badge-tag";
  tag.dataset.color = color;
  tag.textContent = badge;

  top.append(h3, tag);

  const val = document.createElement("div");
  val.className = "water-metric-value tabular";
  val.textContent = value;

  const p = document.createElement("p");
  p.className = "section-text";
  p.textContent = desc;

  card.append(top, val, p);
  return card;
}

function createRuleCard(rule: HeatingCurveRuleCard): HTMLElement {
  const card = document.createElement("article");
  card.className = "nice-card liquid-glass-card";

  const head = document.createElement("div");
  head.className = "nice-card-top";
  const cat = document.createElement("span");
  cat.className = "nice-category";
  cat.appendChild(createMaterialIcon(rule.icon, "xs"));
  const catLabel = document.createElement("span");
  catLabel.textContent = rule.badge;
  cat.appendChild(catLabel);
  head.appendChild(cat);

  const title = document.createElement("h3");
  title.className = "nice-title";
  title.textContent = rule.title;

  const summary = document.createElement("p");
  summary.className = "nice-summary";
  summary.textContent = rule.summary;

  const list = document.createElement("ul");
  list.className = "nice-facts-ul";
  for (const b of rule.bullets) {
    const li = document.createElement("li");
    li.className = "nice-fact-item";
    li.textContent = b;
    list.appendChild(li);
  }

  card.append(head, title, summary, list);
  return card;
}

/**
 * Rendert die Heizkurve inkl. Live-Werten und Praxiskarten.
 */
export function renderHeatingCurveView(
  elements: HeatingCurveDomElements,
  state: AppState
): void {
  const { hcSlope, hcShift } = state;

  elements.slopeSlider.value = String(hcSlope);
  elements.shiftSlider.value = String(hcShift);
  elements.slopeValue.textContent = hcSlope.toFixed(2).replace(".", ",");
  const shiftPrefix = hcShift > 0 ? "+" : "";
  elements.shiftValue.textContent = `${shiftPrefix}${hcShift.toFixed(1).replace(".", ",")} K`;

  const [fbh, lowHk, oldHk] = HEATING_CURVE_PRESETS;
  elements.btnPresetFbh.setAttribute(
    "aria-selected",
    String(Math.abs(hcSlope - fbh.slope) < 0.01 && hcShift === fbh.shift)
  );
  elements.btnPresetLowHk.setAttribute(
    "aria-selected",
    String(Math.abs(hcSlope - lowHk.slope) < 0.01 && hcShift === lowHk.shift)
  );
  elements.btnPresetOldHk.setAttribute(
    "aria-selected",
    String(Math.abs(hcSlope - oldHk.slope) < 0.01 && hcShift === oldHk.shift)
  );

  // Kurvenpfad in 2-K-Schritten von +20 °C bis -16 °C erzeugen
  const points: string[] = [];
  for (let t = 20; t >= -16; t -= 2) {
    const flow = calculateFlowTemp(t, hcSlope, hcShift);
    points.push(`${t === 20 ? "M" : "L"} ${mapX(t)} ${mapY(flow)}`);
  }
  elements.curvePath.setAttribute("d", points.join(" "));

  const t10 = calculateFlowTemp(10, hcSlope, hcShift);
  const t0 = calculateFlowTemp(0, hcSlope, hcShift);
  const tMinus12 = calculateFlowTemp(-12, hcSlope, hcShift);

  const updateMarker = (
    dot: SVGCircleElement,
    label: SVGTextElement,
    outdoor: number,
    flow: number
  ): void => {
    const x = mapX(outdoor);
    const y = mapY(flow);
    dot.setAttribute("cx", String(x));
    dot.setAttribute("cy", String(y));
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(Math.max(28, y - 12)));
    label.textContent = `${flow.toFixed(1).replace(".", ",")} °C`;
  };

  updateMarker(elements.dot10, elements.label10, 10, t10);
  updateMarker(elements.dot0, elements.label0, 0, t0);
  updateMarker(elements.dotMinus12, elements.labelMinus12, -12, tMinus12);

  const evalBadge =
    tMinus12 <= 38
      ? { text: "Top WP-Effizienz", color: "mint" as const }
      : tMinus12 <= 50
        ? { text: "Gute WP-Auslegung", color: "sky" as const }
        : tMinus12 <= 58
          ? { text: "Grenzwertig (COP sinkt)", color: "peach" as const }
          : { text: "Zu hoch für WP!", color: "rose" as const };

  // Live-Effizienz-Badge (Grün / Gelb / Rot)
  const liveEff =
    tMinus12 <= 42
      ? { color: "mint", label: "Grün (Optimal)" }
      : tMinus12 <= 55
        ? { color: "peach", label: "Gelb (Erhöht)" }
        : { color: "rose", label: "Rot (Ineffizient)" };

  elements.efficiencyBadge.dataset.color = liveEff.color;
  elements.efficiencyBadge.textContent = `${liveEff.label} · Pro 1 K höhere Vorlauftemperatur sinkt der COP / die JAZ um ca. 2,5 %`;

  elements.metricsGrid.replaceChildren(
    createMetricCard(
      "Übergangszeit (+10 °C außen)",
      `${t10.toFixed(1).replace(".", ",")} °C`,
      "Teillast",
      "sky",
      "Typische Vorlauftemperatur in Frühjahr/Herbst – hier läuft die WP im hocheffizienten Teillastbetrieb."
    ),
    createMetricCard(
      "Wintertag (0 °C außen)",
      `${t0.toFixed(1).replace(".", ",")} °C`,
      "Hauptlast",
      "mint",
      "Entscheidend für die Jahresarbeitszahl: Die meisten Heizstunden im Jahr liegen zwischen -2 °C und +7 °C."
    ),
    createMetricCard(
      "Norm-Auslegung (-12 °C außen)",
      `${tMinus12.toFixed(1).replace(".", ",")} °C`,
      evalBadge.text,
      evalBadge.color,
      "Maximale Vorlauftemperatur am kältesten Tag. Über 55 °C sinkt der COP stark ab und der Heizstab droht."
    )
  );

  if (elements.rulesGrid.childElementCount === 0) {
    elements.rulesGrid.replaceChildren(...HEATING_CURVE_RULES.map(createRuleCard));
  }
}
