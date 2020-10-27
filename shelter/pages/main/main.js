let petsArr = [
  {
    name: "Jennifer",
    img: "../../assets/images/pets-jennifer.png",
    type: "Dog",
    breed: "Labrador",
    description:
      "Jennifer is a sweet 2 months old Labrador that is patiently waiting to find a new forever home. ",
    age: "2 months",
    inoculations: ["none"],
    diseases: ["none"],
    parasites: ["none"],
    id: "0",
  },
  {
    name: "Sophia",
    img: "../../assets/images/pets-sophia.png",
    type: "Dog",
    breed: "Shih tzu",
    description:
      "Sophia here and I'm looking for my forever home to live out the best years of my life. I am full of energy. ",
    age: "1 month",
    inoculations: ["virus"],
    diseases: ["none"],
    parasites: ["none"],
    id: "1",
  },
  {
    name: "Woody",
    img: "../../assets/images/pets-woody.png",
    type: "Dog",
    breed: "Golden Retriever",
    description:
      "Woody is a handsome 3 1/2 year old boy. Woody does know basic commands and is a smart pup. Since he is on the stronger side, he will learn a lot from your training.",
    age: "3 years 6 months",
    inoculations: ["virus"],
    diseases: ["right back"],
    parasites: ["none"],
    id: "2",
  },
  {
    name: "Scarlett",
    img: "../../assets/images/pets-scarlet.png",
    type: "Dog",
    breed: "Jack Russell Terrier",
    description:
      "Scarlett is a happy, playful girl who will make you laugh and smile.",
    age: "3 months",
    inoculations: ["fluen"],
    diseases: ["none"],
    parasites: ["none"],
    id: "3",
  },
  {
    name: "Katrine",
    img: "../../assets/images/pets-katrine.png",
    type: "Cat",
    breed: "British Shorthair",
    description:
      "Katrine is a beautiful girl. She is as soft as the finest velvet with a thick lush fur. Will love you until the last breath she takes as long as you are the one.",
    age: "6 months",
    inoculations: ["penia"],
    diseases: ["none"],
    parasites: ["none"],
    id: "4",
  },
  {
    name: "Timmy",
    img: "../../assets/images/pets-timmy.png",
    type: "Cat",
    breed: "British Shorthair",
    description:
      "Timmy is an adorable grey british shorthair male. He loves to play and snuggle.",
    age: "2 years 3 months",
    inoculations: ["calic"],
    diseases: ["kidney stones"],
    parasites: ["none"],
    id: "5",
  },
  {
    name: "Freddie",
    img: "../../assets/images/pets-freddie.png",
    type: "Cat",
    breed: "British Shorthair",
    description:
      "Freddie is a little shy at first, but very sweet when he warms up.",
    age: "2 months",
    inoculations: ["rabie"],
    diseases: ["none"],
    parasites: ["none"],
    id: "6",
  },
  {
    name: "Charly",
    img: "../../assets/images/pets-charly.png",
    type: "Dog",
    breed: "Jack Russell Terrier",
    description:
      "This cute boy, Charly, is three years old and he likes adults and kids. He isn’t fond of many other dogs, so he might do best in a single dog home.",
    age: "8 years",
    inoculations: ["lepto"],
    diseases: ["deafness"],
    parasites: ["lice", "fleas"],
    id: "7",
  },
];

let arrows = document.querySelectorAll(".slider__arrow");
let slider = document.querySelector(".slider__container");

let cardCreator = (i) => {
  let card = document.createElement("div");
  let image = document.createElement("img");
  let title = document.createElement("p");
  let button = document.createElement("button");

  card.className = "card";
  card.setAttribute("id", i);
  image.className = "card__image";
  title.className = "card__title";
  button.className = "card__button";
  image.src = petsArr[i].img;
  image.alt = petsArr[i].type;
  title.textContent = petsArr[i].name;
  button.textContent = "Learn more";
  button.type = "button";
  card.append(image, title, button);
  slider.prepend(card);
};

const popupCreator = (i) => {
  let popupImage = document.querySelector(".popup__image");
  let popupName = document.querySelector(".popup__name");
  let popupType = document.querySelector(".popup__type");
  let popupDescription = document.querySelector(".popup__description");
  let popupAge = document.querySelector(".popup__item_age");
  let popupInoculations = document.querySelector(".popup__item_inoculations");
  let popupDiseases = document.querySelector(".popup__item_diseases");
  let popupParasites = document.querySelector(".popup__item_parasites");

  popupImage.src = petsArr[i].img;
  popupName.textContent = petsArr[i].name;
  popupType.textContent = petsArr[i].type + " - " + petsArr[i].breed;
  popupDescription.textContent = petsArr[i].description;
  popupAge.innerHTML = "<strong>Age: </strong>" + petsArr[i].age;
  popupInoculations.innerHTML =
    "<strong>Inoculations: </strong>" + petsArr[i].inoculations;
  popupDiseases.innerHTML = "<strong>Diseases: </strong>" + petsArr[i].diseases;
  popupParasites.innerHTML =
    "<strong>Parasites: </strong>" + petsArr[i].parasites;
};

let cardAdder = () => {
  petsArr.sort((a, b) => Math.random() * 2 - 1);
  for (let i = 0; i < 3; i++) {
    cardCreator(i);
  }

  while (slider.children.length > 3) {
    slider.removeChild(slider.lastChild);
  }

  let popup = document.querySelector(".popup__window");
  let cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", function () {
      popupCreator(card.id);
      popup.style.display = "flex";
      body.classList.toggle("overflow-hidden_desktop");
    });
  });

  popup.addEventListener("click", function (e) {
    if (!e.target.closest(".popup__card") || e.target.closest(".popup__btn")) {
      popup.style.display = "none";
      body.classList.toggle("overflow-hidden_desktop");
    }
  });
};

cardAdder();
arrows.forEach((arrow) => arrow.addEventListener("click", cardAdder));

// ! BURGER FUNCTION

const burgerBtn = document.querySelector(".menu_burger_link");
const burgerWindow = document.querySelector(".burger__overlay");
const menu = document.querySelector(".menu");
const burgerLinkActive = document.querySelector(".list__link_active");
const body = document.querySelector("body");

burgerBtn.addEventListener("click", function () {
  burgerBtn.classList.toggle("menu_burger_link_active");
  burgerWindow.classList.toggle("burger__overlay_active");
  menu.classList.toggle("menu_active");
  body.classList.toggle("overflow-hidden");
});

burgerWindow.addEventListener("click", function (e) {
  if (!e.target.closest(".burger__box")) {
  burgerBtn.classList.toggle("menu_burger_link_active");
  burgerWindow.classList.toggle("burger__overlay_active");
  menu.classList.toggle("menu_active");
  body.classList.toggle("overflow-hidden");
  }
});

burgerLinkActive.addEventListener("click", function () {
  burgerBtn.classList.toggle("menu_burger_link_active");
  burgerWindow.classList.toggle("burger__overlay_active");
  menu.classList.toggle("menu_active");
  body.classList.toggle("overflow-hidden");
});
