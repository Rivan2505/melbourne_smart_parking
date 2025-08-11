// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import Header from './components/Header';
// import Home from './components/Home';
// import DataInsights from './components/DataInsights';
// import RealTimeParking from './components/RealTimeParking';
// import EcoCommuting from './components/EcoCommuting';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/data-insights" element={<DataInsights />} />
//           <Route path="/real-time-parking" element={<RealTimeParking />} />
//           <Route path="/eco-commuting" element={<EcoCommuting />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import DataInsights from './components/DataInsights';
import RealTimeParking from './components/RealTimeParking';
import EcoCommuting from './components/EcoCommuting';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('isAuthenticated');
        const loginTime = localStorage.getItem('loginTime');
        
        if (authStatus === 'true' && loginTime) {
          // Optional: Check if login is still valid (e.g., within 24 hours)
          const loginTimestamp = parseInt(loginTime);
          const currentTime = new Date().getTime();
          const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
          
          if (currentTime - loginTimestamp < twentyFourHours) {
            setIsAuthenticated(true);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('loginTime');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handle login
  const handleLogin = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    setIsAuthenticated(false);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <h2>Melbourne Smart Parking</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Protected App Routes
  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data-insights" element={<DataInsights />} />
            <Route path="/real-time-parking" element={<RealTimeParking />} />
            <Route path="/eco-commuting" element={<EcoCommuting />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;