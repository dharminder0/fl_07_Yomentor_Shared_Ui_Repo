import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { clearUserData } from "../shared/sharedDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { YoColors } from "../assets/themes/YoColors";

const DrawerSidebar = ({ navigation }: { navigation: any }) => {
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logoutUser = () => {
    clearUserData("userData");
    navigation.navigate("Startup");
  };

  return (
    <View style={{ padding: 5, flex: 1, backgroundColor: YoColors.primary }}>
      <View>
        <Text style={{ color: "red" }}>{userData?.name}</Text>
      </View>
      <TouchableOpacity style={styles.tabView}>
        <Ionicons name="home" size={19} color={"#fff"} />
        <Text style={styles.tabTitle}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabView}
        onPress={() => navigation.navigate("AssessmentList")}
      >
        <MaterialCommunityIcons name="book" size={19} color={"#fff"} />
        <Text style={styles.tabTitle}>My Assessment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabView}
        onPress={() => navigation.navigate("AssignmentList")}
      >
        <MaterialCommunityIcons name="book" size={19} color={"#fff"} />
        <Text style={styles.tabTitle}>My Assignment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabView} onPress={logoutUser}>
        <MaterialCommunityIcons name="logout" size={19} color={"#fff"} />
        <Text style={styles.tabTitle}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrawerSidebar;

const styles = StyleSheet.create({
  tabView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginBottom: 5,
    borderRadius: 8,
  },
  tabTitle: {
    paddingHorizontal: 8,
    fontSize: 19,
    color: "#fff",
  },
});
