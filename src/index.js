import {hardDictionary, easyDictionary} from './dictionary.js';


const state = {
  secret: hardDictionary[Math.floor(Math.random() * hardDictionary.length)],
  grid: Array(6).fill().map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
};

function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          shakeGrid();
        }
      }
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() { //concatena las letras de toda la fila
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) { //verifica si la palabra existe en el diccionario
  return easyDictionary.includes(word) || hardDictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {result++;}
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {result++;}
  }
  return result;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 150; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(state.secret,letter);
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (numOfOccurrencesGuess > numOfOccurrencesSecret && letterPosition > numOfOccurrencesSecret){box.classList.add('empty');}
      else {if (letter === state.secret[i]) {box.classList.add('right');} 
      else if (state.secret.includes(letter)) {box.classList.add('wrong');}
      else {box.classList.add('empty');}}
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert('Ganaste!');
    } else if (isGameOver) {
      alert(`La palabra era: ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) { //verifica que lo ingresado sea una letra
  return key.length === 1 && key.match(/[a-zñ]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function shakeGrid() {
  const grid = document.querySelector('.grid');
  grid.classList.add('shake');

  setTimeout(() => {
    grid.classList.remove('shake');
  }, 300); // Duración de la animación
}

function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  registerKeyboardEvents();
}

document.getElementById('restartButton').addEventListener('click', () => {
  location.reload();
});

document.getElementById('modeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const modeToggleButton = document.getElementById('modeToggle');
});

startup();