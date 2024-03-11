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

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const { height } = Dimensions.get("window");
  const backgroundStyle = {
    backgroundColor: isDarkMode ? YoColors.primary : YoColors.primary,
    height: height,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "light-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
