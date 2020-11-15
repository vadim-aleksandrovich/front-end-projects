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
const messageOverlay = create('div', 'message__overlay', '', main);
const messageContent = create('div', 'message__content', '', messageOverlay);
const messageTitle = create('div', 'message__title', '', messageContent);
const messageClose = create('div', 'message__close', '<i class="material-icons">close</i>', messageTitle);
const messageSubtitle = create('div', 'message__subtitle', 'subtitle', messageContent);
const messageWinners = create('div', 'message__results', '', messageContent);

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

// Parameters for game
const windowSize = 600;
let cellSize = windowSize / sizeSelector.value;
let fieldSize = sizeSelector.value ** 2;
let randImageInd = Math.floor(Math.random() * (150 - 1) + 1);
let stepCounter = 0;
let cells = [];
let solution = [];
let isMute = false;
let isDrag = false;
let timerSeconds = 0;
let timerMinutes = 0;
let timerCount;

const addZero = (n) => (n < 10 ? `0${n}` : n);

// Winners list
const winners = JSON.parse(window.localStorage.getItem('winners')) || [];

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

function showMessage(message) {
  messageOverlay.style.display = 'flex';
  messageContent.classList.remove('message__close');
  messageContent.classList.add('message__show');
  messageSubtitle.textContent = message;
}

function closeMessage() {
  messageContent.classList.remove('message__show');
  setTimeout(() => {
    messageContent.classList.add('message__close');
  }, 0);
  setTimeout(() => {
    messageOverlay.style.display = 'none';
    messageWinners.style.display = 'none';
  }, 300);
}

function winnersRender() {
  while (messageWinners.children.length) {
    messageWinners.removeChild(messageWinners.lastChild);
  }
  for (let i = 0; i < winners.length && i < 10; i += 1) {
    winners.sort((a, b) => (a.steps > b.steps ? 1 : -1));
    messageWinners.append(create('p', '', `Game: ${winners.length - i} time: ${addZero(winners[i].mins)}:${addZero(winners[i].seconds)} steps: ${winners[i].steps}`));
  }
  timerPause();
  messageWinners.style.display = 'flex';
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

  if (param !== 'random') {
    const isFinish = cells.every((el) => el.value === el.top * Math.sqrt(fieldSize) + el.left + 1);
    if (isFinish && param !== 'solution') {
      cellEmpty.style.backgroundImage = `url('./assets/images/${randImageInd}.jpg')`;
      cellEmpty.style.opacity = '1';
      timerPause();
      showMessage(`Congratulations! You won in ${addZero(timerMinutes)} minutes ${addZero(timerSeconds)} seconds and ${stepCounter} steps`);
      winners.unshift({
        steps: stepCounter,
        mins: timerMinutes,
        seconds: timerSeconds,
      });
      window.localStorage.setItem('winners', JSON.stringify(winners));
      winnersRender();
      field.style.pointerEvents = 'none';
    }
    if (isFinish && param === 'solution') {
      cellEmpty.style.backgroundImage = `url('./assets/images/${randImageInd}.jpg')`;
      cellEmpty.style.opacity = '1';
      showMessage(`You gave up by ${addZero(timerMinutes)} minutes ${addZero(timerSeconds)} seconds, making ${stepCounter} moves. The result will not be added to the winner table. Please try again`);
      field.style.pointerEvents = 'none';
    }
  }
  if (param !== 'random' && param !== 'solution') {
    document.getElementById('sound').currentTime = 0;
    if (!isMute) {
      document.getElementById('sound').play();
    } else {
      document.getElementById('sound').pause();
    }
  }
}

function startGame(size) { // (size == fieldSize)
  const numbers = [...Array(size - 1).keys()];
  randImageInd = Math.floor(Math.random() * (150));
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
    cell.style.backgroundImage = `url('/assets/images/${randImageInd}.jpg')`;
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.backgroundSize = `${Math.sqrt(size) * cellSize}rem ${Math.sqrt(size) * cellSize}rem`;
    cell.style.backgroundPositionX = `${-(left * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
    cell.style.backgroundPositionY = `${-(top * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
    field.append(cell);
    cell.addEventListener('click', () => {
      move(i);
    });

    // Drag drop
    cell.setAttribute('draggable', 'true');

    cell.addEventListener('dragstart', () => {
      setTimeout(() => {
        cell.style.display = 'none';
      }, 0);
    });
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('dragend', () => {
      cell.style.display = 'flex';
      if (isDrag) {
        move(i);
      }
    });
  }
  cellEmpty.addEventListener('dragenter', () => {
    isDrag = true;
  });
  cellEmpty.addEventListener('dragleave', () => {
    setTimeout(() => {
      isDrag = false;
    }, 600);
  });
  cells.push(empty);

  // Add EmptyCell in DOM
  field.append(cellEmpty);
  empty.element = cellEmpty;
  empty.posX = `${-(cells[fieldSize - 1].left * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
  empty.posY = `${-(cells[fieldSize - 1].top * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
  cellEmpty.style.width = `${cellSize}rem`;
  cellEmpty.style.height = `${cellSize}rem`;
  cellEmpty.style.left = `${cells[fieldSize - 1].left * cellSize}rem`;
  cellEmpty.style.top = `${cells[fieldSize - 1].top * cellSize}rem`;
  cellEmpty.style.backgroundRepeat = 'no-repeat';
  cellEmpty.style.backgroundSize = `${Math.sqrt(size) * cellSize}rem ${Math.sqrt(size) * cellSize}rem`;
  cellEmpty.style.backgroundPositionX = `${-(cells[fieldSize - 1].left * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
  cellEmpty.style.backgroundPositionY = `${-(cells[fieldSize - 1].top * Math.sqrt(size) * cellSize) / Math.sqrt(size)}rem`;
}

function randomGame(count) {
  for (let i = 0; i < count; i += 1) {
    const moveItem = Math.floor(Math.random() * (fieldSize - 1));
    move(moveItem, 'random');
  }
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
  randomGame(fieldSize * 40); // Set random
  stepCounter = 0;
  stepsValue.textContent = stepCounter;
  clearInterval(timerCount);
  timerSeconds = 0;
  timerMinutes = 0;
  timerCount = setInterval(gameTimer, 1000);
  timerValue.textContent = `${addZero(timerMinutes)}:${addZero(timerSeconds)}`;
}

function changeSize() {
  fieldSize = sizeSelector.value ** 2;
  startBtn.textContent = `START ${sizeSelector.value}x${sizeSelector.value}`;
}

function deleteDouble(solutionList) {
  for (let i = solutionList.length - 1; i > 0; i -= 1) {
    if (solutionList[i] === solutionList[i - 1]) {
      solutionList.splice(i - 1, 2);
      i -= 1;
    }
  }
}

function autoSolution() {
  for (let i = 0; i < 5; i += 1) deleteDouble(solution);
  if (solution.length > 1) {
    let solutionSteps = solution.length;
    autofinishBtn.disabled = true;
    burgerBtn.disabled = true;

    let ind = 0;
    const pushElement = function loop() {
      setTimeout(() => {
        move(solution[ind], 'solution');
        solutionSteps -= 1;
        stepsValue.textContent = solutionSteps;
        ind += 1;
        if (ind < solution.length) {
          pushElement();
        }
        if (ind === solution.length) {
          clearInterval(timerCount);
          solution = [];
          autofinishBtn.disabled = false;
          burgerBtn.disabled = false;
        }
      }, 170);
    };
    pushElement();
  }
}

function saveGame() {
  if (solution.length === 0) {
    return;
  }
  const solutionStr = solution.toString();
  window.localStorage.setItem('solution', JSON.stringify(solutionStr));
  window.localStorage.setItem('cells', JSON.stringify(cells));
  window.localStorage.setItem('fieldSize', JSON.stringify(fieldSize));
  window.localStorage.setItem('cellSize', JSON.stringify(cellSize));
  window.localStorage.setItem('timerSeconds', JSON.stringify(timerSeconds));
  window.localStorage.setItem('timerMinutes', JSON.stringify(timerMinutes));
  window.localStorage.setItem('stepCounter', JSON.stringify(stepCounter));
  window.localStorage.setItem('randImageInd', JSON.stringify(randImageInd));
}

function loadGame() {
  const solutionLoadStr = JSON.parse(window.localStorage.getItem('solution'));
  if (!solutionLoadStr) {
    loadBtn.disabled = true;
  } else {
    loadBtn.disabled = false;
  }
  const solutionLoadArr = solutionLoadStr.split(',');
  solution = solutionLoadArr.map((element) => element * 1);

  // varibles value
  fieldSize = JSON.parse(window.localStorage.getItem('fieldSize')) * 1;
  cellSize = JSON.parse(window.localStorage.getItem('cellSize')) * 1;
  timerSeconds = JSON.parse(window.localStorage.getItem('timerSeconds')) * 1;
  timerMinutes = JSON.parse(window.localStorage.getItem('timerMinutes')) * 1;
  stepCounter = JSON.parse(window.localStorage.getItem('stepCounter')) * 1;
  randImageInd = JSON.parse(window.localStorage.getItem('randImageInd')) * 1;

  stepsValue.textContent = stepCounter;
  sizeSelector.value = Math.sqrt(fieldSize);

  field.style.width = `${Math.sqrt(fieldSize) * cellSize}rem`;
  field.style.height = `${Math.sqrt(fieldSize) * cellSize}rem`;
  clearInterval(timerCount);
  timerCount = setInterval(gameTimer, 1000);

  // cells position
  const cellsLoad = JSON.parse(window.localStorage.getItem('cells'));
  field.style.pointerEvents = '';
  while (field.children.length) {
    field.removeChild(field.lastChild);
  }
  cells = [];
  cellEmpty = create('div', 'cell__empty', '', '');
  for (let i = 0; i < fieldSize - 1; i += 1) {
    const cell = document.createElement('div');
    const { value } = cellsLoad[i];
    cell.className = 'cell';
    cell.innerHTML = value;
    const { left } = cellsLoad[i];
    const { top } = cellsLoad[i];

    cells.push({
      value,
      left,
      top,
      element: cell,
      posX: cellsLoad[i].posX,
      posY: cellsLoad[i].posY,
    });

    cell.style.width = `${cellSize}rem`;
    cell.style.height = `${cellSize}rem`;
    cell.style.left = `${left * cellSize}rem`;
    cell.style.top = `${top * cellSize}rem`;
    cell.style.backgroundImage = `url('/assets/images/${randImageInd}.jpg')`;
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.backgroundSize = `${Math.sqrt(fieldSize) * cellSize}rem ${Math.sqrt(fieldSize) * cellSize}rem`;
    cell.style.backgroundPositionX = cellsLoad[i].posX;
    cell.style.backgroundPositionY = cellsLoad[i].posY;
    field.append(cell);

    cell.addEventListener('click', () => {
      move(i);
    });

    // Drag drop
    cell.setAttribute('draggable', 'true');

    cell.addEventListener('dragstart', () => {
      setTimeout(() => {
        cell.style.display = 'none';
      }, 0);
    });
    // eslint-disable-next-line no-loop-func
    cell.addEventListener('dragend', () => {
      cell.style.display = 'flex';
      if (isDrag) {
        move(i);
      }
    });
  }

  empty = {
    value: fieldSize,
    top: cellsLoad[fieldSize - 1].top,
    left: cellsLoad[fieldSize - 1].left,
    posX: cellsLoad[fieldSize - 1].posX,
    posY: cellsLoad[fieldSize - 1].posY,
  };

  cellEmpty.addEventListener('dragenter', () => {
    isDrag = true;
  });
  cellEmpty.addEventListener('dragleave', () => {
    setTimeout(() => {
      isDrag = false;
    }, 600);
  });
  cells.push(empty);

  // Add EmptyCell in DOM on load
  field.append(cellEmpty);
  empty.element = cellEmpty;
  cellEmpty.style.width = `${cellSize}rem`;
  cellEmpty.style.height = `${cellSize}rem`;
  cellEmpty.style.left = `${cells[fieldSize - 1].left * cellSize}rem`;
  cellEmpty.style.top = `${cells[fieldSize - 1].top * cellSize}rem`;
  cellEmpty.style.backgroundRepeat = 'no-repeat';
  cellEmpty.style.backgroundSize = `${Math.sqrt(fieldSize) * cellSize}rem ${Math.sqrt(fieldSize) * cellSize}rem`;
  cellEmpty.style.backgroundPositionX = empty.posX;
  cellEmpty.style.backgroundPositionY = empty.posY;
}

restartGame();

burgerBtn.addEventListener('click', () => {
  showMenu();
  closeMessage();
});
muteBtn.addEventListener('click', mute);
messageClose.addEventListener('click', () => {
  closeMessage();
  timerResume();
});
startBtn.addEventListener('click', () => {
  restartGame();
  showMenu();
});
saveBtn.addEventListener('click', () => {
  saveGame();
  showMenu();
});
loadBtn.addEventListener('click', () => {
  loadGame();
  showMenu();
});
autofinishBtn.addEventListener('click', () => {
  autoSolution();
  showMenu();
});
sizeSelector.addEventListener('change', changeSize);
resultsBtn.addEventListener('click', () => {
  showMenu();
  showMessage('Best Results');
  winnersRender();
});
