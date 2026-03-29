import axios from 'axios';

// Use your computer's IP address for testing on physical devices
// For Android emulator use: 10.0.2.2
// For iOS simulator use: localhost
// For physical device use: your computer's IP (e.g., 192.168.1.x)
const API_BASE_URL = 'http://192.168.1.4:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const routeService = {
  findRoutes: async (origin, destination) => {
    try {
      const response = await api.post('/routes', { origin, destination });
      return response.data;
    } catch (error) {
      console.error('Error finding routes:', error.message);
      // Return mock data if backend is not available
      return {
        success: true,
        routes: [
          {
            id: 'r1',
            origin,
            destination,
            estimatedTime: 45,
            totalFare: 35,
            transfers: 1,
            steps: [
              {
                type: 'jeepney',
                instruction: `Ride Jeepney from ${origin}`,
                distance: 8,
                duration: 25
              },
              {
                type: 'jeepney',
                instruction: `Transfer to ${destination}`,
                distance: 2,
                duration: 10
              }
            ]
          }
        ]
      };
    }
  },
  
  calculateFare: async (routeData) => {
    try {
      const response = await api.post('/fare', routeData);
      return response.data;
    } catch (error) {
      console.error('Error calculating fare:', error.message);
      return { success: true, totalFare: 35 };
    }
  },
};

export const terminalService = {
  getNearbyTerminals: async (latitude, longitude, radius = 2000) => {
    try {
      const response = await api.get('/terminals', {
        params: { latitude, longitude, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching terminals:', error.message);
      // Return mock data
      return {
        success: true,
        terminals: [
          {
            id: 't1',
            name: 'Cubao Terminal',
            type: 'jeepney',
            latitude: latitude + 0.01,
            longitude: longitude + 0.01,
            distance: 0.5
          },
          {
            id: 't2',
            name: 'Bus Stop',
            type: 'bus',
            latitude: latitude - 0.01,
            longitude: longitude + 0.01,
            distance: 0.8
          }
        ]
      };
    }
  },
};

export const reportService = {
  getReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error.message);
      return {
        success: true,
        reports: [
          {
            id: '1',
            type: 'traffic',
            location: 'EDSA-Cubao',
            description: 'Heavy traffic',
            upvotes: 15,
            downvotes: 2,
            reliability: 88,
            timeAgo: '5 mins ago'
          }
        ]
      };
    }
  },
  
  submitReport: async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error.message);
      return { success: true, report: { ...reportData, id: Date.now().toString() } };
    }
  },
  
  voteReport: async (reportId, vote) => {
    try {
      const response = await api.post(`/reports/${reportId}/vote`, { vote });
      return response.data;
    } catch (error) {
      console.error('Error voting:', error.message);
      return { success: true };
    }
  },
};

export default api;
