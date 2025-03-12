const login = document.getElementById("login").value.trim();
const password = document.getElementById("password").value.trim();
   document.addEventListener("DOMContentLoaded", function () {


        const form = document.querySelector(".form");
    
        form.addEventListener("submit", function (event) {

            
            console.log(`Login: ${login}, Password: ${password}`);
            if (!login) {
                event.preventDefault(); 
                return;
            }
            if (!password) {
                event.preventDefault();
                return;
            }
    
        });
    });
    
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

function checkuser(usernameValue, passwordValue) {
    if (usernameValue.length === 0 || passwordValue.length === 0) {
        console.log("тупее чем рыжий кот");
    } else {
        console.log("умнее чем рыжий кот");
    }
}