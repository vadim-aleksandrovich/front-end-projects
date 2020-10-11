const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operator");
const clearBtns = document.querySelectorAll(".clear-btn");
const decimalBtn = document.getElementById("decimal");
const result = document.getElementById("result");
const display = document.getElementById("display");
let MemoryCurrentNumber = 0;
let MemoryNewNumber = false;
let MemoryPendingOperation = "";
let plus_minusBtn = document.getElementById("plus-minus");
let sqrtBtn = document.getElementById("sqrt");

for (let i = 0; i < numbers.length; i++) {
  let number = numbers[i];
  number.addEventListener("click", function (e) {
    numberPress(e.target.textContent);
  });
}

for (let i = 0; i < operations.length; i++) {
  let operationBtn = operations[i];
  operationBtn.addEventListener("click", function (e) {
    operationPress(e.target.textContent);
  });
}

for (let i = 0; i < clearBtns.length; i++) {
  let clearBtn = clearBtns[i];
  clearBtn.addEventListener("click", function (e) {
    clear(e.target.textContent);
  });
}

const numberPress = (number) => {
  if (MemoryNewNumber) {
    display.textContent = number;
    MemoryNewNumber = false;
  } else {
    if (display.textContent === "0") {
      display.textContent = number;
    } else {
      display.textContent += number;
    }
  }
};

const operationPress = (op) => {
  let localOperationMemory = display.textContent;

  if (MemoryNewNumber && MemoryPendingOperation !== "=") {
    display.textContent = MemoryCurrentNumber;
  } else {
    MemoryNewNumber = true;
    switch (MemoryPendingOperation) {
      case "+":
        MemoryCurrentNumber += +localOperationMemory;
        break;
      case "-":
        MemoryCurrentNumber -= +localOperationMemory;
        break;
      case "*":
        MemoryCurrentNumber *= +localOperationMemory;
        break;
      case "/":
        MemoryCurrentNumber /= +localOperationMemory;
        break;
      case "xn":
        MemoryCurrentNumber **= +localOperationMemory;
        break;
      default:
        MemoryCurrentNumber = +localOperationMemory;
    }
  }
  display.textContent = Number(MemoryCurrentNumber.toFixed(7));
  MemoryPendingOperation = op;
};

const decimal = (argument) => {
  let localDecimalMemory = display.textContent;

  if (MemoryNewNumber) {
    localDecimalMemory = "0.";
    MemoryNewNumber = false;
  } else {
    if (localDecimalMemory.indexOf(".") === -1) {
      localDecimalMemory += ".";
    }
  }
  display.textContent = localDecimalMemory;
};

decimalBtn.addEventListener("click", decimal);

const plusMinus = (argument) => {
  display.textContent *= -1;
};

plus_minusBtn.addEventListener("click", plusMinus);

const sqrt = (argument) => {
  let localSqrt = display.textContent;
  display.textContent < 0
    ? (display.textContent = "error")
    : (display.textContent = Math.sqrt(localSqrt));
};

sqrtBtn.addEventListener("click", sqrt);

const clear = (id) => {
  if (id === "CE") {
    display.textContent = "0";
    MemoryNewNumber = true;
  } else if (id === "C") {
    display.textContent = "0";
    MemoryNewNumber = true;
    MemoryCurrentNumber = 0;
    MemoryPendingOperation = "";
  }
};
