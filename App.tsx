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
  useNavigation,
} from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import InternetConnectionStatus from "./src/screens/InternetConnectionStatus";
import { ToastProvider } from "react-native-toast-notifications";
import { useThemeColor } from "./src/assets/themes/useThemeColor";
import { ThemeProvider } from "./src/assets/themes/ThemeContext";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  let YoColors = useThemeColor();
  const { height } = Dimensions.get("window");

  const backgroundStyle = {
    backgroundColor: isDarkMode ? YoColors.primary : YoColors.primary,
    height: height,
    color: isDarkMode ? YoColors.white : "#000",
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={backgroundStyle}>
        <ToastProvider>
          <StatusBar
            barStyle={isDarkMode ? "dark-content" : "light-content"}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer
            theme={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
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
