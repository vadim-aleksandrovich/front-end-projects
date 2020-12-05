/* eslint-disable no-unused-vars */
import '../sass/style.scss';
import './images';
import create from './utils/create';
import createIcon from './utils/createIcon';
import deleteChildren from './utils/deleteChildren';
import categories from './categories/categories';
import links from './nls/links';

import gameOverlay from './elements/gameoverlay';
import switchElement from './elements/switchelement';

const header = create('header', 'header', create('div', 'wrapper wrapper__header'));
const footer = create('footer', 'footer', create('div', 'wrapper wrapper__footer'));
const burgerBtn = create('button', 'burger__btn', createIcon('menu'), header.firstChild);

const infoBtn = create('button', 'info__btn button', 'info', header.firstChild);
header.firstChild.append(switchElement.switchBox);
const gameBtn = create('button', 'game__btn button', 'START', header.firstChild);
gameBtn.disabled = true;
const main = create('main', 'main', create('div', 'wrapper wrapper__main'), '');
const gameAnswers = create('div', 'game__answers', '', main.firstChild);
const cardConteiner = create('div', 'card__container', '', main.firstChild);

document.body.prepend(gameOverlay.gameOverlayBox, header, main);
gameOverlay.gameOverlayBox.append(
  gameOverlay.gameOverlayImg,
  gameOverlay.gameOverlayMessage,
  gameOverlay.gameOverlayLink,
);

const engSound = create('audio', '', '', main);
const messageSound = create('audio', '', '', main);
let gameMode = [];
let currentFolder;

switchElement.switchBox.append(
  switchElement.switchBtn,
  switchElement.switchLabel,
  switchElement.trainLabel,
  switchElement.playLabel,
);
let mistakes = 0;
switchElement.switchBtn.addEventListener('change', () => {
  if (switchElement.switchBtn.checked) {
    main.setAttribute('data-state', 'gameMode');
    footer.setAttribute('data-state', 'gameMode');
    header.setAttribute('data-state', 'gameMode');
    document.querySelector('body').setAttribute('data-state', 'gameMode');
  }
  if (!switchElement.switchBtn.checked) {
    main.removeAttribute('data-state');
    footer.removeAttribute('data-state');
    header.removeAttribute('data-state');
    document.querySelector('body').removeAttribute('data-state', 'gameMode');
  }
});

const generateCards = function generateCards(cardContent) {
  deleteChildren(cardConteiner);
  deleteChildren(gameAnswers);
  mistakes = 0;
  const { content } = cardContent;
  gameBtn.innerHTML = 'START';
  gameBtn.disabled = false;
  gameMode = [];
  currentFolder = cardContent.title;
  for (let i = 0; i < content.length; i += 1) {
    gameMode.push(content[i].eng);
    const cardBox = create('div', 'card__box card__box_word', '', cardConteiner, ['soundSrc', links.soundSrc(cardContent.title, content[i].eng)], ['cardName', content[i].eng]);

    const cardFront = create('div', 'card__front', '', cardBox);
    const cardBack = create('div', 'card__back', '', cardBox);
    create('div', 'card__word', `${content[i].rus}`, cardBack);

    const cardImage = create('img', 'card__image', '', cardFront, ['src', links.imageSrc(cardContent.title, content[i].eng)]);
    create('div', 'card__word', `${content[i].eng}`, cardFront);

    const cardReverse = create('button', 'card__reverse', createIcon('autorenew'), cardFront);

    cardReverse.addEventListener('click', () => {
      cardFront.classList.add('card__front_reverse');
      cardBack.classList.add('card__back_reverse');
    });
    cardBox.addEventListener('mouseleave', () => {
      cardFront.classList.remove('card__front_reverse');
      cardBack.classList.remove('card__back_reverse');
    });
  }
};

const createCards = function createCards() {
  for (let i = 0; i < categories.length; i += 1) {
    const cardBox = create('a', 'card__box', '', cardConteiner, [
      'href',
      `#${categories[i].title}`,
    ]);

    const cardFront = create('div', 'card__front',
      [create('img', 'card__image', '', '',
        ['src', links.imageSrc(categories[i].title, categories[i].title)]),
      create('div', 'card__word', `${categories[i].title}`, ''),
      ], cardBox);
    cardBox.addEventListener('click', () => {
      generateCards(categories[i]);
    });
  }
};

const createMenu = function createMenu() {
  const menu = create('nav', 'menu', '', header.firstChild);
  const menuList = create('ul', 'menu__list', '', menu);
  create('li', 'menu__item', create('a', 'menu__link', '<img src="./assets/icons/home.png" class="menu__image"/> main menu', '', ['href', '']), menuList);

  for (let i = 0; i < categories.length; i += 1) {
    const menuItem = create('li', 'menu__item', '', menuList);
    const menuLink = create(
      'a',
      'menu__link',
      `<img src="./assets/icons/${categories[i].title}/${categories[i].title}.png" class="menu__image"/> ${categories[i].title}`,
      menuItem,
      ['href', `#${categories[i].title}/`],
    );
    menuLink.addEventListener('click', () => {
      generateCards(categories[i]);
    });
  }
  return menu;
};

const menu = createMenu();
createCards();

function switherMenu() {
  // window.addEventListener('click', (e) => {
  //   if (!e.target.closest('.menu')) {
  //     menu.classList.remove('menu_active');
  //     burgerBtn.classList.remove('burger__btn_active');
  //   }
  // });
  menu.classList.toggle('menu_active');
  burgerBtn.classList.toggle('burger__btn_active');
}

const playMessageSound = (message) => {
  messageSound.src = message;
  setTimeout(() => {
    messageSound.play();
  }, 1);
};

const playSound = (card) => {
  const soundSrc = card.getAttribute('data-sound-src');
  engSound.src = soundSrc;
  setTimeout(() => {
    engSound.play();
  }, 1);
};

const gameMessage = () => {
  gameOverlay.gameOverlayBox.classList.add('gameoverlay_active');
  if (mistakes === 0) {
    playMessageSound(links.winnerSound);
    gameOverlay.gameOverlayImg.src = links.imageSrc('gameIcons', 'win_color2');
    gameOverlay.gameOverlayMessage.innerHTML = 'You are winner!!!';
  } else {
    playMessageSound(links.failSound);
    gameOverlay.gameOverlayImg.src = links.imageSrc('gameIcons', 'losing_сolor');
    gameOverlay.gameOverlayMessage.innerHTML = `You made ${mistakes} mistakes, please try again`;
  }
};

const playGame = () => {
  if (gameMode.length === 0) {
    gameMessage();
    return;
  }
  gameMode.sort(() => Math.random() * 2 - 1);
  engSound.src = links.soundSrc(currentFolder, gameMode[gameMode.length - 1]);
  engSound.load();
  engSound.play();
  gameBtn.innerHTML = 'REPEAT';
};

cardConteiner.onclick = function func(event) {
  const targ = event.target.closest('.card__box_word');

  if (targ) {
    if (!switchElement.switchBtn.checked) {
      playSound(targ);
    }
    if (switchElement.switchBtn.checked && gameBtn.innerHTML === 'REPEAT') {
      if (targ.getAttribute('data-card-name') === gameMode[gameMode.length - 1]) {
        targ.firstChild.classList.add('game__true');
        gameAnswers.prepend(create('div', 'correct', '', ''));
        playMessageSound(links.correctSound);
        gameMode.pop();
        playGame();
      } else {
        gameAnswers.prepend(create('div', 'mistake', '', ''));
        playMessageSound(links.mistakeSound);
        mistakes += 1;
      }
    }
  }
};

gameBtn.addEventListener('click', () => {
  if (gameBtn.innerHTML === 'START') {
    playGame();
  }
  if (gameBtn.innerHTML === 'REPEAT') {
    engSound.play();
  }
});

burgerBtn.addEventListener('click', switherMenu);
menu.addEventListener('click', switherMenu);
