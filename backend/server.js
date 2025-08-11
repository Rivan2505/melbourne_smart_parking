// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// require('dotenv').config();

// const app = express(); 
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001','https://melbourne-smart-parking.vercel.app'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(morgan('combined'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database connection
// const mysql = require('mysql2/promise');

// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   port: process.env.DB_PORT || 3307,
//   password: process.env.DB_PASSWORD || 'root',
//   database: process.env.DB_NAME || 'melbourne_smart_parking',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   // Fix for MySQL 8.0+ authentication issues
//   ssl: false,
//   charset: 'utf8mb4',
//   timezone: '+00:00'
// };

// // Create connection pool
// const pool = mysql.createPool(dbConfig);

// // Test database connection
// pool.getConnection()
//   .then(connection => {
//     console.log('✅ Database connected successfully');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('❌ Database connection failed:', err);
//   });

// // Routes
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Melbourne Smart Parking API',
//     version: '1.0.0',
//     status: 'running'
//   });
// });

// // 1. Get all parking spots
// app.get('/api/parking-spots', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT 
//         ps.*,
//         COALESCE(pa.available_spots, ps.total_spots) as available_spots,
//         COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
//         pa.status
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           available_spots,
//           occupancy_percentage,
//           status,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.is_active = TRUE
//       ORDER BY ps.name
//     `);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching parking spots:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 2. Get parking spot by ID
// app.get('/api/parking-spots/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [rows] = await pool.execute(`
//       SELECT 
//         ps.*,
//         COALESCE(pa.available_spots, ps.total_spots) as available_spots,
//         COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
//         pa.status
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           available_spots,
//           occupancy_percentage,
//           status,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.id = ? AND ps.is_active = TRUE
//     `, [id]);
    
//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: 'Parking spot not found' });
//     }
    
//     res.json({ success: true, data: rows[0] });
//   } catch (error) {
//     console.error('Error fetching parking spot:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 3. Get parking spots by area
// app.get('/api/parking-spots/area/:area', async (req, res) => {
//   try {
//     const { area } = req.params;
//     const [rows] = await pool.execute(`
//       SELECT 
//         ps.*,
//         COALESCE(pa.available_spots, ps.total_spots) as available_spots,
//         COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
//         pa.status
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           available_spots,
//           occupancy_percentage,
//           status,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.area_type = ? AND ps.is_active = TRUE
//       ORDER BY ps.name
//     `, [area]);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching parking spots by area:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 4. Get current availability for all spots
// app.get('/api/availability/current', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT 
//         ps.id,
//         ps.name,
//         ps.address,
//         ps.latitude,
//         ps.longitude,
//         pa.available_spots,
//         pa.occupancy_percentage,
//         pa.status,
//         pa.timestamp
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           available_spots,
//           occupancy_percentage,
//           status,
//           timestamp,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.is_active = TRUE
//       ORDER BY ps.name
//     `);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching current availability:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 5. Get analytics data for charts
// app.get('/api/analytics/occupancy', async (req, res) => {
//   try {
//     const { days = 7 } = req.query;
    
//     const [rows] = await pool.execute(`
//       SELECT 
//         DATE(pa.timestamp) as date,
//         HOUR(pa.timestamp) as hour,
//         AVG(pa.occupancy_percentage) as avg_occupancy,
//         COUNT(DISTINCT pa.parking_spot_id) as total_spots
//       FROM parking_availability pa
//       JOIN parking_spots ps ON pa.parking_spot_id = ps.id
//       WHERE pa.timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
//         AND ps.is_active = TRUE
//       GROUP BY DATE(pa.timestamp), HOUR(pa.timestamp)
//       ORDER BY date DESC, hour ASC
//     `, [days]);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching occupancy analytics:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 6. Get emissions data (no user required)
// app.get('/api/emissions/calculate', async (req, res) => {
//   try {
//     const { distance, transportMode } = req.query;
    
//     if (!distance || !transportMode) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Distance and transport mode are required' 
//       });
//     }
    
//     // Emission factors (kg CO2 per km)
//     const emissionFactors = {
//       car: 0.2,
//       public_transport: 0.05,
//       walking: 0,
//       cycling: 0
//     };
    
//     const factor = emissionFactors[transportMode] || 0.2;
//     const emissions = distance * factor;
//     const alternativeEmissions = emissions * 0.3; // 30% of car emissions
    
//     res.json({
//       success: true,
//       data: {
//         distance: parseFloat(distance),
//         transportMode,
//         emissions: parseFloat(emissions.toFixed(2)),
//         alternativeEmissions: parseFloat(alternativeEmissions.toFixed(2)),
//         emissionsSaved: parseFloat((emissions - alternativeEmissions).toFixed(2))
//       }
//     });
//   } catch (error) {
//     console.error('Error calculating emissions:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 7. Get parking search time analytics
// app.get('/api/analytics/search-time', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT 
//         date,
//         AVG(average_search_time) as avg_search_time,
//         COUNT(*) as data_points
//       FROM parking_analytics
//       WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
//       GROUP BY date
//       ORDER BY date DESC
//     `);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching search time analytics:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 8. Get peak hours analysis
// app.get('/api/analytics/peak-hours', async (req, res) => {
//   try {
//     // Query using parking_analytics table
//     const [rows] = await pool.execute(`
//       SELECT 
//         hour,
//         AVG(average_search_time) as avg_occupancy,
//         COUNT(*) as data_points,
//         CASE 
//           WHEN AVG(average_search_time) > 15 THEN 'high'
//           WHEN AVG(average_search_time) > 10 THEN 'medium'
//           ELSE 'low'
//         END as congestion_level
//       FROM parking_analytics pa
//       JOIN parking_spots ps ON pa.parking_spot_id = ps.id
//       WHERE ps.is_active = TRUE
//       GROUP BY hour
//       ORDER BY hour ASC
//     `);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching peak hours analysis:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 9. Get parking spots with low occupancy (green parking options)
// app.get('/api/parking-spots/green-options', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT 
//         ps.*,
//         COALESCE(pa.available_spots, ps.total_spots) as available_spots,
//         COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
//         pa.status
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           available_spots,
//           occupancy_percentage,
//           status,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.is_active = TRUE 
//         AND COALESCE(pa.occupancy_percentage, 0) < 50
//       ORDER BY pa.occupancy_percentage ASC
//       LIMIT 10
//     `);
    
//     res.json({ success: true, data: rows });
//   } catch (error) {
//     console.error('Error fetching green parking options:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // 10. Get parking statistics summary
// app.get('/api/analytics/summary', async (req, res) => {
//   try {
//     const [rows] = await pool.execute(`
//       SELECT 
//         COUNT(DISTINCT ps.id) as total_spots,
//         SUM(ps.total_spots) as total_capacity,
//         AVG(COALESCE(pa.occupancy_percentage, 0)) as avg_occupancy,
//         COUNT(CASE WHEN COALESCE(pa.occupancy_percentage, 0) < 20 THEN 1 END) as low_occupancy_spots,
//         COUNT(CASE WHEN COALESCE(pa.occupancy_percentage, 0) > 80 THEN 1 END) as high_occupancy_spots
//       FROM parking_spots ps
//       LEFT JOIN (
//         SELECT 
//           parking_spot_id,
//           occupancy_percentage,
//           ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
//         FROM parking_availability
//       ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
//       WHERE ps.is_active = TRUE
//     `);
    
//     res.json({ success: true, data: rows[0] });
//   } catch (error) {
//     console.error('Error fetching parking summary:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Something went wrong!' });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Melbourne Smart Parking API running on port ${PORT}`);
//   console.log(`📊 Database: ${dbConfig.database}`);
//   console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
// });





const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express(); 
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://melbourne-smart-parking.vercel.app',
      'https://melbourne-smart-parking-git-main-your-username.vercel.app', // Add your actual Vercel preview URLs
      /^https:\/\/melbourne-smart-parking-.*\.vercel\.app$/ // Pattern for Vercel preview deployments
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly
app.options('*', cors(corsOptions));

// Other middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Disable for API
  contentSecurityPolicy: false     // Disable CSP for API
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add a middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Database connection
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3307,
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'melbourne_smart_parking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  // Fix for MySQL 8.0+ authentication issues
  ssl: {
    rejectUnauthorized: false // For cloud databases
  },
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection with better error handling
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    console.log(`📊 Connected to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database
    });
    return false;
  }
}

// Test connection on startup
testDatabaseConnection();

// Routes with better error handling
app.get('/', (req, res) => {
  res.json({ 
    message: 'Melbourne Smart Parking API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    res.json({
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      cors: 'enabled'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 1. Get all parking spots
app.get('/api/parking-spots', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ps.*,
        COALESCE(pa.available_spots, ps.total_spots) as available_spots,
        COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
        pa.status
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          available_spots,
          occupancy_percentage,
          status,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.is_active = TRUE
      ORDER BY ps.name
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching parking spots:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 2. Get parking spot by ID
app.get('/api/parking-spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        ps.*,
        COALESCE(pa.available_spots, ps.total_spots) as available_spots,
        COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
        pa.status
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          available_spots,
          occupancy_percentage,
          status,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.id = ? AND ps.is_active = TRUE
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Parking spot not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching parking spot:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 3. Get parking spots by area
app.get('/api/parking-spots/area/:area', async (req, res) => {
  try {
    const { area } = req.params;
    const [rows] = await pool.execute(`
      SELECT 
        ps.*,
        COALESCE(pa.available_spots, ps.total_spots) as available_spots,
        COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
        pa.status
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          available_spots,
          occupancy_percentage,
          status,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.area_type = ? AND ps.is_active = TRUE
      ORDER BY ps.name
    `, [area]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching parking spots by area:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 4. Get current availability for all spots
app.get('/api/availability/current', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ps.id,
        ps.name,
        ps.address,
        ps.latitude,
        ps.longitude,
        pa.available_spots,
        pa.occupancy_percentage,
        pa.status,
        pa.timestamp
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          available_spots,
          occupancy_percentage,
          status,
          timestamp,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.is_active = TRUE
      ORDER BY ps.name
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching current availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 5. Get analytics data for charts
app.get('/api/analytics/occupancy', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const [rows] = await pool.execute(`
      SELECT 
        DATE(pa.timestamp) as date,
        HOUR(pa.timestamp) as hour,
        AVG(pa.occupancy_percentage) as avg_occupancy,
        COUNT(DISTINCT pa.parking_spot_id) as total_spots
      FROM parking_availability pa
      JOIN parking_spots ps ON pa.parking_spot_id = ps.id
      WHERE pa.timestamp >= DATE_SUB(NOW(), INTERVAL ? DAY)
        AND ps.is_active = TRUE
      GROUP BY DATE(pa.timestamp), HOUR(pa.timestamp)
      ORDER BY date DESC, hour ASC
    `, [days]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching occupancy analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 6. Get emissions data (no user required)
app.get('/api/emissions/calculate', async (req, res) => {
  try {
    const { distance, transportMode } = req.query;
    
    if (!distance || !transportMode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Distance and transport mode are required' 
      });
    }
    
    // Emission factors (kg CO2 per km)
    const emissionFactors = {
      car: 0.2,
      public_transport: 0.05,
      walking: 0,
      cycling: 0
    };
    
    const factor = emissionFactors[transportMode] || 0.2;
    const emissions = distance * factor;
    const alternativeEmissions = emissions * 0.3; // 30% of car emissions
    
    res.json({
      success: true,
      data: {
        distance: parseFloat(distance),
        transportMode,
        emissions: parseFloat(emissions.toFixed(2)),
        alternativeEmissions: parseFloat(alternativeEmissions.toFixed(2)),
        emissionsSaved: parseFloat((emissions - alternativeEmissions).toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error calculating emissions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 7. Get parking search time analytics
app.get('/api/analytics/search-time', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        date,
        AVG(average_search_time) as avg_search_time,
        COUNT(*) as data_points
      FROM parking_analytics
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY date
      ORDER BY date DESC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching search time analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 8. Get peak hours analysis
app.get('/api/analytics/peak-hours', async (req, res) => {
  try {
    // Query using parking_analytics table
    const [rows] = await pool.execute(`
      SELECT 
        hour,
        AVG(average_search_time) as avg_occupancy,
        COUNT(*) as data_points,
        CASE 
          WHEN AVG(average_search_time) > 15 THEN 'high'
          WHEN AVG(average_search_time) > 10 THEN 'medium'
          ELSE 'low'
        END as congestion_level
      FROM parking_analytics pa
      JOIN parking_spots ps ON pa.parking_spot_id = ps.id
      WHERE ps.is_active = TRUE
      GROUP BY hour
      ORDER BY hour ASC
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching peak hours analysis:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 9. Get parking spots with low occupancy (green parking options)
app.get('/api/parking-spots/green-options', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        ps.*,
        COALESCE(pa.available_spots, ps.total_spots) as available_spots,
        COALESCE(pa.occupancy_percentage, 0) as occupancy_percentage,
        pa.status
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          available_spots,
          occupancy_percentage,
          status,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.is_active = TRUE 
        AND COALESCE(pa.occupancy_percentage, 0) < 50
      ORDER BY pa.occupancy_percentage ASC
      LIMIT 10
    `);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching green parking options:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 10. Get parking statistics summary
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT ps.id) as total_spots,
        SUM(ps.total_spots) as total_capacity,
        AVG(COALESCE(pa.occupancy_percentage, 0)) as avg_occupancy,
        COUNT(CASE WHEN COALESCE(pa.occupancy_percentage, 0) < 20 THEN 1 END) as low_occupancy_spots,
        COUNT(CASE WHEN COALESCE(pa.occupancy_percentage, 0) > 80 THEN 1 END) as high_occupancy_spots
      FROM parking_spots ps
      LEFT JOIN (
        SELECT 
          parking_spot_id,
          occupancy_percentage,
          ROW_NUMBER() OVER (PARTITION BY parking_spot_id ORDER BY timestamp DESC) as rn
        FROM parking_availability
      ) pa ON ps.id = pa.parking_spot_id AND pa.rn = 1
      WHERE ps.is_active = TRUE
    `);
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching parking summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy violation',
      origin: req.get('Origin')
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/parking-spots',
      'GET /api/parking-spots/:id',
      'GET /api/parking-spots/area/:area',
      'GET /api/availability/current',
      'GET /api/analytics/occupancy',
      'GET /api/emissions/calculate',
      'GET /api/analytics/search-time',
      'GET /api/analytics/peak-hours',
      'GET /api/parking-spots/green-options',
      'GET /api/analytics/summary'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Melbourne Smart Parking API running on port ${PORT}`);
  console.log(`📊 Database: ${dbConfig.database} at ${dbConfig.host}:${dbConfig.port}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS enabled for multiple origins`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await pool.end();
  process.exit(0);
});