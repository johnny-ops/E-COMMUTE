import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: 'bookmark', label: 'Naka-save na Ruta', screen: 'SavedRoutes' },
    { icon: 'time', label: 'Kasaysayan ng Biyahe', screen: 'History' },
    { icon: 'heart', label: 'Paborito', screen: 'Favorites' },
    { icon: 'notifications', label: 'Mga Abiso', screen: 'Notifications' },
    { icon: 'settings', label: 'Settings', screen: 'Settings' },
    { icon: 'help-circle', label: 'Tulong at Suporta', screen: 'Support' },
  ];

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={800}
        style={[styles.header, isDark && styles.headerDark]}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={[styles.userName, isDark && styles.textDark]}>
          {user?.email || 'Bisita'}
        </Text>
        <Text style={styles.userStats}>
          🚌 42 biyahe • ⭐ 128 ulat
        </Text>
      </Animatable.View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            delay={index * 100}
            duration={600}
          >
            <TouchableOpacity 
              style={[styles.menuItem, isDark && styles.menuItemDark]}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={22} color="#4CAF50" />
                </View>
                <Text style={[styles.menuLabel, isDark && styles.textDark]}>
                  {item.label}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
      
      <Animatable.View animation="fadeIn" delay={600}>
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={logout}
        >
          <Ionicons name="log-out" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Mag-logout</Text>
        </TouchableOpacity>
      </Animatable.View>
      
      <Text style={styles.version}>Bersyon 1.0.0</Text>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerDark: {
    backgroundColor: '#1a1a1a',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  userStats: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemDark: {
    backgroundColor: '#2a2a2a',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 32,
    gap: 10,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F44336',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    marginTop: 32,
    marginBottom: 48,
    fontWeight: '500',
  },
  textDark: {
    color: '#fff',
  },
});

export default ProfileScreen;
