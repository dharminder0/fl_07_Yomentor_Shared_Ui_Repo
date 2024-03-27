import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import { YoColors } from "./src/assets/themes/YoColors";
import InternetConnectionStatus from "./src/screens/InternetConnectionStatus";
import { ToastProvider } from "react-native-toast-notifications";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const { height } = Dimensions.get("window");
  const backgroundStyle = {
    backgroundColor: isDarkMode ? YoColors.primary : YoColors.primary,
    height: height,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ToastProvider>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "light-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
        {/* <InternetConnectionStatus /> */}
      </ToastProvider>
    </SafeAreaView>
  );
}

export default App;
