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
    // temporary solution
    solution: "",

    execute(continueOperation=false) {
        if (this.verify()) {
            let temp = this.runCalculation();
            temp = this.roundExcessive(temp);
            this.reset();
            this.solution = temp;
            showSolution(this.solution);
            if (continueOperation) {
                this.a = temp;
            }
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
            case "*":
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
            if (this.a === "" && this.solution !== "") {
                this.a = this.solution;
            }
            this.operator = operator;
        }
        else {
            // calculate the solution and display it
            if (!this.execute(true)) {
                return false;
            }
            this.operator = operator;
        }
        return true;
    },

    addDecimal() {
        if (this.pointer === "left") {
            if (this.a.indexOf(".") === -1) {
                this.a = (this.a === "") ? "0." : this.a + ".";
            }
        }
        else {
            if (this.b.indexOf(".") === -1) {
                this.b = (this.b === "") ? "0." : this.b + ".";
            }
        }
    },

    verify() {
        if (this.checkDivisionByZero()) return false;
        if (!this.checkNumber()) return false;
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
        this.solution = "";
    },

    roundExcessive(value, max_digits=10) {
        if (value.toString().length > 10) {
            return value.toPrecision(+max_digits);
        }
        return value;
    },

    maxSizeReached() {
        if (this.a.length >= 10 && this.pointer === "left")
            return true;
        if (this.b.length >= 10 && this.pointer === "right")
            return true;
        return false;
    },

    checkNumber() {
        return (!isNaN(this.a) && !isNaN(this.b));
    },

    deleteLast() {
        if (this.pointer === "right") {
            this.b = (this.b.length > 0) ? this.b.slice(0, this.b.length-1) : this.b;
        }
        else if (this.pointer === "left" && this.operator === "") {
            this.a = (this.a.length > 0) ? this.a.slice(0, this.a.length-1) : this.a;
        }
    },

    // gui
    getOperationText() {
        return this.a + " " + this.operator + " " + this.b;
    },
}

const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");
const delete_btn = document.querySelector("#delete");
const ac_btn = document.querySelector("#ac");
const dot = document.querySelector("#dot");

numbers.forEach(element => element.addEventListener(
    "click", e => {
        operation.addNumber(element.id);
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
    if (!operation.execute())
        showErrorMessage();
});

dot.addEventListener("click", e => {
    operation.addDecimal();
    updateDisplay();
});

ac_btn.addEventListener("click", e => {
    operation.reset();
    updateDisplay();
});

delete_btn.addEventListener("click", e => {
    operation.deleteLast();
    updateDisplay();
});

// keyboard support
document.addEventListener("keypress", e => {
    console.log(e.key);
    if (!isNaN(e.key)) {
        operation.addNumber(e.key);
    }
    else if (["*", "/", "+", "-"].includes(e.key)) {
        if (!operation.addOperator(e.key))
            showErrorMessage();
    }
    else if (e.key === "." || e.key === ",") {
        operation.addDecimal();
    }
    updateDisplay();
    if (e.key === "=" || e.key === "Enter" || e.key === "Return") {
        if (!operation.execute())
            showErrorMessage();
    }
})

// gui functionality
const display = document.querySelector("#text");

function updateDisplay() {
    display.textContent = operation.getOperationText();
}

function showSolution(solution) {
    display.textContent = solution;
}

function showErrorMessage() {
    display.textContent = "Stoopid";
}