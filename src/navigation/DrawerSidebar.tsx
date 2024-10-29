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
import { useTheme } from '@react-navigation/native';
import { common } from "../assets/styles/Common";
import image from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import { color } from "@rneui/base";

const DrawerSidebar = () => {
  const { colors }: any = useTheme();
  const userInfo: any = getUserInfo();
  const { height, width } = Dimensions.get("screen");

  const navigation: any = useNavigation();
  const logoutUser = () => {
    clearUserData("userData");
    navigation.navigate("Startup");
  };

  const goToProfilePage = () => {
    navigation.navigate("UserProfile");
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          minHeight: 70,
          paddingVertical: 15,
          paddingStart: 12,
          backgroundColor: colors.primary,
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
              style={[common.h2Title, { color: '#fff' }]}
              numberOfLines={1}
            >
              {userInfo?.firstName + " " + userInfo?.lastName}
            </Text>
            {userInfo?.email && (
              <Text
                style={[common.title, { color: '#fff' }]}
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
                  color={'#fff'}
                />
                <Text style={[common.title, { color: '#fff' }]}>
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
                  color={'#fff'}
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
          backgroundColor: colors.background,
        }}
      >
        <View style={{ height: Platform.OS === 'ios' ? '97%' : '94%' }}>
          <TouchableOpacity
            style={styles.tabView}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={19} color={colors.icon} />
            <Text style={[styles.tabTitle, { color: colors.icon }]}>Home</Text>
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
                  color={colors.icon}
                />
                <Text style={[styles.tabTitle, { color: colors.icon }]}>Skill Tests</Text>
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
                <Text style={[styles.tabTitle, { color: colors.icon }]}>My Skill Tests</Text>
              </TouchableOpacity> */}
            </>
          )}
        </View>

        <View
          style={{
            height: 20,
          }}
        >
          <Button
            onPress={logoutUser}
            buttonStyle={{
              padding: 0,
              paddingHorizontal: 12,
              alignSelf: 'flex-start'
            }}
            type="clear"
            title=" Logout"
            titleStyle={[common.fs12, { color: colors.icon }]}
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={12}
                color={colors.icon}
              />
            }
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
  },
});
