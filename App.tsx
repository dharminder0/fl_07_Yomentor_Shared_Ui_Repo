import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
  useNavigation,
} from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import InternetConnectionStatus from "./src/screens/InternetConnectionStatus";
import { ToastProvider } from "react-native-toast-notifications";
import { useThemeColor } from "./src/assets/themes/useThemeColor";
import { ThemeProvider } from "./src/assets/themes/ThemeContext";
import { useTheme } from '@react-navigation/native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const { colors }: any = useTheme();
  const { height } = Dimensions.get("window");

  const backgroundStyle = {
    backgroundColor: '#283F8E',
    height: height,
    color: isDarkMode ? '#fff' : "#000",
  };


  const MyDarkTheme: any = {
    dark: true,
    colors: {
      primary: '#283F8E',
      secondary: "#6c757d",
      background: '#171616',
      lightBackground: "#121212",
      card: '#121212',
      text: "#D8D8D8",
      inputText: "#fff",
      border: '#272729',
      notification: 'rgb(255, 69, 58)',
      placeholderText: "#707070",
      icon: "#fff",
      star: "#f0ca02",
      success: "#198754",
      danger: "#dc3545",
    },
  };

  const MyLightTheme: any = {
    dark: false,
    colors: {
      primary: '#283F8E',
      secondary: "#789abc",
      background: '#F2F2F2',
      lightBackground: "rgba(97,175,254,.15)",
      card: 'rgb(255, 255, 255)',
      text: "#2F3438",
      inputText: "#000",
      border: 'rgb(216, 216, 216)',
      notification: 'rgb(255, 59, 48)',
      placeholderText: "#A0A0A0",
      icon: "#124076",
      star: "#f0ca02",
      success: "#198754",
      danger: "#dc3545",
    },
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={backgroundStyle}>
        <ToastProvider>
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer
            theme={useColorScheme() === "dark" ? MyDarkTheme : MyLightTheme}
          >
            <MainNavigator />
          </NavigationContainer>
          {/* <InternetConnectionStatus /> */}
        </ToastProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default App;
