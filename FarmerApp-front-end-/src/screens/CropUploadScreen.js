// src/screens/CropUploadScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_BASE } from "../services/api";

const { width } = Dimensions.get("window");

export default function CropUploadScreen({ navigation }) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [available, setAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Unauthorized", "Please login again.");
          navigation.navigate("Login");
          return;
        }

        const res = await axios.get(`${API_BASE}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    setCategoryId(category.categoryId.toString());
    setCategoryName(category.categoryName);
    setModalVisible(false);
  };

  const handleUpload = async () => {
    if (
      !productName ||
      !description ||
      !price ||
      !stockQuantity ||
      !categoryId
    ) {
      Alert.alert("Warning", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please login again.");
        navigation.navigate("Login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const data = {
        productName,
        description,
        price,
        stockQuantity,
        available,
        user_Id: userId,
        category_Id: categoryId,
      };

      await axios.post(`${API_BASE}/products`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Success", "Product uploaded successfully!");
      setProductName("");
      setDescription("");
      setPrice("");
      setStockQuantity("");
      setCategoryId("");
      setCategoryName("");
      navigation.navigate("FarmerDashboard");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to upload product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2d5016" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Upload Crop</Text>
            <Text style={styles.headerSubtitle}>Add new product to sell</Text>
          </View>

          <View style={styles.backButton} />
        </View>
      </View>

      {/* Content */}
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>🌱 Upload Your Product</Text>

          <InputField
            icon="eco"
            placeholder="Enter product name"
            value={productName}
            onChange={setProductName}
          />
          <InputField
            icon="description"
            placeholder="Enter product description"
            value={description}
            onChange={setDescription}
            multiline
          />
          <InputField
            icon="attach-money"
            placeholder="Enter price (LKR)"
            value={price}
            onChange={setPrice}
            keyboardType="numeric"
          />
          <InputField
            icon="inventory"
            placeholder="Enter stock quantity (kg)"
            value={stockQuantity}
            onChange={setStockQuantity}
            keyboardType="numeric"
          />

          {/* Category Selector */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select Category:</Text>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialIcons name="category" size={24} color="#9ca086" />
              <Text style={styles.categoryButtonText}>
                {categoryName || "-- Select Category --"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Category Modal */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Category</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.categoryId.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.categoryItem}
                      onPress={() => handleCategorySelect(item)}
                    >
                      <Text style={styles.categoryItemText}>
                        {item.categoryName}
                      </Text>
                      {categoryId === item.categoryId.toString() && (
                        <MaterialIcons name="check" size={24} color="#9ca086" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>

          {/* Availability */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Available for sale?</Text>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: "#ccc", true: "#9ca086" }}
            />
          </View>

          {/* Upload Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpload}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Uploading..." : " Upload Product"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const InputField = ({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType = "default",
  multiline = false,
}) => (
  <View style={styles.inputContainer}>
    <MaterialIcons name={icon} size={24} color="#9ca086" />
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      style={[styles.input, multiline && { height: 80 }]}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8faf9",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9ca086",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },
  label: {
    marginBottom: 8,
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    minHeight: 50,
  },
  categoryButtonText: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryItemText: {
    fontSize: 15,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    backgroundColor: "#F8F9FA",
    padding: 15,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
