import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import TerminalsScreen from './src/screens/TerminalsScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider } from './src/context/AuthContext';

const Tab = createBottomTabNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') iconName = focused ? 'map' : 'map-outline';
              else if (route.name === 'Terminals') iconName = focused ? 'location' : 'location-outline';
              else if (route.name === 'Reports') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            },
            headerStyle: {
              backgroundColor: isDark ? '#1a1a1a' : '#4CAF50',
            },
            headerTintColor: '#ffffff',
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'E-COMMUTE MO!' }} />
          <Tab.Screen name="Terminals" component={TerminalsScreen} options={{ title: 'Nearby Terminals' }} />
          <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Community Reports' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
