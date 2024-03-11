import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { YoImages } from "../assets/themes/YoImages";
import { Image } from "react-native-elements";

const { height, width } = Dimensions.get("window");
const Startup = ({ navigation }: { navigation: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const init = async () => {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(true);
        navigation.reset({
          index: 0,
          routes: [{ name: isLoggedIn ? "AppStack" : "AuthStack" }],
        });
        SplashScreen.hide();
      }, 2000)
    );
  };

  useEffect(() => {
    checkLoggedInStatus();
  }, [isLoggedIn]);

  const checkLoggedInStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      setIsLoggedIn(!!userData);
      init();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const image: any = YoImages();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ marginBottom: 50 }}>
        <Image source={image.logo} style={{ height: 55, width: width - 40 }} />
      </View>
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default Startup;
