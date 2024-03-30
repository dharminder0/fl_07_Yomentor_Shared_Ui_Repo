import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentList from "../components/batch/students/StudentList";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import OpenBatchDetails from "../components/OpenBatchDetails";
import DrawerNavigation from "./DrawerNavigation";
import { YoColors } from "../assets/themes/YoColors";
import BatchDetailTab from "../components/BatchDetailTab";
import AddStudentAttendence from "../components/batch/students/AddStudentAttendence";
import TeacherAssessmentList from "../components/teacher/TeacherAssessmentList";
import TeacherAssignmentList from "../components/teacher/TeacherAssignmentList";
import AssignmentDetails from "../components/batch/assignments/AssignmentDetails";
import AssesmentDetails from "../components/batch/assessments/AssesmentDetails";
import TeachersList from "../components/TeachersList";
import UserDetails from "../components/UserDetails";
import Reviews from "../components/Reviews";
import { BottomNavigation } from "./BottomNavigation";

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
    <Stack.Navigator initialRouteName="">
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
      {/* <Stack.Screen
        name="TeacherAssessmentList"
        component={TeacherAssessmentList}
        options={{
          headerShown: false,
          title: "TeacherAssessmentList",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="TeacherAssignmentList"
        component={TeacherAssignmentList}
        options={{
          headerShown: false,
          title: "TeacherAssignmentList",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      /> */}
      <Stack.Screen
        name="AssignmentDetails"
        component={AssignmentDetails}
        options={{
          headerShown: false,
          title: "AssignmentDetails",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="AssesmentDetails"
        component={AssesmentDetails}
        options={{
          headerShown: false,
          title: "AssesmentDetails",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      {/* <Stack.Screen
        name="TeachersList"
        component={TeachersList}
        options={{
          headerShown: false,
          title: "TeachersList",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      /> */}
      <Stack.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          headerShown: false,
          title: "UserDetails",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="Reviews"
        component={Reviews}
        options={{
          headerShown: false,
          title: "Reviews",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}
