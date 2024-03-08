import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DashboardPage from '../components/DashboardPage';
import DrawerSidebar from './DrawerSidebar';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardPage"
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: '#dadada'},
      }}
      drawerContent={props => <DrawerSidebar {...props} />}>
      <Drawer.Screen
        name="DashboardPage"
        component={DashboardPage}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
