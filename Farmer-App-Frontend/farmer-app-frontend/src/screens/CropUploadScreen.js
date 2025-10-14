// src/screens/CropUploadScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { API_BASE } from '../services/api';

export default function CropUploadScreen({ navigation }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Pick image from gallery (Expo SDK 49+ compatible)
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access gallery is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images', // ✅ just a string now
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      alert('Failed to open gallery');
    }
  };

  const handleUpload = async () => {
    if (!name || !quantity || !price || !image) {
      alert('⚠️ Please fill all fields and select an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('quantity', quantity);
      formData.append('price', price);
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'crop.jpg',
      });

      await axios.post(`${API_BASE}/crops`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Crop uploaded successfully!');
      setName('');
      setQuantity('');
      setPrice('');
      setImage(null);
      navigation.navigate('FarmerDashboard');
    } catch (err) {
      console.error(err);
      alert('❌ Error uploading crop. Check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=60' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>🌾 Upload Your Crop</Text>

            <View style={styles.inputContainer}>
              <MaterialIcons name="eco" size={24} color="#4CAF50" />
              <TextInput
                placeholder="Crop Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="layers" size={24} color="#4CAF50" />
              <TextInput
                placeholder="Quantity (kg)"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.currency}>Rs.</Text>
              <TextInput
                placeholder="Price per kg"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <>
                  <MaterialIcons name="add-a-photo" size={32} color="#4CAF50" />
                  <Text style={{ marginTop: 5, color: "#4CAF50" }}>Upload Image</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>🚀 Upload Crop</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    borderRadius:12,
    marginBottom:15,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor:'#ddd'
  },
  input: { flex:1, marginLeft:10, height:50 },
  currency: { fontSize:18, fontWeight:'bold', color:'#4CAF50', marginLeft:6 },
  imageUpload: {
    height: 200,
    borderWidth:2,
    borderColor:'#4CAF50',
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
    backgroundColor:'#fff',
  },
  previewImage: { width: '100%', height: '100%', borderRadius:12 },
  button: { backgroundColor:'#2E7D32', padding:15, borderRadius:12, alignItems:'center', marginTop:10 },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'bold' },
});
