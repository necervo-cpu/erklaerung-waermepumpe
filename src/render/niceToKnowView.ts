/**
 * Modul: DOM-Rendering der Wissenskarten „Nice to Know“ (niceToKnowView.ts)
 * Zweck: Rendert ein responsives Liquid-Glass-Kartengrid für praxisrelevantes Wärmepumpen-Wissen.
 * Verantwortlichkeit: Sichere DOM-Erstellung über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { NICE_TO_KNOW } from "../data/niceToKnow";
import type { NiceToKnowItem } from "../types/circuit";

/**
 * Erzeugt eine einzelne semantische Wissenskarte für das Grid.
 */
function createNiceCard(item: NiceToKnowItem): HTMLElement {
  const card = document.createElement("article");
  card.className = "liquid-glass-card nice-card";
  card.setAttribute("aria-labelledby", `nice-title-${item.id}`);

  // Obere Leiste mit Fachkategorie und Badge
  const topRow = document.createElement("div");
  topRow.className = "nice-card-top";

  const categoryEl = document.createElement("span");
  categoryEl.className = "nice-category";
  categoryEl.textContent = item.category;

  const badgeEl = document.createElement("span");
  badgeEl.className = "nice-badge tabular";
  badgeEl.textContent = item.badge;

  topRow.appendChild(categoryEl);
  topRow.appendChild(badgeEl);
  card.appendChild(topRow);

  // Kartentitel
  const titleEl = document.createElement("h3");
  titleEl.id = `nice-title-${item.id}`;
  titleEl.className = "nice-title";
  titleEl.textContent = item.title;
  card.appendChild(titleEl);

  // Kurzzusammenfassung
  const summaryEl = document.createElement("p");
  summaryEl.className = "nice-summary";
  summaryEl.textContent = item.summary;
  card.appendChild(summaryEl);

  // Wichtigste Fakten als Aufzählung
  const factsList = document.createElement("ul");
  factsList.className = "nice-facts-ul";

  item.keyFacts.forEach((fact) => {
    const li = document.createElement("li");
    li.className = "nice-fact-item";
    li.textContent = fact;
    factsList.appendChild(li);
  });
  card.appendChild(factsList);

  // Experten-Tipp als hervorgehobene Box
  const tipBox = document.createElement("div");
  tipBox.className = "nice-tip";

  const tipHeader = document.createElement("div");
  tipHeader.className = "nice-tip-header";

  const tipIcon = document.createElement("span");
  tipIcon.className = "nice-tip-icon";
  tipIcon.setAttribute("aria-hidden", "true");
  tipIcon.textContent = "💡";

  const tipLabel = document.createElement("strong");
  tipLabel.className = "nice-tip-label";
  tipLabel.textContent = "Praxis-Tipp:";

  tipHeader.appendChild(tipIcon);
  tipHeader.appendChild(tipLabel);
  tipBox.appendChild(tipHeader);

  const tipText = document.createElement("p");
  tipText.className = "nice-tip-text";
  tipText.textContent = item.proTip;
  tipBox.appendChild(tipText);

  card.appendChild(tipBox);

  return card;
}

/**
 * Rendert das gesamte Wissens-Grid vollständig ohne innerHTML.
 */
export function renderNiceToKnowView(container: HTMLElement): void {
  const cards = NICE_TO_KNOW.map((item) => createNiceCard(item));
  container.replaceChildren(...cards);
}
