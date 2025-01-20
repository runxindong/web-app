// 表单验证类
class FormValidator {
    constructor() {
        this.rules = {
            required: (value) => value !== undefined && value !== null && value.toString().trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            minLength: (value, length) => value.length >= length,
            maxLength: (value, length) => value.length <= length,
            numeric: (value) => /^\d+$/.test(value),
            alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value),
            password: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)
        };
    }

    // 添加自定义验证规则
    addRule(name, validator) {
        if (typeof validator !== 'function') {
            throw new Error('Validator must be a function');
        }
        this.rules[name] = validator;
    }

    // 验证单个值
    validate(value, rules) {
        const errors = [];

        for (const [rule, params] of Object.entries(rules)) {
            const validator = this.rules[rule];
            if (!validator) {
                throw new Error(`Unknown validation rule: ${rule}`);
            }

            const isValid = validator(value, params);
            if (!isValid) {
                errors.push({
                    rule,
                    message: this.getErrorMessage(rule, params)
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // 验证表单对象
    validateForm(formData, validationRules) {
        const results = {};
        let isValid = true;

        for (const [field, rules] of Object.entries(validationRules)) {
            const value = formData[field];
            const result = this.validate(value, rules);
            
            results[field] = result;
            if (!result.isValid) {
                isValid = false;
            }
        }

        return {
            isValid,
            results
        };
    }

    // 获取错误消息
    getErrorMessage(rule, params) {
        const messages = {
            required: '此字段为必填项',
            email: '请输入有效的电子邮件地址',
            minLength: `最小长度应为 ${params} 个字符`,
            maxLength: `最大长度应为 ${params} 个字符`,
            numeric: '请只输入数字',
            alphanumeric: '请只输入字母和数字',
            password: '密码必须至少8个字符，包含至少一个字母和一个数字'
        };

        return messages[rule] || '无效的值';
    }
}

// UI 交互代码
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('validationForm');
    const validator = new FormValidator();

    // 显示错误消息
    function showError(input, message) {
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    // 清除错误消息
    function clearError(input) {
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }

    // 验证规则配置
    const validationRules = {
        username: {
            required: true,
            minLength: 3,
            maxLength: 20,
            alphanumeric: true
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

    // 实时验证
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            const field = input.name;
            const value = input.value;
            const rules = validationRules[field];

            if (rules) {
                const result = validator.validate(value, rules);
                if (!result.isValid) {
                    showError(input, result.errors[0].message);
                } else {
                    clearError(input);
                }
            }
        });
    });

    // 表单提交验证
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            username: form.username.value,
            email: form.email.value,
            password: form.password.value
        };

        const result = validator.validateForm(formData, validationRules);

        if (!result.isValid) {
            // 显示所有错误
            Object.entries(result.results).forEach(([field, fieldResult]) => {
                const input = form[field];
                if (!fieldResult.isValid) {
                    showError(input, fieldResult.errors[0].message);
                }
            });
        } else {
            // 表单验证通过，可以提交
            alert('表单验证通过！');
            form.reset();
        }
    });
}); 