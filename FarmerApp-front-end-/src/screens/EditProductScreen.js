import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { API_BASE } from "../services/api";

export default function EditProductScreen({ route, navigation }) {
  const { product } = route.params;

  const [productName, setProductName] = useState(product.productName || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price?.toString() || "");
  const [stockQuantity, setStockQuantity] = useState(
    product.stockQuantity?.toString() || ""
  );
  const [available, setAvailable] = useState(product.available || false);
  const [loading, setLoading] = useState(false);

  // Field focus states for animations
  const [focusedField, setFocusedField] = useState(null);

  const handleUpdate = async () => {
    // Validate inputs
    if (!productName.trim()) {
      Alert.alert("Validation Error", "Product name is required");
      return;
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Validation Error", "Please enter a valid price");
      return;
    }
    if (!stockQuantity || isNaN(stockQuantity) || parseInt(stockQuantity) < 0) {
      Alert.alert("Validation Error", "Please enter a valid stock quantity");
      return;
    }

    Alert.alert(
      "Update Product",
      "Are you sure you want to update this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem("token");

              await axios.put(
                `${API_BASE}/products/${product.productId}`,
                {
                  productName,
                  description,
                  price: parseFloat(price),
                  stockQuantity: parseInt(stockQuantity),
                  available,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              Alert.alert("Success", "Product updated successfully!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              console.error("Update error:", err);
              Alert.alert(
                "Error",
                err.response?.data?.message || "Failed to update product"
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard your changes?",
      [
        { text: "Continue Editing", style: "cancel" },
        { text: "Discard", style: "destructive", onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#2d5016" />
      
      {/* ✨ Premium Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.backButton}
        >
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Edit Crop</Text>
          <Text style={styles.headerSubtitle}>Update product details</Text>
        </View>

        <TouchableOpacity
          onPress={handleUpdate}
          style={styles.saveButton}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="checkmark" size={26} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Product Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="inventory-2" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.cardTitle}>Product Information</Text>
          </View>

          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <MaterialIcons name="label" size={16} color="#666" /> Product Name *
            </Text>
            <View style={[
              styles.inputContainer,
              focusedField === 'name' && styles.inputContainerFocused
            ]}>
              <TextInput
                value={productName}
                onChangeText={setProductName}
                style={styles.input}
                placeholder="e.g., Fresh Carrots"
                placeholderTextColor="#999"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              <MaterialIcons name="description" size={16} color="#666" /> Description
            </Text>
            <View style={[
              styles.inputContainer,
              styles.textAreaContainer,
              focusedField === 'description' && styles.inputContainerFocused
            ]}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholder="Describe your product..."
                placeholderTextColor="#999"
                textAlignVertical="top"
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>
        </View>

        {/* Pricing & Stock Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <FontAwesome5 name="chart-line" size={20} color="#FF9800" />
            </View>
            <Text style={styles.cardTitle}>Pricing & Stock</Text>
          </View>

          <View style={styles.twoColumnRow}>
            {/* Price */}
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                <FontAwesome5 name="rupee-sign" size={14} color="#666" /> Price (LKR) *
              </Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'price' && styles.inputContainerFocused
              ]}>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  style={styles.input}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#999"
                  onFocus={() => setFocusedField('price')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Stock */}
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>
                <MaterialIcons name="inventory" size={16} color="#666" /> Stock (kg) *
              </Text>
              <View style={[
                styles.inputContainer,
                focusedField === 'stock' && styles.inputContainerFocused
              ]}>
                <TextInput
                  value={stockQuantity}
                  onChangeText={setStockQuantity}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999"
                  onFocus={() => setFocusedField('stock')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Availability Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="check-circle" size={24} color="#2196F3" />
            </View>
            <Text style={styles.cardTitle}>Availability</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchLeft}>
              <View style={[
                styles.switchIconContainer,
                { backgroundColor: available ? '#E8F5E9' : '#FFEBEE' }
              ]}>
                <MaterialIcons 
                  name={available ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={available ? '#4CAF50' : '#FF5252'} 
                />
              </View>
              <View style={styles.switchTextContainer}>
                <Text style={styles.switchLabel}>Product Availability</Text>
                <Text style={styles.switchDescription}>
                  {available 
                    ? "Product is visible and available for purchase" 
                    : "Product is hidden from customers"}
                </Text>
              </View>
            </View>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={available ? "#4CAF50" : "#BDBDBD"}
              ios_backgroundColor="#E0E0E0"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={loading}
          >
            <Ionicons name="close-circle" size={22} color="#FF5252" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.updateButton, loading && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="update" size={22} color="#fff" />
                <Text style={styles.updateButtonText}>Update Product</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <MaterialIcons name="info-outline" size={18} color="#999" />
          <Text style={styles.helpText}>
            Fields marked with * are required
          </Text>
        </View>

        {/* Bottom Spacer */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8faf9",
  },

  // ✨ Header Styles
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContainer: {
    padding: 20,
  },

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  // Input Styles
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  inputContainerFocused: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    minHeight: 120,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Two Column Layout
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },

  // Switch Styles
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  switchIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // Action Buttons
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FF5252',
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  updateButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Help Text
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
});