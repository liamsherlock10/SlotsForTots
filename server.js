require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001; // Port for the backend
const JWT_SECRET = process.env.JWT_SECRET;
const STARTING_MONEY = 10;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection (settings come from .env)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the users table the first time the server runs
const setupDatabase = () =>
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      money NUMERIC(12, 2) NOT NULL DEFAULT ${STARTING_MONEY},
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

// Postgres sends NUMERIC back as a string, so convert money to a number
const publicUser = (row) => ({
  username: row.username,
  money: Number(row.money),
});

const makeToken = (row) => jwt.sign({ id: row.id }, JWT_SECRET, { expiresIn: '7d' });

// Checks the "Authorization: Bearer <token>" header and sets req.userId
const requireAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again' });
  }
};

// API Endpoints
// Test connection
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Create an account
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== 'string' || !/^[A-Za-z0-9_]{3,20}$/.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 letters, numbers, or underscores' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;',
      [username, passwordHash]
    );
    const user = result.rows[0];
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      // 23505 = unique constraint broken, i.e. the username is taken
      return res.status(409).json({ error: 'That username is taken' });
    }
    console.error(error);
    res.status(500).json({ error: 'Could not create account' });
  }
});

// Log in
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(String(password), user.password_hash))) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not log in' });
  }
});

// Get the logged in user's info
app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1;', [req.userId]);
    if (!result.rows[0]) {
      return res.status(401).json({ error: 'Please log in again' });
    }
    res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load account' });
  }
});

// Place a bet. The coin flip happens here so players can't cheat from the browser.
app.post('/api/bet', requireAuth, async (req, res) => {
  const amount = Math.round(Number(req.body.amount) * 100) / 100;
  if (!(amount > 0)) {
    return res.status(400).json({ error: 'Enter a bet greater than 0!' });
  }
  const won = Math.random() > 0.5;
  const change = won ? amount : -amount;
  try {
    // "money >= amount" makes sure they can afford the bet
    const result = await pool.query(
      'UPDATE users SET money = money + $1 WHERE id = $2 AND money >= $3 RETURNING *;',
      [change, req.userId, amount]
    );
    if (!result.rows[0]) {
      return res.status(400).json({ error: "You can't bet more than you have!" });
    }
    res.json({ won, change, user: publicUser(result.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not place bet' });
  }
});

// Make Money side game: +$1 per click
app.post('/api/earn', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET money = money + 1 WHERE id = $1 RETURNING *;',
      [req.userId]
    );
    res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not add money' });
  }
});

// Start the server once the database is ready
setupDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to the database. Is Postgres running and DATABASE_URL correct?');
    console.error(error.message);
    process.exit(1);
  });
