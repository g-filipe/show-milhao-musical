export const valueMap = {
  "1k": 1000,
  "2k": 2000,
  "3k": 3000,
  "4k": 4000,
  "5k": 5000,
  "10k": 10000,
  "20k": 20000,
  "30k": 30000,
  "40k": 40000,
  "50k": 50000,
  "100k": 100000,
  "200k": 200000,
  "300k": 300000,
  "400k": 400000,
  "500k": 500000,
  "1kk": 1000000,
};

export let gameState = {
  currentQuestionIndex: -1,
  currentPrize: 0,
  guaranteedPrize: 0,
  isGameActive: false,
  timer: 45,
  timerInterval: null,
  aids: {
    pulo: { limit: 3, used: 0, button: null },
    cartas: { limit: 1, used: 0, button: null },
    placas: { limit: 1, used: 0, button: null },
    universitarios: { limit: 1, used: 0, button: null },
  },
};

export const formatCurrency = (v) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(v);

export const resetGameState = (questionsLoaded = false) => {
  gameState.currentQuestionIndex = -1;
  gameState.currentPrize = 0;
  gameState.guaranteedPrize = 0;
  gameState.isGameActive = false;
  if (questionsLoaded) {
    Object.values(gameState.aids).forEach((a) => (a.used = 0));
  }

  if (gameState.timerInterval) clearInterval(gameState.timerInterval);
  gameState.timerInterval = null;
  gameState.timer = 45;
};
