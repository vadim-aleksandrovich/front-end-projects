import create from '../utils/create';

export default {
  switchBox: create('div', 'switch', ''),
  switchBtn: create('input', 'checkbox', '', '', ['type', 'checkbox'], ['id', 'checkbox']),
  switchLabel: create('label', 'checkbox__label', '', '', ['for', 'checkbox']),
  trainLabel: create('span', 'train', 'Train', ''),
  playLabel: create('span', 'play', 'Game', ''),
};
