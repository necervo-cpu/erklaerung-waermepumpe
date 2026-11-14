/**
 * Modul: Wiederverwendbare Google-Material-Symbols-Icons (uiIcons.ts)
 * Zweck: Erzeugt monochrome, barrierefreie Google Material Symbols Rounded Icons ohne HTML-Strings.
 * Verantwortlichkeit: Stellt das animierbare Accordion-Chevron sowie einheitliche Material-Ligaturen gemäß ICONS.md bereit.
 * Sicherheitsrelevanz: Reine createElement-DOM-Erstellung ohne innerHTML (vollständige XSS-Sicherheit).
 */

export type AgIconSize = "xs" | "sm" | "md" | "lg";

/**
 * Erzeugt ein monochromes Google Material Symbols Rounded Icon als Text-Ligatur.
 */
export function createMaterialIcon(
  name: string,
  size: AgIconSize = "md",
  active = false
): HTMLSpanElement {
  const span = document.createElement("span");
  const sizeClass = size === "md" ? "" : ` ag-icon--${size}`;
  const activeClass = active ? " ag-icon--active" : "";
  span.className = `ag-icon${sizeClass}${activeClass}`;
  span.setAttribute("aria-hidden", "true");
  span.textContent = name;
  return span;
}

/**
 * Erzeugt das Accordion-Chevron über Google Material Symbols Rounded (`expand_more`).
 */
export function createChevronIcon(): HTMLSpanElement {
  return createMaterialIcon("expand_more", "sm");
}
