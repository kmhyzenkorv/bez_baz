import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
//import bcrypt from 'bcrypt';
import pool from './db.js';

const app = express();
const PORT = 80;
const secret = "secret";


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//const userData = [
 //   { role: 'admin', login: 'admin', password: 'admin' },
 //   { role: 'staff', login: 'staff', password: 'staff' },
 //   { role: 'user', login: 'user', password: 'user' }
//];
const options = {root: "pages" };

app.get('/', (req, res) => {
    res.sendFile( 'index.html', options);
});

app.post('/auth', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM Users WHERE name = $1', [login]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).sendFile("error.html", options);
        }
        //const passwordMatch = await bcrypt.compare(password, user.password);
        //if (passwordMatch) {
       if (password === user.password) {
        const token = jwt.sign({ role: user.role, login: user.name }, secret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        console.log(token);

            return res.redirect('/protected');
        } else {
            return res.status(401).sendFile("error.html", options);
        }
    } catch (error) {
        console.error("Ошибка аутентификации:", error);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
});

app.get("/protected", (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: "Токен недействителен" });
            }
            //const data = decodedToken;
            const role = decodedToken.role;
            console.log(role);
            if (role === "admin"){
                res.sendFile("admin.html", options);
            }
            else if (role === "staff"){
                res.sendFile("staff.html", options);
            }
            else{
                res.sendFile("user.html", options);
            }
        });
    } else {
        return res.status(401).sendFile("error.html", options);
}
});

app.get("/telegram", (req, res) => {
    const userData = req.query
    const keys = Object.keys(userData).sort();
    const rows = keys
    .map(key=>{
        if (key !== 'hash'){
            return `${key}=${userData[key]}`;
        }
        return null
    })
    .filter((i) => i !== null);
    const rawData = rows.join("\n");
    console.log(rawData);
    const hashSecret = crypto
    .createHash('SHA256')
    .update('') 
    .digest();
    const hash = crypto
    .createHmac('sha256', hashSecret)
    .update(rawData)
    .digest('hex');
    console.log(hash);
    if (hash !== userData.hash) {
    res.status(403).json({message: "Invalid hash"});
}
    res.send("Успешно!").status(403);
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/'); 
});


app.get('/feed', async (req, res) => {
    try {
      const feed = await pool.query('SELECT title, body FROM feedback');
      res.json(feed.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении отзывов' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
}); 