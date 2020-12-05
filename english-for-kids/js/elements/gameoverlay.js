import create from '../utils/create';

export default {
  gameOverlayBox: create('div', 'gameoverlay'),
  gameOverlayImg: create('img', 'gameoverlay__img'),
  gameOverlayMessage: create('p', 'gameoverlay__message'),
  gameOverlayLink: create('a', 'gameoverlay__link', 'Home', '', ['href', '']),
};
