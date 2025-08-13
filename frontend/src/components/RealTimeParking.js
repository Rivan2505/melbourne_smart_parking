import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import ParkingMap from '../components/ParkingMap';
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
  const [showAllSpots, setShowAllSpots] = useState(false); // New state to control display

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

  // Get parking spots that have meaningful availability data
  const getSpotsWithData = () => {
    return parkingSpots.filter(spot => {
      const availability = getAvailability(spot.id);
      
      // Check if this spot has meaningful data:
      // 1. Has total spots greater than 0
      // 2. Has actual availability data (not just zeros)
      // 3. Either has available spots OR has occupancy percentage > 0
      const hasMeaningfulData = (
        spot.total_spots > 0 && (
          availability.available_spots > 0 || 
          availability.occupancy_percentage > 0 ||
          (availability.available_spots === spot.total_spots && spot.total_spots > 0) // All spots available
        )
      );
      
      // Also check if there's actual availability record with recent timestamp
      const hasRecentData = currentAvailability.some(av => 
        av.id === spot.id && 
        (av.available_spots > 0 || av.occupancy_percentage > 0)
      );
      
      return hasMeaningfulData || hasRecentData;
    });
  };

  // Filter parking spots based on search and area
  const getFilteredSpots = () => {
    let spotsToFilter = parkingSpots;
    
    // If no search term and no area filter, show only spots with meaningful data (limited to 5)
    if (!searchTerm && selectedArea === 'all' && !showAllSpots) {
      const spotsWithMeaningfulData = getSpotsWithData();
      
      // Sort by data quality: spots with higher occupancy or availability first
      const sortedSpots = spotsWithMeaningfulData.sort((a, b) => {
        const availabilityA = getAvailability(a.id);
        const availabilityB = getAvailability(b.id);
        
        // Prioritize spots that have either availability or occupancy data
        const scoreA = (availabilityA.available_spots || 0) + (availabilityA.occupancy_percentage || 0);
        const scoreB = (availabilityB.available_spots || 0) + (availabilityB.occupancy_percentage || 0);
        
        return scoreB - scoreA; // Higher score first
      });
      
      spotsToFilter = sortedSpots.slice(0, 5);
    }
    
    // If user is searching or filtering, show all matching spots
    if (searchTerm || selectedArea !== 'all' || showAllSpots) {
      spotsToFilter = parkingSpots.filter(spot => {
        const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             spot.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesArea = selectedArea === 'all' || spot.area_type === selectedArea;
        return matchesSearch && matchesArea;
      });
    }
    
    return spotsToFilter;
  };

  const filteredSpots = getFilteredSpots();
  const spotsWithData = getSpotsWithData();

  // Auto-expand results when user searches
  useEffect(() => {
    if (searchTerm || selectedArea !== 'all') {
      setShowAllSpots(true);
    } else {
      setShowAllSpots(false);
    }
  }, [searchTerm, selectedArea]);

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

  // Calculate summary statistics (only for displayed spots)
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

  // Handle showing more spots
  const handleShowMore = () => {
    setShowAllSpots(true);
  };

  // Handle marker click to scroll to parking card
  const handleMarkerClick = (spot) => {
    const cardElement = document.getElementById(`parking-card-${spot.id}`);
    if (cardElement) {
      cardElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Add highlight effect
      cardElement.style.transform = 'scale(1.02)';
      cardElement.style.boxShadow = '0 20px 40px rgba(52, 152, 219, 0.3)';
      setTimeout(() => {
        cardElement.style.transform = '';
        cardElement.style.boxShadow = '';
      }, 2000);
    }
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

        {/* Display info about current view */}
        {!searchTerm && selectedArea === 'all' && !showAllSpots && (
          <div style={{
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '15px',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
              📍 Showing Top 5 Locations with Active Real-Time Data
            </div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              Displaying parking spots with current availability and occupancy information. 
              {spotsWithData.length > 5 && ` ${spotsWithData.length} total locations available.`} 
              Use search to find specific locations or <button 
                onClick={handleShowMore}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginLeft: '0.5rem'
                }}
              >
                Show All Locations
              </button>
            </div>
          </div>
        )}

        {/* Google Maps Section */}
        <div className={`map-section ${isVisible ? 'fade-in-up' : ''}`}>
          <ParkingMap 
            parkingSpots={showAllSpots ? parkingSpots : filteredSpots}
            currentAvailability={currentAvailability}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Enhanced Stats Bar */}
        <div className={`stats-bar ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="stat-card">
            <span className="stat-icon">🏢</span>
            <span className="stat-number">{filteredSpots.length}</span>
            <span className="stat-label">Locations Shown</span>
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
              <div key={spot.id} id={`parking-card-${spot.id}`} className={`parking-card ${isVisible ? 'fade-in-up' : ''}`}>
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

        {/* Show More Button for default view */}
        {!searchTerm && selectedArea === 'all' && !showAllSpots && spotsWithData.length > 5 && (
          <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <button 
              onClick={handleShowMore}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              Show All {parkingSpots.length} Locations
            </button>
          </div>
        )}

        {filteredSpots.length === 0 && !loading && (
          <div className="no-results">
            {!searchTerm && selectedArea === 'all' && !showAllSpots ? (
              <>
                <p>No parking locations with active real-time data available at the moment.</p>
                <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#999' }}>
                  This might be due to temporary data collection issues. Please try refreshing or 
                  <button 
                    onClick={handleShowMore}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3498db',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      margin: '0 0.5rem'
                    }}
                  >
                    view all locations
                  </button>
                  to see the complete parking directory.
                </p>
              </>
            ) : (
              <>
                <p>No parking spots found matching your search criteria.</p>
                <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#999' }}>
                  Try adjusting your search terms or area filter.
                </p>
              </>
            )}
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