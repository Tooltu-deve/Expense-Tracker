import mysql from 'mysql2/promise';

export async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'expense_tracker'}`
  );
  await connection.end();

  const pool = (await import('./db.js')).default;

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email_verified BOOLEAN DEFAULT FALSE,
      email_verification_token VARCHAR(255),
      email_verification_expires DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Expenses table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      purpose VARCHAR(255) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      expense_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_date (user_id, expense_date)
    )
  `);

  console.log('Database initialized successfully');
}
