// src/screens/BuyerDashboard.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function BuyerDashboard({ navigation }) {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/crops`)
      .then(res => setCrops(res.data))
      .catch(err => console.log(err));
  }, []);

  const placeOrder = async (cropId) => {
    try {
      await axios.post(`${API_BASE}/orders`, { cropId, quantity: 1 });
      alert('Order placed successfully!');
    } catch (err) {
      console.log(err);
      alert('Failed to place order');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
            // Clear any auth tokens if used
            navigation.replace('Login');
          } 
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={{ uri:'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60' }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Available Crops</Text>

        {crops.map(crop => (
          <View key={crop._id} style={styles.card}>
            {crop.image && <Image source={{ uri: crop.image }} style={styles.image} />}
            <View style={styles.cardContent}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropDetails}>Price: ${crop.price}</Text>
              <Text style={styles.cropDetails}>Quantity: {crop.quantity}</Text>
              <TouchableOpacity style={styles.button} onPress={() => placeOrder(crop._id)}>
                <Text style={styles.buttonText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Logout Button - Fixed at bottom-right */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, resizeMode:'cover' },
  scrollContainer: { padding:20, paddingBottom:120 }, // extra bottom padding for logout button
  header: { fontSize:28, fontWeight:'bold', color:'#fff', marginBottom:20, textAlign:'center', textShadowColor:'#000', textShadowOffset:{width:1,height:1}, textShadowRadius:5 },
  card: { backgroundColor:'#ffffffcc', borderRadius:15, marginBottom:20, overflow:'hidden', shadowColor:'#000', shadowOpacity:0.2, shadowOffset:{width:0,height:3}, shadowRadius:5, elevation:5 },
  image: { width:'100%', height:150 },
  cardContent: { padding:15 },
  cropName: { fontSize:20, fontWeight:'bold', marginBottom:5, color:'#333' },
  cropDetails: { fontSize:16, marginBottom:5, color:'#555' },
  button: { backgroundColor:'#4CAF50', padding:12, borderRadius:10, alignItems:'center', marginTop:10 },
  buttonText: { color:'#fff', fontSize:16, fontWeight:'bold' },
  logoutButton: {
    position: 'absolute',
    bottom: 40, // slightly above bottom
    right: 20,
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
  logoutText: { color:'#fff', fontSize:16, fontWeight:'bold' },
});
