import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'admin-secret',
    saveUninitialized: true,
    cookie: { httpOnly: true }
}));

const options = {root: "public" };

app.get('/', (req, res) => {
    res.sendFile( 'index.html', options);
});

app.post('/auth', (req, res) => {
    const { login, password } = req.body;
    console.log(login, password);
    const authLogin = ["admin"];
    const authPassword = ["admin"];

    if (authLogin.includes(login) && authPassword.includes(password)) {
        req.session.loggedIn = true;
        req.session.uid = crypto.randomBytes(48).toString('hex');
        console.log(`UID: ${req.session.uid}`);
        console.log(`Logged In: ${req.session.loggedIn}`);
        return res.redirect('/protected');
    } else {
        return res.status(401).json({ message: "Неправильный логин или пароль" });
    }
});

app.get("/protected", (req, res) => {
    if (!req.session.loggedIn) {
        return res.status(402).json({ message: "Неавторизованный доступ" });
    }
    res.sendFile("protected.html", options);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
