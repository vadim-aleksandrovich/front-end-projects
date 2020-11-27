import '../sass/style.scss';
import './images';
import create from './utils/create';
import createIcon from './utils/createIcon';
import clear from './utils/clear';
import categories from './categories/categories';

const header = create('header', 'header', create('div', 'wrapper wrapper__header'));
const burgerBtn = create('button', 'burger__btn', createIcon('menu'), header.firstChild);
const main = create('main', 'main', create('div', 'wrapper wrapper__main'));
document.body.prepend(header, main);

const generateCards = function generateCards(cardContent) {
  clear(main.firstChild);
  const { content } = cardContent;
  for (let i = 0; i < content.length; i += 1) {
    const cardBox = create('div', 'card__box', '', main.firstChild);
    const cardFront = create('div', 'card__front', '', cardBox);
    const cardImage = create('img', 'card__image', '', cardFront, ['src', `./assets/icons/${cardContent.title}/${content[i].eng}.png`]);
    const cardWord = create('div', 'card__word', `${content[i].eng}`, cardFront);
    const cardReverse = create('button', 'card__reverse', createIcon('autorenew'), cardBox);
    const cardBack = create('div', 'card__back', '', cardBox);

    const cardSound = create('audio', '', '', cardBox, ['src', `./assets/sounds/${cardContent.title}/${content[i].eng}.mp3`]);
    cardBox.addEventListener('click', () => {
      cardSound.play();
    });

    cardReverse.addEventListener('click', () => {
      cardBack.classList.remove('card__back_rotate');
      // cardBox.classList.add('card__box_reverse');
      // cardWord.textContent = '';
      cardFront.classList.add('card__front_rotate');
      setTimeout(() => {
        cardWord.textContent = content[i].rus;
        cardImage.classList.add('card__image_hide');
      }, 500);
    });
    cardBox.addEventListener('mouseleave', () => {
      cardFront.classList.remove('card__front_rotate');
      cardBack.classList.add('card__back_rotate');
      // cardBox.classList.remove('card__box_reverse');
      setTimeout(() => {
        cardImage.classList.remove('card__image_hide');
        cardWord.textContent = content[i].eng;
      }, 500);
    });
  }
};

const createCards = function createCards() {
  for (let i = 0; i < categories.length; i += 1) {
    const cardBox = create('a', 'card__box', '', main.firstChild, [
      'href',
      `#${categories[i].title}/`,
    ]);

    const cardFront = create('div', 'card__front',
      [create('img', 'card__image', '', '',
        ['src', `./assets/icons/${categories[i].title}/${categories[i].title}.png`]),
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
