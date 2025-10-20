import React from 'react';
import { View, Text, Button, Image } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function CropCard({ crop }) {
  const placeOrder = async () => {
    try {
      await axios.post(`${API_BASE}/orders`, { cropId: crop._id, quantity: 1 });
      alert('✅ Order placed successfully');
    } catch (err) {
      console.error(err);
      alert('❌ Error placing order');
    }
  };

  return (
    <View style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{crop.name}</Text>
      <Text>Price: {crop.price}</Text>
      <Text>Available: {crop.quantity}</Text>

      {crop.image && (
        <Image
          source={{ uri: crop.image }}
          style={{ width: 120, height: 120, marginVertical: 10, borderRadius: 8 }}
        />
      )}

      <Button title="Order" onPress={placeOrder} />
    </View>
  );
}
