// DOM Elements
const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const focus = document.querySelector('.focus');
const buttonBg = document.querySelector('.button__bg');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let now = new Date;
let counterBg = now.getHours();
let timeFlag = now.getHours();
let bgNight = ["url(assets/images/night/01.jpg)", "url(assets/images/night/02.jpg)", "url(assets/images/night/02.jpg)", "url(assets/images/night/03.jpg)", "url(assets/images/night/04.jpg)", "url(assets/images/night/05.jpg)", "url(assets/images/night/06.jpg)", "url(assets/images/night/07.jpg)", "url(assets/images/night/08.jpg)", "url(assets/images/night/09.jpg)", "url(assets/images/night/10.jpg)", "url(assets/images/night/11.jpg)", "url(assets/images/night/12.jpg)", "url(assets/images/night/13.jpg)", "url(assets/images/night/14.jpg)", "url(assets/images/night/15.jpg)" ];
let bgMorning = ["url(assets/images/morning/01.jpg)", "url(assets/images/morning/02.jpg)", "url(assets/images/morning/02.jpg)", "url(assets/images/morning/03.jpg)", "url(assets/images/morning/04.jpg)", "url(assets/images/morning/05.jpg)", "url(assets/images/morning/06.jpg)", "url(assets/images/morning/07.jpg)", "url(assets/images/morning/08.jpg)", "url(assets/images/morning/09.jpg)", "url(assets/images/morning/10.jpg)", "url(assets/images/morning/11.jpg)", "url(assets/images/morning/12.jpg)", "url(assets/images/morning/13.jpg)", "url(assets/images/morning/14.jpg)", "url(assets/images/morning/15.jpg)"];
let bgAfternoon = ["url(assets/images/day/01.jpg)", "url(assets/images/day/02.jpg)", "url(assets/images/day/02.jpg)", "url(assets/images/day/03.jpg)", "url(assets/images/day/04.jpg)", "url(assets/images/day/05.jpg)", "url(assets/images/day/06.jpg)", "url(assets/images/day/07.jpg)", "url(assets/images/day/08.jpg)", "url(assets/images/day/09.jpg)", "url(assets/images/day/10.jpg)", "url(assets/images/day/11.jpg)", "url(assets/images/day/12.jpg)", "url(assets/images/day/13.jpg)", "url(assets/images/day/14.jpg)", "url(assets/images/day/15.jpg)"];
let bgEvening = ["url(assets/images/evening/01.jpg)", "url(assets/images/evening/02.jpg)", "url(assets/images/evening/02.jpg)", "url(assets/images/evening/03.jpg)", "url(assets/images/evening/04.jpg)", "url(assets/images/evening/05.jpg)", "url(assets/images/evening/06.jpg)", "url(assets/images/evening/07.jpg)", "url(assets/images/evening/08.jpg)", "url(assets/images/evening/09.jpg)", "url(assets/images/evening/10.jpg)", "url(assets/images/evening/11.jpg)", "url(assets/images/evening/12.jpg)", "url(assets/images/evening/13.jpg)", "url(assets/images/evening/14.jpg)", "url(assets/images/day/15.jpg)"];

let partOfDay;
let bgNightSort = bgNight.sort(() => Math.random() - 0.5);
let bgMorningSort = bgMorning.sort(() => Math.random() - 0.5);
let bgAfternoonSort = bgAfternoon.sort(() => Math.random() - 0.5);
let bgEveningSort = bgEvening.sort(() => Math.random() - 0.5);

let backgroundArray = [];
for (let i = 0; i < 6; i++) backgroundArray.push(bgNightSort[i]);
for (let i = 0; i < 6; i++) backgroundArray.push(bgMorningSort[i]);
for (let i = 0; i < 6; i++) backgroundArray.push(bgAfternoonSort[i]);
for (let i = 0; i < 6; i++) backgroundArray.push(bgEveningSort[i]);
//(new Image()).src = url1;


// Show Time and Date
showTime = () => {
    let today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    let day = today.getDay();
    let dayNumber = today.getDate();
    let month = today.getMonth();

// Get Date
getWeekDay = (day) => days[day];
getMonth = (month) => months[month];

// Add Zero
addZero = (n) => (parseInt(n, 10) < 10 ? '0' : '') + n;

// Output Time and Date
time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
date.innerHTML = `${getWeekDay(day)}, ${dayNumber} ${getMonth(month)}`;
setTimeout(showTime, 1000);
};

// //? Set Background and Greeting
setBg = () => {
    let today = new Date();
    let hour = today.getHours();
    document.body.style.backgroundImage = backgroundArray[hour];
}

setBgGreet = () => {
    let today = new Date();
    let hour = today.getHours();
    if (hour >= 6 && hour < 12) {
        greeting.textContent = 'Good Morning';
    }
    if (hour >= 12 && hour < 18) {
        greeting.textContent = 'Good Afternoon';
    }
    if (hour >= 18 && hour < 24) {
        greeting.textContent = 'Good Evening';
    }
    if (hour >= 0 && hour < 6) {
        greeting.textContent = 'Good Night';
    }
}

//? Get Name
getName = () => localStorage.getItem('name') === null || localStorage.getItem('name').replace(/\s/g,'') == '' ?
                name.textContent = '[Enter Name]' :
                name.textContent = localStorage.getItem('name');

//? Set Name
setName = (e) => {
    let memoryText = localStorage.getItem('name') || '[Enter Name]';
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            name.textContent.replace(/\s/g,'') == '' ?
            name.textContent = memoryText :
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else {
        name.textContent.replace(/\s/g,'') == '' ?
        name.textContent = memoryText:
        localStorage.setItem('name', e.target.innerText);
      }
};

//? Get Focus
getFocus = () => localStorage.getItem('focus') === null || localStorage.getItem('focus').replace(/\s/g,'') == '' ?
                 focus.textContent = '[Enter Focus]' :
                 focus.textContent = localStorage.getItem('focus');



//? Set focus
setFocus = (e) => {
    let memoryText = localStorage.getItem('focus') || '[Enter Focus]';
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            focus.textContent.replace(/\s/g,'') == '' ?
            focus.textContent = memoryText :
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else {
        focus.textContent.replace(/\s/g,'') == '' ?
        focus.textContent = memoryText:
        localStorage.setItem('focus', e.target.innerText);
      }
};

name.addEventListener ('click', function () {name.textContent = '';});
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener ('click', function () {focus.textContent = '';});
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

buttonBg.addEventListener('click', function () {
    counterBg < 23 ? counterBg +=1 : counterBg = timeFlag;
    document.body.style.backgroundImage = backgroundArray[counterBg];
    buttonBg.disabled = true;
    setTimeout(function() { buttonBg.disabled = false }, 2000);
});

//! Цитата

const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');
const btnQt = document.querySelector('.button__qt');

async function getQuote() {
  const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
  const res = await fetch(url);
  const data = await res.json();
  btnQt.disabled = true;
  blockquote.textContent = data.quoteText;
  figcaption.textContent = data.quoteAuthor;
  btnQt.disabled = true;
  setTimeout(function() { btnQt.disabled = false }, 2000);
}
document.addEventListener('DOMContentLoaded', getQuote);
btnQt.addEventListener('click', getQuote);







//? Run
showTime();
setBg();
setBgGreet();
getName();
getFocus();
