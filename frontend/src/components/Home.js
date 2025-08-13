import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <>
      {/* Existing Hero Section - Keep exactly as is */}
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
              <div className="building-text">
                <img className='car-image' src='car.png' alt="Building" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="problem-section">
        <div className="problem-container">
          <div className="problem-header">
            <h2 className="problem-title">The Problem We're Solving</h2>
            <p className="problem-subtitle">
              Melbourne's post-COVID shift toward car dependency has created a perfect storm in the CBD
            </p>
          </div>
          
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">🚗</div>
              <h3 className="problem-card-title">Urban Congestion</h3>
              <p className="problem-card-text">
                30% of CBD traffic consists of drivers searching for parking
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">🌍</div>
              <h3 className="problem-card-title">Environmental Impact</h3>
              <p className="problem-card-text">
                Unnecessary driving increases CO2 emissions and air pollution
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">💰</div>
              <h3 className="problem-card-title">Economic Cost</h3>
              <p className="problem-card-text">
                Lost productivity and wasted fuel cost drivers millions annually
              </p>
            </div>
            
            <div className="problem-card">
              <div className="problem-icon">😤</div>
              <h3 className="problem-card-title">Quality of Life</h3>
              <p className="problem-card-text">
                Stress and time lost that could be spent with family or work
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="solution-section">
        <div className="solution-container">
          <div className="solution-header">
            <h2 className="solution-title">Our Smart Solution</h2>
            <p className="solution-subtitle">
              Leveraging real-time data and predictive analytics to revolutionize parking
            </p>
          </div>
          
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">📡</div>
              <h3 className="solution-card-title">Real-Time Intelligence</h3>
              <p className="solution-card-text">
                Live parking availability from sensors, city databases, and crowdsourced information across Melbourne's CBD
              </p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">🔮</div>
              <h3 className="solution-card-title">Predictive Analytics</h3>
              <p className="solution-card-text">
                Historical data analysis helps commuters plan optimal travel times and predict parking patterns
              </p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">🌱</div>
              <h3 className="solution-card-title">Sustainable Navigation</h3>
              <p className="solution-card-text">
                Eco-conscious routing that minimizes driving distance and highlights green parking options
              </p>
            </div>
            
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3 className="solution-card-title">Data-Driven Insights</h3>
              <p className="solution-card-text">
                Comprehensive analytics helping both individuals and city planners make informed decisions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: More Insights CTA Section */}
      <div className="insights-cta-section">
        <div className="insights-cta-container">
          <div className="insights-cta-content">
            <h2 className="insights-cta-title">Want to Learn More?</h2>
            <p className="insights-cta-subtitle">
              Explore detailed analytics, growth trends, and data-driven insights about Melbourne's parking challenges and urban mobility patterns.
            </p>
            <Link to="/data-insights" className="insights-button">
              More Insights
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;