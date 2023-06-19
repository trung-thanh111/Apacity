//thư viện kiểm lỗi form 
// đối tượng validator
function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorMessage;
        // var errorMessage = getParent(inputElement, '.form-group');
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        // lấy ra từng rules của selector
        var rules = selectorRules[rule.selector];

        // lập qua từng rules và kiểm tra
        // nếu có lỗi dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i].test(inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // thực hiện lặp qua từng rule
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });


            if (isFormValid) {
                // trường hợp submit với javascripi
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                // trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        };
    }


    // lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {
        // lưu lại các rule cho mỗi input
        if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule);
        } else {
            selectorRules[rule.selector] = [rule];
        }

        var inputElement = formElement.querySelector(rule.selector);
        if (inputElement) {
            // xử lý sự kiện blur input
            inputElement.onblur = function () {
                validate(inputElement, rule);
            };

            // xử lý khi người dùng nhập vào input
            inputElement.oninput = function () {
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            };
        }
    });
}


// định nghĩa các rules
// nguyên tắc các rules
// 1. khi có lỗi => trả ra message lỗi
// 2. khi hợp lệ => trả ra undefined
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // kiểm tra người dùng nhập hay chưa
            return value ? undefined : 'Vui lòng nhập trường này';
        },
    };
};

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            // kiểm tra có phải là email không
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là Email';
        },
    };
};

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
        },
    };
};
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';

        }
    };
};