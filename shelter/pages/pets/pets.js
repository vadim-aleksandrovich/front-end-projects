let burgerBtn = document.querySelector(".menu_burger_link");
let burgerWindow = document.querySelector(".burger__window");
let burgerLinkActive = document.querySelector(".burger__link_active");
const body = document.querySelector("body");
const header = document.querySelector("header");
burgerBtn.addEventListener("click", function () {
  burgerBtn.classList.toggle("menu_burger_link_active");
  burgerWindow.classList.toggle("burger__window_active");
  body.classList.toggle("overflow-hidden");
});

burgerWindow.addEventListener("click", function (e) {
  if (!e.target.closest(".burger__box")) {
    burgerWindow.classList.toggle("burger__window_active");
    burgerBtn.classList.toggle("menu_burger_link_active");
    body.classList.toggle("overflow-hidden");
  }
});

burgerLinkActive.addEventListener("click", function () {
  burgerWindow.classList.remove("burger__window_active");
  burgerBtn.classList.remove("menu_burger_link_active");
  body.classList.toggle("overflow-hidden");
});
