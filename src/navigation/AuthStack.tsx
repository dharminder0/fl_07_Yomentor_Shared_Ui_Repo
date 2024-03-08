import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from '../components/LoginPage';
import ForgetPassword from '../components/ForgetPassword';
import Registration from '../components/Registration';

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
}
