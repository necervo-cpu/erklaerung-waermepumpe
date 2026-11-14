/**
 * Modul: DOM-Rendering der Wissenskarten „Nice to Know“ (niceToKnowView.ts)
 * Zweck: Rendert ein responsives Liquid-Glass-Kartengrid für praxisrelevantes Wärmepumpen-Wissen.
 * Verantwortlichkeit: Sichere DOM-Erstellung über createElement, textContent und replaceChildren (kein innerHTML).
 * Sicherheitsrelevanz: Strikte XSS-Sicherheit durch deklarativen Elementbau ohne HTML-String-Parsing.
 */

import { NICE_TO_KNOW } from "../data/niceToKnow";
import type { NiceToKnowItem } from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

interface NiceCategoryStyle {
  readonly icon: string;
}

const NICE_CATEGORY_PALETTE: readonly NiceCategoryStyle[] = [
  { icon: "star" },
  { icon: "bolt" },
  { icon: "check_circle" },
  { icon: "local_fire_department" },
  { icon: "ac_unit" },
  { icon: "tune" }
];

/**
 * Erzeugt eine einzelne semantische Wissenskarte für das Grid.
 */
function createNiceCard(item: NiceToKnowItem, index: number): HTMLElement {
  const palette = NICE_CATEGORY_PALETTE[index % NICE_CATEGORY_PALETTE.length]!;
  const card = document.createElement("article");
  card.className = "liquid-glass-card nice-card";
  card.setAttribute("aria-labelledby", `nice-title-${item.id}`);

  // Obere Leiste mit rundem iOS-Icon-Badge, Fachkategorie und Badge
  const topRow = document.createElement("div");
  topRow.className = "nice-card-top";

  const catWrap = document.createElement("div");
  catWrap.className = "nice-cat-wrap";

  const iconDot = document.createElement("span");
  iconDot.className = "nice-icon-badge";
  iconDot.setAttribute("aria-hidden", "true");
  iconDot.appendChild(createMaterialIcon(palette.icon, "xs"));

  const categoryEl = document.createElement("span");
  categoryEl.className = "nice-category";
  categoryEl.textContent = item.category;

  catWrap.appendChild(iconDot);
  catWrap.appendChild(categoryEl);

  const badgeEl = document.createElement("span");
  badgeEl.className = "nice-badge tabular";
  badgeEl.textContent = item.badge;

  topRow.appendChild(catWrap);
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

  const tipIcon = createMaterialIcon("lightbulb", "xs");
  tipIcon.classList.add("nice-tip-icon");

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
  // Statische Wissens-Karten bei erneutem Tab-Wechsel nicht neu aufbauen
  if (container.childElementCount === NICE_TO_KNOW.length) {
    return;
  }
  const cards = NICE_TO_KNOW.map((item, idx) => createNiceCard(item, idx));
  container.replaceChildren(...cards);
}
