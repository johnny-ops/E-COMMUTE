import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, ActivityIndicator, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Animatable from 'react-native-animatable';
import RouteCard from '../components/RouteCard';
import { routeService } from '../services/api';
import { calculateBestRoute } from '../utils/routeAlgorithm';

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState('balanced');
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 14.5995,
    longitude: 120.9842,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [showMap, setShowMap] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Kailangan ang Permission', 'Location permission is required para gumana ang app');
        return;
      }
      
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    })();
  }, []);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: showMap ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [showMap]);

  const handleSearch = async () => {
    if (!origin || !destination) {
      Alert.alert('Kulang ang Impormasyon', 'Pakilagay ang origin at destination');
      return;
    }
    
    setLoading(true);
    setShowMap(true);
    try {
      const result = await routeService.findRoutes(
        origin.description || origin,
        destination.description || destination
      );
      const rankedRoutes = calculateBestRoute(result.routes, { priority });
      setRoutes(rankedRoutes);
      
      if (rankedRoutes.length > 0) {
        setSelectedRoute(rankedRoutes[0]);
        
        // Create route coordinates for polyline
        if (origin.location && destination.location) {
          const coords = [
            {
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            },
            {
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }
          ];
          setRouteCoordinates(coords);
          
          // Fit map to show both markers
          if (mapRef.current) {
            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
              animated: true,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error finding routes:', error);
      Alert.alert('Error', 'Hindi mahanap ang ruta. Subukan ulit.');
    } finally {
      setLoading(false);
    }
  };

  const useCurrentLocation = async () => {
    if (location) {
      setOrigin({
        description: 'Kasalukuyang Lokasyon',
        location: { lat: location.latitude, lng: location.longitude }
      });
    } else {
      Alert.alert('Walang Location', 'I-enable ang location services');
    }
  };

  const getTransportColor = (type) => {
    const colors = {
      jeepney: '#FF9800',
      bus: '#2196F3',
      train: '#9C27B0',
      tricycle: '#4CAF50',
    };
    return colors[type] || '#757575';
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      {showMap && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsTraffic
        >
          {origin && origin.location && (
            <Marker
              coordinate={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
              }}
              title="Simula"
              description={origin.description}
              pinColor="#4CAF50"
            >
              <View style={styles.customMarker}>
                <Ionicons name="location" size={32} color="#4CAF50" />
              </View>
            </Marker>
          )}
          
          {destination && destination.location && (
            <Marker
              coordinate={{
                latitude: destination.location.lat,
                longitude: destination.location.lng,
              }}
              title="Destinasyon"
              description={destination.description}
              pinColor="#F44336"
            >
              <View style={styles.customMarker}>
                <Ionicons name="flag" size={32} color="#F44336" />
              </View>
            </Marker>
          )}
          
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#4CAF50"
              strokeWidth={5}
              lineDashPattern={[1]}
            />
          )}
        </MapView>
      )}
      
      <Animatable.View 
        animation="fadeInDown" 
        duration={800}
        style={[styles.searchContainer, isDark && styles.searchContainerDark]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>E-COMMUTE MO!</Text>
          <TouchableOpacity onPress={() => setShowMap(!showMap)}>
            <Ionicons name={showMap ? 'list' : 'map'} size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={20} color="#4CAF50" />
          </View>
          <GooglePlacesAutocomplete
            placeholder="Saan ka galing? (e.g., Cubao)"
            onPress={(data, details = null) => {
              setOrigin({
                description: data.description,
                location: details?.geometry?.location
              });
            }}
            query={{
              key: 'YOUR_GOOGLE_PLACES_API_KEY', // Replace with your API key
              language: 'tl',
              components: 'country:ph',
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            styles={{
              textInput: [styles.autocompleteInput, isDark && styles.autocompleteInputDark],
              container: styles.autocompleteContainer,
              listView: styles.autocompleteList,
            }}
            textInputProps={{
              placeholderTextColor: isDark ? '#999' : '#666',
            }}
          />
          <TouchableOpacity onPress={useCurrentLocation} style={styles.iconContainer}>
            <Ionicons name="navigate" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="flag" size={20} color="#F44336" />
          </View>
          <GooglePlacesAutocomplete
            placeholder="Saan ka pupunta? (e.g., Makati)"
            onPress={(data, details = null) => {
              setDestination({
                description: data.description,
                location: details?.geometry?.location
              });
            }}
            query={{
              key: 'YOUR_GOOGLE_PLACES_API_KEY', // Replace with your API key
              language: 'tl',
              components: 'country:ph',
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            styles={{
              textInput: [styles.autocompleteInput, isDark && styles.autocompleteInputDark],
              container: styles.autocompleteContainer,
              listView: styles.autocompleteList,
            }}
            textInputProps={{
              placeholderTextColor: isDark ? '#999' : '#666',
            }}
          />
        </View>
        
        <View style={styles.priorityContainer}>
          {[
            { key: 'fastest', label: 'Mabilis', icon: 'flash' },
            { key: 'cheapest', label: 'Mura', icon: 'cash' },
            { key: 'balanced', label: 'Balansado', icon: 'speedometer' }
          ].map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[styles.priorityBtn, priority === p.key && styles.priorityBtnActive]}
              onPress={() => setPriority(p.key)}
            >
              <Ionicons 
                name={p.icon} 
                size={16} 
                color={priority === p.key ? '#fff' : '#666'} 
              />
              <Text style={[styles.priorityText, priority === p.key && styles.priorityTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.searchBtn, loading && styles.searchBtnDisabled]} 
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.searchBtnText}>Maghanap ng Ruta</Text>
            </>
          )}
        </TouchableOpacity>
      </Animatable.View>
      
      {!showMap && (
        <Animated.ScrollView 
          style={[
            styles.resultsContainer,
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }]
            }
          ]}
        >
          {routes.map((route, index) => (
            <Animatable.View
              key={index}
              animation="fadeInUp"
              delay={index * 100}
              duration={600}
            >
              <RouteCard 
                route={route} 
                onPress={() => {
                  setSelectedRoute(route);
                  setShowMap(true);
                }} 
              />
            </Animatable.View>
          ))}
          {routes.length === 0 && !loading && (
            <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={64} color="#ccc" />
              <Text style={[styles.emptyText, isDark && styles.textDark]}>
                Ilagay ang simula at destinasyon{'\n'}para mahanap ang ruta
              </Text>
            </Animatable.View>
          )}
        </Animated.ScrollView>
      )}
      
      {showMap && routes.length > 0 && (
        <Animatable.View 
          animation="slideInUp" 
          duration={600}
          style={[styles.routePreview, isDark && styles.routePreviewDark]}
        >
          <Text style={[styles.routePreviewTitle, isDark && styles.textDark]}>
            Mga Ruta
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {routes.map((route, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.routePreviewCard,
                  selectedRoute === route && styles.routePreviewCardActive
                ]}
                onPress={() => setSelectedRoute(route)}
              >
                <View style={styles.routePreviewHeader}>
                  {route.steps.map((step, i) => (
                    <View key={i} style={[styles.transportIcon, { backgroundColor: getTransportColor(step.type) }]}>
                      <Ionicons name="bus" size={12} color="#fff" />
                    </View>
                  ))}
                </View>
                <Text style={styles.routePreviewTime}>{route.estimatedTime} min</Text>
                <Text style={styles.routePreviewFare}>₱{route.totalFare}</Text>
                <Text style={styles.routePreviewTransfers}>
                  {route.transfers} {route.transfers === 1 ? 'lipat' : 'paglipat'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  searchContainerDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: 1,
    textShadowColor: 'rgba(76, 175, 80, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginBottom: 12,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    padding: 12,
  },
  autocompleteContainer: {
    flex: 1,
  },
  autocompleteInput: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    backgroundColor: 'transparent',
    paddingVertical: 14,
  },
  autocompleteInputDark: {
    color: '#fff',
  },
  autocompleteList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priorityBtnActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    elevation: 4,
  },
  priorityText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  searchBtn: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  searchBtnDisabled: {
    backgroundColor: '#9E9E9E',
    shadowColor: '#000',
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
    lineHeight: 22,
  },
  routePreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  routePreviewDark: {
    backgroundColor: 'rgba(26, 26, 26, 0.98)',
  },
  routePreviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  routePreviewCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    minWidth: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routePreviewCardActive: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    elevation: 6,
  },
  routePreviewHeader: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  transportIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routePreviewTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  routePreviewFare: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  routePreviewTransfers: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  textDark: {
    color: '#fff',
  },
});

export default HomeScreen;
