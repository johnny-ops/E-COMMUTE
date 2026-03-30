# E-COMMUTE MO! - Philippine Transport Assistant

A full-stack mobile application designed for commuters in the Philippines, helping navigate jeepneys, buses, tricycles, and MRT/LRT systems with AI-powered route suggestions and crowd-sourced updates.

## Features

### Route Finder
- AI-based route suggestions with multiple transport options
- Real-time route optimization
- Multiple priority modes (fastest, cheapest, balanced)
- Step-by-step navigation instructions

### Fare Estimator
- Accurate fare calculation for jeepneys, buses, trains, and tricycles
- Distance-based pricing
- Multi-leg journey support
- Real-time fare updates

### Nearby Terminals
- GPS-based terminal finder with map visualization
- 2km radius search
- Filter by transport type
- Walking directions to terminals

### Crowd-Sourced Reports
- Community updates on traffic, route changes, and congestion
- Upvote/downvote system for reliability
- Real-time notifications
- Report submission and verification

### Smart Commute Mode
- Personalized route suggestions based on time and behavior
- Frequent destination tracking
- Current traffic conditions integration
- Historical data analysis

### Additional Features
- Dark mode support
- Filipino language interface
- Offline mode with cached routes
- Google Places autocomplete search
- Interactive maps with route visualization
- Smooth animations and transitions

## Tech Stack

### Frontend
- React Native 0.81.5
- Expo SDK 54
- React 19.1.0
- React Navigation 6.x
- React Native Maps 1.20.1
- Expo Location 19.x
- @expo/vector-icons 15.x
- Firebase 11.x Authentication
- Google Places Autocomplete
- React Native Animatable

### Backend
- Node.js + Express
- Firebase Admin
- RESTful API
- MongoDB/Firestore (optional)

## Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Update `src/context/AuthContext.js` with your Firebase config

3. Configure Google Places API:
   - Get API key from Google Cloud Console
   - Enable Places API, Maps SDK, and Geocoding API
   - Update `src/screens/HomeScreen.js` with your API key
   - See `GOOGLE_PLACES_SETUP.md` for detailed instructions

4. Start the app:
```bash
npx expo start --clear
```

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials

5. Start the server:
```bash
npm run dev
```

## Running the App

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## Project Structure

```
e-commute-mo/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── RouteCard.js
│   │   └── TerminalMarker.js
│   ├── screens/         # Main app screens
│   │   ├── HomeScreen.js
│   │   ├── TerminalsScreen.js
│   │   ├── ReportsScreen.js
│   │   └── ProfileScreen.js
│   ├── services/        # API service layer
│   │   └── api.js
│   ├── context/         # React Context (Auth)
│   │   └── AuthContext.js
│   └── utils/           # Helper functions & algorithms
│       └── routeAlgorithm.js
├── backend/
│   ├── routes/          # API endpoints
│   │   ├── routes.js
│   │   ├── fare.js
│   │   ├── terminals.js
│   │   └── reports.js
│   ├── data/            # Sample data
│   │   ├── sampleRoutes.js
│   │   └── sampleTerminals.js
│   └── server.js        # Express server
├── assets/              # Images and icons
└── App.js               # Root component
```

## API Endpoints

### Routes
- `POST /api/routes` - Find routes between origin and destination
- `POST /api/fare` - Calculate fare for a route

### Terminals
- `GET /api/terminals` - Get nearby terminals (params: latitude, longitude, radius)

### Reports
- `GET /api/reports` - Get community reports
- `POST /api/reports` - Submit new report
- `POST /api/reports/:id/vote` - Vote on report (params: vote)

## Key Components

### RouteCard
Displays route information with transport icons, fare, time, and transfers.

### TerminalMarker
Custom map markers for terminals with color-coding by transport type.

### HomeScreen
Route finder with Google Places autocomplete, AI suggestions, and map visualization.

### TerminalsScreen
Map view of nearby terminals with filtering and route lines.

### ReportsScreen
Community updates and reports with voting system.

### ProfileScreen
User profile, settings, and travel history.

## AI Features

The app uses a scoring algorithm that considers:
- Travel time optimization
- Cost efficiency analysis
- Number of transfers
- Real-time traffic conditions
- User preference learning

## Distance Calculation

Uses Haversine formula for accurate distance calculations:
- Accuracy: ±100 meters
- Accounts for Earth's curvature
- Real-time GPS positioning
- Optimized for Philippine geography

## Fare Calculation

### Jeepney
- Base fare: ₱13
- Per kilometer: ₱1.50

### Bus
- Base fare: ₱15
- Per kilometer: ₱2.00

### Train (MRT/LRT)
- Base fare: ₱15
- Per kilometer: ₱1.00

### Tricycle
- Base fare: ₱20
- Per kilometer: ₱5.00

## Configuration

### API Base URL
Update in `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3000/api';
```

To find your IP address:
- Windows: Run `ipconfig` and look for IPv4 Address
- Mac/Linux: Run `ifconfig` and look for inet address

### Firebase Configuration
Update in `src/context/AuthContext.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Offline Mode

The app includes offline functionality:
- Cached route data
- Fallback mock data when backend is unavailable
- Local distance calculations
- Graceful error handling

## Future Enhancements

- Offline route caching
- Push notifications for disruptions
- Machine learning for ETA prediction
- Integration with real-time traffic APIs
- Multi-language support (Tagalog, English, Cebuano)
- Fare calculator with discounts (student, senior, PWD)
- Social features (share routes, group travel)
- Payment integration
- Driver/operator portal

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow React Native best practices
2. Use functional components with hooks
3. Implement proper error handling
4. Write clean, documented code
5. Test on both iOS and Android
6. Ensure accessibility compliance

## Troubleshooting

### Metro Bundler Issues
```bash
npx expo start --clear
# or
npm start -- --reset-cache
```

### Module Resolution Errors
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Backend Connection Issues
- Verify backend is running on correct port
- Check IP address in `src/services/api.js`
- Ensure firewall allows connections
- App will use offline mode if backend unavailable

### Location Permission Issues
- Grant location permission when prompted
- Check device location settings
- Ensure GPS is enabled

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

## Acknowledgments

Built for Filipino commuters to improve daily transportation experience.

## Documentation

- `GOOGLE_PLACES_SETUP.md` - Google Places API configuration guide
- `FEATURES_TAGALOG.md` - Feature documentation in Filipino
- `IMPROVEMENTS_SUMMARY.md` - Complete list of improvements
- `ALL_FIXED.md` - Recent fixes and updates

## Version

Current Version: 1.0.0

## Authors

Development Team

## Contact

For support or inquiries, please contact through GitHub issues.
