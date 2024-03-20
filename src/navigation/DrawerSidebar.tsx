import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { clearUserData, getUserInfo } from "../shared/sharedDetails";
import { YoColors } from "../assets/themes/YoColors";

const DrawerSidebar = ({ navigation }: { navigation: any }) => {
  const userInfo: any = getUserInfo();

  const logoutUser = () => {
    clearUserData("userData");
    navigation.navigate("Startup");
  };

  return (
    <View style={{ padding: 5, flex: 1, backgroundColor: YoColors.primary }}>
      {/* <View style={{ height: 100 }}>
        <Text style={{ color: "red" }}>{userInfo?.name}</Text>
      </View> */}
      <TouchableOpacity
        style={styles.tabView}
        onPress={() => navigation.navigate("DashboardPage")}
      >
        <Ionicons name="home" size={19} color={"#fff"} />
        <Text style={styles.tabTitle}>Dashboard</Text>
      </TouchableOpacity>
      {userInfo?.type === 1 && (
        <>
          <TouchableOpacity
            style={styles.tabView}
            onPress={() => navigation.navigate("TeacherAssessmentList")}
          >
            <MaterialCommunityIcons name="book" size={19} color={"#fff"} />
            <Text style={styles.tabTitle}>My Assessments</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabView}
            onPress={() => navigation.navigate("TeacherAssignmentList")}
          >
            <MaterialCommunityIcons name="book" size={19} color={"#fff"} />
            <Text style={styles.tabTitle}>My Assignments</Text>
          </TouchableOpacity>
        </>
      )}
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
