import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import pool from './db.js';

const app = express();
const PORT = 80;
const BOT_TOKEN = '7773555430:AAE4zsaCBgy7omL5WpSb4zeDQmntRntZUpk'
const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();

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

app.get('/reg', (req,res)=>{
    res.sendFile('reg.html', options);
});

app.post('/reg', async (req,res)=>{
    const {user, password} = req.body

    const hashedpass = await bcrypt.hash(password, 10);

    const token = jwt.sign({ role: "user", login: user }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    console.log(token);

    const result = await pool.query("INSERT INTO users (name, password, role) VALUES ($1, $2, $3)", [user, hashedpass, "user"]);

    return res.redirect('/protected');
});

app.post('/auth', async (req, res) => {
    const { login, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM Users WHERE name = $1', [login]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).sendFile("error.html", options);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
       //if (password === user.password) {
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
    console.log(token);
    
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                console.log(err);
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

app.get("/telegram", async (req, res) => {
    const userData = req.query;
    const name = userData.first_name
    const keys = Object.keys(userData).filter(k => k !== 'hash').sort();
    const dataCheckString = keys.map(key => `${key}=${userData[key]}`).join('\n');
  
    const hmac = crypto.createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');
  
    if (hmac !== userData.hash) {
      return res.status(403).json({message: "Invalid hash"});
    }
  
    const telegramId = userData.id;
  
    const client = await pool.connect();
    try {
      const existing = await client.query('SELECT * FROM users WHERE telega_id = $1', [telegramId]);
      if (existing.rowCount === 0) {
        await client.query(
          'INSERT INTO users (name, password, role, telega_id) VALUES (\$1, \$2, \$3, \$4)',
          [name, '', "user", telegramId]
        );
      }
      console.log('0')
    const token = jwt.sign(
        {role: "user", login: telegramId},
        secret,
        { expiresIn: '1h' }
    );
    console.log(token);
    res.cookie('token', token, { httpOnly: true });

      res.redirect('/protected');
    } catch (err) {
      console.error(err);
      res.status(500).json({message: "DB error"});
    }
  });
  
  app.listen(3000, () => {
    console.log('Server started on port 3000');
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