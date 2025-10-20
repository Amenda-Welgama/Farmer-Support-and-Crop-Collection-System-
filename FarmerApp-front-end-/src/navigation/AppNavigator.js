import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FarmerDashboard from "../screens/FarmerDashboard";
import CropUploadScreen from "../screens/CropUploadScreen";
import MyItemsScreen from "../screens/MyCrops";
import BuyerDashboard from "../screens/BuyerDashboard";
import OrdersScreen from "../screens/OrdersScreen";
import ChatScreen from "../screens/ChatScreen";
import EditProductScreen from "../screens/EditProductScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FarmerDashboard"
        component={FarmerDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CropUpload"
        component={CropUploadScreen}
        options={{
          headerShown:false,
          
        }}
      />
      <Stack.Screen
        name="MyCrops"
        component={MyItemsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuyerDashboard"
        component={BuyerDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerShown: false,
        
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown:false,
        }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
