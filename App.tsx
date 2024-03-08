import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import LoginPage from './src/components/LoginPage';
import {NavigationContainer} from '@react-navigation/native';
import {StackNavigator} from './src/navigation/StackNavigator';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import {getUserData} from './src/shared/sharedDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthStack} from './src/navigation/AuthStack';
import MainNavigator from './src/navigation/MainNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {height} = Dimensions.get('window');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#124076' : '#124076',
    height: height,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <MainNavigator />
        {/* {!isLoggedIn ? <AuthStack /> : <DrawerNavigation />} */}
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
