document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (submitButton && usernameInput && passwordInput) {
        submitButton.addEventListener('click', function() {
            var username = usernameInput.value;
            var password = passwordInput.value;
            
            checkuser(username, password);

            nedoauthorized(usernameInput, passwordInput);
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
    }
    else console.log("умнее чем рыжий кот");
};

function nedoauthorized(usernameInput, passwordInput) {
    let auth_login = ["admin", "user", "guest", "moderator", "admin", "superadmin", "root", "dev"]
    let auth_password = ["admin", "user", "guest", "moderator", "admin", "superadmin", "root", "dev"]
    var user = usernameInput.value;
    var pass = passwordInput.value;
    if (auth_login.includes(user) && auth_password.includes(pass)) {
        console.log("Успешно авторизованы");
    } else {
        console.log("Неправильный логин или пароль");
    }}