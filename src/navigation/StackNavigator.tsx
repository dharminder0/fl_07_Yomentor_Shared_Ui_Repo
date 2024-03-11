import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardPage from "../components/DashboardPage";
import LoginPage from "../components/LoginPage";
import BatchDetails from "../components/BatchDetails";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import OpenBatchDetails from "../components/OpenBatchDetails";
import DrawerNavigation from "./DrawerNavigation";
import { YoColors } from "../assets/themes/YoColors";

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
        name="BatchDetail"
        component={BatchDetails}
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
    </Stack.Navigator>
  );
}
