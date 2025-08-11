const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3307,
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'melbourne_smart_parking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false,
  charset: 'utf8mb4',
  timezone: '+00:00'
};

async function diagnoseDatabase() {
  try {
    const pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    console.log('🔍 DIAGNOSING DATABASE CONTENT...\n');
    
    // Check all tables and their record counts
    const tables = ['parking_spots', 'parking_availability', 'parking_analytics', 'emissions_data'];
    
    for (const table of tables) {
      try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`📊 ${table}: ${rows[0].count} records`);
      } catch (error) {
        console.log(`❌ ${table}: Table doesn't exist or error - ${error.message}`);
      }
    }
    
    console.log('\n🔍 CHECKING ID RANGES...\n');
    
    // Check parking_spots ID range
    try {
      const [spotRows] = await connection.execute(`SELECT MIN(id) as min_id, MAX(id) as max_id FROM parking_spots`);
      console.log(`🅿️  parking_spots IDs: ${spotRows[0].min_id} to ${spotRows[0].max_id}`);
    } catch (error) {
      console.log(`❌ parking_spots ID check failed: ${error.message}`);
    }
    
    // Check parking_availability parking_spot_id range
    try {
      const [availRows] = await connection.execute(`SELECT MIN(parking_spot_id) as min_id, MAX(parking_spot_id) as max_id FROM parking_availability`);
      console.log(`📍 parking_availability parking_spot_ids: ${availRows[0].min_id} to ${availRows[0].max_id}`);
    } catch (error) {
      console.log(`❌ parking_availability ID check failed: ${error.message}`);
    }
    
    // Test foreign key relationship
    try {
      const [joinRows] = await connection.execute(`
        SELECT COUNT(*) as working_joins 
        FROM parking_spots ps 
        JOIN parking_availability pa ON ps.id = pa.parking_spot_id
      `);
      console.log(`🔗 Working foreign key joins: ${joinRows[0].working_joins}`);
    } catch (error) {
      console.log(`❌ Foreign key test failed: ${error.message}`);
    }
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
    process.exit(1);
  }
}

diagnoseDatabase();