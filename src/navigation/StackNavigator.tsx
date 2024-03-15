import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardPage from "../components/DashboardPage";
import LoginPage from "../components/auth/LoginPage";
import StudentList from "../components/batch/StudentList";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import OpenBatchDetails from "../components/OpenBatchDetails";
import DrawerNavigation from "./DrawerNavigation";
import { YoColors } from "../assets/themes/YoColors";
import BatchDetailTab from "../components/BatchDetailTab";
import AddStudentAttendence from "../components/batch/AddStudentAttendence";

const Stack = createNativeStackNavigator();

export function StackNavigator() {
  const navigation: any = useNavigation();
  const leftBackButton = () => {
    <MaterialCommunityIcons
      name="arrow-left"
      size={23}
      color={"#fff"}
      onPress={() => navigation.goBack()}
    />;
  };

  const openDrawerScreen = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen
        name="DrawerNavigation"
        component={DrawerNavigation}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="BatchStudentList"
        component={StudentList}
        options={{
          headerShown: false,
          title: "Batch Detail",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="OpenBatchDetails"
        component={OpenBatchDetails}
        options={{
          headerShown: false,
          title: "OpenBatchDetails",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="AddStudentAttendence"
        component={AddStudentAttendence}
        options={{
          headerShown: false,
          title: "AddStudentAttendence",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="BatchDetailTab"
        component={BatchDetailTab}
        options={{
          headerShown: false,
          title: "BatchDetailTab",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}
