import React, { useEffect } from "react";
import { View, ToastAndroid } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const InternetConnectionStatus = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      if (!state.isConnected) {
        showToast("No internet connection");
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message: any) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  return <View />;
};

export default InternetConnectionStatus;
