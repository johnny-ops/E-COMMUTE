import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RouteCard = ({ route, onPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const getTransportIcon = (type) => {
    const icons = {
      jeepney: 'bus',
      bus: 'bus-outline',
      train: 'train',
      tricycle: 'bicycle',
    };
    return icons[type] || 'bus';
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
    <TouchableOpacity 
      style={[styles.card, isDark && styles.cardDark]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.transportBadge}>
          {route.steps.map((step, index) => (
            <View key={index} style={[styles.badge, { backgroundColor: getTransportColor(step.type) }]}>
              <Ionicons name={getTransportIcon(step.type)} size={16} color="#fff" />
            </View>
          ))}
        </View>
        <Text style={[styles.score, isDark && styles.textDark]}>
          Score: {route.score?.toFixed(0) || 'N/A'}
        </Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={18} color={isDark ? '#fff' : '#666'} />
          <Text style={[styles.detailText, isDark && styles.textDark]}>
            {route.estimatedTime} mins
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={18} color={isDark ? '#fff' : '#666'} />
          <Text style={[styles.detailText, isDark && styles.textDark]}>
            ₱{route.totalFare?.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="swap-horizontal-outline" size={18} color={isDark ? '#fff' : '#666'} />
          <Text style={[styles.detailText, isDark && styles.textDark]}>
            {route.transfers} transfer{route.transfers !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      <View style={styles.steps}>
        {route.steps.map((step, index) => (
          <Text key={index} style={[styles.stepText, isDark && styles.textDark]}>
            {index + 1}. {step.instruction}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transportBadge: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  steps: {
    marginTop: 8,
  },
  stepText: {
    fontSize: 13,
    color: '#333',
    marginVertical: 2,
  },
  textDark: {
    color: '#fff',
  },
});

export default RouteCard;
