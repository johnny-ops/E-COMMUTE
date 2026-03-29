import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import TerminalMarker from '../components/TerminalMarker';
import { terminalService } from '../services/api';

const TerminalsScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [location, setLocation] = useState(null);
  const [terminals, setTerminals] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [routeToTerminal, setRouteToTerminal] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Kailangan ang Permission', 'Location permission para makita ang malapit na terminal');
        setLoading(false);
        return;
      }
      
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        fetchNearbyTerminals(loc.coords.latitude, loc.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Hindi makuha ang iyong lokasyon');
        setLoading(false);
      }
    })();
  }, []);

  const fetchNearbyTerminals = async (lat, lng) => {
    try {
      const data = await terminalService.getNearbyTerminals(lat, lng);
      setTerminals(data.terminals || []);
    } catch (error) {
      console.error('Error fetching terminals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTerminals = selectedType === 'all' 
    ? terminals 
    : terminals.filter(t => t.type === selectedType);

  const transportTypes = [
    { key: 'all', label: 'Lahat', icon: 'apps', color: '#4CAF50' },
    { key: 'jeepney', label: 'Jeep', icon: 'bus', color: '#FF9800' },
    { key: 'bus', label: 'Bus', icon: 'bus-outline', color: '#2196F3' },
    { key: 'train', label: 'Tren', icon: 'train', color: '#9C27B0' },
    { key: 'tricycle', label: 'Traysikel', icon: 'bicycle', color: '#4CAF50' },
  ];

  const showRouteToTerminal = (terminal) => {
    if (location) {
      const route = [
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          latitude: terminal.latitude,
          longitude: terminal.longitude,
        }
      ];
      setRouteToTerminal(route);
      setSelectedTerminal(terminal);
    }
  };

  const getDirections = (terminal) => {
    Alert.alert(
      'Pumunta sa Terminal',
      `Gusto mo bang pumunta sa ${terminal.name}?`,
      [
        { text: 'Kanselahin', style: 'cancel' },
        { 
          text: 'Tingnan ang Ruta', 
          onPress: () => showRouteToTerminal(terminal)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsTraffic
        >
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={2000}
            strokeColor="rgba(76, 175, 80, 0.6)"
            strokeWidth={2}
            fillColor="rgba(76, 175, 80, 0.1)"
          />
          
          {filteredTerminals.map((terminal) => (
            <TerminalMarker 
              key={terminal.id} 
              terminal={terminal}
              onPress={() => showRouteToTerminal(terminal)}
            />
          ))}
          
          {routeToTerminal.length > 0 && (
            <Polyline
              coordinates={routeToTerminal}
              strokeColor="#4CAF50"
              strokeWidth={4}
              lineDashPattern={[10, 5]}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      )}
      
      <Animatable.View 
        animation="fadeInDown" 
        duration={800}
        style={[styles.filterContainer, isDark && styles.filterContainerDark]}
      >
        <FlatList
          horizontal
          data={transportTypes}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterBtn,
                selectedType === item.key && { backgroundColor: item.color }
              ]}
              onPress={() => {
                setSelectedType(item.key);
                setRouteToTerminal([]);
                setSelectedTerminal(null);
              }}
            >
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={selectedType === item.key ? '#fff' : '#666'} 
              />
              <Text style={[
                styles.filterText,
                selectedType === item.key && styles.filterTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animatable.View>
      
      <Animatable.View 
        animation="slideInUp" 
        duration={800}
        style={[styles.listContainer, isDark && styles.listContainerDark]}
      >
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, isDark && styles.textDark]}>
            Malapit na Terminal
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filteredTerminals.length}</Text>
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, isDark && styles.textDark]}>
              Hinahanap ang mga terminal...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredTerminals}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Animatable.View
                animation="fadeInUp"
                delay={index * 100}
                duration={600}
              >
                <TouchableOpacity 
                  style={[
                    styles.terminalCard, 
                    isDark && styles.terminalCardDark,
                    selectedTerminal?.id === item.id && styles.terminalCardSelected
                  ]}
                  onPress={() => showRouteToTerminal(item)}
                >
                  <View style={[
                    styles.terminalIcon, 
                    { backgroundColor: transportTypes.find(t => t.key === item.type)?.color || '#757575' }
                  ]}>
                    <Ionicons 
                      name={transportTypes.find(t => t.key === item.type)?.icon || 'location'} 
                      size={24} 
                      color="#fff" 
                    />
                  </View>
                  
                  <View style={styles.terminalInfo}>
                    <Text style={[styles.terminalName, isDark && styles.textDark]}>
                      {item.name}
                    </Text>
                    <View style={styles.terminalMeta}>
                      <Ionicons name="navigate" size={12} color="#4CAF50" />
                      <Text style={styles.terminalDistance}>
                        {item.distance?.toFixed(2)} km ang layo
                      </Text>
                    </View>
                    {item.routes && (
                      <View style={styles.routesContainer}>
                        <Ionicons name="git-branch-outline" size={12} color="#666" />
                        <Text style={styles.terminalRoutes} numberOfLines={1}>
                          {item.routes.join(' • ')}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.directionsBtn}
                    onPress={() => getDirections(item)}
                  >
                    <Ionicons name="navigate-circle" size={36} color="#4CAF50" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animatable.View>
            )}
            ListEmptyComponent={
              <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={64} color="#ccc" />
                <Text style={[styles.emptyText, isDark && styles.textDark]}>
                  Walang terminal na malapit
                </Text>
              </Animatable.View>
            }
          />
        )}
      </Animatable.View>
      
      {selectedTerminal && (
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite"
          duration={2000}
          style={styles.selectedIndicator}
        >
          <Ionicons name="location" size={20} color="#4CAF50" />
          <Text style={styles.selectedText}>
            Pinili: {selectedTerminal.name}
          </Text>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  filterContainerDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  listContainerDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  terminalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  terminalCardDark: {
    backgroundColor: '#2a2a2a',
  },
  terminalCardSelected: {
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    elevation: 6,
  },
  terminalIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  terminalInfo: {
    flex: 1,
  },
  terminalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  terminalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  terminalDistance: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  routesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  terminalRoutes: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  directionsBtn: {
    padding: 6,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 80,
    left: '50%',
    transform: [{ translateX: -75 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
  },
  textDark: {
    color: '#fff',
  },
});

export default TerminalsScreen;
