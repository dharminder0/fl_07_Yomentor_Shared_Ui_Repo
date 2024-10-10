/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import axios from 'axios';
// import messaging from '@react-native-firebase/messaging';
// import { NotificationListener, requestUserPermission } from './src/shared/pushnotification_helper';


// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Background message:', remoteMessage);
// });

// requestUserPermission();
// NotificationListener();

axios.interceptors.request.use();
AppRegistry.registerComponent(appName, () => App);
