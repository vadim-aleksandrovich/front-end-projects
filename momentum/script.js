// DOM Elements
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const focus = document.querySelector(".focus");

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
addZero = (n) => (parseInt(n, 10) < 10 ? "0" : "") + n;

// Output Time and Date
time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
date.innerHTML = `${getWeekDay(day)}<span>, </span> ${dayNumber} ${getMonth(month)}`;
setTimeout(showTime, 1000); //1000
};

//? Set Background and Greeting
setBgGreet = () => {
    let today = new Date();
    let hour = today.getHours();

    if (hour >= 6 && hour < 12) {
        document.body.style.backgroundImage = "url('../assets/images/morning/01.jpg')";
        greeting.textContent = "Good Morning";
    }
    if (hour >= 12 && hour < 18) {
        document.body.style.backgroundImage = "url('../assets/images/day/01.jpg')";
        greeting.textContent = "Good Afternoon";
    }
    if (hour >= 18 && hour < 24) {
        document.body.style.backgroundImage = "url('../assets/images/evening/01.jpg')";
        greeting.textContent = "Good Evening";
    }
    if (hour > 0 && hour < 6) {
        document.body.style.backgroundImage = "url('../assets/images/evening/01.jpg')";
        greeting.textContent = "Good Night";
        document.body.style.color = "white";
    }
}

//? Get Name
getName = () => localStorage.getItem("name").replace(/\s/g,"") == "" ?
                name.textContent = "[Enter Name]" :
                name.textContent = localStorage.getItem("name");

//? Set Name
setName = (e) => {
    let memoryText = localStorage.getItem("name");
    if (e.type === "keypress") {
        if (e.which == 13 || e.keyCode == 13) {
            name.textContent.replace(/\s/g,"") == "" ?
            name.textContent = memoryText :
            localStorage.setItem("name", e.target.innerText);
            name.blur();
        }
    } else {
      name.textContent = memoryText;
      }
};

//? Get Focus
getFocus = () => localStorage.getItem("focus").replace(/\s/g,"") == "" ?
                focus.textContent = "[Enter Name]" :
                focus.textContent = localStorage.getItem("focus");



//? Set focus
setFocus = (e) => {
    let memoryText = localStorage.getItem("focus");
    if (e.type === "keypress") {
        if (e.which == 13 || e.keyCode == 13) {
            focus.textContent.replace(/\s/g,"") == "" ?
            focus.textContent = memoryText :
            localStorage.setItem("focus", e.target.innerText);
            focus.blur();
        }
    } else {
      focus.textContent = memoryText;
      }
};

name.addEventListener ('click', function () {name.textContent = '';});
name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);

focus.addEventListener ('click', function () {focus.textContent = '';});
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

//? Run
showTime();
setBgGreet();
getName();
getFocus();
