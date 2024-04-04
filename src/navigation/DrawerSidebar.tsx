import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { clearUserData, getUserInfo } from "../shared/sharedDetails";
import { useThemeColor } from "../assets/themes/useThemeColor";
import { common } from "../assets/styles/Common";
import { YoImages } from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";

const DrawerSidebar = () => {
  const YoColors = useThemeColor();
  const userInfo: any = getUserInfo();
  const { height, width } = Dimensions.get("screen");
  const image: any = YoImages();
  const navigation: any = useNavigation();
  const logoutUser = () => {
    clearUserData("userData");
    navigation.navigate("Startup");
  };

  const goToProfilePage = () => {
    navigation.navigate("UserProfile");
  }
  return (
    <View style={{ flex: 1, backgroundColor: YoColors.white }}>
      <View
        style={{
          minHeight: 70,
          paddingVertical: 15,
          paddingHorizontal: 12,
          backgroundColor: YoColors.primary,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => goToProfilePage()}
        >
          <View style={common.row}>
            <View style={{ width: 70 }}>
              {!userInfo.image ? (
                <Image
                  source={image.DefaultUser}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                  }}
                />
              ) : (
                <Image
                  source={{ uri: userInfo.image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                  }}
                />
              )}
            </View>
            <View style={{ width: width - 205 }}>
              <Text
                style={[common.h2Title, { color: YoColors.white }]}
                numberOfLines={1}
              >
                {userInfo?.firstname + " " + userInfo?.lastname}
              </Text>
              {userInfo?.email && (
                <Text
                  style={[common.title, { color: YoColors.white }]}
                  numberOfLines={1}
                >
                  {userInfo?.email}
                </Text>
              )}
              {userInfo?.phone && (
                <View style={common.row}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={13}
                    color={YoColors.white}
                  />
                  <Text style={[common.title, { color: YoColors.white }]}>
                    {" "}
                    {userInfo?.phone}
                  </Text>
                </View>
              )}
              {/* {userInfo?.address && (
              <View style={[common.row, { alignItems: "flex-start" }]}>
                <Ionicons
                  name="location-sharp"
                  size={12}
                  color={YoColors.white}
                />
                <Text
                  style={[common.rText, { color: YoColors.white }]}
                  numberOfLines={2}
                >
                  {userInfo?.address}
                </Text>
              </View>
            )} */}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          padding: 8,
          flex: 1,
          backgroundColor: YoColors.bgColor,
        }}
      >
        <View>
          <TouchableOpacity
            style={styles.tabView}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={19} color={YoColors.primary} />
            <Text style={styles.tabTitle}>Home</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: 20,
            position: "absolute",
            left: 15,
            bottom: 12,
          }}
        >
          <TouchableOpacity style={common.row} onPress={logoutUser}>
            <MaterialCommunityIcons
              name="logout"
              size={12}
              color={YoColors.primary}
            />
            <Text style={[common.fs12, { color: YoColors.primary }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
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
    color: "#124076",
  },
});
