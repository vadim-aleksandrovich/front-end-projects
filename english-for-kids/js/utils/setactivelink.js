export default (clickedCategory) => {
  const category = clickedCategory;
  const element = document.querySelector(`[data-category="${category}"]`);
  const mainMenu = document.querySelector('.menu__item_main');
  mainMenu.classList.remove('menu__item_active');
  element.classList.add('menu__item_active');
};
