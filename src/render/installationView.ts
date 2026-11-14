/**
 * Modul: Rendering des Aufstellungs- & Schallschutz-Dashboards (installationView.ts)
 * Zweck: Steuert die Umschaltung zwischen R290-Monoblock (Schutzzone A3) und R32-Split/VRF (A2L),
 *   schaltet die SVG-Schutzebenen in #installSvg um und baut die 4 Azubi-Checkkarten auf.
 * Verantwortlichkeit: XSS-sicheres DOM-Rendering ohne innerHTML.
 * Sicherheitsrelevanz: Visualisiert verbindliche R290-Schutzbereiche um Fenster, Lichtschächte und Abflüsse.
 */

import { INSTALL_RULES, INSTALL_SYSTEMS, type InstallRuleCard } from "../data/installation";
import type { AppState } from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

export interface InstallationDomElements {
  readonly btnR290: HTMLButtonElement;
  readonly btnR32: HTMLButtonElement;
  readonly bannerTitle: HTMLElement;
  readonly bannerDesc: HTMLElement;
  readonly bannerBadge: HTMLElement;
  readonly layerR290: SVGGElement;
  readonly layerR32: SVGGElement;
  readonly cardsGrid: HTMLElement;
}

function createInstallRuleCard(rule: InstallRuleCard): HTMLElement {
  const card = document.createElement("article");
  card.className = "nice-card liquid-glass-card";

  const head = document.createElement("div");
  head.className = "nice-card-head";
  const cat = document.createElement("span");
  cat.className = "nice-category";
  cat.appendChild(createMaterialIcon(rule.icon, "xs"));
  const label = document.createElement("span");
  label.textContent = rule.badge;
  cat.appendChild(label);
  head.appendChild(cat);

  const title = document.createElement("h3");
  title.className = "nice-title";
  title.textContent = rule.title;

  const summary = document.createElement("p");
  summary.className = "nice-summary";
  summary.textContent = rule.summary;

  const list = document.createElement("ul");
  list.className = "nice-facts";
  for (const bullet of rule.bullets) {
    const li = document.createElement("li");
    li.textContent = bullet;
    list.appendChild(li);
  }

  card.append(head, title, summary, list);
  return card;
}

/**
 * Rendert das komplette Aufstellungs- & Schallschutz-Dashboard.
 */
export function renderInstallationView(
  elements: InstallationDomElements,
  state: AppState
): void {
  const sysKey = state.installSystem;
  const cfg = INSTALL_SYSTEMS[sysKey];

  elements.btnR290.setAttribute("aria-selected", String(sysKey === "r290"));
  elements.btnR32.setAttribute("aria-selected", String(sysKey === "r32"));

  elements.bannerTitle.textContent = cfg.bannerTitle;
  elements.bannerDesc.textContent = cfg.bannerDesc;
  elements.bannerBadge.textContent = cfg.badgeText;
  elements.bannerBadge.dataset.color = cfg.badgeColor;

  elements.layerR290.classList.toggle("is-svg-hidden", sysKey !== "r290");
  elements.layerR32.classList.toggle("is-svg-hidden", sysKey !== "r32");

  if (elements.cardsGrid.childElementCount === 0) {
    elements.cardsGrid.replaceChildren(...INSTALL_RULES.map(createInstallRuleCard));
  }
}
