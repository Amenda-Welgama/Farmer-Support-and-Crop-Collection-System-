// src/screens/OrdersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  const fetchOrders = () => {
    axios.get(`${API_BASE}/orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  const confirmOrder = async (orderId) => {
    try {
      await axios.patch(`${API_BASE}/orders/${orderId}/confirm`);
      Alert.alert('Confirmed', 'Order marked as confirmed');
      fetchOrders();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not confirm order');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear all orders',
      'This will permanently delete all orders. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
            axios.delete(`${API_BASE}/orders?confirm=true`)
              .then(res => {
                Alert.alert('Deleted', `${res.data.deletedCount || 0} orders deleted`);
                fetchOrders();
              })
              .catch(err => {
                console.log(err);
                Alert.alert('Error', 'Could not delete orders');
              });
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=60' }}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }} // Slight transparency for readability
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Orders</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        {orders.map(order => (
          <View key={order._id} style={styles.orderCard}>
            <Text style={styles.orderText}>Crop: {order.crop?.name}</Text>
            <Text style={styles.orderText}>Quantity: {order.quantity}</Text>
            <Text style={styles.orderText}>Buyer: {order.buyerEmail || order.buyer?.name}</Text>
            <Text style={styles.orderText}>Status: {order.status}</Text>
            <Text style={styles.orderText}>Price: Rs.{order.price}</Text>
            <View style={styles.orderActions}>
              {order.status !== 'confirmed' && (
                <TouchableOpacity style={styles.confirmButton} onPress={() => {
                  Alert.alert(
                    'Confirm order',
                    'Are you sure you want to confirm this order? This will notify the buyer.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Confirm', onPress: () => confirmOrder(order._id) }
                    ],
                    { cancelable: true }
                  );
                }}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.deleteOrderButton} onPress={() => {
                Alert.alert(
                  'Delete order',
                  'Are you sure you want to delete this order? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: async () => {
                      try {
                        await axios.delete(`${API_BASE}/orders/${order._id}`);
                        Alert.alert('Deleted', 'Order has been deleted');
                        fetchOrders();
                      } catch (err) {
                        console.log(err);
                        Alert.alert('Error', 'Failed to delete order');
                      }
                    } }
                  ],
                  { cancelable: true }
                );
              }}>
                <Text style={styles.deleteOrderButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, resizeMode:'cover' },
  container: { padding:20, paddingTop:50, paddingBottom:30 },
  header: { 
    fontSize:28, fontWeight:'bold', color:'#fff', marginBottom:20, 
    textAlign:'center', textShadowColor:'#000', textShadowOffset:{width:1,height:1}, textShadowRadius:5 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: '#e53935',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  orderCard: { 
    backgroundColor:'#ffffffaa', padding:15, borderRadius:15, marginBottom:15, 
    shadowColor:'#000', shadowOpacity:0.2, shadowOffset:{width:0,height:3}, shadowRadius:4, elevation:5 
  },
  orderText: { fontSize:16, marginBottom:5, color:'#333' },
  orderActions: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  deleteOrderButton: { backgroundColor: '#e53935', paddingHorizontal:12, paddingVertical:8, borderRadius:8 },
  deleteOrderButtonText: { color: '#fff', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#2E7D32', paddingHorizontal:12, paddingVertical:8, borderRadius:8, marginRight:8 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold' },
});
