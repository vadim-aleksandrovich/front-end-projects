import * as storage from './storage';

export default (categories) => {
  let statistic = [];
  if (!storage.get('statistic')) {
    categories.forEach((category) => {
      const elements = category.content;
      elements.forEach((element) => {
        const statisticItem = {
          categoryName: category.title,
          trainCount: 0,
          correctCount: 0,
          mistakesCount: 0,
          eng: element.eng,
          rus: element.rus,
          coef: 0,
        };
        statistic.push(statisticItem);
      });
    });
    return statistic;
  }
  statistic = storage.get('statistic');
  return statistic;
};
