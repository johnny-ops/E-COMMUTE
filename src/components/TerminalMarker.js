import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const TerminalMarker = ({ terminal, onPress }) => {
  const getMarkerColor = (type) => {
    const colors = {
      jeepney: '#FF9800',
      bus: '#2196F3',
      train: '#9C27B0',
      tricycle: '#4CAF50',
    };
    return colors[type] || '#757575';
  };

  return (
    <Marker
      coordinate={{
        latitude: terminal.latitude,
        longitude: terminal.longitude,
      }}
      onPress={onPress}
    >
      <View style={[styles.marker, { backgroundColor: getMarkerColor(terminal.type) }]}>
        <Ionicons name="location" size={24} color="#fff" />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});

export default TerminalMarker;
