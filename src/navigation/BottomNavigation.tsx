import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { getUserInfo } from "../shared/sharedDetails";
import { YoImages } from "../assets/themes/YoImages";
import { YoColors } from "../assets/themes/YoColors";
import HomeScreen from "../components/home/HomeScreen";
import TeacherAssignmentList from "../components/teacher/TeacherAssignmentList";
import TeacherAssessmentList from "../components/teacher/TeacherAssessmentList";
import DashboardPage from "../components/DashboardPage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TeachersList from "../components/TeachersList";

const Tab = createBottomTabNavigator();
// Ionicons.loadFont();
// Icon.loadFont();

export const BottomNavigation = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const Images: any = YoImages();
  const openDrawerScreen = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const headerDrawer = () => (
    <Pressable
      onPress={openDrawerScreen}
      style={{ paddingEnd: 12, paddingVertical: 5 }}
    >
      {/* <Icon name="bars" size={21} color={"#fff"} /> */}
      <Image
        source={Images.DefaultUser}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
        }}
      />
    </Pressable>
  );

  const headerBack = () => (
    <TouchableOpacity activeOpacity={0.8} onPress={openDrawerScreen}>
      <Icon name="bars" size={21} color={"#fff"} />
    </TouchableOpacity>
  );

  // Screen names
  const HomeTab = "Home";
  const DashboardTab = "DashboardPage";
  const TeacherAssignmentTab = "TeacherAssignmentList";
  const TeacherAssessmentTab = "TeacherAssessmentList";
  const TeachersListTab = "TeachersList";

  const pageOptions: any = {
    homeTab: {
      headerTintColor: "#fff",
      title: "Home",
      headerStyle: styles.headerStyle,
      headerLeft: headerDrawer,
    },
    dashboardTab: {
      headerTintColor: "#fff",
      title: "My Batches",
      headerStyle: styles.headerStyle,
      headerLeft: headerDrawer,
    },
    TeacherAssignmentTab: {
      headerTintColor: "#fff",
      title: "My Assignment",
      headerStyle: styles.headerStyle,
      headerLeft: headerDrawer,
    },
    TeacherAssessmentTab: {
      headerTintColor: "#fff",
      title: "My Assessment",
      headerStyle: styles.headerStyle,
      headerLeft: headerDrawer,
    },
    TeachersListTab: {
      headerTintColor: "#fff",
      title: "Teachers",
      headerStyle: styles.headerStyle,
      headerLeft: headerDrawer,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName={HomeTab}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let rn = route.name;
          return (
            <View>
              {rn === HomeTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="home" size={21} color={color} />
                </View>
              )}
              {rn === DashboardTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="laptop" size={21} color={color} />
                </View>
              )}
              {rn === TeacherAssignmentTab && (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons name="book" size={21} color={color} />
                </View>
              )}
              {rn === TeacherAssessmentTab && (
                <View style={{ alignItems: "center" }}>
                  <Icon name="book" size={21} color={color} />
                </View>
              )}
              {rn === TeachersListTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="person" size={21} color={color} />
                </View>
              )}
            </View>
          );
        },
        headerShown: true,
        tabBarItemStyle: { padding: 5 },
        tabBarActiveTintColor: YoColors.primary,
        headerLeftContainerStyle: { paddingStart: 12 },
        headerTitleAlign: "center",
        headerRightContainerStyle: { paddingEnd: 12 },
      })}
    >
      <Tab.Screen
        name={HomeTab}
        component={HomeScreen}
        options={pageOptions["homeTab"]}
      />
      <Tab.Screen
        name={DashboardTab}
        component={DashboardPage}
        options={pageOptions["dashboardTab"]}
      />

      {userInfo?.type === 1 && (
        <>
          <Tab.Screen
            name={TeacherAssignmentTab}
            component={TeacherAssignmentList}
            options={pageOptions["TeacherAssignmentTab"]}
          />
          <Tab.Screen
            name={TeacherAssessmentTab}
            component={TeacherAssessmentList}
            options={pageOptions["TeacherAssessmentTab"]}
          />
        </>
      )}

      {userInfo?.type === 3 && (
        <Tab.Screen
          name={TeachersListTab}
          component={TeachersList}
          options={pageOptions["TeachersListTab"]}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: YoColors.primary,
  },
  iconContainer: {
    width: 65,
    marginEnd: 10,
  },
  backIcon: {
    alignSelf: "center",
    paddingVertical: 2,
  },
});
