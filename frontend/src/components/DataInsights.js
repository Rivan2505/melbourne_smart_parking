// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
// import apiService from '../services/api';
// import './DataInsights.css';

// const DataInsights = () => {
//   const [parkingSummary, setParkingSummary] = useState(null);
//   const [occupancyData, setOccupancyData] = useState([]);
//   const [peakHoursData, setPeakHoursData] = useState([]);
//   const [searchTimeData, setSearchTimeData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch analytics data
//   useEffect(() => {
//     const fetchAnalyticsData = async () => {
//       try {
//         setLoading(true);
//         const [summaryResponse, occupancyResponse, peakHoursResponse, searchTimeResponse] = await Promise.all([
//           apiService.getParkingSummary(),
//           apiService.getOccupancyAnalytics(7),
//           apiService.getPeakHoursAnalysis(),
//           apiService.getSearchTimeAnalytics()
//         ]);

//         if (summaryResponse.success) {
//           setParkingSummary(summaryResponse.data);
//         }

//         if (occupancyResponse.success) {
//           setOccupancyData(occupancyResponse.data);
//         }

//         if (peakHoursResponse.success) {
//           setPeakHoursData(peakHoursResponse.data);
//         }

//         if (searchTimeResponse.success) {
//           setSearchTimeData(searchTimeResponse.data);
//         }
//       } catch (err) {
//         setError('Failed to fetch analytics data');
//         console.error('Error fetching analytics:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalyticsData();
//   }, []);

//   // Colors for charts
//   const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

//   if (loading) {
//     return (
//       <div className="data-insights">
//         <div className="loading">Loading analytics data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="data-insights">
//         <div className="error">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="data-insights">
//       <div className="container">
//         <h1>Data Insights & Analytics</h1>
        
//         {/* Summary Cards */}
//         {parkingSummary && (
//           <div className="summary-cards">
//             <div className="summary-card">
//               <div className="card-icon">🏢</div>
//               <div className="card-content">
//                 <h3>{parkingSummary.total_spots}</h3>
//                 <p>Total Parking Spots</p>
//               </div>
//             </div>
            
//             <div className="summary-card">
//               <div className="card-icon">🚗</div>
//               <div className="card-content">
//                 <h3>{parkingSummary.total_capacity}</h3>
//                 <p>Total Capacity</p>
//               </div>
//             </div>
            
//             <div className="summary-card">
//               <div className="card-icon">📊</div>
//               <div className="card-content">
//                 <h3>{parkingSummary.avg_occupancy ? parseFloat(parkingSummary.avg_occupancy).toFixed(1) : '0.0'}%</h3>
//                 <p>Average Occupancy</p>
//               </div>
//             </div>
            
//             <div className="summary-card">
//               <div className="card-icon">🟢</div>
//               <div className="card-content">
//                 <h3>{parkingSummary.low_occupancy_spots}</h3>
//                 <p>Low Occupancy Spots</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Charts Section */}
//         <div className="charts-section">
//           {/* Occupancy Trends */}
//           <div className="chart-container">
//             <h3>Occupancy Trends (Last 7 Days)</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={occupancyData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis domain={[0, 100]} />
//                 <Tooltip />
//                 <Line 
//                   type="monotone" 
//                   dataKey="avg_occupancy" 
//                   stroke="#8884d8" 
//                   strokeWidth={3}
//                   fill="#8884d8"
//                   fillOpacity={0.3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Peak Hours Analysis */}
//           <div className="chart-container">
//             <h3>Peak Hours Analysis</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={peakHoursData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis domain={[0, 100]} />
//                 <Tooltip />
//                 <Bar dataKey="avg_occupancy" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Search Time Analytics */}
//           <div className="chart-container">
//             <h3>Average Search Time (Last 30 Days)</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={searchTimeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line 
//                   type="monotone" 
//                   dataKey="avg_search_time" 
//                   stroke="#ffc658" 
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Congestion Levels */}
//           <div className="chart-container">
//             <h3>Congestion Levels by Hour</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={peakHoursData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="hour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="avg_occupancy" fill="#ff7300">
//                   {peakHoursData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={entry.congestion_level === 'high' ? '#ff4444' : 
//                             entry.congestion_level === 'medium' ? '#ffaa00' : '#44ff44'} 
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Insights Section */}
//         <div className="insights-section">
//           <h2>Key Insights</h2>
//           <div className="insights-grid">
//             <div className="insight-card">
//               <h4>🚗 Car Ownership Growth</h4>
//               <p>Melbourne's car ownership has increased by 15% since 2020, contributing to CBD congestion and parking challenges.</p>
//             </div>
            
//             <div className="insight-card">
//               <h4>👥 CBD Population Growth</h4>
//               <p>The CBD population has grown by 25% in the last 5 years, increasing demand for parking infrastructure.</p>
//             </div>
            
//             <div className="insight-card">
//               <h4>⏰ Peak Hours</h4>
//               <p>Parking demand peaks between 8-10 AM and 5-7 PM, with 85% average occupancy during these times.</p>
//             </div>
            
//             <div className="insight-card">
//               <h4>🔍 Search Time Impact</h4>
//               <p>Drivers spend an average of 17 hours annually searching for parking, contributing to congestion and emissions.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataInsights;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import apiService from '../services/api';
import './DataInsights.css';

const DataInsights = () => {
  const [parkingSummary, setParkingSummary] = useState(null);
  const [occupancyData, setOccupancyData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [searchTimeData, setSearchTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const [summaryResponse, occupancyResponse, peakHoursResponse, searchTimeResponse] = await Promise.all([
          apiService.getParkingSummary(),
          apiService.getOccupancyAnalytics(7),
          apiService.getPeakHoursAnalysis(),
          apiService.getSearchTimeAnalytics()
        ]);

        if (summaryResponse.success) {
          setParkingSummary(summaryResponse.data);
        }

        if (occupancyResponse.success) {
          setOccupancyData(occupancyResponse.data);
        }

        if (peakHoursResponse.success) {
          setPeakHoursData(peakHoursResponse.data);
        }

        if (searchTimeResponse.success) {
          setSearchTimeData(searchTimeResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
        // Trigger animations after data loads
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Enhanced tooltip formatter
  const formatTooltip = (value, name, props) => {
    if (name === 'avg_occupancy') {
      return [`${value.toFixed(1)}%`, 'Average Occupancy'];
    }
    if (name === 'avg_search_time') {
      return [`${value.toFixed(1)} min`, 'Average Search Time'];
    }
    return [value, name];
  };

  // Custom chart colors
  const chartColors = {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#43e97b',
    warning: '#f39c12',
    danger: '#e74c3c'
  };

  if (loading) {
    return (
      <div className="data-insights">
        <div className="container">
          <div className="loading">Loading analytics data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-insights">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-insights">
      <div className="container">
        {/* Enhanced Page Header */}
        <div className="page-header">
          <h1>Data Insights & Analytics</h1>
          <p>
            Comprehensive analysis of Melbourne CBD parking patterns, usage trends, 
            and environmental impact to optimize urban mobility solutions.
          </p>
        </div>
        
        {/* Enhanced Summary Cards */}
        {parkingSummary && (
          <div className="summary-cards">
            <div className={`summary-card ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="card-icon">🏢</div>
              <div className="card-content">
                <h3>{parkingSummary.total_spots}</h3>
                <p>Total Parking Locations</p>
              </div>
            </div>
            
            <div className={`summary-card ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="card-icon">🚗</div>
              <div className="card-content">
                <h3>{parkingSummary.total_capacity?.toLocaleString()}</h3>
                <p>Total Parking Capacity</p>
              </div>
            </div>
            
            <div className={`summary-card ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>{parkingSummary.avg_occupancy ? parseFloat(parkingSummary.avg_occupancy).toFixed(1) : '0.0'}%</h3>
                <p>Average Occupancy Rate</p>
              </div>
            </div>
            
            <div className={`summary-card ${isVisible ? 'fade-in-up' : ''}`}>
              <div className="card-icon">🟢</div>
              <div className="card-content">
                <h3>{parkingSummary.low_occupancy_spots}</h3>
                <p>Available Green Options</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Charts Section */}
        <div className="charts-section">
          {/* Occupancy Trends */}
          <div className={`chart-container ${isVisible ? 'fade-in-up' : ''}`}>
            <h3>Hourly Occupancy Trends</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={occupancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => `Time: ${value}:00`}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_occupancy" 
                  stroke={chartColors.primary}
                  strokeWidth={3}
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours Analysis */}
          <div className={`chart-container ${isVisible ? 'fade-in-up' : ''}`}>
            <h3>Peak Hours Analysis</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={peakHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => `Time: ${value}:00`}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="avg_occupancy" 
                  radius={[4, 4, 0, 0]}
                >
                  {peakHoursData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.congestion_level === 'high' ? chartColors.danger : 
                            entry.congestion_level === 'medium' ? chartColors.warning : chartColors.success} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Search Time Analytics */}
          <div className={`chart-container ${isVisible ? 'fade-in-up' : ''}`}>
            <h3>Search Time Trends</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={searchTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_search_time" 
                  stroke={chartColors.accent}
                  strokeWidth={3}
                  dot={{ fill: chartColors.accent, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartColors.accent, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Congestion Distribution */}
          <div className={`chart-container ${isVisible ? 'fade-in-up' : ''}`}>
            <h3>Congestion Level Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={peakHoursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e1e8ed" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value.toFixed(1)}%`,
                    'Occupancy Level'
                  ]}
                  labelFormatter={(value) => `Hour: ${value}:00`}
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="avg_occupancy" 
                  radius={[4, 4, 0, 0]}
                  fill={chartColors.secondary}
                >
                  {peakHoursData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.congestion_level === 'high' ? chartColors.danger : 
                            entry.congestion_level === 'medium' ? chartColors.warning : chartColors.success} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Insights Section */}
        <div className={`insights-section ${isVisible ? 'fade-in-up' : ''}`}>
          <h2>Key Insights & Trends</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>🚗 Urban Vehicle Growth</h4>
              <p>Melbourne's vehicle registration has increased by 15% since 2020, putting unprecedented pressure on CBD parking infrastructure and contributing to increased congestion during peak hours.</p>
            </div>
            
            <div className="insight-card">
              <h4>👥 CBD Population Surge</h4>
              <p>The CBD population has expanded by 25% over the past five years, driven by high-density residential developments and commercial growth, significantly increasing parking demand.</p>
            </div>
            
            <div className="insight-card">
              <h4>⏰ Critical Peak Periods</h4>
              <p>Peak parking demand occurs between 8-10 AM and 5-7 PM, with occupancy rates reaching 85%. Off-peak optimization could improve overall efficiency by 30%.</p>
            </div>
            
            <div className="insight-card">
              <h4>🔍 Search Time Economics</h4>
              <p>Drivers spend approximately 17 hours annually searching for parking, resulting in increased fuel consumption, emissions, and economic losses estimated at $2.1 billion citywide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInsights;