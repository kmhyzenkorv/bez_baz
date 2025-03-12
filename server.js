import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

app.use(session({
    secret: 'admin-secret',
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join('public', 'index.html'));
});

app.post('/auth', (req, res) => {
    const { username, password } = req.body;

    const authLogin = ["admin"];
    const authPassword = ["admin"];

    if (authLogin.includes(username) && authPassword.includes(password)) {
        req.session.loggedIn = true;
        req.session.uid = crypto.randomBytes(48).toString('hex');
        console.log(`UID: ${req.session.uid}`);
        console.log(`Logged In: ${req.session.loggedIn}`);
        return res.redirect('/protected');
    } else {
        return res.status(401).json({ message: "Неправильный логин или пароль" });
    }
});

app.get('/protected', (req, res) => {
    if (req.session.loggedIn === true) {
        res.status(200).json({ message: "Доступ разрешен" });
    } else {
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
