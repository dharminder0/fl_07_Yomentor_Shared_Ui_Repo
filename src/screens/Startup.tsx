import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { YoImages } from "../assets/themes/YoImages";
import { Image } from "react-native-elements";
import { GetFCMToken, getUserData } from "../shared/sharedDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PushNotification from "react-native-push-notification";
import { addDeviceToken } from "../apiconfig/SharedApis";

const Startup = () => {
  const image: any = YoImages();
  const navigation: any = useNavigation();

  useEffect(() => {
    const channelCallback = (created: boolean) => {
      if (created) {
        console.log("Channel created successfully");
      } else {
        console.log("Channel creation failed");
      }
    };

    getUserData("userData").then((result: any) => {
      if (result && result?.id) {
        PushNotification.createChannel(
          {
            channelId: "YomentorNotify",
            channelName: "Yo!Mentor",
          },
          channelCallback
        );
        AsyncStorage.getItem("fcmtoken").then((deviceToken: any) => {
          if (deviceToken) {
            // console.log("deviceToken", deviceToken);
            // console.log("userInfo", result);
            const payload: any = {
              userId: [result?.id],
              deviceToken: deviceToken,
            };
            addDeviceToken(payload)
              .then((response: any) => {
                console.log("resspoinse", response);
                new Promise((resolve) =>
                  setTimeout(() => {
                    resolve(true);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "AppStack" }],
                    });
                    SplashScreen.hide();
                  }, 2000)
                );
              })
              .catch((error: any) => {
                console.log(error);
                setTimeout(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "AuthStack" }],
                  });
                  SplashScreen.hide();
                }, 2000);
              });
          }
        });
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
