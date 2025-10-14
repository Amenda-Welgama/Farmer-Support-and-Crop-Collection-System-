import React from 'react';
import { View, Text } from 'react-native';

export default function Header({ title }) {
  return (
    <View style={{ padding: 20, backgroundColor: '#4CAF50' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
        {title}
      </Text>
    </View>
  );
}
