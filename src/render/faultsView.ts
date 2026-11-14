/**
 * Modul: DOM-Rendering der Fehleranalyse & Störungsbilder (faultsView.ts)
 * Zweck: Rendert aufklappbare Störungs-Accordions inkl. Symptomen, Checklisten und Komponenten-Sprüngen.
 * Verantwortlichkeit: Manipuliert das DOM ausschließlich über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { FAULTS } from "../data/faults";
import { HVAC_FAULTS } from "../data/hvacFaults";
import type { AppState, CategoryType, FaultData } from "../types/circuit";
import { getComponentsForCategory } from "./circuitView";
import { createChevronIcon, createMaterialIcon } from "./uiIcons";

export interface FaultsDomElements {
  readonly faultList: HTMLElement;
}

/**
 * Erzeugt eine kompakte Detail-Sektion für den aufgeklappten Accordion-Inhalt.
 */
function createFaultSection(
  label: string,
  content: HTMLElement,
  extraClass = ""
): HTMLDivElement {
  const section = document.createElement("div");
  section.className = `detail-section${extraClass ? ` ${extraClass}` : ""}`;

  const heading = document.createElement("p");
  heading.className = "section-label";
  heading.textContent = label;

  section.appendChild(heading);
  section.appendChild(content);
  return section;
}

/**
 * Erzeugt eine Aufzählungsliste (<ul>) für Ursachen oder Prüfschritte.
 */
function createBulletList(items: readonly string[]): HTMLUListElement {
  const ul = document.createElement("ul");
  ul.className = "fault-list-ul";
  items.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    ul.appendChild(li);
  });
  return ul;
}

/**
 * Baut den aufklappbaren Diagnose-Inhalt für ein einzelnes Störungsbild.
 */
function createAccordionPanel(
  fault: FaultData,
  category: CategoryType,
  isOpen: boolean,
  onJumpToComponent: (componentId: number) => void
): HTMLDivElement {
  const panel = document.createElement("div");
  panel.className = `t-acc-panel${isOpen ? " is-open" : ""}`;
  panel.setAttribute("data-open", String(isOpen));
  panel.id = `fault-panel-${fault.id}`;

  const inner = document.createElement("div");
  inner.className = "t-acc-panel-inner";

  const body = document.createElement("div");
  body.className = "fault-acc-body";

  // Schweregrad-Zeile
  const severityRow = document.createElement("div");
  severityRow.className = "fault-severity-row";
  const severityBadge = document.createElement("span");
  severityBadge.className = "fault-code tabular";
  severityBadge.textContent = fault.severity;
  severityRow.appendChild(severityBadge);
  body.appendChild(severityRow);

  // Symptome
  const symptomsP = document.createElement("p");
  symptomsP.className = "section-text";
  symptomsP.textContent = fault.symptoms;
  body.appendChild(createFaultSection("Typische Symptome", symptomsP));

  // Ursachen & Prüfschritte
  body.appendChild(
    createFaultSection(
      "Mögliche Ursachen (Praxis-Checkliste)",
      createBulletList(fault.causes)
    )
  );
  body.appendChild(
    createFaultSection(
      "Messbild & Prüfschritte",
      createBulletList(fault.checks),
      "service-highlight"
    )
  );

  // Direktsprung-Buttons zu beteiligten Komponenten
  const activeComponents = getComponentsForCategory(category);
  const actionsWrap = document.createElement("div");
  actionsWrap.className = "fault-actions";
  fault.relatedComponents.forEach((compId) => {
    const comp = activeComponents.find((c) => c.id === compId);
    if (!comp) return;

    const jumpBtn = document.createElement("button");
    jumpBtn.type = "button";
    jumpBtn.className = "action-btn press-btn";
    jumpBtn.textContent = `Im Schema prüfen: ${comp.id}. ${comp.shortName}`;
    jumpBtn.setAttribute(
      "aria-label",
      `Komponente ${comp.id} (${comp.shortName}) im Schaltschema anzeigen`
    );
    jumpBtn.addEventListener("click", () => onJumpToComponent(comp.id));
    actionsWrap.appendChild(jumpBtn);
  });

  if (actionsWrap.childElementCount > 0) {
    body.appendChild(actionsWrap);
  }

  inner.appendChild(body);
  panel.appendChild(inner);
  return panel;
}

interface FaultVisualStyle {
  readonly icon: string;
  readonly bg: string;
}

const FAULT_VISUAL_MAP: Record<string, FaultVisualStyle> = {
  // Primäre IDs aus data/faults.ts (offizielle Google Material Symbols Rounded Namen)
  hd: { icon: "warning", bg: "var(--surface-field)" },
  nd: { icon: "ac_unit", bg: "var(--surface-field)" },
  hotgas: { icon: "local_fire_department", bg: "var(--surface-field)" },
  ice: { icon: "severe_cold", bg: "var(--surface-field)" },
  cycling: { icon: "autorenew", bg: "var(--surface-field)" },
  heater: { icon: "bolt", bg: "var(--surface-field)" },
  flow: { icon: "water_drop", bg: "var(--surface-field)" },

  // Primäre IDs für Split-Klima & VRV (data/hvacFaults.ts)
  condensate: { icon: "water_drop", bg: "var(--surface-field)" },
  indoor_ice: { icon: "severe_cold", bg: "var(--surface-field)" },
  vrv_oil: { icon: "oil_barrel", bg: "var(--surface-field)" },
  eev_branch: { icon: "tune", bg: "var(--surface-field)" },
  comm_bus: { icon: "router", bg: "var(--surface-field)" },
  hd_summer: { icon: "sunny", bg: "var(--surface-field)" },
  smell_hygiene: { icon: "air", bg: "var(--surface-field)" },

  // Abwärtskompatible Deskriptor-Aliases
  hd_alarm: { icon: "warning", bg: "var(--surface-field)" },
  nd_alarm: { icon: "ac_unit", bg: "var(--surface-field)" },
  superheat_high: { icon: "local_fire_department", bg: "var(--surface-field)" },
  icing_evaporator: { icon: "severe_cold", bg: "var(--surface-field)" },
  liquid_slugging: { icon: "autorenew", bg: "var(--surface-field)" },
  subcooling_low: { icon: "bolt", bg: "var(--surface-field)" },
  water_flow_low: { icon: "water_drop", bg: "var(--surface-field)" }
};

/**
 * Rendert alle Störungsbilder als aufklappbare Liquid-Glass-Accordion-Karten.
 */
export function renderFaultsView(
  elements: FaultsDomElements,
  state: AppState,
  onSelectFault: (faultId: string) => void,
  onJumpToComponent: (componentId: number) => void
): void {
  const activeFaults = state.category === "hvac" ? HVAC_FAULTS : FAULTS;

  // In-Place-Update bei reinem Accordion-Toggle für < 200ms Reaktionszeit und flüssige Transition
  if (
    elements.faultList.dataset.rendered === "true" &&
    elements.faultList.dataset.renderedCategory === state.category &&
    elements.faultList.childElementCount === activeFaults.length
  ) {
    activeFaults.forEach((fault) => {
      const isOpen = fault.id === state.faultId;
      const card = document.getElementById(`fault-card-${fault.id}`);
      const trigger = card?.querySelector<HTMLButtonElement>(".fault-card-btn");
      const panel = document.getElementById(`fault-panel-${fault.id}`);
      card?.classList.toggle("is-open", isOpen);
      trigger?.classList.toggle("is-active", isOpen);
      trigger?.setAttribute("aria-expanded", String(isOpen));
      panel?.classList.toggle("is-open", isOpen);
      panel?.setAttribute("data-open", String(isOpen));
    });
    return;
  }

  const cards: HTMLDivElement[] = activeFaults.map((fault) => {
    const isOpen = fault.id === state.faultId;
    const visual = FAULT_VISUAL_MAP[fault.id] ?? {
      icon: "warning",
      bg: "var(--surface-field)"
    };

    const card = document.createElement("div");
    card.id = `fault-card-${fault.id}`;
    card.className = `fault-accordion-card${isOpen ? " is-open" : ""}`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `fault-card-btn press-card${isOpen ? " is-active" : ""}`;
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `fault-panel-${fault.id}`);

    // Kopfzeile mit rundem iOS-Icon-Badge, Titel, Fehlercode und Aufklapp-Pfeil
    const topRow = document.createElement("div");
    topRow.className = "fault-card-top";

    const leftGroup = document.createElement("div");
    leftGroup.className = "fault-card-lead";

    const iconBadge = document.createElement("span");
    iconBadge.className = "fault-icon-badge";
    iconBadge.setAttribute("aria-hidden", "true");
    iconBadge.appendChild(createMaterialIcon(visual.icon, "sm"));

    const textCol = document.createElement("div");
    textCol.className = "fault-card-textcol";

    const titleEl = document.createElement("h3");
    titleEl.className = "fault-card-title";
    titleEl.textContent = fault.title;

    const previewEl = document.createElement("p");
    previewEl.className = "fault-card-preview";
    previewEl.textContent = fault.preview;

    textCol.appendChild(titleEl);
    textCol.appendChild(previewEl);

    leftGroup.appendChild(iconBadge);
    leftGroup.appendChild(textCol);

    const rightGroup = document.createElement("div");
    rightGroup.className = "fault-card-meta";

    const codeBadge = document.createElement("span");
    codeBadge.className = "fault-code tabular";
    codeBadge.textContent = fault.code;

    const chevron = document.createElement("span");
    chevron.className = "fault-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.appendChild(createChevronIcon());

    rightGroup.appendChild(codeBadge);
    rightGroup.appendChild(chevron);

    topRow.appendChild(leftGroup);
    topRow.appendChild(rightGroup);

    trigger.appendChild(topRow);
    trigger.addEventListener("click", () => onSelectFault(fault.id));

    card.appendChild(trigger);
    card.appendChild(createAccordionPanel(fault, state.category, isOpen, onJumpToComponent));
    return card;
  });

  elements.faultList.replaceChildren(...cards);
  elements.faultList.dataset.rendered = "true";
  elements.faultList.dataset.renderedCategory = state.category;
}
