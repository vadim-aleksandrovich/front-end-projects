import create from '../utils/create';

export default {
  footer: create('footer', 'footer'),
  wrapper: create('div', 'wrapper wrapper__footer'),
  author: create('a', 'footer__author', '', '', ['href', 'https://github.com/VadimAlexandrovich']),
  githubImg: create('img', 'footer__img github', '', '', ['src', './assets/icons/github.png'], ['alt', 'github']),
  date: create('span', 'footer__date', '2020', ''),
  school: create('a', 'footer__school', '', '', ['href', 'https://rs.school/js/']),
  schoolImg: create('img', 'footer__img school', '', '', ['src', './assets/icons/rs_school.svg'], ['alt', 'RSSchool']),
};
