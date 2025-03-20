let btnRef = document.querySelectorAll(".button-option");
let popupRef = document.querySelector(".popup");
let newgameBtn = document.getElementById("new-game");
let restartBtn = document.getElementById("restart");
let msgRef = document.getElementById("message");

let difficulty = "medium"; // Default difficulty

const chooseDifficulty = () => {
  let selected = prompt("Choose Difficulty: easy, medium, or hard", "medium");
  if (["easy", "medium", "hard"].includes(selected)) {
    difficulty = selected;
  } else {
    difficulty = "medium"; // Default if input is invalid
  }
};

let winningPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let playerTurn = true; // Player starts as 'X'
let count = 0;

const disableButtons = () => {
  btnRef.forEach((element) => (element.disabled = true));
  popupRef.classList.remove("hide");
};

const enableButtons = () => {
  btnRef.forEach((element) => {
    element.innerText = "";
    element.disabled = false;
  });
  popupRef.classList.add("hide");
  playerTurn = true;
};

const winFunction = (letter) => {
  disableButtons();
  msgRef.innerHTML = letter === "X" ? "🎉 'X' Wins!" : "🤖 'O' Wins!";
};

const drawFunction = () => {
  disableButtons();
  msgRef.innerHTML = "😎 It's a Draw!";
};

const winChecker = () => {
  for (let pattern of winningPattern) {
    let [a, b, c] = pattern;
    if (
      btnRef[a].innerText &&
      btnRef[a].innerText === btnRef[b].innerText &&
      btnRef[a].innerText === btnRef[c].innerText
    ) {
      winFunction(btnRef[a].innerText);
      return true;
    }
  }
  if (count === 9) drawFunction();
  return false;
};

const aiMove = () => {
  if (difficulty === "easy") {
    easyAI();
  } else if (difficulty === "medium") {
    mediumAI();
  } else {
    hardAI();
  }
};

// EASY AI (Random Moves)
const easyAI = () => {
  let emptyCells = [];
  btnRef.forEach((btn, index) => {
    if (!btn.innerText) emptyCells.push(index);
  });
  if (emptyCells.length > 0) {
    let aiChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    btnRef[aiChoice].innerText = "O";
    btnRef[aiChoice].disabled = true;
    count++;
    if (!winChecker()) playerTurn = true;
  }
};

// MEDIUM AI (Try to win, otherwise random)
const mediumAI = () => {
  for (let pattern of winningPattern) {
    let [a, b, c] = pattern;
    let values = [
      btnRef[a].innerText,
      btnRef[b].innerText,
      btnRef[c].innerText,
    ];

    // Try to win
    if (values.filter((v) => v === "O").length === 2 && values.includes("")) {
      let index = values.indexOf("");
      btnRef[pattern[index]].innerText = "O";
      btnRef[pattern[index]].disabled = true;
      count++;
      if (!winChecker()) playerTurn = true;
      return;
    }
  }
  // Play random if no winning move
  easyAI();
};

// HARD AI (Block player & Try to win)
const hardAI = () => {
  for (let pattern of winningPattern) {
    let [a, b, c] = pattern;
    let values = [
      btnRef[a].innerText,
      btnRef[b].innerText,
      btnRef[c].innerText,
    ];

    // Try to win
    if (values.filter((v) => v === "O").length === 2 && values.includes("")) {
      let index = values.indexOf("");
      btnRef[pattern[index]].innerText = "O";
      btnRef[pattern[index]].disabled = true;
      count++;
      if (!winChecker()) playerTurn = true;
      return;
    }

    // Block Player 'X' from winning
    if (values.filter((v) => v === "X").length === 2 && values.includes("")) {
      let index = values.indexOf("");
      btnRef[pattern[index]].innerText = "O";
      btnRef[pattern[index]].disabled = true;
      count++;
      if (!winChecker()) playerTurn = true;
      return;
    }
  }

  // Play center if available
  if (!btnRef[4].innerText) {
    btnRef[4].innerText = "O";
    btnRef[4].disabled = true;
    count++;
    if (!winChecker()) playerTurn = true;
    return;
  }

  // Otherwise, play randomly
  easyAI();
};

// Player Move
btnRef.forEach((element) => {
  element.addEventListener("click", () => {
    if (playerTurn) {
      element.innerText = "X";
      element.disabled = true;
      count++;
      playerTurn = false;
      if (!winChecker()) setTimeout(aiMove, 500);
    }
  });
});

// New Game
newgameBtn.addEventListener("click", () => {
  count = 0;
  enableButtons();
});

// Restart Game
restartBtn.addEventListener("click", () => {
  count = 0;
  enableButtons();
});

// Load Game
window.onload = () => {
  chooseDifficulty();
  enableButtons();
};
