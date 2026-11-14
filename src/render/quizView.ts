/**
 * Modul: Rendering des Azubi-Prüfungstrainings (quizView.ts)
 * Zweck: Steuert Themenfilter, Fortschrittszähler, Multiple-Choice-Fragenkarte,
 *   Sofort-Auswertung mit Begründung und Prüfungs-Feedback.
 * Verantwortlichkeit: Baut alle Quiz-Elemente XSS-sicher über DOM-APIs auf.
 * Sicherheitsrelevanz: Ausschließliche Verwendung von textContent ohne innerHTML.
 */

import { QUIZ_QUESTIONS } from "../data/quizQuestions";
import type { AppState, QuizQuestion, QuizTopic } from "../types/circuit";
import { createMaterialIcon } from "./uiIcons";

export interface QuizDomElements {
  readonly btnTopicAll: HTMLButtonElement;
  readonly btnTopicHeatpump: HTMLButtonElement;
  readonly btnTopicHvac: HTMLButtonElement;
  readonly btnReset: HTMLButtonElement;
  readonly progressText: HTMLElement;
  readonly scoreText: HTMLElement;
  readonly progressBarFill: HTMLElement;
  readonly questionHost: HTMLElement;
}

export interface QuizCallbacks {
  readonly onAnswer: (questionId: string, optionIndex: number) => void;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onReset: () => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export function getFilteredQuizQuestions(topic: QuizTopic): readonly QuizQuestion[] {
  if (topic === "all") return QUIZ_QUESTIONS;
  return QUIZ_QUESTIONS.filter((q) => q.topic === topic);
}

function createOptionButton(
  label: string,
  index: number,
  selectedIndex: number | undefined,
  correctIndex: number,
  onSelect: () => void
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "quiz-option-btn press-btn";

  const isAnswered = selectedIndex !== undefined;
  const isCorrect = index === correctIndex;
  const isSelected = index === selectedIndex;

  if (isAnswered) {
    btn.disabled = true;
    if (isCorrect) {
      btn.classList.add("is-correct");
    } else if (isSelected) {
      btn.classList.add("is-wrong");
    } else {
      btn.classList.add("is-dimmed");
    }
  }

  const letterBadge = document.createElement("span");
  letterBadge.className = "quiz-option-letter";
  letterBadge.textContent = OPTION_LETTERS[index] ?? String(index + 1);

  const textSpan = document.createElement("span");
  textSpan.className = "quiz-option-text";
  textSpan.textContent = label;

  btn.append(letterBadge, textSpan);

  if (isAnswered && (isCorrect || isSelected)) {
    const statusIcon = createMaterialIcon(isCorrect ? "check_circle" : "cancel", "sm");
    statusIcon.classList.add("quiz-option-icon");
    btn.appendChild(statusIcon);
  }

  if (!isAnswered) {
    btn.addEventListener("click", onSelect);
  }

  return btn;
}

function createExplanationBox(
  question: QuizQuestion,
  selectedIndex: number
): HTMLElement {
  const isRight = selectedIndex === question.correctIndex;
  const box = document.createElement("div");
  box.className = `quiz-feedback-box ${isRight ? "is-correct" : "is-wrong"}`;

  const statusLine = document.createElement("div");
  statusLine.className = "quiz-feedback-head";
  statusLine.appendChild(createMaterialIcon(isRight ? "task_alt" : "info", "sm"));
  const statusText = document.createElement("strong");
  statusText.textContent = isRight
    ? "Richtig beantwortet!"
    : `Nicht ganz – richtig ist Antwort ${OPTION_LETTERS[question.correctIndex]}.`;
  statusLine.appendChild(statusText);

  const explanation = document.createElement("p");
  explanation.className = "section-text";
  explanation.textContent = question.explanation;

  const tip = document.createElement("div");
  tip.className = "tip-box";
  const tipTitle = document.createElement("strong");
  tipTitle.textContent = "Prüfungstipp: ";
  const tipText = document.createElement("span");
  tipText.textContent = question.examTip;
  tip.append(tipTitle, tipText);

  box.append(statusLine, explanation, tip);
  return box;
}

/**
 * Rendert das komplette Prüfungstraining inkl. Themenfilter, Punktestand und Fragenkarte.
 */
export function renderQuizView(
  elements: QuizDomElements,
  state: AppState,
  callbacks: QuizCallbacks
): void {
  const questions = getFilteredQuizQuestions(state.quizTopic);
  const total = questions.length;
  const safeIndex = Math.max(0, Math.min(state.quizIndex, Math.max(0, total - 1)));
  const current = questions[safeIndex];

  elements.btnTopicAll.setAttribute("aria-selected", String(state.quizTopic === "all"));
  elements.btnTopicHeatpump.setAttribute("aria-selected", String(state.quizTopic === "heatpump"));
  elements.btnTopicHvac.setAttribute("aria-selected", String(state.quizTopic === "hvac"));

  let answeredCount = 0;
  let correctCount = 0;
  for (const q of questions) {
    const ans = state.quizAnswers[q.id];
    if (ans !== undefined) {
      answeredCount += 1;
      if (ans === q.correctIndex) correctCount += 1;
    }
  }

  const pct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPct = total > 0 ? Math.round(((safeIndex + 1) / total) * 100) : 0;
  elements.progressText.textContent = `Frage ${safeIndex + 1} von ${total}`;
  elements.scoreText.textContent = `Richtig: ${correctCount} / ${answeredCount} (${pct} %)`;
  elements.progressBarFill.style.width = `${progressPct}%`;
  elements.progressBarFill.setAttribute("aria-valuenow", String(progressPct));

  if (!current) {
    elements.questionHost.replaceChildren();
    return;
  }

  const card = document.createElement("article");
  card.className = "quiz-card liquid-glass-card";

  // Meta-Kopfzeile
  const metaRow = document.createElement("div");
  metaRow.className = "quiz-meta-row";

  const topicBadge = document.createElement("span");
  topicBadge.className = "badge-tag";
  topicBadge.dataset.color = current.topic === "heatpump" ? "mint" : "lavender";
  topicBadge.textContent = current.badge;

  const levelBadge = document.createElement("span");
  levelBadge.className = "ref-pill";
  levelBadge.textContent = current.examLevel;

  metaRow.append(topicBadge, levelBadge);

  const qTitle = document.createElement("h2");
  qTitle.className = "quiz-question-title";
  qTitle.textContent = current.question;

  const selectedIndex = state.quizAnswers[current.id];
  const optionsList = document.createElement("div");
  optionsList.className = "quiz-options-list";
  current.options.forEach((optText, idx) => {
    optionsList.appendChild(
      createOptionButton(optText, idx, selectedIndex, current.correctIndex, () => {
        callbacks.onAnswer(current.id, idx);
      })
    );
  });

  card.append(metaRow, qTitle, optionsList);

  if (selectedIndex !== undefined) {
    card.appendChild(createExplanationBox(current, selectedIndex));
  }

  // Navigationsleiste unten
  const navRow = document.createElement("div");
  navRow.className = "quiz-nav-row";

  const btnPrev = document.createElement("button");
  btnPrev.type = "button";
  btnPrev.className = "quiz-nav-btn press-btn";
  btnPrev.disabled = safeIndex === 0;
  btnPrev.appendChild(createMaterialIcon("arrow_back", "xs"));
  const prevSpan = document.createElement("span");
  prevSpan.textContent = "Vorherige";
  btnPrev.appendChild(prevSpan);
  btnPrev.addEventListener("click", callbacks.onPrev);

  const btnNext = document.createElement("button");
  btnNext.type = "button";
  btnNext.className = "quiz-nav-btn is-primary press-btn";
  const isLast = safeIndex === total - 1;
  const nextSpan = document.createElement("span");
  nextSpan.textContent = isLast ? "Neu starten" : "Nächste Frage";
  btnNext.appendChild(nextSpan);
  btnNext.appendChild(createMaterialIcon(isLast ? "refresh" : "arrow_forward", "xs"));
  btnNext.addEventListener("click", isLast ? callbacks.onReset : callbacks.onNext);

  navRow.append(btnPrev, btnNext);
  card.appendChild(navRow);

  // Zusammenfassung der falsch beantworteten Fragen am Ende (sobald alle beantwortet sind oder auf der letzten Frage nach Antwort)
  const isCompleted = answeredCount === total || (isLast && selectedIndex !== undefined);
  if (isCompleted && answeredCount > 0) {
    const wrongQuestions = questions.filter((q) => {
      const ans = state.quizAnswers[q.id];
      return ans !== undefined && ans !== q.correctIndex;
    });

    const summaryCard = document.createElement("article");
    summaryCard.className = "quiz-summary-card liquid-glass-card";

    const sumHead = document.createElement("div");
    sumHead.className = "quiz-feedback-head";
    sumHead.appendChild(
      createMaterialIcon(wrongQuestions.length === 0 ? "emoji_events" : "assignment_late", "sm")
    );
    const sumTitle = document.createElement("h3");
    sumTitle.className = "detail-title";
    sumTitle.textContent =
      wrongQuestions.length === 0
        ? `Top-Ergebnis: ${correctCount} von ${answeredCount} Fragen richtig!`
        : `Auswertung: ${wrongQuestions.length} falsch beantwortete ${wrongQuestions.length === 1 ? "Frage" : "Fragen"}`;
    sumHead.appendChild(sumTitle);
    summaryCard.appendChild(sumHead);

    if (wrongQuestions.length === 0) {
      const okText = document.createElement("p");
      okText.className = "section-text";
      okText.textContent =
        "Alle beantworteten Prüfungsfragen in diesem Themenbereich sitzen. Du bist bestens auf die Gesellenprüfung vorbereitet!";
      summaryCard.appendChild(okText);
    } else {
      const list = document.createElement("div");
      list.className = "quiz-wrong-list";

      for (const wq of wrongQuestions) {
        const wrongIdx = state.quizAnswers[wq.id];
        const item = document.createElement("div");
        item.className = "quiz-wrong-item";

        const qHead = document.createElement("p");
        qHead.className = "quiz-wrong-question";
        qHead.textContent = wq.question;

        const ansMeta = document.createElement("p");
        ansMeta.className = "quiz-wrong-answers";
        const yourAns =
          wrongIdx !== undefined ? wq.options[wrongIdx] ?? "–" : "–";
        const rightAns = wq.options[wq.correctIndex];
        ansMeta.textContent = `Deine Antwort: ${yourAns} · Richtig: ${rightAns}`;

        const exp = document.createElement("p");
        exp.className = "section-text";
        exp.textContent = wq.explanation;

        item.append(qHead, ansMeta, exp);
        list.appendChild(item);
      }

      summaryCard.appendChild(list);
    }

    elements.questionHost.replaceChildren(card, summaryCard);
    return;
  }

  elements.questionHost.replaceChildren(card);
}
