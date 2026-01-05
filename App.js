// File: App.js
import * as React from "react";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import FavoritesScreen from "./Screens/FavoritesScreen"; 

// Import Context
import { AuthProvider } from './context/AuthContext';

// Screens
import LoginScreen from "./Screens/Login";
import Signup from "./Screens/Signup";
import HomeScreen from "./Screens/Home";
import GalleryScreen from "./Screens/GalleryScreen";
import WeatherScreen from "./Screens/Weather";
import CityDetail from "./Screens/CityDetail";
import MapScreen from './Screens/MapScreen';

// ------------------- MAIN TABS ---------------------
const MainTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
      },
    },
    Gallery: {
      screen: GalleryScreen,
      options: {
        title: 'Gallery',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="images-outline" color={color} size={size} />
        ),
      },
    },
    Favorites: {  // NEW TAB ADDED
      screen: FavoritesScreen,
      options: {
        title: 'Favorites',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" color={color} size={size} />
        ),
      },
    },
    Map: {
      screen: MapScreen,
      options: {
        title: 'Explore',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="map-outline" color={color} size={size} />
        ),
      },
    },
  },
  screenOptions: {
    tabBarActiveTintColor: "#187c3a",
    tabBarInactiveTintColor: "gray",
    tabBarStyle: {
      backgroundColor: "white",
      paddingBottom: 5,
      paddingTop: 5,
      height: 60,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: "600",
    },
    headerShown: false,
  },
});

// ------------------- ROOT STACK ---------------------
const RootStack = createNativeStackNavigator({
  screens: {
    LoginScreen: {
      screen: LoginScreen,
      options: { 
        title: "Explore Pakistan",
        headerShown: false,
      },
    },
    Signup: {
      screen: Signup,
      options: { 
        title: "Explore Pakistan",
        headerShown: false,
      },
    },
    MainTabs: {
      screen: MainTabs,
      options: { 
        title: "Explore Pakistan",
        headerShown: true,
      },
    },
    Weather: {
      screen: WeatherScreen,
      options: ({ route }) => ({
        title: route.params?.city || "Weather",
        headerStyle: { backgroundColor: "#187c3a" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
      }),
    },
    CityDetail: {
      screen: CityDetail,
      options: ({ route }) => ({
        title: route.params?.cityName || "City Details",
        headerStyle: { backgroundColor: "#187c3a" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
      }),
    },
  },
  screenOptions: {
    headerStyle: { backgroundColor: "#187c3a" },
    headerTintColor: "white",
    headerTitleStyle: { fontWeight: "bold", fontSize: 25 },
    headerTitleAlign: "center",
  },
  initialRouteName: "LoginScreen",
});

const Navigation = createStaticNavigation(RootStack);

// ------------------- APP ROOT ----------------------
export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}