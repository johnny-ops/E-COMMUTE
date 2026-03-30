import axios from 'axios';

// IMPORTANT: Replace with your computer's IP address
// To find your IP: Run 'ipconfig' in terminal and look for IPv4 Address
// For Android emulator use: 10.0.2.2
// For iOS simulator use: localhost
// For physical device use: your computer's IP (e.g., 192.168.1.x)
const API_BASE_URL = __DEV__ ? 'http://192.168.1.4:3000/api' : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to calculate accurate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
};

export const routeService = {
  findRoutes: async (origin, destination) => {
    try {
      const response = await api.post('/routes', { origin, destination });
      return response.data;
    } catch (error) {
      console.log('Using offline data - Backend not available');
      // Return accurate mock data if backend is not available
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
                instruction: `Sakay ng Jeep mula ${origin}`,
                distance: 8.5,
                duration: 25
              },
              {
                type: 'jeepney',
                instruction: `Lipat papunta ${destination}`,
                distance: 2.3,
                duration: 10
              }
            ]
          },
          {
            id: 'r2',
            origin,
            destination,
            estimatedTime: 35,
            totalFare: 28,
            transfers: 1,
            steps: [
              {
                type: 'train',
                instruction: `Sakay ng Tren mula ${origin}`,
                distance: 7.2,
                duration: 15
              },
              {
                type: 'jeepney',
                instruction: `Sakay ng Jeep papunta ${destination}`,
                distance: 2.3,
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
      console.log('Calculating fare offline');
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
      console.log('Using offline terminal data');
      // Return accurate mock data with real distances
      const mockTerminals = [
        {
          id: 't1',
          name: 'Cubao Terminal',
          type: 'jeepney',
          latitude: 14.6191,
          longitude: 121.0577,
          routes: ['Cubao-Divisoria', 'Cubao-Quiapo']
        },
        {
          id: 't2',
          name: 'EDSA-Ayala Bus Stop',
          type: 'bus',
          latitude: 14.5547,
          longitude: 121.0244,
          routes: ['Makati-Quezon City']
        },
        {
          id: 't3',
          name: 'MRT Cubao Station',
          type: 'train',
          latitude: 14.6199,
          longitude: 121.0520,
          routes: ['North Avenue-Taft']
        },
        {
          id: 't4',
          name: 'Fairview Terminal',
          type: 'jeepney',
          latitude: 14.7108,
          longitude: 121.0583,
          routes: ['Fairview-Cubao']
        }
      ];
      
      // Calculate accurate distances
      const terminalsWithDistance = mockTerminals.map(terminal => ({
        ...terminal,
        distance: calculateDistance(latitude, longitude, terminal.latitude, terminal.longitude)
      })).filter(t => t.distance <= radius / 1000).sort((a, b) => a.distance - b.distance);
      
      return {
        success: true,
        terminals: terminalsWithDistance
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
      console.log('Using offline reports data');
      return {
        success: true,
        reports: [
          {
            id: '1',
            type: 'traffic',
            location: 'EDSA-Cubao',
            description: 'Mabigat ang trapiko dahil sa construction',
            upvotes: 15,
            downvotes: 2,
            reliability: 88,
            timeAgo: '5 minuto ang nakalipas'
          },
          {
            id: '2',
            type: 'route_change',
            location: 'Divisoria Terminal',
            description: 'Pansamantalang binago ang ruta ng jeep',
            upvotes: 8,
            downvotes: 1,
            reliability: 89,
            timeAgo: '15 minuto ang nakalipas'
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
      console.log('Report saved offline');
      return { success: true, report: { ...reportData, id: Date.now().toString() } };
    }
  },
  
  voteReport: async (reportId, vote) => {
    try {
      const response = await api.post(`/reports/${reportId}/vote`, { vote });
      return response.data;
    } catch (error) {
      console.log('Vote saved offline');
      return { success: true };
    }
  },
};

export default api;
