window.onload = function(){
    let a = '';
    let b = '';
    let selectedOperation = null;
    let expressionResult = '';

    const outputElement = document.getElementById("result");

    const headerThemeBtn = document.getElementById('header_theme_btn');
    const moonImg = document.querySelector('.moon-bg');
    if (headerThemeBtn) {
        headerThemeBtn.onclick = function() {
            document.body.classList.toggle('alternate-theme');
            if (document.body.classList.contains('alternate-theme')) {
            moonImg.src = 'Moon_rover.png';
            if (headerThemeBtn) headerThemeBtn.textContent = 'ТЕМНАЯ ТЕМА';
        } else {
            moonImg.src = 'Moon.png';
            if (headerThemeBtn) headerThemeBtn.textContent = 'СВЕТЛАЯ ТЕМА';
        }

        };
    }

    const digitButton = document.querySelectorAll('[id^="btn_digit_"]');

function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
        if (a === '' && digit === '000') {
            digit = '0';
        }
        if (a === '0' && (digit === '0' || digit === '000')) return;
        if (a === '0' && digit !== '.') {
            a = (digit === '000') ? '0' : digit;
        }

        if ((digit != '.') || (digit == '.' && !a.includes(digit))) {
            a += digit;
            outputElement.innerHTML = a;
        }
        else if (a === '' && digit === '.') {
            a = '0.';
        }
        else if (digit !== '.' || !a.includes('.')) {
            a += digit;
        }

        outputElement.innerHTML = a;

    } else {
        if ((digit != '.') || (digit == '.' && !b.includes(digit))) {
            b += digit;
            outputElement.innerHTML = b;
        }
    }
}
    digitButton.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = 'x';
    }
    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
    }
    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
    }
    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '/';
    }

    document.getElementById("btn_op_clear").onclick = function() {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        outputElement.innerHTML = '0';
    }

    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation) return;

        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b);
                break;
            case '+':
                expressionResult = (+a) + (+b);
                break;
            case '-':
                expressionResult = (+a) - (+b);
                break;
            case '/':
                expressionResult = (+a) / (+b);
                break;
        }

        a = expressionResult.toString();
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    }

    document.getElementById("btn_op_sign").onclick = function() {
        if (!selectedOperation && a !== ''){
            a = (Number(a)* -1).toString();
            outputElement.innerHTML = a;
        } else if (selectedOperation && b !=='') {
            b = (Number(b)* -1).toString();
            outputElement.innerHTML = b;
        }
    }

    document.getElementById("btn_backspace").onclick = function() {
        if (!selectedOperation && a !== '') {
            a = a.slice(0, -1);
            outputElement.innerHTML = a === '' ? '0' : a;
        } else if (selectedOperation && b !== '') {
            b = b.slice(0, -1);
            outputElement.innerHTML = b === '' ? '0' : b;
        }
    }

    document.getElementById("btn_op_percent").onclick = function() {

        if (!selectedOperation && a !== '') {
            a = (Number(a) / 100).toString();
            outputElement.innerHTML = a;
        }
        else if (selectedOperation && b !== '') {
            b = (Number(b) / 100).toString();
            outputElement.innerHTML = b;
        }
    }

    let memory = 0;

    document.getElementById("btn_000").onclick = function() {
        onDigitButtonClicked('000');
    };

    document.getElementById("btn_sqrt").onclick = function() {
        if (a === '') return;
        a = Math.sqrt(Number(a)).toString();
        outputElement.innerHTML = a;
    };

    document.getElementById("btn_sqr").onclick = function() {
        if (a === '') return;
        a = Math.pow(Number(a), 2).toString();
        outputElement.innerHTML = a;
    };

    function getFactorial(n) {
        if (n < 0) return "Error";
        if (n === 0 || n === 1) return 1;
        let res = 1;
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }
    document.getElementById("btn_fact").onclick = function() {
        if (a === '') return;
        a = getFactorial(Number(a)).toString();
        outputElement.innerHTML = a;
    };

    document.getElementById("btn_inverse").onclick = function() {
        if (a === '' || a === '0') return;
        a = (1 / Number(a)).toString();
        outputElement.innerHTML = a;
    };

    document.getElementById("btn_m_plus").onclick = function() {
        memory += Number(outputElement.innerHTML);
        console.log("M+: В памяти теперь " + memory);
    };

    document.getElementById("btn_m_minus").onclick = function() {
        memory -= Number(outputElement.innerHTML);
        console.log("M-: В памяти теперь " + memory);
    };

    document.getElementById("btn_m_recall").onclick = function() {
        if (!selectedOperation) {
            a = memory.toString();
            outputElement.innerHTML = a;
        } else {
            b = memory.toString();
            outputElement.innerHTML = b;
        }
    };

    document.getElementById("btn_change_color").onclick = function() {
         outputElement.classList.toggle('black-mode');
    };

};
