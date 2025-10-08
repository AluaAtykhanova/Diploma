//bot/db.js
const Pool = require("pg").Pool;
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const initializeDB = async () => {
  try {
    const result = await pool.query("SELECT NOW()"); // Тестовый запрос
    console.log("Connected to PostgreSQL:", result.rows[0].now);
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1); // Прерываем выполнение, если подключение не удалось
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = { pool, initializeDB, query };
