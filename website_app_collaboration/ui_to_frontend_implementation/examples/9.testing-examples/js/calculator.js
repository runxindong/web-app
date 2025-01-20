// 计算器类
class Calculator {
    constructor() {
        this.currentValue = 0;
        this.memory = [];
    }

    // 加法运算
    add(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue += value;
        this.memory.push({ operation: 'add', value });
        return this.currentValue;
    }

    // 减法运算
    subtract(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue -= value;
        this.memory.push({ operation: 'subtract', value });
        return this.currentValue;
    }

    // 乘法运算
    multiply(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        this.currentValue *= value;
        this.memory.push({ operation: 'multiply', value });
        return this.currentValue;
    }

    // 除法运算
    divide(value) {
        if (typeof value !== 'number') {
            throw new Error('Invalid input: value must be a number');
        }
        if (value === 0) {
            throw new Error('Division by zero is not allowed');
        }
        this.currentValue /= value;
        this.memory.push({ operation: 'divide', value });
        return this.currentValue;
    }

    // 清除当前值
    clear() {
        this.currentValue = 0;
        this.memory = [];
        return this.currentValue;
    }

    // 获取运算历史
    getHistory() {
        return this.memory;
    }
}

// UI 交互代码
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    const display = document.getElementById('display');
    const keypad = document.querySelector('.keypad');
    let currentInput = '';
    let lastOperation = null;

    // 更新显示
    function updateDisplay(value) {
        display.value = value;
    }

    // 处理数字输入
    function handleNumber(num) {
        currentInput += num;
        updateDisplay(currentInput);
    }

    // 处理操作符
    function handleOperator(operator) {
        if (currentInput === '') return;
        
        const value = parseFloat(currentInput);
        if (lastOperation) {
            calculator[lastOperation](value);
        } else {
            calculator.clear();
            calculator.add(value);
        }
        
        lastOperation = operator;
        currentInput = '';
        updateDisplay(calculator.currentValue);
    }

    // 按钮点击事件
    keypad.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const value = e.target.dataset.value;

        if ('0123456789.'.includes(value)) {
            handleNumber(value);
        } else if ('+-*/'.includes(value)) {
            handleOperator({
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide'
            }[value]);
        } else if (value === '=') {
            if (currentInput && lastOperation) {
                handleOperator(lastOperation);
                lastOperation = null;
            }
        } else if (value === 'C') {
            calculator.clear();
            currentInput = '';
            lastOperation = null;
            updateDisplay('0');
        }
    });
}); 