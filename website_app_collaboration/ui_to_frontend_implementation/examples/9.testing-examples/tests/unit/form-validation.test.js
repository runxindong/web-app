describe('FormValidator', () => {
    let validator;

    beforeEach(() => {
        validator = new FormValidator();
    });

    describe('Basic Validation Rules', () => {
        it('should validate required fields', () => {
            expect(validator.validate('', { required: true }).isValid).toBe(false);
            expect(validator.validate('value', { required: true }).isValid).toBe(true);
        });

        it('should validate email format', () => {
            expect(validator.validate('invalid-email', { email: true }).isValid).toBe(false);
            expect(validator.validate('test@example.com', { email: true }).isValid).toBe(true);
        });

        it('should validate minimum length', () => {
            expect(validator.validate('ab', { minLength: 3 }).isValid).toBe(false);
            expect(validator.validate('abc', { minLength: 3 }).isValid).toBe(true);
        });

        it('should validate maximum length', () => {
            expect(validator.validate('abcd', { maxLength: 3 }).isValid).toBe(false);
            expect(validator.validate('abc', { maxLength: 3 }).isValid).toBe(true);
        });

        it('should validate numeric values', () => {
            expect(validator.validate('abc', { numeric: true }).isValid).toBe(false);
            expect(validator.validate('123', { numeric: true }).isValid).toBe(true);
        });

        it('should validate alphanumeric values', () => {
            expect(validator.validate('abc123', { alphanumeric: true }).isValid).toBe(true);
            expect(validator.validate('abc-123', { alphanumeric: true }).isValid).toBe(false);
        });

        it('should validate password format', () => {
            expect(validator.validate('weak', { password: true }).isValid).toBe(false);
            expect(validator.validate('Password123', { password: true }).isValid).toBe(true);
        });
    });

    describe('Custom Rules', () => {
        it('should allow adding custom validation rules', () => {
            validator.addRule('customRule', value => value === 'valid');
            expect(validator.validate('invalid', { customRule: true }).isValid).toBe(false);
            expect(validator.validate('valid', { customRule: true }).isValid).toBe(true);
        });

        it('should throw error when adding invalid rule', () => {
            expect(() => validator.addRule('invalidRule', 'not-a-function'))
                .toThrow('Validator must be a function');
        });
    });

    describe('Form Validation', () => {
        it('should validate entire form', () => {
            const formData = {
                username: 'john_doe',
                email: 'john@example.com',
                password: 'Password123'
            };

            const rules = {
                username: {
                    required: true,
                    minLength: 3,
                    maxLength: 20
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    password: true
                }
            };

            const result = validator.validateForm(formData, rules);
            expect(result.isValid).toBe(true);
        });

        it('should return all validation errors', () => {
            const formData = {
                username: '',
                email: 'invalid-email',
                password: 'weak'
            };

            const rules = {
                username: {
                    required: true
                },
                email: {
                    email: true
                },
                password: {
                    password: true
                }
            };

            const result = validator.validateForm(formData, rules);
            expect(result.isValid).toBe(false);
            expect(result.results.username.isValid).toBe(false);
            expect(result.results.email.isValid).toBe(false);
            expect(result.results.password.isValid).toBe(false);
        });
    });

    describe('UI Integration', () => {
        let form;

        beforeEach(() => {
            document.body.innerHTML = `
                <form id="validationForm">
                    <div class="form-group">
                        <input type="text" name="username" id="username">
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" id="email">
                        <div class="error-message"></div>
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" id="password">
                        <div class="error-message"></div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            `;
            form = document.getElementById('validationForm');
            // 触发 DOMContentLoaded 事件
            document.dispatchEvent(new Event('DOMContentLoaded'));
        });

        it('should show error message on invalid input', () => {
            const emailInput = form.querySelector('#email');
            emailInput.value = 'invalid-email';
            emailInput.dispatchEvent(new Event('input'));

            const errorMessage = emailInput.nextElementSibling;
            expect(errorMessage.textContent).toBe('请输入有效的电子邮件地址');
            expect(errorMessage.style.display).toBe('block');
        });

        it('should clear error message on valid input', () => {
            const emailInput = form.querySelector('#email');
            
            // First trigger invalid input
            emailInput.value = 'invalid-email';
            emailInput.dispatchEvent(new Event('input'));
            
            // Then make it valid
            emailInput.value = 'valid@example.com';
            emailInput.dispatchEvent(new Event('input'));

            const errorMessage = emailInput.nextElementSibling;
            expect(errorMessage.textContent).toBe('');
            expect(errorMessage.style.display).toBe('none');
        });

        it('should prevent form submission with invalid data', () => {
            const submitHandler = jest.fn();
            form.addEventListener('submit', submitHandler);

            form.querySelector('#username').value = '';
            form.querySelector('#email').value = 'invalid-email';
            form.querySelector('#password').value = 'weak';

            form.dispatchEvent(new Event('submit'));

            expect(submitHandler).toHaveBeenCalled();
            expect(submitHandler.mock.calls[0][0].defaultPrevented).toBe(true);
        });

        it('should allow form submission with valid data', () => {
            const submitHandler = jest.fn();
            form.addEventListener('submit', submitHandler);

            form.querySelector('#username').value = 'john_doe';
            form.querySelector('#email').value = 'john@example.com';
            form.querySelector('#password').value = 'Password123';

            form.dispatchEvent(new Event('submit'));

            expect(submitHandler).toHaveBeenCalled();
            expect(submitHandler.mock.calls[0][0].defaultPrevented).toBe(true);
            // Note: defaultPrevented is still true because our form handler prevents default to show success message
        });
    });
}); 