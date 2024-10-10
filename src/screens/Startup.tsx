import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { YoImages } from "../assets/themes/YoImages";
import { Image } from "react-native-elements";
import { getUserData } from "../shared/sharedDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { addDeviceToken } from "../apiconfig/SharedApis";

const Startup = () => {
  const image: any = YoImages();
  const navigation: any = useNavigation();

  useEffect(() => {
    getUserData("userData").then((result: any) => {
      if (result && result?.id) {
        new Promise((resolve) =>
          setTimeout(() => {
            resolve(true);
            if (result.type == 3 && result.studentGradeId <= 0 && result.category <= 0) {
              navigation.reset({
                index: 0,
                routes: [{ name: "StudentOnBoard" }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "AppStack" }],
              });
            }
            SplashScreen.hide();
          }, 2000)
        );
      } else {
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack" }],
          });
          SplashScreen.hide();
        }, 2000);
      }
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ marginBottom: 100 }}>
        <Image source={image.logo} style={{ height: 55, width: 300 }} />
      </View>
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default Startup;
