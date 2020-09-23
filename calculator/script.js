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
    display.value = number;
    MemoryNewNumber = false;
  } else {
    if (display.value === "0") {
      display.value = number;
    } else {
      display.value += number;
    }
  }
};

const operationPress = (op) => {
  let localOperationMemory = display.value;

  if (MemoryNewNumber && MemoryPendingOperation !== "=") {
    display.value = MemoryCurrentNumber;
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
  display.value = Number(MemoryCurrentNumber.toFixed(7));
  MemoryPendingOperation = op;
};

const decimal = (argument) => {
  let localDecimalMemory = display.value;

  if (MemoryNewNumber) {
    localDecimalMemory = "0.";
    MemoryNewNumber = false;
  } else {
    if (localDecimalMemory.indexOf(".") === -1) {
      localDecimalMemory += ".";
    }
  }
  display.value = localDecimalMemory;
};

decimalBtn.addEventListener("click", decimal);

const plusMinus = (argument) => {
  display.value *= -1;
};

plus_minusBtn.addEventListener("click", plusMinus);

const sqrt = (argument) => {
  let localSqrt = display.value;
  display.value < 0
    ? (display.value = "error")
    : (display.value = Math.sqrt(localSqrt));
};

sqrtBtn.addEventListener("click", sqrt);

const clear = (id) => {
  if (id === "CE") {
    display.value = "0";
    MemoryNewNumber = true;
  } else if (id === "C") {
    display.value = "0";
    MemoryNewNumber = true;
    MemoryCurrentNumber = 0;
    MemoryPendingOperation = "";
  }
};
