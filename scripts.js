let displayValue = '0';
let firstOperand = null;
let secondOperand = null;
let currentOperation = null;
let awaitingNewNumber = true;

const displayElement = document.querySelector('#display');

function updateDisplay() {
    displayElement.textContent = displayValue;
}

function pressNum(num) {
    if (num === '.' && displayValue.includes('.') && !awaitingNewNumber) return;
    if (awaitingNewNumber) {
        if (num === '-') return;
        displayValue = num !== '.' ? num : '0.';
        awaitingNewNumber = false;
    } else {
        if (num === '-') {
            if (displayValue.includes('-')) {
                displayValue = displayValue.replace('-', '');
            } else {
                displayValue = `-${displayValue}`;
            }
        } else {
            displayValue += num;
        }
    }
    updateDisplay();
}

function setOperation(operator) {
    if (currentOperation && !awaitingNewNumber) {
        operate();
    }
    firstOperand = parseFloat(displayValue);
    currentOperation = operator;
    awaitingNewNumber = true; 
}

function verifyDecimals () {
    let array = displayValue.split('.');
    let decimalNumbers = array.length > 1 ? array[1].split('') : ['']; 
    if (decimalNumbers.length > 1) {
        let decNum = Number.parseFloat(displayValue);
        displayValue = decNum.toFixed(2);
    }
}

function operate() {
    if (!currentOperation || awaitingNewNumber) return;
    if (displayValue.includes("Error")) return;
    secondOperand = parseFloat(displayValue);
    if (currentOperation === '/' && secondOperand === 0) {
        displayValue = "Error: Divide by zero";
        updateDisplay();
        return;
    }
    displayValue = performCalculation(firstOperand, secondOperand, currentOperation).toString();
    verifyDecimals();
    updateDisplay();
    firstOperand = parseFloat(displayValue);
    currentOperation = null;
    awaitingNewNumber = true; 
}

function performCalculation(a, b, operation) {
    switch (operation) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: return b;
    }
}

function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    currentOperation = null;
    secondOperand = null;
    awaitingNewNumber = true; 
    updateDisplay();
}

function backspace() {
    let array = displayValue.split('');
    if (array.length == 1 || array.length == 2 && displayValue.includes('-')) {
        displayValue = '0';
        awaitingNewNumber = true;
    } else {
        array.length--;
        displayValue = array.join('');
    }
    updateDisplay();
}

document.addEventListener('keydown', function(e) {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') pressNum(e.key);
    if (e.key === 'Enter' || e.key === '=') operate();
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape' || e.key === 'Delete') clearDisplay();
    if (['+', '-', '*', '/'].includes(e.key)) setOperation(e.key);
});
