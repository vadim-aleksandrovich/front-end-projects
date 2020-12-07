/* eslint-disable no-param-reassign */
import '../sass/style.scss';
import './images';
import create from './utils/create';
import * as storage from './utils/storage';
import createIcon from './utils/createIcon';
import deleteChildren from './utils/deleteChildren';
import categories from './categories/categories';
import links from './nls/links';
import messages from './nls/messages';
import gameOverlay from './elements/gameoverlay';
import switchElement from './elements/switchelement';
import generateStatistics from './utils/generateStatistics';
import setActiveLink from './utils/setactivelink';
import footer from './elements/footer';
import setRefreshTime from './utils/setRefreshTime';

const body = document.querySelector('body');
const header = create('header', 'header', create('div', 'wrapper wrapper__header'));
const burgerBtn = create('button', 'burger__btn', createIcon('menu'), header.firstChild);
const statisticOverlay = create('div', 'statistic__overlay');
const infoBtn = create('button', 'info__btn button', createIcon('info'), header.firstChild);
header.firstChild.append(switchElement.switchBox);
const gameBtn = create('button', 'game__btn button', createIcon('play_circle_outline'), header.firstChild);
gameBtn.disabled = true;
const main = create('main', 'main', create('div', 'wrapper wrapper__main'), '');
const gameAnswers = create('div', 'game__answers', '', main.firstChild);
const cardConteiner = create('div', 'card__container', '', main.firstChild);

document.body.prepend(gameOverlay.gameOverlayBox, statisticOverlay, header, main, footer.footer);
gameOverlay.gameOverlayBox.append(
  gameOverlay.gameOverlayImg,
  gameOverlay.gameOverlayMessage,
  gameOverlay.gameOverlayLink,
);
footer.footer.append(footer.wrapper);

footer.wrapper.append(
  footer.author,
  footer.date,
  footer.school,
);
footer.author.append(footer.githubImg);
footer.school.append(footer.schoolImg);

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
    header.setAttribute('data-state', 'gameMode');
    document.querySelector('body').setAttribute('data-state', 'gameMode');
  }
  if (!switchElement.switchBtn.checked) {
    main.removeAttribute('data-state');
    header.removeAttribute('data-state');
    document.querySelector('body').removeAttribute('data-state', 'gameMode');
  }
});

const generateCards = function generateCards(cardContent) {
  deleteChildren(cardConteiner);
  deleteChildren(gameAnswers);
  mistakes = 0;
  const { content } = cardContent;
  gameBtn.innerHTML = createIcon('play_circle_outline');
  gameBtn.classList.add('play');
  gameBtn.disabled = false;
  gameMode = [];
  currentFolder = cardContent.title;
  for (let i = 0; i < content.length; i += 1) {
    gameMode.push(content[i].eng);
    const cardBox = create('div', 'card__box card__box_word', '', cardConteiner, ['soundSrc', links.soundSrc(cardContent.title, content[i].eng)], ['cardName', content[i].eng]);

    const cardFront = create('div', 'card__front', '', cardBox);
    const cardBack = create('div', 'card__back', '', cardBox);
    create('div', 'card__word', `${content[i].rus}`, cardBack);

    create('img', 'card__image', '', cardFront, ['src', links.imageSrc(cardContent.title, content[i].eng)]);
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
    ], ['category', `${categories[i].title}`]);

    create('div', 'card__front',
      [create('img', 'card__image', '', '',
        ['src', links.imageSrc(categories[i].title, categories[i].title)]),
      create('div', 'card__word', `${categories[i].title}`, ''),
      ], cardBox);
    cardBox.addEventListener('click', () => {
      generateCards(categories[i]);
      setActiveLink(categories[i].title);
    });
  }
};
const menuOverlay = create('div', 'menu__overlay', '', header.firstChild);
const createMenu = function createMenu() {
  const menu = create('nav', 'menu', '', header.firstChild);

  const menuList = create('ul', 'menu__list', '', menu);
  const mainMenu = create('li', 'menu__item menu__item_main', create('a', 'menu__link menu__link_main', '<img src="./assets/icons/home.png" class="menu__image"/> main menu', '', ['href', '']), menuList);
  mainMenu.classList.add('menu__item_active');
  const itemsArray = [];
  for (let i = 0; i < categories.length; i += 1) {
    const menuItem = create('li', 'menu__item', '', menuList, ['category', `${categories[i].title}`]);
    const menuLink = create(
      'a',
      'menu__link',
      `<img src="./assets/icons/${categories[i].title}/${categories[i].title}.png" class="menu__image"/> ${categories[i].title}`,
      menuItem,
      ['href', `#${categories[i].title}/`],
    );
    itemsArray.push(menuItem);
    menuLink.addEventListener('click', () => {
      itemsArray.forEach((el) => el.classList.remove('menu__item_active'));
      generateCards(categories[i]);
      menuItem.classList.add('menu__item_active');
      mainMenu.classList.remove('menu__item_active');
    });
  }
  return menu;
};

const menu = createMenu();
createCards();

function switherMenu() {
  menu.classList.toggle('menu_active');
  burgerBtn.classList.toggle('burger__btn_active');
  menuOverlay.classList.toggle('menu__overlay_active');
  body.classList.toggle('overflow-hidden');
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
    gameOverlay.gameOverlayMessage.innerHTML = messages.win;
  } else {
    playMessageSound(links.failSound);
    gameOverlay.gameOverlayImg.src = links.imageSrc('gameIcons', 'losing_сolor');
    gameOverlay.gameOverlayMessage.innerHTML = messages.fail(mistakes);
  }
  setRefreshTime();
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
  gameBtn.classList.remove('play');
  gameBtn.classList.add('repeat');
  gameBtn.innerHTML = createIcon('replay');
};

const statistic = generateStatistics(categories);

const statisticUpdate = (cardName, field) => {
  const newStatistis = statistic;
  statistic.forEach((el) => {
    if (el.eng === cardName) {
      switch (field) {
        case 'mistake':
          el.mistakesCount += 1;
          break;
        case 'correct':
          el.correctCount += 1;
          break;
        default:
          el.trainCount += 1;
          break;
      }
      if (el.correctCount || el.mistakesCount) {
        el.coef = Math.ceil((el.correctCount / (el.correctCount + el.mistakesCount)) * 100);
      }
    }
  });
  storage.set('statistic', newStatistis);
};

function showStatistic() {
  statisticOverlay.classList.toggle('statistic__overlay_active');
  deleteChildren(statisticOverlay);
  const clearBtn = create('button', 'button clear__btn', createIcon('delete_forever'), statisticOverlay);
  clearBtn.addEventListener('click', () => {
    storage.del('statistic');
    generateStatistics(categories);
  });
  const category = create('div', 'statistic__category', '', statisticOverlay);
  create(
    'div',
    'statistic__fields',
    [
      create('div', 'statistic__eng', 'Category', ''),
      create('div', 'statistic__eng', 'Word', ''),
      create('div', 'statistic__rus', 'Translate', ''),
      create('div', 'statistic__train', 'Train', ''),
      create('div', 'statistic__mistakes', '-', ''),
      create('div', 'statistic__correct', '+', ''),
      create('div', 'statistic__correct', '%', ''),
    ],
    category,
  );
  statistic.forEach((statisticElement) => {
    create(
      'div',
      'statistic__item',
      [
        create('div', 'statistic__name', `${statisticElement.categoryName}`, ''),
        create('div', 'statistic__eng', `${statisticElement.eng}`, ''),
        create('div', 'statistic__rus', `${statisticElement.rus}`, ''),
        create('div', 'statistic__train', `${statisticElement.trainCount}`, ''),
        create('div', 'statistic__mistakes', `${statisticElement.mistakesCount}`, ''),
        create('div', 'statistic__correct', `${statisticElement.correctCount}`, ''),
        create('div', 'statistic__coef', `${statisticElement.coef}`, ''),
      ],
      category,
    );
  });
}

cardConteiner.onclick = function func(event) {
  const targ = event.target.closest('.card__box_word');

  if (targ) {
    const cardName = targ.getAttribute('data-card-name');
    if (!switchElement.switchBtn.checked) {
      playSound(targ);
      statisticUpdate(cardName);
    }
    if (switchElement.switchBtn.checked && gameBtn.classList.contains('repeat')) {
      if (targ.getAttribute('data-card-name') === gameMode[gameMode.length - 1]) {
        targ.classList.add('game__true');
        gameAnswers.prepend(create('div', 'correct', '', ''));
        statisticUpdate(cardName, 'correct');
        playMessageSound(links.correctSound);
        gameMode.pop();
        playGame();
      } else {
        gameAnswers.prepend(create('div', 'mistake', '', ''));
        statisticUpdate(gameMode[gameMode.length - 1], 'mistake');
        playMessageSound(links.mistakeSound);
        mistakes += 1;
      }
    }
  }
};

gameBtn.addEventListener('click', () => {
  if (gameBtn.classList.contains('play')) {
    playGame();
  }
  if (gameBtn.classList.contains('repeat')) {
    engSound.play();
  }
});

burgerBtn.addEventListener('click', switherMenu);
menu.addEventListener('click', switherMenu);
menuOverlay.addEventListener('click', (e) => {
  if (!e.target.closest('.menu')) {
    switherMenu();
  }
});

infoBtn.addEventListener('click', showStatistic);
statisticOverlay.addEventListener('click', showStatistic);
