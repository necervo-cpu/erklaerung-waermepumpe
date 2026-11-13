/**
 * Modul: Wiederverwendbare Vektor-UI-Icons (uiIcons.ts)
 * Zweck: Erzeugt präzise, barrierefreie SVG-Icons im Apple-SF-Symbols-Stil ohne HTML-Strings.
 * Verantwortlichkeit: Stellt das animierbare Accordion-Chevron für Bauteil- und Störungskarten bereit.
 * Sicherheitsrelevanz: Reine createElementNS-DOM-Erstellung ohne innerHTML (vollständige XSS-Sicherheit).
 */

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Erzeugt ein feines SVG-Chevron-Icon (14×14 px) mit abgerundeten Linienenden.
 */
export function createChevronSvg(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("acc-chevron-svg");

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M3.75 6.25L8 10.5l4.25-4.25");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.1");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path);
  return svg;
}
