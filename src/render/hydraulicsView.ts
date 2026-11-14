/**
 * Modul: DOM-Rendering für das Hydraulik-Dashboard (hydraulicsView.ts)
 * Zweck: Rendert das interaktive Hydraulik-Flussbild (Reihenpuffer vs. Parallelpuffer)
 *   sowie die 9 aufklappbaren Hydraulik-Bauteile mit Azubi-Merksätzen und Montagefehlern.
 * Verantwortlichkeit: Manipuliert das DOM strikt über createElement und textContent (kein innerHTML).
 * Sicherheitsrelevanz: Vollständig XSS-sicher ohne String-HTML-Injektion.
 */

import { BUFFER_VARIANTS } from "../data/bufferStorage";
import { HYDRAULICS_VARIANTS, HYDRAULIC_COMPONENTS } from "../data/hydraulics";
import type { AppState, HydraulicsVariant, PaletteColorKey } from "../types/circuit";
import { createChevronIcon } from "./uiIcons";

export interface HydraulicsDomElements {
  readonly hydBanner: HTMLElement;
  readonly hydBannerTitle: HTMLElement;
  readonly hydBannerDesc: HTMLElement;
  readonly hydBannerBadge: HTMLElement;
  readonly hydraulicsSvg: SVGSVGElement;
  readonly hydPipesSeries: SVGGElement;
  readonly hydPipesParallel: SVGGElement;
  readonly hydBypassSeries: SVGGElement;
  readonly hydPumpSecParallel: SVGGElement;
  readonly hydBufferTitle: SVGTextElement;
  readonly hydBufferSub: SVGTextElement;
  readonly accordionList: HTMLElement;
}

const HYD_BADGE_GRADIENTS: Readonly<Record<PaletteColorKey, string>> = {
  rose: "var(--gradient-blossom)",
  peach: "var(--gradient-sunrise)",
  butter: "var(--gradient-honey)",
  lime: "var(--gradient-spring)",
  mint: "var(--gradient-meadow)",
  aqua: "var(--gradient-lagoon)",
  sky: "var(--gradient-ocean)",
  periwinkle: "var(--gradient-iris)",
  lavender: "var(--gradient-dusk)",
  orchid: "var(--gradient-blossom)"
};

function createInfoBlock(
  label: string,
  text: string,
  extraClass = ""
): HTMLDivElement {
  const section = document.createElement("div");
  section.className = extraClass ? `detail-section ${extraClass}` : "detail-section";

  const labelEl = document.createElement("p");
  labelEl.className = "section-label";
  labelEl.textContent = label;

  const textEl = document.createElement("p");
  textEl.className = "detail-text";
  textEl.textContent = text;

  section.appendChild(labelEl);
  section.appendChild(textEl);
  return section;
}

/**
 * Aktualisiert die aktive Variante (Reihenpuffer vs. Parallelpuffer) und die 9 Hydraulik-Bauteile.
 */
export function renderHydraulicsView(
  elements: HydraulicsDomElements,
  state: AppState,
  onSelectComponent: (id: number) => void
): void {
  const bufData = BUFFER_VARIANTS[state.bufferVariant];
  const isSeries = state.bufferVariant === "seriesReturn";
  const mappedVariant: HydraulicsVariant = isSeries ? "series" : "parallel";
  const variant = HYDRAULICS_VARIANTS[mappedVariant];

  elements.hydBanner.className = `refrigerant-banner ${isSeries ? "is-r290" : "is-r32"}`;
  elements.hydBannerTitle.textContent = bufData.title;
  elements.hydBannerDesc.textContent = bufData.principle;
  elements.hydBannerBadge.className = "badge-tag";
  elements.hydBannerBadge.dataset.color = bufData.color;
  elements.hydBannerBadge.textContent = bufData.efficiencyBadge;

  // SVG-Layer zwischen Reihenschaltung (1 Pumpe + ÜSV) und entkoppelten Schaltungen (2 Pumpen) umschalten
  elements.hydPipesSeries.classList.toggle("svg-layer-hidden", !isSeries);
  elements.hydPipesParallel.classList.toggle("svg-layer-hidden", isSeries);
  elements.hydBypassSeries.classList.toggle("svg-layer-hidden", !isSeries);
  elements.hydPumpSecParallel.classList.toggle("svg-layer-hidden", isSeries);

  const bufferLabels: Readonly<Record<AppState["bufferVariant"], { readonly title: string; readonly sub: string }>> = {
    seriesReturn: { title: "Reihenpuffer", sub: "Rücklauf (50–100 l)" },
    teeBranch: { title: "Pendelspeicher", sub: "Stich-T-Stück (100–300 l)" },
    parallel4Pipe: { title: "Parallelpuffer", sub: "Hydr. Weiche (100–300 l)" },
    combiTank: { title: "Kombispeicher", sub: "Heizung + TWW (300–500 l)" }
  };
  const labelInfo = bufferLabels[state.bufferVariant];
  elements.hydBufferTitle.textContent = labelInfo.title;
  elements.hydBufferSub.textContent = labelInfo.sub;

  // Aktives Bauteil im Hydraulik-SVG hervorheben
  const svgNodes = elements.hydraulicsSvg.querySelectorAll<SVGGElement>(".svg-comp");
  svgNodes.forEach((node) => {
    const id = Number(node.getAttribute("data-comp"));
    const active = id === state.hydraulicComponentId;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });

  // In-Place-Update innerhalb derselben Variante erhält offene Akkordeon-Transitionen
  if (
    elements.accordionList.dataset.renderedVariant === mappedVariant &&
    elements.accordionList.childElementCount === HYDRAULIC_COMPONENTS.length
  ) {
    HYDRAULIC_COMPONENTS.forEach((comp) => {
      const isOpen = comp.id === state.hydraulicComponentId;
      const card = document.getElementById(`hyd-card-${comp.id}`);
      const trigger = card?.querySelector<HTMLButtonElement>(".comp-card-btn");
      const panel = document.getElementById(`hyd-panel-${comp.id}`);
      card?.classList.toggle("is-open", isOpen);
      trigger?.classList.toggle("is-active", isOpen);
      trigger?.setAttribute("aria-expanded", String(isOpen));
      panel?.classList.toggle("is-open", isOpen);
      panel?.setAttribute("data-open", String(isOpen));
    });
    return;
  }

  const cards = HYDRAULIC_COMPONENTS.map((comp) => {
    const isOpen = comp.id === state.hydraulicComponentId;
    const location = comp.location[mappedVariant];
    const badgeBg = HYD_BADGE_GRADIENTS[comp.badgeColor];

    const card = document.createElement("div");
    card.className = `comp-accordion-card${isOpen ? " is-open" : ""}`;
    card.id = `hyd-card-${comp.id}`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `comp-card-btn press-card${isOpen ? " is-active" : ""}`;
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `hyd-panel-${comp.id}`);
    trigger.addEventListener("click", () => onSelectComponent(comp.id));

    const badge = document.createElement("div");
    badge.className = "comp-icon-badge";
    badge.style.background = badgeBg;
    badge.textContent = String(comp.id);

    const textWrap = document.createElement("div");
    textWrap.className = "comp-card-text";

    const title = document.createElement("span");
    title.className = "comp-card-title";
    title.textContent = comp.name;

    const preview = document.createElement("span");
    preview.className = "comp-card-preview";
    preview.textContent = location;

    const metricPill = document.createElement("span");
    metricPill.className = "comp-metric-pill tabular";
    metricPill.textContent = comp.metricBadge;

    textWrap.appendChild(title);
    textWrap.appendChild(preview);
    textWrap.appendChild(metricPill);

    const chevron = document.createElement("span");
    chevron.className = "comp-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.appendChild(createChevronIcon());

    trigger.appendChild(badge);
    trigger.appendChild(textWrap);
    trigger.appendChild(chevron);

    const panel = document.createElement("div");
    panel.className = `comp-acc-panel t-acc-panel${isOpen ? " is-open" : ""}`;
    panel.id = `hyd-panel-${comp.id}`;
    panel.setAttribute("data-open", String(isOpen));

    const inner = document.createElement("div");
    inner.className = "t-acc-inner";

    const body = document.createElement("div");
    body.className = "comp-acc-body";

    const metaRow = document.createElement("div");
    metaRow.className = "detail-meta-row";

    const kicker = document.createElement("p");
    kicker.className = "detail-kicker";
    kicker.textContent = `Hydraulik-Bauteil ${comp.id} von ${HYDRAULIC_COMPONENTS.length} · ${variant.label}`;

    const locPill = document.createElement("span");
    locPill.className = "location-pill";
    locPill.textContent = `Einbauort: ${location}`;

    metaRow.appendChild(kicker);
    metaRow.appendChild(locPill);
    body.appendChild(metaRow);

    body.appendChild(createInfoBlock("Aufgabe im Heizungswasserkreis", comp.task));
    body.appendChild(createInfoBlock("Azubi-Merksatz für die Praxis", comp.azubiRule, "service-highlight"));
    body.appendChild(createInfoBlock("Typischer Montagefehler (Vermeiden!)", comp.commonMistake, "defrost-note-box"));
    body.appendChild(createInfoBlock("Prüf- & Einstellwert bei Inbetriebnahme", comp.checkValue, "heating-note-box"));

    inner.appendChild(body);
    panel.appendChild(inner);

    card.appendChild(trigger);
    card.appendChild(panel);
    return card;
  });

  elements.accordionList.replaceChildren(...cards);
  elements.accordionList.dataset.renderedVariant = mappedVariant;
}
