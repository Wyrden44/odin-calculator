function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

let operation = {
    a: "",
    b: "",
    operator: "",
    // pointer: where the user is currently typing in (left / right)
    pointer: "left",

    execute() {
        if (this.verify()) {
            let temp = this.runCalculation();
            temp = this.roundExcessive(temp);
            this.reset();
            this.a = temp;
            return true;
        }
        this.reset();
        return false;
    },

    runCalculation() {
        // catch bug: user presses equals after entering an operator but no second number
        if (this.operator && this.b === "") {
            return this.a;
        }

        switch (this.operator) {
            case "+":
                return add(+this.a, +this.b);
            case "-":
                return subtract(+this.a, +this.b);
            case "x":
                return multiply(+this.a, +this.b);
            case "/":
                return divide(+this.a, +this.b);
            default:
                return this.a;
        }
    },

    addNumber(num) {
        // right side of operation
        if (this.operator !== "") {
            // user is starting right side of operation
            this.pointer = "right";
            if (!this.maxSizeReached())
                this.b += num;
        }
        else {
            if (!this.maxSizeReached())
                this.a += num;
        }
    },

    addOperator(operator) {
        if (this.pointer === "left" && operator !== "=") {
            this.operator = operator;
        }
        else {
            // calculate the solution and display it
            if (!this.execute()) {
                this.operator = operator;
                return false;
            }
            this.operator = operator;
        }
        return true;
    },

    verify() {
        if (this.checkDivisionByZero()) return false;
        return true;
    },

    checkDivisionByZero() {
        if (this.b === "0") return true;
        return false;
    },

    reset() {
        this.a = "";
        this.b = "";
        this.operator = "";
        this.pointer = "left";
    },

    roundExcessive(value, max_digits=10) {
        return value.toPrecision(max_digits);
    },

    maxSizeReached() {
        console.log(this.a.length)
        if (this.a.length >= 10 && this.pointer === "left")
            return true;
        if (this.a.length + this.b.length >= 11 && this.pointer === "right")
            return true;
        return false;
    },

    // gui
    getOperationText() {
        return this.a + " " + this.operator + " " + this.b;
    },
}

const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");

numbers.forEach(element => element.addEventListener(
    "click", e => {
        operation.addNumber(element.id);
        console.log(operation);

        updateDisplay();
    }
));

operators.forEach(element => element.addEventListener(
    "click", e => {
        if (operation.addOperator(element.textContent)) {
            updateDisplay();
        }
        else showErrorMessage();
    }
));

equals.addEventListener("click", e => {
    if (operation.execute()) {
        updateDisplay();
    }
    else showErrorMessage();
    
})

// gui functionality
const display = document.querySelector("#text");

function updateDisplay() {
    display.textContent = operation.getOperationText();
}

function showErrorMessage() {
    display.textContent = "Stoopid";
}