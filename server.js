import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());


app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join('public', 'index.html'));
});

app.post('/auth', (req, res) => {
    const { username, password } = req.body;

    const authLogin = ["admin"];
    const authPassword = ["admin"];

    if (authLogin.includes(username) && authPassword.includes(password)) {
        return res.json({ message: "Успешно авторизованы" });
    } else {
        return res.status(401).json({ message: "Неправильный логин или пароль" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
