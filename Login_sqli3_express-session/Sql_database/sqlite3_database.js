const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// you can choose file name, maybe in /db/data.sqlite
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to db', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Create users table if not exists
const createTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`;
db.run(createTableSql, (err) => {
  if (err) {
    console.error('Could not create users table', err.message);
  } else {
    console.log('Users table ready');
  }
});

module.exports = db;
