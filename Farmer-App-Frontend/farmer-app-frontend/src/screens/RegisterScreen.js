import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/auth/register`, { name, email, password, role });
      alert('✅ Registration successful');
      navigation.navigate('Login');
    } catch (err) {
      alert('❌ Error registering');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌾 Create Account</Text>
      <Text style={styles.subtitle}>Join as Farmer or Buyer</Text>

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
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Select Role:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Farmer 👨‍🌾" value="farmer" />
          <Picker.Item label="Buyer 🛒" value="buyer" />
        </Picker>
      </View>

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
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  label: { marginTop: 8, marginLeft: 12, color: '#444', fontWeight: '600' },
  picker: { width: '100%', height: 50 },
  button: { backgroundColor: '#1B5E20', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 15, textAlign: 'center', color: '#2E7D32', fontWeight: '600' },
});
