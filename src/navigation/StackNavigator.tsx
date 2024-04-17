import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentList from "../components/batch/students/StudentList";
import OpenBatchDetails from "../components/OpenBatchDetails";
import DrawerNavigation from "./DrawerNavigation";
import { useThemeColor } from "../assets/themes/useThemeColor";
import BatchDetailTab from "../components/BatchDetailTab";
import AddStudentAttendence from "../components/batch/students/AddStudentAttendence";
import AssignmentDetails from "../components/batch/assignments/AssignmentDetails";
import AssesmentDetails from "../components/batch/assessments/AssesmentDetails";
import UserDetails from "../components/UserDetails";
import Reviews from "../components/Reviews";
import UserProfile from "../components/profile/UserProfile";
import BookDetails from "../components/books/BookDetails";
import OffersBookDetails from "../components/books/OffersBookDetails";
import StudentAttendanceDetails from "../components/batch/students/StudentAttendanceDetails";

const Stack = createNativeStackNavigator();

export function StackNavigator() {
  const YoColors = useThemeColor();

  return (
    <Stack.Navigator
      initialRouteName=""
      screenOptions={{ headerTitleAlign: "center", headerTintColor: "#fff" }}
    >
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
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerShown: true,
          title: "My Profile",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
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
      <Stack.Screen
        name="BookDetails"
        component={BookDetails}
        options={{
          headerShown: false,
          title: "Book Details",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
      <Stack.Screen
        name="OffersBookDetails"
        component={OffersBookDetails}
        options={{
          headerShown: false,
          title: "Offer Book Details",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
       <Stack.Screen
        name="StudentAttendanceDetails"
        component={StudentAttendanceDetails}
        options={{
          headerShown: false,
          title: "Student Attendance Details",
          headerStyle: { backgroundColor: YoColors.primary },
          headerTitleStyle: { color: "#fff" },
        }}
      />
    </Stack.Navigator>
  );
}
