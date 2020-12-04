/* eslint-disable no-unused-vars */
import '../sass/style.scss';
import './images';
import create from './utils/create';
import createIcon from './utils/createIcon';
import deleteChildren from './utils/deleteChildren';
import categories from './categories/categories';
import links from './nls/links';

const header = create('header', 'header', create('div', 'wrapper wrapper__header'));
const burgerBtn = create('button', 'burger__btn', createIcon('menu'), header.firstChild);
const main = create('main', 'main', '', '');
const wrapperMain = create('div', 'wrapper wrapper__main', '', main);
document.body.prepend(header, main);
const engSound = create('audio', 'card__sound_eng', '', main);

wrapperMain.onclick = function sayWord(event) {
  const targ = event.target.closest('.card__box_word');
  if (targ) {
    const soundSrc = targ.getAttribute('data-sound-src');
    engSound.src = soundSrc;
    engSound.load();
    engSound.play();
  }
};

const generateCards = function generateCards(cardContent) {
  deleteChildren(main.firstChild);
  const { content } = cardContent;
  for (let i = 0; i < content.length; i += 1) {
    const cardBox = create('div', 'card__box card__box_word', '', main.firstChild, ['soundSrc', links.soundSrc(cardContent.title, content[i].eng)]);

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
    const cardBox = create('a', 'card__box', '', main.firstChild, [
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

burgerBtn.addEventListener('click', switherMenu);
menu.addEventListener('click', switherMenu);
