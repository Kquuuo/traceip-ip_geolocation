const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initializeSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      name      TEXT NOT NULL,
      email     TEXT UNIQUE NOT NULL,
      password  TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS search_history (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ip_address TEXT NOT NULL,
      city       TEXT,
      region     TEXT,
      country    TEXT,
      org        TEXT,
      lat        DOUBLE PRECISION,
      lon        DOUBLE PRECISION,
      timezone   TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

initializeSchema().catch(err => {
  console.error('Failed to initialize DB schema:', err.message);
});

async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

module.exports = { query };