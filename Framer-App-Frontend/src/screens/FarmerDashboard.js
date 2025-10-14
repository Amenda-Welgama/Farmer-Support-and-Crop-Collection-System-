// src/screens/FarmerDashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Alert, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function FarmerDashboard({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
            // Clear any auth tokens here if used
            navigation.replace('Login'); // Navigate back to login
          } 
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60' }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Welcome, Farmer!</Text>

        {/* Dashboard Cards */}
        <View style={styles.cardsWrapper}>
          <View style={styles.cardsContainerColumn}>

            {/* Upload Crop */}
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CropUpload')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
                <MaterialIcons name="cloud-upload" size={22} color="#fff" />
              </View>
              <Text style={styles.cardText}>Upload Crop</Text>
            </TouchableOpacity>

            {/* View Orders */}
            <TouchableOpacity 
              style={[styles.card, styles.cardOrange]} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Orders')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
                <FontAwesome5 name="shopping-cart" size={20} color="#fff" />
              </View>
              <Text style={styles.cardText}>View Orders</Text>
            </TouchableOpacity>

            {/* Chat */}
            <TouchableOpacity 
              style={[styles.card, styles.cardBlue]} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Chat')}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
                <MaterialIcons name="chat" size={22} color="#fff" />
              </View>
              <Text style={styles.cardText}>Chat</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Logout Button - Bottom Right */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: { paddingHorizontal: 20, paddingTop: 50, flexGrow: 1 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign:'center',
    textShadowColor:'#000',
    textShadowOffset:{ width:1, height:1 },
    textShadowRadius:5
  },
  cardsWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cardsContainerColumn: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#66BB6A',
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    overflow: 'hidden',
    shadowColor:'#000',
    shadowOpacity:0.22,
    shadowOffset:{ width:0, height:3 },
    shadowRadius:5,
    elevation:4,
  },
  cardOrange: {
    backgroundColor: '#FF7043'
  },
  cardBlue: {
    backgroundColor: '#42A5F5'
  },
  cardText: {
    color:'#fff',
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    alignSelf: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 14,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32', // Green
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width:0, height:4 },
    shadowRadius: 5,
    elevation: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
