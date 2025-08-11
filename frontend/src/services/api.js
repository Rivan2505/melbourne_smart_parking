const API_BASE_URL = 'http://localhost:5000/api';

// API Service class
class ApiService {
  // Helper method for making API calls
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all parking spots
  async getParkingSpots() {
    return this.makeRequest('/parking-spots');
  }

  // Get parking spot by ID
  async getParkingSpot(id) {
    return this.makeRequest(`/parking-spots/${id}`);
  }

  // Get parking spots by area
  async getParkingSpotsByArea(area) {
    return this.makeRequest(`/parking-spots/area/${area}`);
  }

  // Get current availability
  async getCurrentAvailability() {
    return this.makeRequest('/availability/current');
  }

  // Get occupancy analytics
  async getOccupancyAnalytics(days = 7) {
    return this.makeRequest(`/analytics/occupancy?days=${days}`);
  }

  // Calculate emissions
  async calculateEmissions(distance, transportMode) {
    return this.makeRequest(`/emissions/calculate?distance=${distance}&transportMode=${transportMode}`);
  }

  // Get search time analytics
  async getSearchTimeAnalytics() {
    return this.makeRequest('/analytics/search-time');
  }

  // Get peak hours analysis
  async getPeakHoursAnalysis() {
    return this.makeRequest('/analytics/peak-hours');
  }

  // Get green parking options
  async getGreenParkingOptions() {
    return this.makeRequest('/parking-spots/green-options');
  }

  // Get parking summary
  async getParkingSummary() {
    return this.makeRequest('/analytics/summary');
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
