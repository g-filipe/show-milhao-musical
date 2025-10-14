import { gameState, formatCurrency } from "./state.js";
import { getQuestionData } from "./questions.js";
import {
  updateHelpButtons,
  showModal,
  enableAlternativeButtons,
} from "./ui.js";

let gameCallbacks = {};
export const setGameCallbacks = (callbacks) => {
  gameCallbacks = callbacks;
};

export const activateHelp = (type) => {
  const aid = gameState.aids[type];
  if (aid.used >= aid.limit || !gameState.isGameActive) return;
  aid.used++;

  gameCallbacks.pauseTimer();

  const q = getQuestionData()[gameState.currentQuestionIndex];

  enableAlternativeButtons(false);
  document.querySelectorAll(".help-btn").forEach((b) => (b.disabled = true));
  document.getElementById("help-blocked-text").textContent = "(Aguarde...)";
  updateHelpButtons();

  if (type === "pulo") {
    const newQ =
      q.allQuestions[Math.floor(Math.random() * q.allQuestions.length)];
    getQuestionData()[gameState.currentQuestionIndex].question = newQ.question;
    getQuestionData()[gameState.currentQuestionIndex].options = newQ.options;
    getQuestionData()[gameState.currentQuestionIndex].answer = newQ.answer;

    setTimeout(() => {
      gameCallbacks.loadNextQuestionSameLevel();
      enableAlternativeButtons(true);
      updateHelpButtons();
      document.getElementById("help-blocked-text").textContent = "";
    }, 1000);
    return;
  }

  if (type === "cartas") {
    showCardsHelp(q.answer);
    return;
  }

  const title = type === "placas" ? "Ajuda: Placas" : "Ajuda: Universitários";
  const message =
    type === "placas"
      ? "As Placas revelam a porcentagem de votos para cada alternativa. (Aperte OK para continuar)"
      : "Os Universitários analisam a pergunta e dão sua opinião. (Aperte OK para continuar)";
  showHelpInfoModal(title, message, type);
};

function removeWrongAlternatives(allAlternativeButtons, correctAnswer, count) {
  let incorrectButtons = allAlternativeButtons.filter((b) => {
    const alternativeText = b.textContent.substring(3).trim();
    return (
      alternativeText !== correctAnswer && !b.classList.contains("eliminated")
    );
  });

  incorrectButtons.sort(() => Math.random() - 0.5);

  const toRemove = incorrectButtons.slice(0, count);

  toRemove.forEach((btn) => {
    btn.classList.add("eliminated");
    btn.style.opacity = "0.3";
    btn.style.borderStyle = "dashed";
    btn.style.pointerEvents = "none";
  });
}

function showCardsHelp(correctAnswer) {
  const modal = document.getElementById("cards-modal");
  modal.classList.remove("hidden");

  const container = document.getElementById("cards-container-modal");
  container.innerHTML = "";

  const eliminations = [0, 1, 2, 3];
  const shuffledEliminations = eliminations.sort(() => Math.random() - 0.5);

  const alternatives = Array.from(
    document.querySelectorAll("#alternatives .alternative")
  );

  let cardClicked = false;

  shuffledEliminations.forEach((val) => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "?";
    card.dataset.value = val;

    card.onclick = (e) => {
      if (cardClicked) return;
      cardClicked = true;

      document.querySelectorAll("#cards-container-modal .card").forEach((c) => {
        c.style.pointerEvents = "none";
        if (!c.classList.contains("flipped")) {
          const v = c.dataset.value;
          c.textContent =
            v === "1" ? `Remove 1` : v > "1" ? `Remove ${v}` : `Nada`;
        }
      });

      card.classList.add("flipped");
      card.textContent =
        val === 1 ? `Remove 1` : val > 1 ? `Remove ${val}` : `Nada`;

      if (val > 0) {
        removeWrongAlternatives(alternatives, correctAnswer, val);
      }

      setTimeout(() => {
        modal.classList.add("hidden");
        enableAlternativeButtons(true);
        updateHelpButtons();
        document.getElementById("help-blocked-text").textContent = "";
        gameCallbacks.resumeTimer();
      }, 3000);
    };
    container.appendChild(card);
  });
}

function showHelpInfoModal(title, message, type) {
  const modal = document.getElementById("help-info-modal");
  document.getElementById("help-info-modal-title").textContent = title;
  document.getElementById("help-info-modal-message").textContent = message;

  const contentDiv = document.getElementById("help-info-content");
  const icon = type === "placas" ? "📊" : "🎓";
  const specificContent = `<p style="font-size: 3rem; margin-top: 10px; margin-bottom: 0;">${icon}</p>`;
  contentDiv.innerHTML = specificContent;

  modal.classList.remove("hidden");

  const closeBtn = document.getElementById("btn-close-help-info");
  closeBtn.onclick = () => {
    modal.classList.add("hidden");
    enableAlternativeButtons(true);
    updateHelpButtons();
    document.getElementById("help-blocked-text").textContent = "";
    gameCallbacks.resumeTimer();
  };
}
