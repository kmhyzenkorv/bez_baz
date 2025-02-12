document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submitButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password'); // Новый элемент для пароля

    if (submitButton && usernameInput && passwordInput) {
        submitButton.addEventListener('click', function() {
            var username = usernameInput.value; // Получаем имя пользователя
            var password = passwordInput.value; // Получаем пароль
            
            console.log(username);
            console.log(password); // Выводим пароль в консоль
        });
    } else {
        console.error('Кнопка или поля ввода не найдены.');
    }
});