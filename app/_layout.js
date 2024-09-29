import { Link, Slot, Stack } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import logo from "../assets/logo.png";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1e293b" },
        headerShadowVisible: false,
        headerTitle: "",
        headerLeft: () => (
          <Image
            resizeMode="contain"
            source={logo}
            style={{ width: 30, height: 30 }}
          />
        ),
      }}
    />
  );
}
