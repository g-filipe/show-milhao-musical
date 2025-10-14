import { valueMap } from "./state.js";

let QUESTION_DATA = [];

const questionFiles = [
  "data/questions_1k.json",
  "data/questions_2k.json",
  "data/questions_3k.json",
  "data/questions_4k.json",
  "data/questions_5k.json",
  "data/questions_10k.json",
  "data/questions_20k.json",
  "data/questions_30k.json",
  "data/questions_40k.json",
  "data/questions_50k.json",
  "data/questions_100k.json",
  "data/questions_200k.json",
  "data/questions_300k.json",
  "data/questions_400k.json",
  "data/questions_500k.json",
  "data/questions_1kk.json",
];

export const getQuestionData = () => QUESTION_DATA;
export const getQuestionCount = () => QUESTION_DATA.length;

export async function loadQuestions() {
  try {
    const responses = await Promise.all(questionFiles.map((f) => fetch(f)));
    const allJson = await Promise.all(responses.map((r) => r.json()));

    QUESTION_DATA = allJson.map((fileData, index) => {
      const key = Object.keys(valueMap)[index];
      const val = valueMap[key];
      const guaranteed =
        index === 0 ? 0 : valueMap[Object.keys(valueMap)[index - 1]];
      const qArray = fileData.questions;
      const q = qArray[Math.floor(Math.random() * qArray.length)];

      return {
        value: val,
        guaranteed_value: guaranteed,
        allQuestions: qArray,
        question: q.question,
        options: q.options,
        answer: q.answer,
      };
    });
  } catch (error) {
    console.error("Erro ao carregar arquivos de perguntas:", error);
    QUESTION_DATA = [
      {
        value: 1000,
        guaranteed_value: 0,
        allQuestions: [],
        question: "Erro ao carregar. Recarregue a página.",
        options: ["A. Opção A", "B. Opção B"],
        answer: "A. Opção A",
      },
    ];
  }
}
