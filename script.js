class Calculator {

    constructor(previousDisplayElement, currentDisplayElement) {

        this.previousDisplayElement = previousDisplayElement;
        this.currentDisplayElement = currentDisplayElement;

        this.clear();
    }

    clear() {

        this.currentOperand = "";
        this.previousOperand = "";

        this.operation = undefined;

        this.updateDisplay();
    }

    delete() {

        this.currentOperand =
            this.currentOperand.toString().slice(0, -1);

        this.updateDisplay();
    }

    appendNumber(number) {

        if (number === "." &&
            this.currentOperand.includes(".")) {
            return;
        }

        this.currentOperand =
            this.currentOperand.toString() + number;

        this.updateDisplay();
    }

    chooseOperation(operation) {

        if (this.currentOperand === "" &&
            this.previousOperand === "") {
            return;
        }

        if (this.currentOperand === "" &&
            this.previousOperand !== "") {

            this.operation = operation;

            this.updateDisplay();

            return;
        }

        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operation;

        this.previousOperand = this.currentOperand;

        this.currentOperand = "";

        this.updateDisplay();
    }

    compute() {

        const previous = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(previous) || isNaN(current)) {
            return;
        }

        let result;

        switch (this.operation) {

            case "+":
                result = previous + current;
                break;

            case "-":
                result = previous - current;
                break;

            case "*":
                result = previous * current;
                break;

            case "/":

                if (current === 0) {

                    this.currentOperand = "Error";

                    this.previousOperand = "";

                    this.operation = undefined;

                    this.updateDisplay();

                    return;
                }

                result = previous / current;

                break;

            default:
                return;
        }

        this.currentOperand = this.roundResult(result);

        this.previousOperand = "";

        this.operation = undefined;

        this.updateDisplay();
    }

    percentage() {

        if (this.currentOperand === "") {
            return;
        }

        const value = parseFloat(this.currentOperand);

        this.currentOperand = this.roundResult(value / 100);

        this.updateDisplay();
    }

    changeSign() {

        if (this.currentOperand === "" ||
            this.currentOperand === "Error") {
            return;
        }

        this.currentOperand =
            (parseFloat(this.currentOperand) * -1).toString();

        this.updateDisplay();
    }

    roundResult(number) {

        return Math.round((number + Number.EPSILON) * 100000000) /
            100000000;
    }

    formatNumber(number) {

        if (number === "Error") {
            return number;
        }

        const stringNumber = number.toString();

        if (stringNumber.length > 15) {

            return parseFloat(number).toExponential(8);
        }

        return stringNumber;
    }

    updateDisplay() {

        this.currentDisplayElement.innerText =
            this.formatNumber(
                this.currentOperand || "0"
            );

        if (this.operation !== undefined) {

            this.previousDisplayElement.innerText =
                `${this.formatNumber(this.previousOperand)} ${this.getDisplayOperation()}`;

        } else {

            this.previousDisplayElement.innerText = "";
        }
    }

    getDisplayOperation() {

        switch (this.operation) {

            case "*":
                return "×";

            case "/":
                return "÷";

            default:
                return this.operation;
        }
    }
}


const numberButtons =
    document.querySelectorAll("[data-number]");

const operationButtons =
    document.querySelectorAll("[data-operator]");

const actionButtons =
    document.querySelectorAll("[data-action]");

const previousDisplay =
    document.getElementById("previous-display");

const currentDisplay =
    document.getElementById("current-display");


const calculator =
    new Calculator(
        previousDisplay,
        currentDisplay
    );


numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        calculator.appendNumber(
            button.dataset.number
        );

    });

});


operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        calculator.chooseOperation(
            button.dataset.operator
        );

    });

});


actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        switch (action) {

            case "clear":
                calculator.clear();
                break;

            case "delete":
                calculator.delete();
                break;

            case "percentage":
                calculator.percentage();
                break;

            case "sign":
                calculator.changeSign();
                break;

            case "decimal":
                calculator.appendNumber(".");
                break;

            case "equals":
                calculator.compute();
                break;
        }

    });

});


document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        calculator.appendNumber(key);

        return;
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {

        calculator.chooseOperation(key);

        return;
    }

    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculator.compute();

        return;
    }

    if (key === "Backspace") {

        calculator.delete();

        return;
    }

    if (key === "Escape") {

        calculator.clear();

        return;
    }

    if (key === "%") {

        calculator.percentage();
    }

});