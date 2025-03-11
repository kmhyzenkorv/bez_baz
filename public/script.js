document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (submitButton && usernameInput && passwordInput) {
        submitButton.addEventListener('click', function() {
            var username = usernameInput.value;
            var password = passwordInput.value;

            checkuser(username, password);
            authenticateUser(username, password);
        });
    }
});

const background = document.querySelector('.background');
const squaresCount = 644;

for (let i = 0; i < squaresCount; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    background.appendChild(square);
}

function checkuser(usernameValue, passwordValue) {
    if (usernameValue.length === 0 || passwordValue.length === 0) {
        console.log("тупее чем рыжий кот");
    } else {
        console.log("умнее чем рыжий кот");
    }
}

function authenticateUser(username, password) {
    fetch('http://localhost:3000/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Неправильный логин или пароль');
    })
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error(error.message);
    });
}