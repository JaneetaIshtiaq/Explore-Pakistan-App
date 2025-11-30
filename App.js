import * as React from "react";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Screens
import LoginScreen from "./Screens/Login";
import Signup from "./Screens/Signup";
import HomeScreen from "./Screens/Home";
import GalleryScreen from "./Screens/GalleryScreen";
import WeatherScreen from "./Screens/Weather";   

// ------------------- MAIN TABS ---------------------
const MainTabs = createMaterialTopTabNavigator({
  screens: {
    Home: HomeScreen,
    Gallery: GalleryScreen,
  },
  screenOptions: {
    tabBarActiveTintColor: "#187c3a",
    tabBarIndicatorStyle: { backgroundColor: "#187c3a", height: 3 },
    tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
    tabBarStyle: { backgroundColor: "white" },
  },
});

// ------------------- ROOT STACK ---------------------
const RootStack = createNativeStackNavigator({
  screens: {
    LoginScreen: {
      screen: LoginScreen,
      options: { title: "Explore Pakistan" },
    },
    Signup: {
      screen: Signup,
      options: { title: "Explore Pakistan" },
    },
    MainTabs: {
      screen: MainTabs,
      options: {
        headerShown: false,  // Tabs mein already header hai, duplicate na dikhe
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
  return <Navigation />;
}