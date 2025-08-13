import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const MapComponent = ({ parkingSpots, currentAvailability, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

// Add this line at the top of your ParkingMap component to debug
console.log('Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
  });

  // Melbourne CBD center coordinates
  const melbourneCenter = { lat: -37.8136, lng: 144.9631 };

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

  // Get marker color based on availability
  const getMarkerColor = (occupancyPercentage) => {
    if (occupancyPercentage >= 90) return '#e74c3c'; // Red - Full
    if (occupancyPercentage >= 70) return '#f39c12'; // Orange - Limited
    return '#27ae60'; // Green - Available
  };

  // Create custom marker icon
  const createMarkerIcon = (color, isSelected = false) => {
    const size = isSelected ? 40 : 30;
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: size / 24,
      anchor: new window.google.maps.Point(12, 24)
    };
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: melbourneCenter,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });
      
      setMap(newMap);
    }
  }, [mapRef, map]);

  // Create info window content
  const createInfoWindowContent = (spot) => {
    const availability = getAvailability(spot.id);
    const occupancy = availability.occupancy_percentage || 0;
    const statusColor = getMarkerColor(occupancy);
    
    return `
      <div style="padding: 15px; min-width: 250px; font-family: 'Segoe UI', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 16px; font-weight: 600; flex: 1; line-height: 1.3;">
            ${spot.name}
          </h3>
          <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-left: 10px;">
            ${spot.area_type}
          </span>
        </div>
        
        <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; display: flex; align-items: center; gap: 5px;">
          📍 ${spot.address}
        </p>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 12px; margin-bottom: 12px; border: 1px solid #e9ecef;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 14px; font-weight: 600; color: #2c3e50;">📊 Current Availability</span>
            <span style="background: ${occupancy >= 90 ? '#fceaea' : occupancy >= 70 ? '#fef9e7' : '#d5f4e6'}; color: ${statusColor}; padding: 3px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; text-transform: uppercase;">
              ${occupancy >= 90 ? 'FULL' : occupancy >= 70 ? 'LIMITED' : 'AVAILABLE'}
            </span>
          </div>
          
          <div style="background: #ecf0f1; border-radius: 8px; height: 8px; margin-bottom: 8px; overflow: hidden;">
            <div style="height: 100%; background: ${statusColor}; width: ${occupancy}%; transition: width 0.3s ease; border-radius: 8px;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="text-align: center; padding: 8px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
              <div style="font-size: 18px; font-weight: 700; color: #27ae60; margin-bottom: 2px;">${availability.available_spots || 0}</div>
              <div style="font-size: 11px; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Available</div>
            </div>
            <div style="text-align: center; padding: 8px; background: white; border-radius: 8px; border: 1px solid #e9ecef;">
              <div style="font-size: 18px; font-weight: 700; color: #e74c3c; margin-bottom: 2px;">${occupancy.toFixed(1)}%</div>
              <div style="font-size: 11px; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Occupied</div>
            </div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding-top: 8px; border-top: 1px solid #ecf0f1;">
          <div style="display: flex; align-items: center; gap: 5px; font-size: 13px; color: #7f8c8d; font-weight: 500;">
            🚗 ${spot.total_spots} spots
          </div>
          <div style="display: flex; align-items: center; gap: 5px; font-size: 13px; color: #f39c12; font-weight: 600;">
            💰 $${spot.hourly_rate}/hour
          </div>
        </div>
      </div>
    `;
  };

  // Update markers when parking spots or availability changes
  useEffect(() => {
    if (!map || !parkingSpots.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = [];
    const infoWindow = new window.google.maps.InfoWindow();

    parkingSpots.forEach(spot => {
      if (!spot.latitude || !spot.longitude) return;

      const availability = getAvailability(spot.id);
      const occupancy = availability.occupancy_percentage || 0;
      const markerColor = getMarkerColor(occupancy);

      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(spot.latitude), lng: parseFloat(spot.longitude) },
        map: map,
        title: spot.name,
        icon: createMarkerIcon(markerColor),
        animation: window.google.maps.Animation.DROP
      });

      // Add click listener for info window
      marker.addListener('click', () => {
        infoWindow.setContent(createInfoWindowContent(spot));
        infoWindow.open(map, marker);
        
        // Trigger callback if provided
        if (onMarkerClick) {
          onMarkerClick(spot);
        }
      });

      // Add hover effects
      marker.addListener('mouseover', () => {
        marker.setIcon(createMarkerIcon(markerColor, true));
      });

      marker.addListener('mouseout', () => {
        marker.setIcon(createMarkerIcon(markerColor, false));
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers if there are any
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
      
      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom() > 16) {
          map.setZoom(16);
        }
      });
    }

    // Cleanup function
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, parkingSpots, currentAvailability]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }} 
    />
  );
};

const ParkingMap = ({ parkingSpots, currentAvailability, onMarkerClick }) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div style={{
            width: '100%',
            height: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            color: '#666',
            fontSize: '1.1rem'
          }}>
            🗺️ Loading Google Maps...
          </div>
        );
      case Status.FAILURE:
        return (
          <div style={{
            width: '100%',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            color: '#e74c3c',
            fontSize: '1.1rem',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫</div>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Failed to load Google Maps</div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              Please check your API key and internet connection
            </div>
          </div>
        );
      default:
        return (
          <MapComponent 
            parkingSpots={parkingSpots}
            currentAvailability={currentAvailability}
            onMarkerClick={onMarkerClick}
          />
        );
    }
  };

  return (
    <div style={{ width: '100%', marginBottom: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '1.1rem'
      }}>
        🗺️ Interactive Parking Map
      </div>
      <Wrapper 
        apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={['places']}
      />
      
      {/* Map Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '1rem',
        padding: '1rem',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#27ae60'
          }}></div>
          <span>Available (0-70%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#f39c12'
          }}></div>
          <span>Limited (70-90%)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#e74c3c'
          }}></div>
          <span>Full (90%+)</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingMap;