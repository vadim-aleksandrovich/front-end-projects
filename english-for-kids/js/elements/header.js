/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function generateCards(cardData) {
  clear(main.firstChild);
  const { content } = cardData;
  for (let i = 0; i < content.length; i += 1) {
    const cardContainer = create('div', 'card__container', '', main.firstChild);
    const cardFront = create('div', 'card__front', '', cardContainer);
    const cardBack = create(
      'div',
      'card__back',
      create('div', 'card__title', `${content[i].ru}`, ''),
      cardContainer,
    );
    const cardImageContainer = create('div', 'card__image', '', cardFront);
    create('img', 'card__image', '', cardImageContainer, [
      'src',
      `./assets/cards/${content[i].en}.png`,
    ]);
    create('div', 'card__title', `${content[i].en}`, cardFront);
    const cardSound = create('audio', '', '', cardContainer, [
      'src',
      `./assets/sounds/${content[i].en}.mp3`,
    ]);
    const cardLook = create('button', 'btn btn__reverse', createIcon('visibility'), cardFront);

    //! Add Event listener for card rotate
    cardLook.addEventListener('click', () => {
      cardFront.classList.add('card__front_rotate');
      cardBack.classList.add('card__back_rotate');
    });
    cardContainer.addEventListener('mouseleave', () => {
      cardFront.classList.remove('card__front_rotate');
      cardBack.classList.remove('card__back_rotate');
    });
    //! Play Sound
    cardContainer.addEventListener('click', () => {
      cardSound.play();
    });
  }
}
//
.card__container {
  position: relative;
  width: 25rem;
  height: 25rem;
  margin: 1rem;

  .card__front,
  .card__back {
    width: 25rem;
    height: 25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2rem;
    background-color: #82af44;
    background-image: linear-gradient(315deg, #82af44 0%, #6e9737 74%);
    backface-visibility: hidden;
    transition: all 0.5s;
    &:hover {
      box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
    }
  }

  .card__front::before {
    content: '';
    width: 17rem;
    height: 14rem;
    position: absolute;
    border-radius: 2rem;
    top: 1rem;
    left: 2.5rem;
    background-color: whitesmoke;
  }

  .card__back {
    justify-content: center;
    transform: rotateY(180deg);
  }
  .material-icons,
  .card__items {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: #fafafa;
    font-size: 3.2rem;
  }

  .card__title {
    font-size: 3.5rem;
    color: #fafafa;
  }

  .card__image {
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      transition: padding 0.5s;
      padding: 3rem;
      width: 20rem;
      z-index: 2;
    }
  }
  .card__front_rotate {
    transform: rotateY(180deg);
  }
  .card__back_rotate {
    transform: rotateY(360deg);
  }
}