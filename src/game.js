import { gameState, formatCurrency, resetGameState } from "./state.js";
import { getQuestionData, getQuestionCount } from "./questions.js";
import {
  updateHelpButtons,
  updateStatusDisplay,
  updatePrizeSummary,
  updatePrizeLadder,
  showModal,
  updateQuestionArea,
  enableAlternativeButtons,
} from "./ui.js";
import { activateHelp } from "./aids.js";

export function initGameAids() {
  ["pulo", "cartas", "placas", "universitarios"].forEach((k) => {
    gameState.aids[k].button = document.querySelector(`[data-help="${k}"]`);
    gameState.aids[k].button.dataset.label = gameState.aids[
      k
    ].button.textContent
      .split("(")[0]
      .trim();
    gameState.aids[k].button.onclick = () => activateHelp(k);
  });
}

export const startTimer = () => {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timer = 45;
  const timerDisplay = document.getElementById("timer");
  timerDisplay.textContent = gameState.timer;

  if (gameState.currentQuestionIndex === getQuestionCount() - 1) {
    timerDisplay.textContent = "∞";
    return;
  }

  gameState.timerInterval = setInterval(() => {
    gameState.timer--;
    timerDisplay.textContent = gameState.timer;
    if (gameState.timer <= 0) {
      clearInterval(gameState.timerInterval);
      handleWrongAnswer(true);
    }
  }, 1000);
};

export const pauseTimer = () => {
  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
};
export const resumeTimer = () => {
  startTimer();
};

export const loadNextQuestion = () => {
  gameState.currentQuestionIndex++;
  const i = gameState.currentQuestionIndex;
  const qData = getQuestionData();

  if (i >= qData.length) return endGame(true);

  const q = qData[i];
  gameState.currentPrize = q.value;
  gameState.guaranteedPrize = q.guaranteed_value;

  document.getElementById("btn-start").classList.add("hidden");
  document.getElementById("btn-continue").classList.add("hidden");
  document.getElementById("btn-stop").classList.remove("hidden");
  document.getElementById("btn-stop").disabled = false;

  document
    .querySelectorAll(".alternative")
    .forEach((b) => b.classList.remove("eliminated"));

  loadQuestionUI(q, i);

  updateStatusDisplay();
  updatePrizeLadder();
  updatePrizeSummary();
  startTimer();
};

export const loadNextQuestionSameLevel = () => {
  const q = getQuestionData()[gameState.currentQuestionIndex];
  loadQuestionUI(q, gameState.currentQuestionIndex);
  resumeTimer();
};

function loadQuestionUI(q, i) {
  const altContainer = document.getElementById("alternatives");
  altContainer.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "alternative";
    btn.textContent = `${idx + 1}. ${opt}`;
    btn.onclick = handleAnswer;
    altContainer.appendChild(btn);
  });

  enableAlternativeButtons(true);
  updateHelpButtons();
  document.getElementById("help-blocked-text").textContent = "";

  updateQuestionArea(q.question, `Pergunta ${i + 1}/${getQuestionCount()}`);
}

export const handleAnswer = (e) => {
  console.log("handleAnswer chamada. isGameActive:", gameState.isGameActive);

  if (!gameState.isGameActive) return;
  if (e.target.classList.contains("eliminated")) return;

  pauseTimer();
  document.getElementById("btn-stop").disabled = true;
  document.querySelectorAll(".help-btn").forEach((b) => (b.disabled = true));
  document.getElementById("help-blocked-text").textContent = "";

  const btn = e.target;
  const answer = btn.textContent.substring(3).trim();
  const q = getQuestionData()[gameState.currentQuestionIndex];
  const isCorrect = answer === q.answer;

  document.querySelectorAll(".alternative").forEach((b) => (b.disabled = true));

  if (isCorrect) {
    btn.classList.add("correct");
    if (gameState.currentQuestionIndex === getQuestionCount() - 1) {
      gameState.currentPrize = 1000000;
      updateStatusDisplay();
      showModal("🎉 Parabéns!", `Você ganhou ${formatCurrency(1000000)}!`);
      return endGame(true);
    }
    setTimeout(() => showNextStepDecision("Certa resposta!"), 1500);
  } else {
    btn.classList.add("wrong");
    const correctBtn = Array.from(
      document.querySelectorAll(".alternative")
    ).find((b) => b.textContent.substring(3).trim() === q.answer);
    if (correctBtn) {
      correctBtn.classList.add("correct");
    }
    setTimeout(() => handleWrongAnswer(), 3000);
  }
};

const showNextStepDecision = (msg) => {
  document.getElementById("btn-stop").classList.add("hidden");
  document.getElementById("btn-continue").classList.remove("hidden");

  const nextPrize = getQuestionData()[gameState.currentQuestionIndex + 1].value;
  document.getElementById(
    "question-text"
  ).textContent = `${msg} Próxima pergunta vale ${formatCurrency(nextPrize)}!`;
  document.getElementById("alternatives").innerHTML = "";

  updatePrizeSummary();
};

export const handleWrongAnswer = (timeout = false) => {
  let finalPrize = Math.floor(gameState.guaranteedPrize / 2);

  const msg = timeout ? "Tempo esgotado!" : "Resposta incorreta!";

  gameState.currentPrize = finalPrize;
  updateStatusDisplay();

  showModal(msg, `Você sai com ${formatCurrency(finalPrize)}.`);

  endGame(false);
};

export const handleStop = () => {
  if (!gameState.isGameActive) return;
  pauseTimer();
  gameState.isGameActive = false;
  const prize = gameState.guaranteedPrize;
  showModal(
    "Jogo Parado!",
    `Você parou e sai com o prêmio garantido de ${formatCurrency(prize)}.`
  );
  endGame(false);
};

export const endGame = (win = false) => {
  gameState.isGameActive = false;
  pauseTimer();
  document.querySelectorAll(".alternative").forEach((b) => (b.disabled = true));
  document.getElementById("btn-stop").classList.add("hidden");
  document.getElementById("btn-continue").classList.add("hidden");
  document.getElementById("btn-start").classList.add("hidden");
  updateHelpButtons();
  updatePrizeSummary();
};

export { loadQuestionUI, showNextStepDecision };
