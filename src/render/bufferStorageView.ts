/**
 * Modul: Rendering des Pufferspeicher-Dashboards (bufferStorageView.ts)
 * Zweck: Steuert das interaktive Pufferspeicher-Schema (#bufferSvg) sowie das Analyse- & Praxis-Panel
 *   für Reihenpuffer, Stichanbindung, Parallelpuffer und Kombispeicher.
 * Verantwortlichkeit: Baut alle Info-Karten XSS-sicher über DOM-APIs auf und schaltet die SVG-Leitungsebenen um.
 * Sicherheitsrelevanz: Ausschließliche Verwendung von textContent und sicheren SVG-Klassenwechseln.
 */

import { BUFFER_PRACTICE_RULES, BUFFER_VARIANTS } from "../data/bufferStorage";
import type { AppState, BufferPracticeRule, BufferVariant, BufferVariantData } from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

export interface BufferStorageDomElements {
  readonly btnSeriesReturn: HTMLButtonElement;
  readonly btnTeeBranch: HTMLButtonElement;
  readonly btnParallel4Pipe: HTMLButtonElement;
  readonly btnCombiTank: HTMLButtonElement;
  readonly btnCoparTank: HTMLButtonElement;
  readonly detailContainer: HTMLElement;
  readonly practiceGrid: HTMLElement;
}

function createBulletListCard(title: string, items: readonly string[], iconName: string): HTMLElement {
  const card = document.createElement("div");
  card.className = "detail-block";

  const head = document.createElement("h3");
  head.className = "detail-block-title";
  head.appendChild(createMaterialIcon(iconName, "xs"));
  const label = document.createElement("span");
  label.textContent = title;
  head.appendChild(label);

  const list = document.createElement("ul");
  list.className = "nice-facts-ul";
  for (const item of items) {
    const li = document.createElement("li");
    li.className = "nice-fact-item";
    li.textContent = item;
    list.appendChild(li);
  }

  card.append(head, list);
  return card;
}

function createDetailPanel(variant: BufferVariantData): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "buffer-detail-stack";

  // Kopfzeile mit Titel und Effizienz-Badge
  const header = document.createElement("div");
  header.className = "detail-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "detail-title-wrap";
  const kicker = document.createElement("p");
  kicker.className = "detail-kicker";
  kicker.textContent = "Schaltungsanalyse · Luft/Wasser-WP";
  const title = document.createElement("h2");
  title.className = "detail-title";
  title.textContent = variant.title;
  titleWrap.append(kicker, title);

  const badge = document.createElement("span");
  badge.className = "badge-tag";
  badge.dataset.color = variant.color;
  badge.textContent = variant.efficiencyBadge;

  header.append(titleWrap, badge);

  // Wirkprinzip
  const principleBox = document.createElement("div");
  principleBox.className = "detail-block";
  const principleTitle = document.createElement("h3");
  principleTitle.className = "detail-block-title";
  principleTitle.textContent = "Hydraulisches Prinzip";
  const principleText = document.createElement("p");
  principleText.className = "section-text";
  principleText.textContent = variant.principle;
  principleBox.append(principleTitle, principleText);

  // Richtwerte: Dimensionierung & Fühler
  const specsBox = document.createElement("div");
  specsBox.className = "detail-block";
  const specsTitle = document.createElement("h3");
  specsTitle.className = "detail-block-title";
  specsTitle.textContent = "Auslegung & Fühlerposition";
  const sizingLine = document.createElement("p");
  sizingLine.className = "section-text";
  sizingLine.textContent = `Speichervolumen: ${variant.sizingFormula}`;
  const sensorLine = document.createElement("p");
  sensorLine.className = "section-text";
  sensorLine.style.marginTop = "6px";
  sensorLine.textContent = `Fühler: ${variant.sensorPlacement}`;
  specsBox.append(specsTitle, sizingLine, sensorLine);

  // Einsatzgebiet, Vorteile, Nachteile
  const useCasesCard = createBulletListCard("Wann einsetzen?", variant.useCases, "home_work");
  const prosCard = createBulletListCard("Vorteile", variant.pros, "check_circle");
  const consCard = createBulletListCard("Nachteile & Grenzen", variant.cons, "warning");

  // Azubi-Merksatz & Typischer Fehler
  const mistakeBox = document.createElement("div");
  mistakeBox.className = "tip-box is-warn";
  const mistakeTitle = document.createElement("strong");
  mistakeTitle.textContent = "Typischer Azubi-Montagefehler: ";
  const mistakeText = document.createElement("span");
  mistakeText.textContent = variant.azubiMistake;
  mistakeBox.append(mistakeTitle, mistakeText);

  const ruleBox = document.createElement("div");
  ruleBox.className = "tip-box";
  const ruleTitle = document.createElement("strong");
  ruleTitle.textContent = "Azubi-Merksatz: ";
  const ruleText = document.createElement("span");
  ruleText.textContent = variant.azubiMerksatz;
  ruleBox.append(ruleTitle, ruleText);

  wrapper.append(
    header,
    principleBox,
    specsBox,
    useCasesCard,
    prosCard,
    consCard,
    mistakeBox,
    ruleBox
  );
  return wrapper;
}

function createPracticeCard(rule: BufferPracticeRule): HTMLElement {
  const card = document.createElement("article");
  card.className = "nice-card liquid-glass-card";

  const head = document.createElement("div");
  head.className = "nice-card-top";

  const category = document.createElement("span");
  category.className = "nice-category";
  category.appendChild(createMaterialIcon(rule.icon, "xs"));
  const catText = document.createElement("span");
  catText.textContent = rule.badge;
  category.appendChild(catText);

  head.appendChild(category);

  const title = document.createElement("h3");
  title.className = "nice-title";
  title.textContent = rule.title;

  const summary = document.createElement("p");
  summary.className = "nice-summary";
  summary.textContent = rule.summary;

  const list = document.createElement("ul");
  list.className = "nice-facts-ul";
  for (const bullet of rule.bullets) {
    const li = document.createElement("li");
    li.className = "nice-fact-item";
    li.textContent = bullet;
    list.appendChild(li);
  }

  card.append(head, title, summary, list);
  return card;
}

/**
 * Rendert das komplette Pufferspeicher-Dashboard inkl. SVG-Schaltungslayer und Azubi-Praxiskarten.
 */
export function renderBufferStorageView(
  elements: BufferStorageDomElements,
  state: AppState
): void {
  const variantKey: BufferVariant = state.bufferVariant;
  const data = BUFFER_VARIANTS[variantKey];

  elements.btnSeriesReturn.setAttribute("aria-selected", String(variantKey === "seriesReturn"));
  elements.btnTeeBranch.setAttribute("aria-selected", String(variantKey === "teeBranch"));
  elements.btnParallel4Pipe.setAttribute("aria-selected", String(variantKey === "parallel4Pipe"));
  elements.btnCombiTank.setAttribute("aria-selected", String(variantKey === "combiTank"));
  elements.btnCoparTank.setAttribute("aria-selected", String(variantKey === "coparTank"));

  elements.detailContainer.replaceChildren(createDetailPanel(data));

  if (elements.practiceGrid.childElementCount === 0) {
    const cards = BUFFER_PRACTICE_RULES.map(createPracticeCard);
    elements.practiceGrid.replaceChildren(...cards);
  }
}
