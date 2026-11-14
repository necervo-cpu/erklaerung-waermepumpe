/**
 * Modul: DOM-Rendering für den Azubi- & Service-Praxis-Rechner (calculatorView.ts)
 * Zweck: Synchronisiert Slider und Zahlen-Inputs für die 3 Echtzeit-Rechner
 *   (Volumenstrom, Überhitzung/Unterkühlung, Momentaner COP) und aktualisiert die Live-Ampeln.
 * Verantwortlichkeit: Reine DOM-Manipulation über textContent und dataset ohne innerHTML.
 * Sicherheitsrelevanz: Validiert und begrenzt alle Benutzereingaben vor der Berechnung.
 */

import {
  calculateCopMetrics,
  calculateSubcooling,
  calculateSuperheat,
  calculateVolumeFlow
} from "../data/calculator";

export interface CalculatorDomElements {
  // Rechner 1: Volumenstrom
  readonly flowQRange: HTMLInputElement;
  readonly flowQInput: HTMLInputElement;
  readonly flowDtRange: HTMLInputElement;
  readonly flowDtInput: HTMLInputElement;
  readonly flowResultLph: HTMLElement;
  readonly flowResultLpm: HTMLElement;
  readonly flowResultM3h: HTMLElement;
  readonly flowBadge: HTMLElement;
  readonly flowNote: HTMLElement;

  // Rechner 2: Überhitzung & Unterkühlung
  readonly shT0Range: HTMLInputElement;
  readonly shT0Input: HTMLInputElement;
  readonly shTsaugRange: HTMLInputElement;
  readonly shTsaugInput: HTMLInputElement;
  readonly shValue: HTMLElement;
  readonly shBadge: HTMLElement;
  readonly shNote: HTMLElement;

  readonly scTcRange: HTMLInputElement;
  readonly scTcInput: HTMLInputElement;
  readonly scTliqRange: HTMLInputElement;
  readonly scTliqInput: HTMLInputElement;
  readonly scValue: HTMLElement;
  readonly scBadge: HTMLElement;
  readonly scNote: HTMLElement;

  // Rechner 3: COP
  readonly copQRange: HTMLInputElement;
  readonly copQInput: HTMLInputElement;
  readonly copPRange: HTMLInputElement;
  readonly copPInput: HTMLInputElement;
  readonly copValue: HTMLElement;
  readonly copBadge: HTMLElement;
  readonly copAmbientText: HTMLElement;
  readonly copElectricText: HTMLElement;
  readonly copAmbientBar: HTMLElement;
  readonly copPlausibilityNote: HTMLElement;
}

function formatDe(val: number, decimals: number): string {
  return val.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function bindSliderAndNumber(
  range: HTMLInputElement,
  num: HTMLInputElement,
  min: number,
  max: number,
  onChange: () => void
): void {
  range.addEventListener("input", () => {
    num.value = range.value;
    onChange();
  });
  num.addEventListener("input", () => {
    const parsed = Number(num.value);
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(max, Math.max(min, parsed));
    range.value = String(clamped);
    onChange();
  });
}

/**
 * Aktualisiert alle 3 Praxis-Rechner anhand der aktuellen Input-Werte.
 */
export function renderCalculatorView(el: CalculatorDomElements): void {
  // 1. Heizwasser-Volumenstrom
  const q = Number(el.flowQRange.value);
  const dt = Number(el.flowDtRange.value);
  const flow = calculateVolumeFlow(q, dt);
  el.flowResultLph.textContent = `${formatDe(flow.lPerHour, 0)} l/h`;
  el.flowResultLpm.textContent = `${formatDe(flow.lPerMin, 1)} l/min`;
  el.flowResultM3h.textContent = `${formatDe(flow.m3PerHour, 2)} m³/h`;
  el.flowBadge.dataset.color = flow.statusColor;
  el.flowBadge.textContent = flow.statusLabel;
  el.flowNote.textContent = flow.statusDetail;

  // 2a. Überhitzung
  const t0 = Number(el.shT0Range.value);
  const tSaug = Number(el.shTsaugRange.value);
  const sh = calculateSuperheat(t0, tSaug);
  el.shValue.textContent = `${formatDe(sh.deltaK, 1)} K`;
  el.shBadge.dataset.color = sh.statusColor;
  el.shBadge.textContent = sh.statusLabel;
  el.shNote.textContent = sh.statusDetail;

  // 2b. Unterkühlung
  const tc = Number(el.scTcRange.value);
  const tLiq = Number(el.scTliqRange.value);
  const sc = calculateSubcooling(tc, tLiq);
  el.scValue.textContent = `${formatDe(sc.deltaK, 1)} K`;
  el.scBadge.dataset.color = sc.statusColor;
  el.scBadge.textContent = sc.statusLabel;
  el.scNote.textContent = sc.statusDetail;

  // 3. Momentaner COP
  const copQ = Number(el.copQRange.value);
  const copP = Number(el.copPRange.value);
  const copRes = calculateCopMetrics(copQ, copP);
  el.copValue.textContent = formatDe(copRes.cop, 2);
  el.copBadge.dataset.color = copRes.statusColor;
  el.copBadge.textContent = copRes.statusLabel;
  el.copAmbientText.textContent = `Umweltwärme: ${formatDe(copRes.ambientKw, 1)} kW (${formatDe(copRes.ambientPct, 1)} %)`;
  el.copElectricText.textContent = `Antriebsstrom: ${formatDe(copP, 1)} kW (${formatDe(copRes.electricPct, 1)} %)`;
  el.copAmbientBar.style.width = `${Math.round(copRes.ambientPct)}%`;
  el.copPlausibilityNote.textContent = copRes.plausibilityNote;
  el.copPlausibilityNote.classList.toggle("hidden", !copRes.plausibilityNote);
}

/**
 * Registriert Live-Event-Listener auf allen Slidern und Zahlen-Inputs des Praxis-Rechners.
 */
export function attachCalculatorListeners(el: CalculatorDomElements): void {
  const update = (): void => renderCalculatorView(el);

  bindSliderAndNumber(el.flowQRange, el.flowQInput, 3, 25, update);
  bindSliderAndNumber(el.flowDtRange, el.flowDtInput, 2, 10, update);

  bindSliderAndNumber(el.shT0Range, el.shT0Input, -25, 15, update);
  bindSliderAndNumber(el.shTsaugRange, el.shTsaugInput, -20, 25, update);

  bindSliderAndNumber(el.scTcRange, el.scTcInput, 25, 65, update);
  bindSliderAndNumber(el.scTliqRange, el.scTliqInput, 15, 60, update);

  bindSliderAndNumber(el.copQRange, el.copQInput, 1, 30, update);
  bindSliderAndNumber(el.copPRange, el.copPInput, 0.3, 15, update);

  renderCalculatorView(el);
}
