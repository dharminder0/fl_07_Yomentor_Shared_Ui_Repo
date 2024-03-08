import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthStack} from './AuthStack';
import {StackNavigator} from './StackNavigator';
import Startup from '../screens/Startup';

const MainNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Startup" component={Startup} />
      <Stack.Screen name="AppStack" component={StackNavigator} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
