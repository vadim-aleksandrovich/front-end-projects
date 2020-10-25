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

const blockquote = document.querySelector('.advice__text');
const btnQt = document.querySelector('.button__qt');

const weatherIcon = document.querySelector('.weather-icon');
const city = document.querySelector('.city');
const temperature = document.querySelector('.temperature');
const weatherHumidity = document.querySelector('.weather-humidity');
const weatherWind = document.querySelector('.weather-wind');
const weatherError = document.querySelector('.weather__error');



let backgroundArray = [];
// Add Zero
addZero = (n) => (parseInt(n, 10) < 10 ? '0' : '') + n;

 // Set Array backgrounds
let BgAssets = ["night", "morning", "day", "evening"];
for (let i = 0; i < 4; i++) {
    tempArr = [];
    while(tempArr.length < 6) {
        let num = Math.round(Math.random() * 20 + 1);
        if (tempArr.indexOf(num) == -1 && num < 20) {
            tempArr.push(num);
            backgroundArray.push(`assets/images/${BgAssets[i]}/${addZero(num)}.jpg`);
        }
    }
}


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



// Output Time and Date
time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
date.innerHTML = `${getWeekDay(day)}, ${dayNumber} ${getMonth(month)}`;
setTimeout(showTime, 1000);
};

// Set Background and Greeting
const img = document.createElement('img');

function viewBgImage(src) {
    buttonBg.disabled = true;
    const body = document.querySelector('body');
    img.src = src;
    img.onload = () => {
        body.style.backgroundImage = `url(${src})`;
         setTimeout(function() { buttonBg.disabled = false }, 1500);
    };
}


setBg = () => {
    counterBg < 23 ? counterBg +=1 : counterBg = 0;
    viewBgImage(backgroundArray[counterBg]);
}

setBgGreet = () => {
    let today = new Date();
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    if ((min == 15) && (sec == 0))  viewBgImage(backgroundArray[hour]);
    if (hour >= 6 && hour < 12) {greeting.textContent = 'Good Morning';}
    if (hour >= 12 && hour < 18) {greeting.textContent = 'Good Afternoon';}
    if (hour >= 18 && hour < 24) {greeting.textContent = 'Good Evening';}
    if (hour >= 0 && hour < 6) {greeting.textContent = 'Good Night';}
    setTimeout(setBgGreet, 1000);
}

// Get Name
getName = () => localStorage.getItem('name') === null || localStorage.getItem('name').replace(/\s/g,'') == '' ?
                name.textContent = '[Enter Name]' :
                name.textContent = localStorage.getItem('name');

// Set Name
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

// Get Focus
getFocus = () => localStorage.getItem('focus') === null || localStorage.getItem('focus').replace(/\s/g,'') == '' ?
                 focus.textContent = '[Enter Focus]' :
                 focus.textContent = localStorage.getItem('focus');



// Set focus
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

// Quote
async function getQuote() {
    btnQt.disabled = true;
    const url = `https://type.fit/api/quotes`;
    const res = await fetch(url);
    const data = await res.json();
    let random = Math.floor(Math.random() * data.length);
    blockquote.textContent = data[random].text;
    setTimeout(function() { btnQt.disabled = false }, 1000);
}



// Weather

async function getWeather() {
    if ((city.textContent !== "[Enter City]") && (city.textContent !== null)) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=424a8b197e07c37b49bc78d046e68544&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if ((data["message"] === "city not found")) {
            weatherError.textContent = "Error, city not found!";
            weatherIcon.style.display = "none";
            temperature.textContent = "";
            weatherHumidity.textContent = "";
            weatherWind.textContent = "";
        } else {
            weatherError.textContent = "";
            weatherIcon.style.display = "flex";
            weatherIcon.className = 'weather-icon owf';
            weatherIcon.classList.add(`owf-${data.weather[0].id}`);
            temperature.textContent = `${data.main.temp}°C`;
            weatherHumidity.textContent = `${data.main.humidity}%`;
            weatherWind.textContent = `${data.wind.speed}m/s`;
            }
    }

    setTimeout(() => {getWeather();}, 600000);
  }

getCity = () => localStorage.getItem('city') === null || localStorage.getItem('city').replace(/\s/g,'') == '' ?
    city.textContent = '[Enter City]' :
    city.textContent = localStorage.getItem('city');

setCity = (e) => {
    let memoryText = localStorage.getItem('city') || '[Enter city]';
    if (e.type === 'keypress') {
        if (e.which == 13 || e.keyCode == 13) {
            if (city.textContent.replace(/\s/g,'') == '') {
                city.textContent = memoryText;
            } else {
                localStorage.setItem('city', e.target.innerText);
                getWeather();
            }
            city.blur();
        }
    } else {
        city.textContent.replace(/\s/g,'') == '' ?
        city.textContent = memoryText:
        localStorage.setItem('city', e.target.innerText);
        }
    };

setInterval(() => {
    if (city.textContent !== "[Enter City]")
    getWeather();
}, 300000);


name.addEventListener ('click', function () {name.textContent = '';});
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener ('click', function () {focus.textContent = '';});
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

buttonBg.addEventListener('click', setBg);

document.addEventListener('DOMContentLoaded', getQuote);
btnQt.addEventListener('click', getQuote);

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener ('click', function () {city.textContent = '';});
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);


// Run
showTime();
setBg();
setBgGreet();
getName();
getFocus();
getCity();

