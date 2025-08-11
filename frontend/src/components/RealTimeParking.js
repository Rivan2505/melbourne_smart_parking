// import React, { useState, useEffect } from 'react';
// import apiService from '../services/api';
// import './RealTimeParking.css';

// const RealTimeParking = () => {
//   const [parkingSpots, setParkingSpots] = useState([]);
//   const [currentAvailability, setCurrentAvailability] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedArea, setSelectedArea] = useState('all');

//   // Fetch parking spots and availability data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const [spotsResponse, availabilityResponse] = await Promise.all([
//           apiService.getParkingSpots(),
//           apiService.getCurrentAvailability()
//         ]);

//         if (spotsResponse.success) {
//           setParkingSpots(spotsResponse.data);
//         }

//         if (availabilityResponse.success) {
//           setCurrentAvailability(availabilityResponse.data);
//         }
//       } catch (err) {
//         setError('Failed to fetch parking data');
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter parking spots based on search and area
//   const filteredSpots = parkingSpots.filter(spot => {
//     const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          spot.address.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesArea = selectedArea === 'all' || spot.area_type === selectedArea;
//     return matchesSearch && matchesArea;
//   });

//   // Get availability for a specific spot
//   const getAvailability = (spotId) => {
//     const availability = currentAvailability.find(av => av.id === spotId);
//     const spot = parkingSpots.find(s => s.id === spotId);
//     return availability || { available_spots: spot?.total_spots || 0, occupancy_percentage: 0 };
//   };

//   // Get status color based on occupancy
//   const getStatusColor = (occupancyPercentage) => {
//     if (occupancyPercentage >= 80) return '#ff4444';
//     if (occupancyPercentage >= 60) return '#ffaa00';
//     return '#44ff44';
//   };

//   if (loading) {
//     return (
//       <div className="real-time-parking">
//         <div className="loading">Loading parking data...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="real-time-parking">
//         <div className="error">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="real-time-parking">
//       <div className="container">
//         <h1>Real-Time Parking Availability</h1>
        
//         {/* Search and Filter Section */}
//         <div className="search-filter-section">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search parking spots..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div className="area-filter">
//             <select 
//               value={selectedArea} 
//               onChange={(e) => setSelectedArea(e.target.value)}
//             >
//               <option value="all">All Areas</option>
//               <option value="CBD">CBD</option>
//               <option value="Southbank">Southbank</option>
//               <option value="Docklands">Docklands</option>
//             </select>
//           </div>
//         </div>

//         {/* Parking Spots Grid */}
//         <div className="parking-grid">
//           {filteredSpots.map((spot) => {
//             const availability = getAvailability(spot.id);
//             const statusColor = getStatusColor(availability.occupancy_percentage);
            
//             return (
//               <div key={spot.id} className="parking-card">
//                 <div className="parking-header">
//                   <h3>{spot.name}</h3>
//                   <span className="area-tag">{spot.area_type}</span>
//                 </div>
                
//                 <div className="parking-details">
//                   <p className="address">{spot.address}</p>
//                   <div className="availability-info">
//                     <div className="availability-bar">
//                       <div 
//                         className="availability-fill"
//                         style={{ 
//                           width: `${availability.occupancy_percentage}%`,
//                           backgroundColor: statusColor
//                         }}
//                       ></div>
//                     </div>
//                     <div className="availability-stats">
//                       <span className="available-spots">
//                         {availability.available_spots} spots available
//                       </span>
//                       <span className="occupancy">
//                         {availability.occupancy_percentage}% occupied
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="parking-meta">
//                     <span className="total-spots">Total: {spot.total_spots} spots</span>
//                     <span className="hourly-rate">${spot.hourly_rate}/hour</span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {filteredSpots.length === 0 && (
//           <div className="no-results">
//             <p>No parking spots found matching your criteria.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RealTimeParking;






import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './RealTimeParking.css';

const RealTimeParking = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [currentAvailability, setCurrentAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Limited area options for better UX
  const areaOptions = [
    { value: 'all', label: 'All Areas', icon: '🏙️' },
    { value: 'CBD', label: 'CBD', icon: '🏢' },
    { value: 'Southbank', label: 'Southbank', icon: '🌊' }
  ];

  // Fetch parking spots and availability data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [spotsResponse, availabilityResponse] = await Promise.all([
          apiService.getParkingSpots(),
          apiService.getCurrentAvailability()
        ]);

        if (spotsResponse.success) {
          setParkingSpots(spotsResponse.data);
        }

        if (availabilityResponse.success) {
          setCurrentAvailability(availabilityResponse.data);
        }

        setLastUpdated(new Date());
      } catch (err) {
        setError('Failed to fetch parking data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced refresh function
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [spotsResponse, availabilityResponse] = await Promise.all([
        apiService.getParkingSpots(),
        apiService.getCurrentAvailability()
      ]);

      if (spotsResponse.success) {
        setParkingSpots(spotsResponse.data);
      }

      if (availabilityResponse.success) {
        setCurrentAvailability(availabilityResponse.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter parking spots based on search and area
  const filteredSpots = parkingSpots.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spot.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'all' || spot.area_type === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Get availability for a specific spot
  const getAvailability = (spotId) => {
    const availability = currentAvailability.find(av => av.id === spotId);
    const spot = parkingSpots.find(s => s.id === spotId);
    return availability || { 
      available_spots: spot?.available_spots || spot?.total_spots || 0, 
      occupancy_percentage: spot?.occupancy_percentage || 0,
      status: spot?.status || 'available'
    };
  };

  // Get enhanced status color and info
  const getStatusInfo = (occupancyPercentage) => {
    if (occupancyPercentage >= 90) {
      return { 
        color: '#e74c3c', 
        status: 'full', 
        label: 'Full',
        className: 'status-full'
      };
    }
    if (occupancyPercentage >= 70) {
      return { 
        color: '#f39c12', 
        status: 'limited', 
        label: 'Limited',
        className: 'status-limited'
      };
    }
    return { 
      color: '#27ae60', 
      status: 'available', 
      label: 'Available',
      className: 'status-available'
    };
  };

  // Calculate summary statistics
  const calculateStats = () => {
    const totalSpots = filteredSpots.reduce((sum, spot) => sum + (spot.total_spots || 0), 0);
    const availableSpots = filteredSpots.reduce((sum, spot) => {
      const availability = getAvailability(spot.id);
      return sum + (availability.available_spots || 0);
    }, 0);
    const occupiedSpots = totalSpots - availableSpots;
    const averageOccupancy = totalSpots > 0 ? ((occupiedSpots / totalSpots) * 100) : 0;

    return {
      totalSpots,
      availableSpots,
      occupiedSpots,
      averageOccupancy: averageOccupancy.toFixed(1)
    };
  };

  const stats = calculateStats();

  // Format time for last updated
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-AU', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading && parkingSpots.length === 0) {
    return (
      <div className="real-time-parking">
        <div className="container">
          <div className="loading">Loading real-time parking data...</div>
        </div>
      </div>
    );
  }

  if (error && parkingSpots.length === 0) {
    return (
      <div className="real-time-parking">
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="real-time-parking">
      <div className="container">
        {/* Enhanced Page Header */}
        <div className="page-header">
          <h1>Real-Time Parking Availability</h1>
          <p className="page-subtitle">
            Find available parking spots across Melbourne CBD with live occupancy data 
            and smart recommendations for optimal parking choices.
          </p>
          <div className="live-indicator">
            <span className="live-dot"></span>
            LIVE DATA - Last updated: {formatTime(lastUpdated)}
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className={`search-filter-section ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="search-filter-header">
            🔍 Find Your Perfect Parking Spot
          </div>
          <div className="search-filter-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by location name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Area Filter</label>
              <div className="area-filter">
                <select 
                  value={selectedArea} 
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  {areaOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              className="refresh-button" 
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? '🔄' : '🔄'} {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className={`stats-bar ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="stat-card">
            <span className="stat-icon">🏢</span>
            <span className="stat-number">{filteredSpots.length}</span>
            <span className="stat-label">Total Locations</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🟢</span>
            <span className="stat-number">{stats.availableSpots}</span>
            <span className="stat-label">Available Spots</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-number">{stats.averageOccupancy}%</span>
            <span className="stat-label">Average Occupancy</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🚗</span>
            <span className="stat-number">{stats.totalSpots}</span>
            <span className="stat-label">Total Capacity</span>
          </div>
        </div>

        {/* Enhanced Parking Spots Grid */}
        <div className="parking-grid">
          {filteredSpots.map((spot, index) => {
            const availability = getAvailability(spot.id);
            const statusInfo = getStatusInfo(availability.occupancy_percentage || 0);
            
            return (
              <div key={spot.id} className={`parking-card ${isVisible ? 'fade-in-up' : ''}`}>
                <div className="parking-header">
                  <h3>{spot.name}</h3>
                  <span className="area-tag">{spot.area_type}</span>
                </div>
                
                <div className="parking-details">
                  <p className="address">{spot.address}</p>
                  
                  <div className="availability-section">
                    <div className="availability-header">
                      <div className="availability-title">
                        📊 Current Availability
                      </div>
                      <div className={`status-indicator ${statusInfo.className}`}>
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div className="availability-bar">
                      <div 
                        className="availability-fill"
                        style={{ 
                          width: `${availability.occupancy_percentage || 0}%`,
                          backgroundColor: statusInfo.color
                        }}
                      ></div>
                    </div>
                    
                    <div className="availability-stats">
                      <div className="stat-item available-spots">
                        <span className="stat-value">
                          {availability.available_spots || 0}
                        </span>
                        <span className="stat-label">Available</span>
                      </div>
                      <div className="stat-item occupancy">
                        <span className="stat-value">
                          {(availability.occupancy_percentage || 0).toFixed(1)}%
                        </span>
                        <span className="stat-label">Occupied</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="parking-meta">
                    <div className="meta-item total-spots">
                      Capacity: {spot.total_spots} spots
                    </div>
                    <div className="meta-item hourly-rate">
                      ${spot.hourly_rate}/hour
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSpots.length === 0 && !loading && (
          <div className="no-results">
            <p>No parking spots found matching your search criteria.</p>
            <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#999' }}>
              Try adjusting your search terms or area filter.
            </p>
          </div>
        )}

        {/* Additional Information Section */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            💡 Smart Parking Tips
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🕐</div>
              <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>
                Best Times
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                10AM-2PM and after 7PM for better availability
              </div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>
                Save Money
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Compare hourly rates and choose cost-effective options
              </div>
            </div>
            <div style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚶‍♂️</div>
              <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>
                Walking Distance
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                Consider spots within 5 minutes walk of your destination
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeParking;