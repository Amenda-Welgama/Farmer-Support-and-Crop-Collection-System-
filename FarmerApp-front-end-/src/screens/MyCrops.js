import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import io from "socket.io-client";
import { API_BASE, SOCKET_URL } from "../services/api"; // SOCKET_URL = 'http://YOUR_SERVER_IP:3000'

export default function MyItemsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeScreen = async () => {
      if (isMounted) {
        await fetchMyProducts();
        await connectSocket();
      }
    };

    // Add focus listener for navigation
    const unsubscribe = navigation.addListener("focus", () => {
      if (isMounted) {
        fetchMyProducts();
      }
    });

    initializeScreen();

    return () => {
      isMounted = false;
      if (socket) socket.disconnect();
      unsubscribe();
    };
  }, [navigation]);

  // Fetch products from API
  const fetchMyProducts = async () => {
    try {
      if (!refreshing) setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please login again.");
        navigation.navigate("Login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const res = await axios.get(`${API_BASE}/products/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      // Handle 404 as empty product list (user has no products yet)
      if (err.response && err.response.status === 404) {
        setProducts([]);
        // Don't log error or show alert for 404 - it's normal when user has no products
      } else {
        // Only log and show error alert for actual errors
        console.error(err);
        Alert.alert("Error", "Failed to load your products");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Connect to Socket.IO for live updates
  const connectSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const newSocket = io(SOCKET_URL, {
        query: { token },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected");
        // Join user-specific room
        newSocket.emit("joinRoom", { userId });
      });

      // Listen for various product events
      newSocket.on("productUpdated", (data) => {
        if (data.userId === userId) {
          fetchMyProducts();
        }
      });

      newSocket.on("productDeleted", (data) => {
        if (data.userId === userId) {
          fetchMyProducts();
        }
      });

      newSocket.on("productCreated", (data) => {
        if (data.userId === userId) {
          fetchMyProducts();
        }
      });

      setSocket(newSocket);
      return newSocket;
    } catch (error) {
      console.error("Socket connection error:", error);
      return null;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyProducts();
  };

  const handleDelete = (productId, productName) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${productName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await axios.delete(`${API_BASE}/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              // Emit socket event for delete
              if (socket) {
                socket.emit("productDeleted", { productId });
              }

              Alert.alert("Success", "Product deleted successfully");
              fetchMyProducts();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete product");
            }
          },
        },
      ]
    );
  };

  const handleEdit = (product) => {
    if (!product || !product.productId) {
      Alert.alert("Error", "Invalid product data");
      return;
    }

    navigation.navigate("EditProduct", {
      product: {
        productId: product.productId || product.id,
        productName: product.productName,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        available: product.available,
      },
      onUpdate: () => {
        fetchMyProducts();
      },
    });
  };

  const renderProduct = ({ item }) => {
    const productId = item.productId || item.id;
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.available ? "#6e763f" : "#FF5252" },
            ]}
          >
            <Text style={styles.statusText}>
              {item.available ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>

        <View style={styles.productDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={20} color="#6e763f" />
            <Text style={styles.detailText}>
              LKR {parseFloat(item.price).toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="inventory" size={20} color="#6e763f" />
            <Text style={styles.detailText}>{item.stockQuantity} kg</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <MaterialIcons name="edit" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(productId, item.productName)}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6e763f" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>My Crops</Text>
            <Text style={styles.headerSubtitle}>
              {products.length} {products.length === 1 ? "Crop" : "Crops"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={fetchMyProducts}
            style={styles.refreshButton}
          >
            <MaterialIcons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6e763f" />
          <Text style={styles.emptyText}>Loading your products...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="inventory-2" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No crops yet</Text>
          <Text style={styles.emptySubText}>Start uploading your crops!</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => navigation.navigate("CropUpload")}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload Crop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => (item.productId || item.id).toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6e763f"]}
            />
          }
        />
      )}

      {products.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("CropUpload")}
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F9F1" },
  header: {
    backgroundColor: "#6e763f",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
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
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: "rgba(255,255,255,0.9)",
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 8 },
  emptySubText: {
    fontSize: 15,
    color: "#777",
    marginTop: 10,
    textAlign: "center",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6e763f",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  listContainer: { padding: 20 },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productInfo: { flex: 1, marginRight: 10 },
  productName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDescription: { fontSize: 13, color: "#666" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 30,
    justifyContent: "center",
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 10,
  },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailText: { fontSize: 14, fontWeight: "600", color: "#333", marginLeft: 6 },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  actionButtons: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  editButton: { backgroundColor: "#6e763f" },
  deleteButton: { backgroundColor: "#FF5252" },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6e763f",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});