import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "../components/auth/LoginPage";
import ForgetPassword from "../components/auth/ForgetPassword";
import UserRegistration from "../components/auth/UserRegistration";
import SelectUserType from "../components/auth/SelectUserType";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="UserRegistration" component={UserRegistration} />
      <Stack.Screen name="SelectUserType" component={SelectUserType} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
}
