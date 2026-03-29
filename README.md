# 🚌 E-COMMUTE MO! - Philippine Transport Assistant

A full-stack mobile application designed for commuters in the Philippines, helping navigate jeepneys, buses, tricycles, and MRT/LRT systems with AI-powered route suggestions and crowd-sourced updates.

## 🎯 Features

- **Route Finder**: AI-based route suggestions with multiple transport options
- **Fare Estimator**: Accurate fare calculation for jeepneys, buses, trains, and tricycles
- **Nearby Terminals**: GPS-based terminal finder with map visualization
- **Crowd-Sourced Reports**: Community updates on traffic, route changes, and congestion
- **Smart Commute Mode**: Personalized route suggestions based on time and behavior
- **Dark Mode Support**: Comfortable viewing in any lighting condition

## 🛠️ Tech Stack

### Frontend
- React Native 0.81.5
- Expo SDK 54
- React 19.1.0
- React Navigation 6.x
- React Native Maps 1.20.1
- Expo Location 19.x
- @expo/vector-icons 15.x
- Firebase 11.x Authentication

### Backend
- Node.js + Express
- Firebase Admin
- RESTful API

## 📦 Installation

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Update `src/context/AuthContext.js` with your Firebase config

3. Start the app:
```bash
npm start
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

## 📱 Running the App

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## 🗂️ Project Structure

```
commute-helper/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # Main app screens
│   ├── services/         # API service layer
│   ├── context/          # React Context (Auth)
│   └── utils/            # Helper functions & algorithms
├── backend/
│   ├── routes/           # API endpoints
│   ├── data/             # Sample data
│   └── server.js         # Express server
└── App.js                # Root component
```

## 🚀 API Endpoints

- `POST /api/routes` - Find routes between origin and destination
- `POST /api/fare` - Calculate fare for a route
- `GET /api/terminals` - Get nearby terminals
- `GET /api/reports` - Get community reports
- `POST /api/reports` - Submit new report
- `POST /api/reports/:id/vote` - Vote on report

## 🎨 Key Components

- **RouteCard**: Displays route information with transport icons
- **TerminalMarker**: Custom map markers for terminals
- **HomeScreen**: Route finder with AI suggestions
- **TerminalsScreen**: Map view of nearby terminals
- **ReportsScreen**: Community updates and reports
- **ProfileScreen**: User profile and settings

## 🧠 AI Features

The app uses a scoring algorithm that considers:
- Travel time
- Cost efficiency
- Number of transfers
- Real-time traffic conditions
- User preferences

## 🌟 Future Enhancements

- Offline route caching
- Push notifications for disruptions
- Machine learning for ETA prediction
- Integration with real-time traffic APIs
- Multi-language support (Tagalog, English)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for Filipino commuters by E-COMMUTE MO!
