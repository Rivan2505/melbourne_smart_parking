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

async function testPeakHoursQuery() {
  try {
    console.log('Testing peak hours query...');
    
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    console.log('✅ Database connected successfully!');
    
    // Test the exact query from the peak-hours endpoint
    const query = `
      SELECT 
        hour,
        AVG(occupancy_percentage) as avg_occupancy,
        COUNT(*) as data_points,
        CASE 
          WHEN AVG(occupancy_percentage) > 80 THEN 'high'
          WHEN AVG(occupancy_percentage) > 60 THEN 'medium'
          ELSE 'low'
        END as congestion_level
      FROM parking_availability pa
      JOIN parking_spots ps ON pa.parking_spot_id = ps.id
      WHERE pa.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND ps.is_active = TRUE
      GROUP BY HOUR(pa.timestamp)
      ORDER BY hour ASC
    `;
    
    console.log('Executing query...');
    const [rows] = await connection.execute(query);
    
    console.log('✅ Query successful!');
    console.log('Results:', rows);
    console.log('Number of rows:', rows.length);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testPeakHoursQuery();
