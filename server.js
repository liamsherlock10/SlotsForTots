const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5001; // Port for the backend

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',         // Replace with your PostgreSQL username
  host: 'localhost',        // Database host
  database: 'testdb',       // Replace with your database name
  password: 'yourpassword', // Replace with your PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});

// API Endpoints
// Test connection
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Get all users from the database (example)
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users;');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Add a new user (example)
app.post('/users', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *;',
      [username]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
