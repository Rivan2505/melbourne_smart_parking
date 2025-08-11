const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3307,
  password: process.env.DB_PASSWORD || 'your_root_password_here',
  database: process.env.DB_NAME || 'melbourne_smart_parking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    console.log('✅ Database connected successfully!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM parking_spots');
    console.log('✅ Query successful! Parking spots count:', rows[0].count);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
