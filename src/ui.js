import { gameState, formatCurrency, valueMap } from "./state.js";
import { getQuestionData } from "./questions.js";

export const updateHelpButtons = () => {
  const last = gameState.currentQuestionIndex === getQuestionData().length - 1;
  Object.entries(gameState.aids).forEach(([k, aid]) => {
    const btn = aid.button;
    if (!btn) return;
    const label = btn.dataset.label;
    btn.textContent = `${label} (x${aid.limit - aid.used})`;

    const isDisabled = !gameState.isGameActive || last || aid.used >= aid.limit;
    btn.disabled = isDisabled;
  });
};

export const updateStatusDisplay = () => {
  document.getElementById("current-prize").textContent = formatCurrency(
    gameState.currentPrize
  );
  document.getElementById("guaranteed-prize").textContent = formatCurrency(
    gameState.guaranteedPrize
  );
  document.getElementById("stop-value").textContent = formatCurrency(
    gameState.guaranteedPrize
  );
};

export const updatePrizeSummary = () => {
  const i = gameState.currentQuestionIndex;
  const qData = getQuestionData();
  let acertarValue = 0;

  if (i >= 0 && i < qData.length) {
    acertarValue = qData[i].value;
  }

  const pararValue = gameState.guaranteedPrize;
  const errarValue = Math.floor(gameState.guaranteedPrize / 2);

  document.getElementById("prize-acertar").textContent =
    formatCurrency(acertarValue);
  document.getElementById("prize-parar").textContent =
    formatCurrency(pararValue);
  document.getElementById("prize-errar").textContent =
    formatCurrency(errarValue);
};

export const updatePrizeLadder = () => {
  const ladder = document.getElementById("prize-ladder");
  ladder.innerHTML = "";
  getQuestionData().forEach((q, i) => {
    const li = document.createElement("li");
    li.classList.add("prize-item");
    if (i === gameState.currentQuestionIndex) li.classList.add("current");
    const isGuaranteedLevel = [4, 9, 14].includes(i);
    if (isGuaranteedLevel) li.classList.add("guaranteed");

    li.innerHTML = `<span>Q${i + 1}:</span><span>${formatCurrency(
      q.value
    )}</span>`;
    ladder.appendChild(li);
  });
};

export const showModal = (title, msg) => {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-message").innerHTML = msg;
  document.getElementById("game-over-modal").classList.remove("hidden");
};

export const updateQuestionArea = (questionText, questionNumber) => {
  document.getElementById("question-text").textContent = questionText;
  document.getElementById("question-number").textContent = questionNumber;
};

export const resetUI = () => {
  document.getElementById("btn-start").classList.remove("hidden");
  document.getElementById("btn-stop").classList.add("hidden");
  document.getElementById("btn-continue").classList.add("hidden");
  document.getElementById("game-over-modal").classList.add("hidden");

  document.getElementById("cards-modal").classList.add("hidden");
  document.getElementById("help-info-modal").classList.add("hidden");
  document.getElementById("help-blocked-text").textContent = "";

  document.getElementById("question-text").textContent =
    "Pressione 'INICIAR JOGO' para começar!";
  document.getElementById("question-number").textContent = "Pergunta 1/16";
  document.getElementById("alternatives").innerHTML = "";
  document.getElementById("stop-value").textContent = formatCurrency(0);

  updateStatusDisplay();
  updateHelpButtons();
  updatePrizeLadder();
  updatePrizeSummary();
  document.getElementById("timer").textContent = "45";
};

export const enableAlternativeButtons = (enabled) => {
  document.querySelectorAll(".alternative").forEach((b) => {
    if (!b.classList.contains("eliminated")) {
      b.disabled = !enabled;
    }
  });
};
