import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Role is fixed as "user"
  const role = 'user';

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/users/auth/register`, { 
        name, 
        email, 
        address, 
        phone, 
        password, 
        role 
      });
      alert('✅ Registration successful');
      navigation.navigate('Login');
    } catch (err) {
      console.error(err);
      alert('❌ Error registering: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌾 Create Account</Text>
      <Text style={styles.subtitle}>Join as a Farmer/Buyer</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        placeholderTextColor="#777"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#F9F9F9' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#1B5E20' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fff' },
  button: { backgroundColor: '#1B5E20', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 15, textAlign: 'center', color: '#2E7D32', fontWeight: '600' },
});
