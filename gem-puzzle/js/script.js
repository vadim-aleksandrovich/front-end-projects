/* eslint-disable import/extensions */

import create from './create.js';

const menuOverlay = create('div', 'menu__overlay');
const header = create('header', 'header');
const main = create('main', 'main');
const logo = create('div', 'logo', '', header);

create('img', 'logo__img', '', logo, ['src', './assets/puzzle.svg']);
create('h1', 'logo__title', 'Gem Puzzle', logo);
create('audio', 'moveSound', create('source', '', '', '', ['src', './sound/move.mp3']), main, ['id', 'sound']);

document.body.prepend(main);
document.body.prepend(header);
document.body.prepend(menuOverlay);

const gameElements = create('div', 'game__elements', '', header);
const timer = create('div', 'timmer', create('img', 'timer__icon', '', '', ['src', './assets/timer.png']), gameElements);
const timerValue = create('span', 'timer__value', '00:00', timer);
const steps = create('div', 'steps', create('img', 'steps__icon', '', '', ['src', './assets/steps.png']), gameElements);
const stepsValue = create('span', 'steps__value', '0', steps);
const burgerBtn = create('button', 'burger__btn', '<svg class="menu_burger_svg" width="30" height="22" viewBox="0 0 30 22" fill=""xmlns="http://www.w3.org/2000/svg"><line y1="21" x2="30" y2="21" stroke="#fafafa" stroke-width="2" /><line y1="11" x2="30" y2="11" stroke="#fafafa" stroke-width="2" /><line y1="1" x2="30" y2="1" stroke="#fafafa" stroke-width="2" /></svg>', header);
const field = create('div', 'field', '', main);
const menu = create('div', 'menu', '', main);

const sizeSelector = create('input', '', '', menu,
  ['type', 'range'],
  ['id', 'sizeSelector'],
  ['min', '3'],
  ['max', '8'],
  ['step', '1']);
sizeSelector.value = 4;

const startBtn = create('button', 'menu__btn start__btn', `New game ${sizeSelector.value}x${sizeSelector.value}`, menu);
const saveBtn = create('button', 'menu__btn save__btn', 'Save', menu);
const loadBtn = create('button', 'menu__btn load__btn', 'Load', menu);
const autofinishBtn = create('button', 'menu__btn autofinish__btn', 'Auto finish', menu);
const muteBtn = create('button', 'menu__btn mute__btn', 'Mute', menu);
const resultsBtn = create('button', 'menu__btn results__btn', 'Best results', menu);

//Game's parametrs

const windowSize = 600;
let cellSize = windowSize / sizeSelector.value;
let fieldSize = sizeSelector.value ** 2;

let stepCounter = 0;
let cells = [];
let solution = [];
let isMute = false;

let timerSeconds = 0;
let timerMinutes = 0;
let timerCount;

const addZero = (n) => (n < 10 ? `0${n}` : n);

let empty = {
  value: fieldSize,
  top: Math.sqrt(fieldSize) - 1,
  left: Math.sqrt(fieldSize) - 1,
};

let cellEmpty = create('div', 'cell__empty', '', '');

function emptyCellMove() {
  cellEmpty.style.left = `${cells[fieldSize - 1].left * cellSize}rem`;
  cellEmpty.style.top = `${cells[fieldSize - 1].top * cellSize}rem`;
}

function gameTimer() {
  timerSeconds += 1;
  if (timerSeconds >= 60) {
    timerMinutes += 1;
    timerSeconds = 0;
  }
  timerValue.textContent = `${addZero(timerMinutes)} : ${addZero(timerSeconds)}`;
}

function move(index, param) {
  const cell = cells[index];
  const leftDifferent = Math.abs(empty.left - cell.left);
  const topDifferent = Math.abs(empty.top - cell.top);

  if (param !== 'solution') {
    if (leftDifferent + topDifferent > 1) {
      return;
    }
    stepCounter += 1;
    solution.unshift(index);
  }

  stepsValue.textContent = stepCounter;

  cell.element.style.left = `${empty.left * cellSize}rem`;
  cell.element.style.top = `${empty.top * cellSize}rem`;
  const emptyLeft = empty.left;
  const emptyTop = empty.top;
  empty.left = cell.left;
  cellEmpty.left = cell.left;
  empty.top = cell.top;
  cellEmpty.top = cell.top;
  cell.left = emptyLeft;
  cell.top = emptyTop;
  emptyCellMove();
}

function restartGame() {
  while (field.children.length) {
    field.removeChild(field.lastChild);
  }
  cellSize = windowSize / sizeSelector.value;
  fieldSize = sizeSelector.value ** 2;
  cells = [];
  solution = [];
  empty.value = fieldSize;
  empty.top = Math.sqrt(fieldSize) - 1;
  empty.left = Math.sqrt(fieldSize) - 1;
  field.style.width = `${Math.sqrt(fieldSize) * cellSize}rem`;
  field.style.height = `${Math.sqrt(fieldSize) * cellSize}rem`;
  startGame(fieldSize);
  stepCounter = 0;
  stepsValue.textContent = stepCounter;
  clearInterval(timerCount);
  timerSeconds = 0;
  timerMinutes = 0;
  timerCount = setInterval(gameTimer, 1000);
  timerValue.textContent = `${addZero(timerMinutes)}:${addZero(timerSeconds)}`;
}

function timerPause() {
  clearInterval(timerCount);
}

function timerResume() {
  clearInterval(timerCount);
  timerCount = setInterval(gameTimer, 1000);
}

function mute() {
  if (!isMute) {
    isMute = true;
    muteBtn.classList.add('menu__btn_active');
  } else {
    isMute = false;
    muteBtn.classList.remove('menu__btn_active');
  }
}

function showMenu() {
  if (burgerBtn.classList.contains('burger__btn_active')) {
    timerResume();
  } else {
    timerPause();
  }
  burgerBtn.classList.toggle('burger__btn_active');
  menuOverlay.classList.toggle('menu__overlay_active');
  menu.classList.toggle('menu_active');
  const solutionLoadStr = JSON.parse(window.localStorage.getItem('solution'));
  if (!solutionLoadStr) {
    loadBtn.disabled = true;
  } else {
    loadBtn.disabled = false;
  }
}

function startGame(size) { // (size == fieldSize)
  const numbers = [...Array(size - 1).keys()];
  field.style.pointerEvents = '';
  for (let i = 0; i < size - 1; i += 1) {
    const cell = document.createElement('div');
    const value = numbers[i] + 1;
    cell.className = 'cell';
    cell.innerHTML = value;

    const left = i % Math.sqrt(size);
    const top = (i - left) / Math.sqrt(size);

    cells.push({
      value,
      left,
      top,
      element: cell,
      posX: `${-(left * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`,
      posY: `${-(top * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`,
    });

    cell.style.width = `${cellSize}rem`;
    cell.style.height = `${cellSize}rem`;
    cell.style.left = `${left * cellSize}rem`;
    cell.style.top = `${top * cellSize}rem`;

    field.append(cell);
    cell.addEventListener('click', () => {
      move(i);
    });
}

field.append(cellEmpty);
  empty.element = cellEmpty;
  empty.posX = `${-(cells[fieldSize - 1].left * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
  empty.posY = `${-(cells[fieldSize - 1].top * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
  cellEmpty.style.width = `${cellSize}rem`;
  cellEmpty.style.height = `${cellSize}rem`;
  cellEmpty.style.left = `${cells[fieldSize - 1].left * cellSize}rem`;
  cellEmpty.style.top = `${cells[fieldSize - 1].top * cellSize}rem`;
}
restartGame()

burgerBtn.addEventListener('click', () => {
  showMenu();
});
muteBtn.addEventListener('click', mute);