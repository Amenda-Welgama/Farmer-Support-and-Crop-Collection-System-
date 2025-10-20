import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { API_BASE } from "../services/api";

export default function FarmerOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Not Authenticated", "Please log in to view orders.");
        navigation.replace("Login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const cleanToken = token.replace(/['"]+/g, "").trim();
      const response = await axios.get(`${API_BASE}/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${cleanToken}` },
      });

      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (err) {
      // Handle 404 as empty orders list (user has no orders yet)
      if (err.response?.status === 404) {
        setOrders([]);
        // Don't log error or show alert for 404 - it's normal when user has no orders
      } else {
        // Only log and show error alert for actual errors
        console.error("Error fetching orders:", err);
        Alert.alert("Error", "Failed to fetch orders. Please try again later.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const cleanToken = token.replace(/['"]+/g, "").trim();

      await axios.put(
        `${API_BASE}/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${cleanToken}` } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, status: newStatus, lastUpdated: new Date().toISOString() }
            : order
        )
      );

      Alert.alert("Success", `Order marked as ${newStatus}!`);
      setDetailModalVisible(false);
    } catch (err) {
      console.error("Error updating order status:", err);
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFC107";
      case "Confirmed":
        return "#4CAF50";
      case "Cancelled":
        return "#E53935";
      default:
        return "#9E9E9E";
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === "all") return orders;
    return orders.filter(
      (o) => o.status?.toLowerCase() === filterStatus.toLowerCase()
    );
  };

  const renderOrderCard = ({ item }) => {
    const orderDate = new Date(item.orderDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const totalPrice = item.totalPrice || 0;
    const itemsCount = item.items?.length || 0;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => {
          setSelectedOrder(item);
          setDetailModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <MaterialIcons name="receipt" size={28} color="#4CAF50" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.orderTitle}>Order #{item.orderId}</Text>
              <Text style={styles.orderDate}>{orderDate}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status || "Pending"}</Text>
          </View>
        </View>

        <View style={styles.orderDetailsRow}>
          <MaterialIcons name="shopping-bag" size={18} color="#FF9800" />
          <Text style={styles.detailText}>{itemsCount} items</Text>
          <View style={styles.divider} />
          <MaterialIcons name="attach-money" size={18} color="#4CAF50" />
          <Text style={styles.detailText}>Rs. {totalPrice.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredOrders = getFilteredOrders();

  return (
    <View style={styles.container}>
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
            <Text style={styles.headerTitle}>My Orders</Text>
            <Text style={styles.headerSubtitle}>
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </Text>
          </View>

          <TouchableOpacity onPress={fetchOrders} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                filterStatus === status && styles.filterTabActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === status && styles.filterTabTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {status === "all"
                  ? orders.length
                  : orders.filter(
                      (o) => o.status?.toLowerCase() === status.toLowerCase()
                    ).length}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.centerContainer}>
          <MaterialIcons name="inbox" size={80} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>No Orders Found</Text>
          <Text style={styles.emptySubtext}>
            You have no orders matching this filter.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.orderId.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4CAF50"]}
              tintColor="#4CAF50"
            />
          }
        />
      )}

      {/* Modal */}
      <Modal
        visible={detailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>
                Order #{selectedOrder?.orderId}
              </Text>
              <Text style={styles.modalDate}>
                Date:{" "}
                {new Date(selectedOrder?.orderDate).toLocaleDateString("en-US")}
              </Text>

              <Text style={styles.modalSubtitle}>Items:</Text>
              {selectedOrder?.items?.map((item, index) => (
                <View key={index} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>
                    • {item.productName} - {item.quantity}kg
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#4CAF50" }]}
                onPress={() =>
                  updateOrderStatus(selectedOrder.orderId, "Confirmed")
                }
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#E53935" }]}
                onPress={() =>
                  updateOrderStatus(selectedOrder.orderId, "Cancelled")
                }
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#757575" }]}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8faf9" },
  header: {
    backgroundColor: "#4CAF50",
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
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterTabActive: { backgroundColor: "#fff" },
  filterTabText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  filterTabTextActive: { color: "#4CAF50" },
  listContainer: { padding: 20 },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center" },
  orderTitle: { fontSize: 17, fontWeight: "bold", color: "#333" },
  orderDate: { fontSize: 13, color: "#666" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  orderDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  detailText: { marginLeft: 6, fontSize: 14, color: "#333" },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginTop: 8 },
  emptySubtext: { color: "#777", fontSize: 15 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "85%",
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  modalDate: { color: "#666", marginBottom: 10 },
  modalSubtitle: { fontWeight: "bold", marginTop: 10 },
  modalItem: { marginTop: 5 },
  modalItemText: { color: "#333" },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});