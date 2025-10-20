import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator, StatusBar 
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../services/api';

export default function FarmerDashboard({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [stats, setStats] = useState({
    confirmedOrderCount: 0,
    pendingOrderCount: 0,
    productCount: 0,
    totalProfit: 0,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  // ✅ Load userId once
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (!id) {
          Alert.alert('Error', 'User ID not found. Please login again.');
          navigation.replace('Login');
          return;
        }
        setUserId(id);
      } catch (error) {
        console.log('Error getting userId:', error);
      }
    };
    getUserId();
  }, []);

  // ✅ Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!userId) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const fetchData = async (url) => {
        try {
          const response = await axios.get(url, { headers });
          return response.data;
        } catch (error) {
          if (error.response?.status === 404) {
            return {};
          }
          throw error;
        }
      };

      const [confirmedRes, pendingRes, productRes, profitRes, productListRes] = await Promise.all([
        fetchData(`${API_BASE}/orders/stats/confirmed-count/${userId}`),
        fetchData(`${API_BASE}/orders/stats/pending-count/${userId}`),
        fetchData(`${API_BASE}/products/product-count/${userId}`),
        fetchData(`${API_BASE}/orders/profit/${userId}`),
        fetchData(`${API_BASE}/products/user/${userId}`)
      ]);

      setStats({
        confirmedOrderCount: confirmedRes?.confirmedOrderCount ?? 0,
        pendingOrderCount: pendingRes?.pendingOrderCount ?? 0,
        productCount: productRes?.productCount ?? 0,
        totalProfit: profitRes?.totalProfit ?? 0,
      });

      setProducts(Array.isArray(productListRes) ? productListRes : []);

    } catch (error) {
      console.log('Error fetching dashboard data:', error);
      setStats({
        confirmedOrderCount: 0,
        pendingOrderCount: 0,
        productCount: 0,
        totalProfit: 0,
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial + auto refresh (every 10s)
  useEffect(() => {
    if (userId) {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleFooterNavigation = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'home':
        // Already on home
        break;
      case 'crops':
        navigation.navigate('MyCrops');
        break;
      case 'orders':
        navigation.navigate('Orders');
        break;
      case 'chat':
        navigation.navigate('Chat');
        break;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#66BB6A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2d5016" />
      
      {/* ✨ Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="person" size={28} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerGreeting}>Welcome Back!</Text>
              <Text style={styles.headerName}>Farmer Dashboard</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{stats.pendingOrderCount}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://st.depositphotos.com/3113899/4022/v/450/depositphotos_40221619-stock-illustration-farm.jpg' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Grow Your Success</Text>
            <Text style={styles.heroSubtitle}>Manage your farm efficiently</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Quick Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCard1]}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="check-circle" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.statValue}>{stats.confirmedOrderCount}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>

            <View style={[styles.statCard, styles.statCard2]}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="hourglass-empty" size={32} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{stats.pendingOrderCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={[styles.statCard, styles.statCard3]}>
              <View style={styles.statIconContainer}>
                <MaterialIcons name="inventory" size={32} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{stats.productCount}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>

            <View style={[styles.statCard, styles.statCard4]}>
              <View style={styles.statIconContainer}>
                <FontAwesome5 name="coins" size={28} color="#FFD700" />
              </View>
              <Text style={styles.statValue}>Rs. {stats.totalProfit}</Text>
              <Text style={styles.statLabel}>Profit</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCard1]} 
              onPress={() => navigation.navigate('CropUpload')}
            >
              <View style={styles.actionIconCircle}>
                <MaterialIcons name="cloud-upload" size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>Upload</Text>
              <Text style={styles.actionSubtitle}>Add New Crop</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCard2]} 
              onPress={() => navigation.navigate('MyCrops')}
            >
              <View style={styles.actionIconCircle}>
                <MaterialIcons name="inventory-2" size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>My Crops</Text>
              <Text style={styles.actionSubtitle}>View Inventory</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCard3]} 
              onPress={() => navigation.navigate('Orders')}
            >
              <View style={styles.actionIconCircle}>
                <FontAwesome5 name="shopping-cart" size={28} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>Orders</Text>
              <Text style={styles.actionSubtitle}>Track Sales</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCard4]} 
              onPress={() => navigation.navigate('Chat')}
            >
              <View style={styles.actionIconCircle}>
                <MaterialIcons name="chat" size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>Messages</Text>
              <Text style={styles.actionSubtitle}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for footer */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ✨ Modern Footer Navigation */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity 
            style={styles.footerTab}
            onPress={() => handleFooterNavigation('home')}
          >
            <View style={[styles.footerIconContainer, activeTab === 'home' && styles.activeTab]}>
              <Ionicons 
                name={activeTab === 'home' ? 'home' : 'home-outline'} 
                size={24} 
                color={activeTab === 'home' ? '#4CAF50' : '#666'} 
              />
            </View>
            <Text style={[styles.footerLabel, activeTab === 'home' && styles.activeLabel]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerTab}
            onPress={() => handleFooterNavigation('crops')}
          >
            <View style={[styles.footerIconContainer, activeTab === 'crops' && styles.activeTab]}>
              <MaterialIcons 
                name="inventory-2" 
                size={24} 
                color={activeTab === 'crops' ? '#4CAF50' : '#666'} 
              />
            </View>
            <Text style={[styles.footerLabel, activeTab === 'crops' && styles.activeLabel]}>Crops</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerCenterButton}
            onPress={() => navigation.navigate('CropUpload')}
          >
            <View style={styles.centerButtonCircle}>
              <MaterialIcons name="add" size={32} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerTab}
            onPress={() => handleFooterNavigation('orders')}
          >
            <View style={[styles.footerIconContainer, activeTab === 'orders' && styles.activeTab]}>
              <FontAwesome5 
                name="shopping-cart" 
                size={22} 
                color={activeTab === 'orders' ? '#4CAF50' : '#666'} 
              />
            </View>
            <Text style={[styles.footerLabel, activeTab === 'orders' && styles.activeLabel]}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerTab}
            onPress={() => handleFooterNavigation('chat')}
          >
            <View style={[styles.footerIconContainer, activeTab === 'chat' && styles.activeTab]}>
              <Ionicons 
                name={activeTab === 'chat' ? 'chatbubbles' : 'chatbubbles-outline'} 
                size={24} 
                color={activeTab === 'chat' ? '#4CAF50' : '#666'} 
              />
            </View>
            <Text style={[styles.footerLabel, activeTab === 'chat' && styles.activeLabel]}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8faf9' 
  },
  
  // ✨ Header Styles
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerGreeting: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  headerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  scrollContainer: { 
    paddingHorizontal: 20, 
    paddingBottom: 100,
  },

  // Hero Banner
  heroBanner: {
    marginTop: 20,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },

  // Stats Section
  statsSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d5016',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
  },
  statCard1: { borderLeftColor: '#4CAF50' },
  statCard2: { borderLeftColor: '#FF9800' },
  statCard3: { borderLeftColor: '#2196F3' },
  statCard4: { borderLeftColor: '#FFD700' },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  // Actions Section
  actionsSection: {
    marginTop: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  actionCard1: { backgroundColor: '#66BB6A' },
  actionCard2: { backgroundColor: '#7CB342' },
  actionCard3: { backgroundColor: '#558B2F' },
  actionCard4: { backgroundColor: '#33691E' },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },

  // ✨ Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 10,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 10,
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  footerLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  footerCenterButton: {
    marginTop: -30,
  },
  centerButtonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
});