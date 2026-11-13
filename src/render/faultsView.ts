/**
 * Modul: DOM-Rendering der Fehleranalyse & Störungsbilder (faultsView.ts)
 * Zweck: Rendert Auswahlliste, Symptome, Checklisten und Komponenten-Sprünge für Störungsbilder.
 * Verantwortlichkeit: Manipuliert das DOM ausschließlich über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { COMPONENTS } from "../data/components";
import { FAULTS } from "../data/faults";
import type { AppState } from "../types/circuit";

export interface FaultsDomElements {
  readonly faultList: HTMLElement;
  readonly faultTitle: HTMLElement;
  readonly faultSeverity: HTMLElement;
  readonly faultSymptoms: HTMLElement;
  readonly faultCauses: HTMLUListElement;
  readonly faultChecks: HTMLUListElement;
  readonly faultActions: HTMLElement;
}

/**
 * Rendert die Fehleranalyse-Ansicht vollständig ohne innerHTML.
 */
export function renderFaultsView(
  elements: FaultsDomElements,
  state: AppState,
  onSelectFault: (faultId: string) => void,
  onJumpToComponent: (componentId: number) => void
): void {
  // Störungs-Auswahlliste rendern
  const faultButtons: HTMLButtonElement[] = FAULTS.map((fault) => {
    const isSelected = fault.id === state.faultId;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `fault-card-btn press-card${isSelected ? " is-active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(isSelected));

    // Kopfzeile mit Titel und Fehlercode
    const topRow = document.createElement("div");
    topRow.className = "fault-card-top";

    const titleEl = document.createElement("h3");
    titleEl.className = "fault-card-title";
    titleEl.textContent = fault.title;

    const codeBadge = document.createElement("span");
    codeBadge.className = "fault-code tabular";
    codeBadge.textContent = fault.code;

    topRow.appendChild(titleEl);
    topRow.appendChild(codeBadge);

    // Vorschautext
    const previewEl = document.createElement("p");
    previewEl.className = "fault-card-preview";
    previewEl.textContent = fault.preview;

    btn.appendChild(topRow);
    btn.appendChild(previewEl);

    btn.addEventListener("click", () => onSelectFault(fault.id));
    return btn;
  });

  elements.faultList.replaceChildren(...faultButtons);

  // Aktives Störungsbild ermitteln
  const activeFault =
    FAULTS.find((f) => f.id === state.faultId) ?? FAULTS[0];
  if (!activeFault) return;

  elements.faultTitle.textContent = activeFault.title;
  elements.faultSeverity.textContent = activeFault.severity;
  elements.faultSymptoms.textContent = activeFault.symptoms;

  // Ursachen-Liste rendern
  const causeItems: HTMLLIElement[] = activeFault.causes.map((cause) => {
    const li = document.createElement("li");
    li.textContent = cause;
    return li;
  });
  elements.faultCauses.replaceChildren(...causeItems);

  // Prüfschritte-Liste rendern
  const checkItems: HTMLLIElement[] = activeFault.checks.map((check) => {
    const li = document.createElement("li");
    li.textContent = check;
    return li;
  });
  elements.faultChecks.replaceChildren(...checkItems);

  // Direktsprung-Buttons zu beteiligten Kältekreiskomponenten
  const actionButtons: HTMLButtonElement[] = [];
  activeFault.relatedComponents.forEach((compId) => {
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
    actionButtons.push(jumpBtn);
  });

  elements.faultActions.replaceChildren(...actionButtons);
}
