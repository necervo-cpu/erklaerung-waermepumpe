/**
 * Modul: DOM-Rendering der Fehleranalyse & Störungsbilder (faultsView.ts)
 * Zweck: Rendert aufklappbare Störungs-Accordions inkl. Symptomen, Checklisten und Komponenten-Sprüngen.
 * Verantwortlichkeit: Manipuliert das DOM ausschließlich über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { COMPONENTS } from "../data/components";
import { FAULTS } from "../data/faults";
import type { AppState, FaultData } from "../types/circuit";
import { createChevronSvg } from "./uiIcons";

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
  const actionsWrap = document.createElement("div");
  actionsWrap.className = "fault-actions";
  fault.relatedComponents.forEach((compId) => {
    const comp = COMPONENTS.find((c) => c.id === compId);
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
  // Primäre IDs aus data/faults.ts
  hd: { icon: "!", bg: "var(--gradient-blossom)" },
  nd: { icon: "❄", bg: "var(--gradient-ocean)" },
  hotgas: { icon: "♨", bg: "var(--gradient-sorbet)" },
  ice: { icon: "❄", bg: "var(--gradient-lagoon)" },
  cycling: { icon: "⚙", bg: "var(--gradient-honey)" },
  heater: { icon: "⚡", bg: "var(--gradient-spring)" },
  flow: { icon: "≈", bg: "var(--gradient-meadow)" },

  // Abwärtskompatible Deskriptor-Aliases
  hd_alarm: { icon: "!", bg: "var(--gradient-blossom)" },
  nd_alarm: { icon: "❄", bg: "var(--gradient-ocean)" },
  superheat_high: { icon: "♨", bg: "var(--gradient-sorbet)" },
  icing_evaporator: { icon: "❄", bg: "var(--gradient-lagoon)" },
  liquid_slugging: { icon: "⚙", bg: "var(--gradient-honey)" },
  subcooling_low: { icon: "⚡", bg: "var(--gradient-spring)" },
  water_flow_low: { icon: "≈", bg: "var(--gradient-meadow)" }
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
  // In-Place-Update bei reinem Accordion-Toggle für < 200ms Reaktionszeit und flüssige Transition
  if (
    elements.faultList.dataset.rendered === "true" &&
    elements.faultList.childElementCount === FAULTS.length
  ) {
    FAULTS.forEach((fault) => {
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

  const cards: HTMLDivElement[] = FAULTS.map((fault) => {
    const isOpen = fault.id === state.faultId;
    const visual = FAULT_VISUAL_MAP[fault.id] ?? {
      icon: "!",
      bg: "var(--gradient-blossom)"
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
    iconBadge.style.background = visual.bg;
    iconBadge.setAttribute("aria-hidden", "true");
    iconBadge.textContent = visual.icon;

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
    chevron.appendChild(createChevronSvg());

    rightGroup.appendChild(codeBadge);
    rightGroup.appendChild(chevron);

    topRow.appendChild(leftGroup);
    topRow.appendChild(rightGroup);

    trigger.appendChild(topRow);
    trigger.addEventListener("click", () => onSelectFault(fault.id));

    card.appendChild(trigger);
    card.appendChild(createAccordionPanel(fault, isOpen, onJumpToComponent));
    return card;
  });

  elements.faultList.replaceChildren(...cards);
  elements.faultList.dataset.rendered = "true";
}
