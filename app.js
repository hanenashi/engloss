const phrases = [
  { english: "I need water.", czech: "Potrebuju vodu.", pattern: "I need..." },
  { english: "I need food.", czech: "Potrebuju jidlo.", pattern: "I need..." },
  { english: "Can I sit here?", czech: "Muzu si tady sednout?", pattern: "Can I...?" },
  { english: "Can I charge my phone?", czech: "Muzu si nabit telefon?", pattern: "Can I...?" },
  { english: "Do you have water?", czech: "Mate vodu?", pattern: "Do you have...?" },
  { english: "Where is the supermarket?", czech: "Kde je supermarket?", pattern: "Where is...?" }
];

let drillIndex = 0;
let mistakes = [];
let mistakeIndex = 0;
let mistakeAnswerVisible = false;

const phraseGrid = document.querySelector("#phraseGrid");
const promptText = document.querySelector("#promptText");
const answerInput = document.querySelector("#answerInput");
const feedbackText = document.querySelector("#feedbackText");
const checkButton = document.querySelector("#checkButton");
const mistakeLesson = document.querySelector("#mistakeLesson");
const mistakeCategory = document.querySelector("#mistakeCategory");
const mistakeStatus = document.querySelector("#mistakeStatus");
const mistakeWrong = document.querySelector("#mistakeWrong");
const mistakeAnswer = document.querySelector("#mistakeAnswer");
const mistakeCorrect = document.querySelector("#mistakeCorrect");
const mistakeNote = document.querySelector("#mistakeNote");
const randomMistakeButton = document.querySelector("#randomMistakeButton");
const showMistakeButton = document.querySelector("#showMistakeButton");
const rememberedMistakeButton = document.querySelector("#rememberedMistakeButton");
const difficultMistakeButton = document.querySelector("#difficultMistakeButton");

const fallbackMistakes = [
  {
    id: "2026-06-18-charge-vs-change",
    lesson: "001",
    category: "vocabulary",
    wrong: "Can I change my phone?",
    correct: "Can I charge my phone?",
    note: "Use charge for phone or battery. Use change for money or making something different."
  }
];

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[?.!]/g, "")
    .replace(/\s+/g, " ");
}

function renderPhrases() {
  phraseGrid.innerHTML = phrases
    .map(
      (phrase) => `
        <article class="phrase-card">
          <strong>${phrase.english}</strong>
          <span>${phrase.czech}</span>
          <small>${phrase.pattern}</small>
        </article>
      `
    )
    .join("");
}

function renderPrompt() {
  const phrase = phrases[drillIndex];
  promptText.textContent = phrase.czech;
  answerInput.value = "";
  feedbackText.textContent = "";
  answerInput.focus();
}

function checkAnswer() {
  const phrase = phrases[drillIndex];
  const expected = normalize(phrase.english);
  const actual = normalize(answerInput.value);

  if (actual === expected) {
    feedbackText.textContent = "Good. Next one.";
    drillIndex = (drillIndex + 1) % phrases.length;
    window.setTimeout(renderPrompt, 700);
    return;
  }

  feedbackText.textContent = `Better: ${phrase.english}`;
}

function getMistakeState(id) {
  return window.localStorage.getItem(`engloss-mistake-${id}`) || "New";
}

function setMistakeState(id, state) {
  window.localStorage.setItem(`engloss-mistake-${id}`, state);
  renderMistake();
}

function renderMistake() {
  const mistake = mistakes[mistakeIndex];

  if (!mistake) {
    mistakeLesson.textContent = "No lesson";
    mistakeCategory.textContent = "No category";
    mistakeStatus.textContent = "Empty";
    mistakeWrong.textContent = "No mistakes stored yet.";
    mistakeAnswer.hidden = true;
    return;
  }

  mistakeLesson.textContent = `Lesson ${mistake.lesson}`;
  mistakeCategory.textContent = mistake.category;
  mistakeStatus.textContent = getMistakeState(mistake.id);
  mistakeWrong.textContent = mistake.wrong;
  mistakeCorrect.textContent = mistake.correct;
  mistakeNote.textContent = mistake.note;
  mistakeAnswer.hidden = !mistakeAnswerVisible;
  showMistakeButton.textContent = mistakeAnswerVisible ? "Hide answer" : "Show answer";
}

function pickRandomMistake() {
  if (mistakes.length < 2) {
    mistakeIndex = 0;
    mistakeAnswerVisible = false;
    renderMistake();
    return;
  }

  let nextIndex = mistakeIndex;
  while (nextIndex === mistakeIndex) {
    nextIndex = Math.floor(Math.random() * mistakes.length);
  }

  mistakeIndex = nextIndex;
  mistakeAnswerVisible = false;
  renderMistake();
}

async function loadMistakes() {
  try {
    const response = await fetch("data/mistakes.json");
    if (!response.ok) {
      throw new Error("Mistakes could not be loaded.");
    }
    mistakes = await response.json();
  } catch (error) {
    mistakes = fallbackMistakes;
  }

  renderMistake();
}

checkButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});
randomMistakeButton.addEventListener("click", pickRandomMistake);
showMistakeButton.addEventListener("click", () => {
  mistakeAnswerVisible = !mistakeAnswerVisible;
  renderMistake();
});
rememberedMistakeButton.addEventListener("click", () => {
  const mistake = mistakes[mistakeIndex];
  if (mistake) {
    setMistakeState(mistake.id, "Remembered");
  }
});
difficultMistakeButton.addEventListener("click", () => {
  const mistake = mistakes[mistakeIndex];
  if (mistake) {
    setMistakeState(mistake.id, "Difficult");
  }
});

renderPhrases();
renderPrompt();
loadMistakes();
