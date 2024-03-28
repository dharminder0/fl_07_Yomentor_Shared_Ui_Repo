import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { clearUserData, getUserInfo } from "../shared/sharedDetails";
import { YoColors } from "../assets/themes/YoColors";
import { common } from "../assets/styles/Common";
import { YoImages } from "../assets/themes/YoImages";

const DrawerSidebar = ({ navigation }: { navigation: any }) => {
  const userInfo: any = getUserInfo();
  const image: any = YoImages();
  const logoutUser = () => {
    clearUserData("userData");
    navigation.navigate("Startup");
  };

  return (
    <View style={{ flex: 1, backgroundColor: YoColors.primary }}>
      <View
        style={{
          minHeight: 70,
          paddingVertical: 15,
          paddingHorizontal: 12,
          backgroundColor: YoColors.white,
        }}
      >
        <View style={common.row}>
          <View style={{ width: 60 }}>
            {!userInfo.image ? (
              <Image
                source={image.DefaultUser}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            ) : (
              <Image
                source={{ uri: userInfo.image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            )}
          </View>
          <View>
            <Text style={[common.h3Title]}>
              {userInfo?.firstname + " " + userInfo?.lastname}
            </Text>
            {userInfo?.email && (
              <Text style={[common.title]}>{userInfo?.email}</Text>
            )}
            {userInfo?.phone && (
              <View style={common.row}>
                <MaterialCommunityIcons
                  name="phone"
                  size={14}
                  color={YoColors.primary}
                />
                <Text style={[common.title]}> {userInfo?.phone}</Text>
              </View>
            )}
            {userInfo?.address && (
              <View style={common.row}>
                <Ionicons
                  name="location-sharp"
                  size={12}
                  color={YoColors.primary}
                />
                <Text style={common.rText}>{userInfo?.address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={{ padding: 8 }}>
        <TouchableOpacity
          style={styles.tabView}
          onPress={() => navigation.navigate("DashboardPage")}
        >
          <Ionicons name="home" size={19} color={"#fff"} />
          <Text style={styles.tabTitle}>Home</Text>
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
        {userInfo?.type === 3 && (
          <>
            <TouchableOpacity
              style={styles.tabView}
              onPress={() => navigation.navigate("TeachersList")}
            >
              <Ionicons name="person" size={19} color={"#fff"} />
              <Text style={styles.tabTitle}>Teachers</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.tabView} onPress={logoutUser}>
          <MaterialCommunityIcons name="logout" size={19} color={"#fff"} />
          <Text style={styles.tabTitle}>Logout</Text>
        </TouchableOpacity>
      </View>
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
