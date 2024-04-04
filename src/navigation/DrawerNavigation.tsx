import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardPage from "../components/DashboardPage";
import DrawerSidebar from "./DrawerSidebar";
import HomeScreen from "../components/home/HomeScreen";
import { BottomNavigation } from "./BottomNavigation";

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="BottomNavigation"
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#dadada" },
      }}
      drawerContent={(props) => <DrawerSidebar />}
    >
      <Drawer.Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
