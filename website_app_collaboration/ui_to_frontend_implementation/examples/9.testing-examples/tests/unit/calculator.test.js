describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('Basic Operations', () => {
        it('should add numbers correctly', () => {
            expect(calculator.add(5)).toBe(5);
            expect(calculator.add(3)).toBe(8);
        });

        it('should subtract numbers correctly', () => {
            calculator.add(10);
            expect(calculator.subtract(4)).toBe(6);
            expect(calculator.subtract(2)).toBe(4);
        });

        it('should multiply numbers correctly', () => {
            calculator.add(4);
            expect(calculator.multiply(3)).toBe(12);
            expect(calculator.multiply(2)).toBe(24);
        });

        it('should divide numbers correctly', () => {
            calculator.add(12);
            expect(calculator.divide(3)).toBe(4);
            expect(calculator.divide(2)).toBe(2);
        });
    });

    describe('Error Handling', () => {
        it('should throw error for non-numeric input', () => {
            expect(() => calculator.add('5')).toThrow('Invalid input: value must be a number');
            expect(() => calculator.subtract('3')).toThrow('Invalid input: value must be a number');
            expect(() => calculator.multiply('2')).toThrow('Invalid input: value must be a number');
            expect(() => calculator.divide('2')).toThrow('Invalid input: value must be a number');
        });

        it('should throw error for division by zero', () => {
            calculator.add(10);
            expect(() => calculator.divide(0)).toThrow('Division by zero is not allowed');
        });
    });

    describe('Memory and History', () => {
        it('should clear calculator state', () => {
            calculator.add(5);
            calculator.multiply(2);
            expect(calculator.clear()).toBe(0);
            expect(calculator.getHistory()).toEqual([]);
        });

        it('should maintain operation history', () => {
            calculator.add(5);
            calculator.multiply(2);
            calculator.subtract(3);
            const history = calculator.getHistory();
            expect(history).toEqual([
                { operation: 'add', value: 5 },
                { operation: 'multiply', value: 2 },
                { operation: 'subtract', value: 3 }
            ]);
        });
    });

    describe('UI Integration', () => {
        let display;
        let keypad;

        beforeEach(() => {
            document.body.innerHTML = `
                <div class="calculator">
                    <input type="text" id="display" readonly>
                    <div class="keypad">
                        <button data-value="1">1</button>
                        <button data-value="+">+</button>
                        <button data-value="=">=</button>
                        <button data-value="C">C</button>
                    </div>
                </div>
            `;
            display = document.getElementById('display');
            keypad = document.querySelector('.keypad');
            // 触发 DOMContentLoaded 事件
            document.dispatchEvent(new Event('DOMContentLoaded'));
        });

        it('should update display when number is clicked', () => {
            const button = document.querySelector('[data-value="1"]');
            button.click();
            expect(display.value).toBe('1');
        });

        it('should perform calculation when operator is used', () => {
            const numButton = document.querySelector('[data-value="1"]');
            const plusButton = document.querySelector('[data-value="+"]');
            const equalsButton = document.querySelector('[data-value="="]');

            numButton.click();
            plusButton.click();
            numButton.click();
            equalsButton.click();

            expect(display.value).toBe('2');
        });

        it('should clear display when C is clicked', () => {
            const numButton = document.querySelector('[data-value="1"]');
            const clearButton = document.querySelector('[data-value="C"]');

            numButton.click();
            clearButton.click();

            expect(display.value).toBe('0');
        });
    });
}); 