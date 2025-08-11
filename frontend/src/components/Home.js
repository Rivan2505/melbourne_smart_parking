import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">
            Solving Melbourne CBD Parking Problems
          </h1>
          
          <p className="home-subtitle">
            Save an average of 17 hours per year searching for parking, reduce congestion and emissions
          </p>
          
          <div className="stats-container">
            <div className="stat-item1">
              <span className="stat-number1">17 Hours</span>
              <span className="stat-label1">Annual parking search time</span>
            </div>
            <div className="stat-item1">
              <span className="stat-number1">CBD</span>
              <span className="stat-label1">Coverage area</span>
            </div>
            <div className="stat-item1">
              <span className="stat-number1">Real-time</span>
              <span className="stat-label1">Parking data</span>
            </div>
          </div>
          
          <div className="button-container">
            <Link to="/real-time-parking" className="cta-button">
              Find Parking Now
            </Link>
          </div>
        </div>
        
        <div className="home-graphic">
          <div className="building-silhouette">
            <div className="building-text"><img className='car-image' src='car.png' alt="Building" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;