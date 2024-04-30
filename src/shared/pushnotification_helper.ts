import messaging, { firebase } from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { GetFCMToken, getNotifyInfo } from "./sharedDetails";
import { requestNotificationPermission } from "./sharedDetails";

export const requestUserPermission = () => {
  messaging()
    .requestPermission()
    .then((result: any) => {
      const enabled =
        result === messaging.AuthorizationStatus.AUTHORIZED ||
        result === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        GetFCMToken();
      }
    });
};

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
      }
    });

  messaging().onMessage(async (remoteMessage: any) => {
    const notifyInfo = getNotifyInfo();
    PushNotification.localNotification({
      channelId: notifyInfo.channelId,
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
    });
  });
};
