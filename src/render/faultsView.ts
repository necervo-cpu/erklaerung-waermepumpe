/**
 * Modul: DOM-Rendering der Fehleranalyse & Störungsbilder (faultsView.ts)
 * Zweck: Rendert aufklappbare Störungs-Accordions inkl. Symptomen, Checklisten und Komponenten-Sprüngen.
 * Verantwortlichkeit: Manipuliert das DOM ausschließlich über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { COMPONENTS } from "../data/components";
import { FAULTS } from "../data/faults";
import type { AppState, FaultData } from "../types/circuit";

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
  panel.id = `fault-panel-${fault.id}`;

  const inner = document.createElement("div");
  inner.className = "t-acc-panel-inner fault-acc-body";

  // Schweregrad-Zeile
  const severityRow = document.createElement("div");
  severityRow.className = "fault-severity-row";
  const severityBadge = document.createElement("span");
  severityBadge.className = "fault-code tabular";
  severityBadge.textContent = fault.severity;
  severityRow.appendChild(severityBadge);
  inner.appendChild(severityRow);

  // Symptome
  const symptomsP = document.createElement("p");
  symptomsP.className = "section-text";
  symptomsP.textContent = fault.symptoms;
  inner.appendChild(createFaultSection("Typische Symptome", symptomsP));

  // Ursachen & Prüfschritte
  inner.appendChild(
    createFaultSection(
      "Mögliche Ursachen (Praxis-Checkliste)",
      createBulletList(fault.causes)
    )
  );
  inner.appendChild(
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
    inner.appendChild(actionsWrap);
  }

  panel.appendChild(inner);
  return panel;
}

/**
 * Rendert alle Störungsbilder als aufklappbare Liquid-Glass-Accordion-Karten.
 */
export function renderFaultsView(
  elements: FaultsDomElements,
  state: AppState,
  onSelectFault: (faultId: string) => void,
  onJumpToComponent: (componentId: number) => void
): void {
  const cards: HTMLDivElement[] = FAULTS.map((fault) => {
    const isOpen = fault.id === state.faultId;

    const card = document.createElement("div");
    card.className = `liquid-glass-card fault-accordion-card${isOpen ? " is-open" : ""}`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `fault-card-btn press-card${isOpen ? " is-active" : ""}`;
    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-controls", `fault-panel-${fault.id}`);

    // Kopfzeile mit Titel, Fehlercode und Aufklapp-Pfeil
    const topRow = document.createElement("div");
    topRow.className = "fault-card-top";

    const titleEl = document.createElement("h3");
    titleEl.className = "fault-card-title";
    titleEl.textContent = fault.title;

    const rightGroup = document.createElement("div");
    rightGroup.className = "fault-card-meta";

    const codeBadge = document.createElement("span");
    codeBadge.className = "fault-code tabular";
    codeBadge.textContent = fault.code;

    const chevron = document.createElement("span");
    chevron.className = "fault-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "▾";

    rightGroup.appendChild(codeBadge);
    rightGroup.appendChild(chevron);

    topRow.appendChild(titleEl);
    topRow.appendChild(rightGroup);

    const previewEl = document.createElement("p");
    previewEl.className = "fault-card-preview";
    previewEl.textContent = fault.preview;

    trigger.appendChild(topRow);
    trigger.appendChild(previewEl);
    trigger.addEventListener("click", () => onSelectFault(fault.id));

    card.appendChild(trigger);
    card.appendChild(createAccordionPanel(fault, isOpen, onJumpToComponent));
    return card;
  });

  elements.faultList.replaceChildren(...cards);
}
