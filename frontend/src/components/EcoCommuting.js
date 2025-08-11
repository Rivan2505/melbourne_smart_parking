// import React, { useState, useEffect } from 'react';
// import apiService from '../services/api';
// import './EcoCommuting.css';

// const EcoCommuting = () => {
//   const [emissionsResult, setEmissionsResult] = useState(null);
//   const [greenParkingOptions, setGreenParkingOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Form state
//   const [distance, setDistance] = useState('');
//   const [transportMode, setTransportMode] = useState('car');

//   // Fetch green parking options
//   useEffect(() => {
//     const fetchGreenOptions = async () => {
//       try {
//         const response = await apiService.getGreenParkingOptions();
//         if (response.success) {
//           setGreenParkingOptions(response.data);
//         }
//       } catch (err) {
//         console.error('Error fetching green parking options:', err);
//       }
//     };

//     fetchGreenOptions();
//   }, []);

//   // Calculate emissions
//   const calculateEmissions = async () => {
//     if (!distance || distance <= 0) {
//       setError('Please enter a valid distance');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const response = await apiService.calculateEmissions(distance, transportMode);
//       if (response.success) {
//         setEmissionsResult(response.data);
//       }
//     } catch (err) {
//       setError('Failed to calculate emissions');
//       console.error('Error calculating emissions:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get transport mode icon
//   const getTransportIcon = (mode) => {
//     const icons = {
//       car: '🚗',
//       public_transport: '🚌',
//       walking: '🚶',
//       cycling: '🚴'
//     };
//     return icons[mode] || '🚗';
//   };

//   // Get transport mode name
//   const getTransportName = (mode) => {
//     const names = {
//       car: 'Car',
//       public_transport: 'Public Transport',
//       walking: 'Walking',
//       cycling: 'Cycling'
//     };
//     return names[mode] || 'Car';
//   };

//   return (
//     <div className="eco-commuting">
//       <div className="container">
//         <h1>Eco-Conscious Commuting</h1>
//         <p className="subtitle">Make greener travel choices and reduce your carbon footprint</p>

//         {/* Emissions Calculator */}
//         <div className="calculator-section">
//           <h2>Carbon Footprint Calculator</h2>
//           <div className="calculator-form">
//             <div className="form-group">
//               <label htmlFor="distance">Trip Distance (km)</label>
//               <input
//                 type="number"
//                 id="distance"
//                 value={distance}
//                 onChange={(e) => setDistance(e.target.value)}
//                 placeholder="Enter distance in kilometers"
//                 min="0"
//                 step="0.1"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="transportMode">Transport Mode</label>
//               <select
//                 id="transportMode"
//                 value={transportMode}
//                 onChange={(e) => setTransportMode(e.target.value)}
//               >
//                 <option value="car">Car</option>
//                 <option value="public_transport">Public Transport</option>
//                 <option value="walking">Walking</option>
//                 <option value="cycling">Cycling</option>
//               </select>
//             </div>

//             <button 
//               className="calculate-btn" 
//               onClick={calculateEmissions}
//               disabled={loading}
//             >
//               {loading ? 'Calculating...' : 'Calculate Emissions'}
//             </button>
//           </div>

//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}

//           {emissionsResult && (
//             <div className="emissions-result">
//               <h3>Emissions Analysis</h3>
//               <div className="result-grid">
//                 <div className="result-card">
//                   <div className="result-icon">{getTransportIcon(transportMode)}</div>
//                   <div className="result-content">
//                     <h4>{getTransportName(transportMode)}</h4>
//                     <p className="result-value">{emissionsResult.emissions} kg CO₂</p>
//                     <p className="result-label">Carbon Emissions</p>
//                   </div>
//                 </div>

//                 <div className="result-card alternative">
//                   <div className="result-icon">🚌</div>
//                   <div className="result-content">
//                     <h4>Alternative (Public Transport)</h4>
//                     <p className="result-value">{emissionsResult.alternativeEmissions} kg CO₂</p>
//                     <p className="result-label">Carbon Emissions</p>
//                   </div>
//                 </div>

//                 <div className="result-card savings">
//                   <div className="result-icon">🌱</div>
//                   <div className="result-content">
//                     <h4>Emissions Saved</h4>
//                     <p className="result-value">{emissionsResult.emissionsSaved} kg CO₂</p>
//                     <p className="result-label">Environmental Impact</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Green Parking Options */}
//         <div className="green-parking-section">
//           <h2>🌱 Eco-Friendly Parking Options</h2>
//           <p>Low occupancy parking spots near public transport</p>
          
//           <div className="green-parking-grid">
//             {greenParkingOptions.map((spot) => (
//               <div key={spot.id} className="green-parking-card">
//                 <div className="parking-header">
//                   <h3>{spot.name}</h3>
//                   <span className="eco-badge">🌱 Eco-Friendly</span>
//                 </div>
                
//                 <div className="parking-details">
//                   <p className="address">{spot.address}</p>
//                   <div className="availability-info">
//                     <div className="availability-bar">
//                       <div 
//                         className="availability-fill green"
//                         style={{ width: `${spot.occupancy_percentage}%` }}
//                       ></div>
//                     </div>
//                     <div className="availability-stats">
//                       <span className="available-spots">
//                         {spot.available_spots} spots available
//                       </span>
//                       <span className="occupancy">
//                         {spot.occupancy_percentage}% occupied
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="parking-meta">
//                     <span className="total-spots">Total: {spot.total_spots} spots</span>
//                     <span className="hourly-rate">${spot.hourly_rate}/hour</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {greenParkingOptions.length === 0 && (
//             <div className="no-green-options">
//               <p>No eco-friendly parking options available at the moment.</p>
//             </div>
//           )}
//         </div>

//         {/* Sustainable Tips */}
//         <div className="tips-section">
//           <h2>💡 Sustainable Commuting Tips</h2>
//           <div className="tips-grid">
//             <div className="tip-card">
//               <div className="tip-icon">🚌</div>
//               <h4>Use Public Transport</h4>
//               <p>Melbourne's tram and train network can reduce your carbon footprint by up to 75% compared to driving.</p>
//             </div>
            
//             <div className="tip-card">
//               <div className="tip-icon">🚴</div>
//               <h4>Cycle When Possible</h4>
//               <p>Melbourne has excellent bike lanes and shared paths. Cycling produces zero emissions and improves health.</p>
//             </div>
            
//             <div className="tip-card">
//               <div className="tip-icon">🚶</div>
//               <h4>Walk Short Distances</h4>
//               <p>For trips under 2km, walking is often faster than driving and has zero environmental impact.</p>
//             </div>
            
//             <div className="tip-card">
//               <div className="tip-icon">🤝</div>
//               <h4>Carpool</h4>
//               <p>Share rides with colleagues or use carpooling apps to reduce emissions and parking demand.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EcoCommuting;





import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './EcoCommuting.css';

const EcoCommuting = () => {
  const [emissionsResult, setEmissionsResult] = useState(null);
  const [greenParkingOptions, setGreenParkingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Form state
  const [distance, setDistance] = useState('');
  const [transportMode, setTransportMode] = useState('car');

  // Fetch green parking options
  useEffect(() => {
    const fetchGreenOptions = async () => {
      try {
        const response = await apiService.getGreenParkingOptions();
        if (response.success) {
          setGreenParkingOptions(response.data);
        }
      } catch (err) {
        console.error('Error fetching green parking options:', err);
      }
    };

    fetchGreenOptions();
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Calculate emissions with enhanced feedback
  const calculateEmissions = async () => {
    if (!distance || distance <= 0) {
      setError('Please enter a valid distance greater than 0');
      return;
    }

    if (distance > 1000) {
      setError('Please enter a distance less than 1000 km for accurate calculations');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await apiService.calculateEmissions(distance, transportMode);
      if (response.success) {
        setEmissionsResult(response.data);
      }
    } catch (err) {
      setError('Failed to calculate emissions. Please try again.');
      console.error('Error calculating emissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced transport mode data
  const getTransportData = (mode) => {
    const transportData = {
      car: {
        icon: '🚗',
        name: 'Private Car',
        description: 'Personal vehicle transportation'
      },
      public_transport: {
        icon: '🚌',
        name: 'Public Transport',
        description: 'Buses, trams, and trains'
      },
      walking: {
        icon: '🚶‍♂️',
        name: 'Walking',
        description: 'Zero-emission pedestrian travel'
      },
      cycling: {
        icon: '🚴‍♂️',
        name: 'Cycling',
        description: 'Eco-friendly bike transportation'
      }
    };
    return transportData[mode] || transportData.car;
  };

  // Format emissions value with better display
  const formatEmissions = (value) => {
    if (value === 0) return '0.0';
    if (value < 0.01) return '<0.01';
    return value.toFixed(2);
  };

  // Get environmental impact message
  const getEnvironmentalImpact = (emissions, saved) => {
    if (saved > 0) {
      return `Great choice! You're saving ${formatEmissions(saved)} kg CO₂ 🌱`;
    } else if (emissions === 0) {
      return 'Perfect! Zero emissions transportation 🌟';
    } else {
      return `Consider greener alternatives to reduce ${formatEmissions(emissions)} kg CO₂`;
    }
  };

  // Enhanced tips data
  const sustainableTips = [
    {
      icon: '🚌',
      title: 'Public Transport Network',
      description: "Melbourne's extensive tram, train, and bus network reduces carbon emissions by up to 75% compared to private vehicles and often provides faster travel during peak hours.",
      benefit: 'Up to 75% emission reduction'
    },
    {
      icon: '🚴‍♂️',
      title: 'Cycling Infrastructure',
      description: "With over 135km of bike lanes and shared paths, Melbourne offers excellent cycling infrastructure. E-bikes make longer distances accessible while maintaining zero emissions.",
      benefit: 'Zero emissions + health benefits'
    },
    {
      icon: '🚶‍♂️',
      title: 'Walkable City Design',
      description: "Melbourne's compact CBD makes walking efficient for trips under 2km. Walking improves health, reduces traffic congestion, and creates a more liveable city environment.",
      benefit: 'Health + zero environmental impact'
    },
    {
      icon: '🤝',
      title: 'Smart Ride Sharing',
      description: "Carpooling and ride-sharing services reduce the number of vehicles on roads. Apps like GoGet and Flexicar provide access to vehicles only when needed.",
      benefit: 'Reduced parking demand + costs'
    }
  ];

  return (
    <div className="eco-commuting">
      <div className="container">
        {/* Enhanced Page Header */}
        <div className="page-header">
          <h1>Eco-Conscious Commuting</h1>
          <p className="subtitle">
            Make informed, sustainable travel choices that reduce your carbon footprint 
            and contribute to Melbourne's environmental goals
          </p>
        </div>

        {/* Enhanced Emissions Calculator */}
        <div className={`calculator-section ${isVisible ? 'fade-in-up' : ''}`}>
          <h2>Carbon Footprint Calculator</h2>
          <div className="calculator-form">
            <div className="form-group">
              <label htmlFor="distance">
                Trip Distance (kilometers)
              </label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g., 5.2"
                min="0"
                max="1000"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="transportMode">
                Transportation Method
              </label>
              <select
                id="transportMode"
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
              >
                <option value="car">🚗 Private Car</option>
                <option value="public_transport">🚌 Public Transport</option>
                <option value="walking">🚶‍♂️ Walking</option>
                <option value="cycling">🚴‍♂️ Cycling</option>
              </select>
            </div>

            <button 
              className="calculate-button" 
              onClick={calculateEmissions}
              disabled={loading}
            >
              {loading ? '🔄 Calculating...' : '🧮 Calculate Environmental Impact'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {emissionsResult && (
            <div className="emissions-result">
              <h3>Environmental Impact Analysis</h3>
              <div className="result-grid">
                <div className="result-card">
                  <div className="result-icon">
                    {getTransportData(transportMode).icon}
                  </div>
                  <div className="result-content">
                    <h4>{getTransportData(transportMode).name}</h4>
                    <span className="result-value">
                      {formatEmissions(emissionsResult.emissions)} kg CO₂
                    </span>
                    <p className="result-label">Carbon Emissions</p>
                  </div>
                </div>

                <div className="result-card alternative">
                  <div className="result-icon">🚌</div>
                  <div className="result-content">
                    <h4>Public Transport Alternative</h4>
                    <span className="result-value">
                      {formatEmissions(emissionsResult.alternativeEmissions)} kg CO₂
                    </span>
                    <p className="result-label">Eco-Friendly Option</p>
                  </div>
                </div>

                <div className="result-card savings">
                  <div className="result-icon">🌱</div>
                  <div className="result-content">
                    <h4>Potential Savings</h4>
                    <span className="result-value">
                      {formatEmissions(emissionsResult.emissionsSaved)} kg CO₂
                    </span>
                    <p className="result-label">Environmental Benefit</p>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: '#e8f5e8', 
                borderRadius: '10px',
                color: '#27ae60',
                fontWeight: '600'
              }}>
                {getEnvironmentalImpact(emissionsResult.emissions, emissionsResult.emissionsSaved)}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Green Parking Options */}
        <div className={`green-parking-section ${isVisible ? 'fade-in-up' : ''}`}>
          <h2>🌱 Eco-Friendly Parking Locations</h2>
          <p>Low-occupancy parking spots strategically located near public transport hubs</p>
          
          <div className="green-parking-grid">
            {greenParkingOptions.map((spot, index) => (
              <div key={spot.id} className={`green-parking-card ${isVisible ? 'fade-in-up' : ''}`}>
                <div className="parking-header">
                  <h3>{spot.name}</h3>
                  <span className="eco-badge">🌱 Eco-Certified</span>
                </div>
                
                <div className="parking-details">
                  <p className="address">📍 {spot.address}</p>
                  
                  <div className="availability-info">
                    <div className="availability-bar">
                      <div 
                        className="availability-fill"
                        style={{ width: `${spot.occupancy_percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="availability-stats">
                      <span className="available-spots">
                        ✅ {spot.available_spots || spot.total_spots} spots available
                      </span>
                      <span className="occupancy">
                        {(spot.occupancy_percentage || 0).toFixed(1)}% occupied
                      </span>
                    </div>
                  </div>
                  
                  <div className="parking-meta">
                    <span className="total-spots">
                      🚗 Capacity: {spot.total_spots} spots
                    </span>
                    <span className="hourly-rate">
                      💰 ${spot.hourly_rate}/hour
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {greenParkingOptions.length === 0 && (
            <div className="no-green-options">
              <p>🔍 No eco-friendly parking options currently available. Check back later for updates!</p>
            </div>
          )}
        </div>

        {/* Enhanced Sustainable Tips */}
        <div className={`tips-section ${isVisible ? 'fade-in-up' : ''}`}>
          <h2>Sustainable Commuting Strategies</h2>
          <div className="tips-grid">
            {sustainableTips.map((tip, index) => (
              <div key={index} className={`tip-card ${isVisible ? 'fade-in-up' : ''}`}>
                <div className="tip-icon">{tip.icon}</div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(39, 174, 96, 0.1)',
                  borderRadius: '8px',
                  color: '#27ae60',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}>
                  💡 {tip.benefit}
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Environmental Facts */}
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #d5f4e6 100%)',
            borderRadius: '20px',
            textAlign: 'center',
            border: '1px solid rgba(39, 174, 96, 0.2)'
          }}>
            <h3 style={{
              color: '#27ae60',
              marginBottom: '1rem',
              fontSize: '1.3rem',
              fontWeight: '600'
            }}>
              🌍 Environmental Impact Facts
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#27ae60' }}>45%</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Reduction in transport emissions with smart commuting</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#27ae60' }}>$2.1B</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Annual economic impact of parking search time</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#27ae60' }}>30%</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Less traffic congestion with optimized parking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoCommuting;