import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
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
import { useThemeColor } from "../assets/themes/useThemeColor";
import HomeScreen from "../components/home/HomeScreen";
import TeacherAssignmentList from "../components/teacher/TeacherAssignmentList";
import TeacherAssessmentList from "../components/teacher/TeacherAssessmentList";
import DashboardPage from "../components/DashboardPage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TeachersList from "../components/TeachersList";
import BooksList from "../components/books/BooksList";
import MySkillTests from "../components/students/MySkillTests";
import AttemptHistory from "../components/students/AttemptHistory";

const Tab = createBottomTabNavigator();
// Ionicons.loadFont();
// Icon.loadFont();
const YoColors = useThemeColor();

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
      {userInfo?.image ? (
        <Image
          source={{ uri: userInfo?.image }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
          }}
        />
      ) : (
        <Image
          source={Images.DefaultUser}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
          }}
        />
      )}
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
  const BooksListTab = "BooksList";
  const MySkillTestTabs = "MySkillTestTabs";
  const AttemptHistoryTab = "AttemptHistoryTab";

  const pageOptions: any = {
    homeTab: {
      headerTintColor: "#fff",
      title: "Home",
      headerLeft: headerDrawer,
    },
    dashboardTab: {
      headerTintColor: "#fff",
      title: "My Batches",
      headerLeft: headerDrawer,
    },
    TeacherAssignmentTab: {
      headerTintColor: "#fff",
      title: "My Assignments",
      headerLeft: headerDrawer,
    },
    TeacherAssessmentTab: {
      headerTintColor: "#fff",
      title: "My Assessments",
      headerLeft: headerDrawer,
    },
    TeachersListTab: {
      headerTintColor: "#fff",
      title: "Teachers",
      headerLeft: headerDrawer,
    },
    BooksListTab: {
      headerTintColor: "#fff",
      title: "Book Exchange",
      headerLeft: headerDrawer,
    },
    MySkillTestTabs: {
      headerTintColor: "#fff",
      title: "My Skill Test",
      headerLeft: headerDrawer,
    },
    AttemptHistoryTab: {
      headerTintColor: "#fff",
      title: "Attempt History",
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
                  <Text style={[styles.labelTitle, { color: color }]}>
                    Home
                  </Text>
                </View>
              )}
              {rn === DashboardTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="laptop" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    My {"\n"} Batches
                  </Text>
                </View>
              )}
              {rn === TeacherAssignmentTab && (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons name="book" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    My {"\n"} Assignments
                  </Text>
                </View>
              )}
              {rn === TeacherAssessmentTab && (
                <View style={{ alignItems: "center" }}>
                  <Icon name="book" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    My {"\n"} Assessments
                  </Text>
                </View>
              )}
              {rn === TeachersListTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="person" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    Teachers
                  </Text>
                </View>
              )}
              {rn === BooksListTab && (
                <View style={{ alignItems: "center" }}>
                  <Ionicons name="book" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    Book {"\n"} Exchange
                  </Text>
                </View>
              )}
              {rn === MySkillTestTabs && (
                <View style={{ alignItems: "center" }}>
                  <MaterialCommunityIcons name="clipboard-list-outline" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    My Tests
                  </Text>
                </View>
              )}
              {rn === AttemptHistoryTab && (
                <View style={{ alignItems: "center" }}>
                  <Feather name="target" size={21} color={color} />
                  <Text style={[styles.labelTitle, { color: color }]}>
                    My Attempts
                  </Text>
                </View>
              )}
            </View>
          );
        },
        headerShown: true,
        tabBarItemStyle: { paddingTop: 5, paddingBottom: 5 },
        tabBarActiveTintColor: YoColors.primary,
        headerLeftContainerStyle: { paddingStart: 12 },
        headerTitleAlign: "center",
        headerRightContainerStyle: { paddingEnd: 12 },
        headerStyle: { backgroundColor: YoColors.primary },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name={HomeTab}
        component={HomeScreen}
        options={pageOptions["homeTab"]}
      />
      {/* <Tab.Screen
        name={DashboardTab}
        component={DashboardPage}
        options={pageOptions["dashboardTab"]}
      /> */}

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
        <>
          <Tab.Screen
            name={MySkillTestTabs}
            component={MySkillTests}
            options={pageOptions["MySkillTestTabs"]}
          />
          <Tab.Screen
            name={AttemptHistoryTab}
            component={AttemptHistory}
            options={pageOptions["AttemptHistoryTab"]}
          />
        </>
        // <Tab.Screen
        //   name={TeachersListTab}
        //   component={TeachersList}
        //   options={pageOptions["TeachersListTab"]}
        // />
      )}

      {/* <Tab.Screen
        name={BooksListTab}
        component={BooksList}
        options={pageOptions["BooksListTab"]}
      /> */}
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
  labelTitle: {
    fontSize: 10,
    textAlign: "center",
  },
});
