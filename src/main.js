import { loadQuestions } from "./questions.js";
import { gameState, resetGameState } from "./state.js";
import {
  loadNextQuestion,
  handleStop,
  initGameAids,
  pauseTimer,
  resumeTimer,
  loadNextQuestionSameLevel,
  handleAnswer,
} from "./game.js";
import { resetUI } from "./ui.js";
import { setGameCallbacks } from "./aids.js";

const initializeGame = async () => {
  await loadQuestions();

  resetGameState(true);
  resetUI();

  setGameCallbacks({
    pauseTimer,
    resumeTimer,
    loadNextQuestionSameLevel,
  });

  initGameAids();

  document.getElementById("btn-start").onclick = () => {
    gameState.isGameActive = true;
    loadNextQuestion();
  };
  document.getElementById("btn-stop").onclick = handleStop;
  document.getElementById("btn-continue").onclick = loadNextQuestion;
  document.getElementById("btn-restart").onclick = () => initializeGame();
};

document.addEventListener("DOMContentLoaded", initializeGame);
