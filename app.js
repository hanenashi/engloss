const phrases = [
  { english: "I need water.", czech: "Potrebuju vodu.", pattern: "I need..." },
  { english: "I need food.", czech: "Potrebuju jidlo.", pattern: "I need..." },
  { english: "Can I sit here?", czech: "Muzu si tady sednout?", pattern: "Can I...?" },
  { english: "Can I charge my phone?", czech: "Muzu si nabit telefon?", pattern: "Can I...?" },
  { english: "Do you have water?", czech: "Mate vodu?", pattern: "Do you have...?" },
  { english: "Where is the supermarket?", czech: "Kde je supermarket?", pattern: "Where is...?" }
];

let drillIndex = 0;

const phraseGrid = document.querySelector("#phraseGrid");
const promptText = document.querySelector("#promptText");
const answerInput = document.querySelector("#answerInput");
const feedbackText = document.querySelector("#feedbackText");
const checkButton = document.querySelector("#checkButton");

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

checkButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

renderPhrases();
renderPrompt();
