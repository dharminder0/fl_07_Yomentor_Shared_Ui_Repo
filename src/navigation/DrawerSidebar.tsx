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
import { Button } from "react-native-elements";

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
  };
  return (
    <View style={{ flex: 1, backgroundColor: YoColors.white }}>
      <View
        style={{
          minHeight: 70,
          paddingVertical: 15,
          paddingStart: 12,
          backgroundColor: YoColors.primary,
        }}
      >
        <View style={common.row}>
          <View style={{ width: 70 }}>
            <Image
              source={
                !userInfo.image ? image.DefaultUser : { uri: userInfo.image }
              }
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
              }}
            />
          </View>
          <View style={{ width: "60%" }}>
            <Text
              style={[common.h2Title, { color: YoColors.white }]}
              numberOfLines={1}
            >
              {userInfo?.firstName + " " + userInfo?.lastName}
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
          </View>
          <View style={{ width: 30 }}>
            <Button
              onPress={() => goToProfilePage()}
              buttonStyle={{
                padding: 0,
                height: 60,
                backgroundColor: "none",
              }}
              icon={
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={25}
                  color={YoColors.white}
                />
              }
              containerStyle={{
                justifyContent: "center",
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          padding: 8,
          flex: 1,
          backgroundColor: YoColors.background,
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

          {userInfo?.type === 3 && (
            <>
              <TouchableOpacity
                style={styles.tabView}
                onPress={() => navigation.navigate("SkillsTestList")}
              >
                <MaterialCommunityIcons
                  name="clipboard-text"
                  size={19}
                  color={YoColors.primary}
                />
                <Text style={styles.tabTitle}>Skill Tests</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.tabView}
                onPress={() => navigation.navigate("SkillsTestList")}
              >
                <MaterialCommunityIcons
                  name="clipboard-text"
                  size={19}
                  color={YoColors.primary}
                />
                <Text style={styles.tabTitle}>My Skill Tests</Text>
              </TouchableOpacity> */}
            </>
          )}
        </View>

        <View
          style={{
            height: 20,
            position: "absolute",
            left: 15,
            bottom: 12,
          }}
        >
          <Button
            onPress={logoutUser}
            buttonStyle={{
              padding: 0,
              paddingEnd: 12,
              backgroundColor: "none",
            }}
            title="Logout"
            titleStyle={[common.fs12, { color: YoColors.primary }]}
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={12}
                color={YoColors.primary}
              />
            }
            containerStyle={{
              justifyContent: "center",
            }}
          />
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
    //marginBottom: 2,
    borderRadius: 8,
  },
  tabTitle: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#124076",
  },
});
