import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "@react-native-community/geolocation";
import {
  Platform,
  PermissionsAndroid,
  Permission,
  useColorScheme,
  Appearance,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import configData from "../../config.json";
import { firebase } from "@react-native-firebase/messaging";

export const saveAsyncData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log("User data saved successfully.");
  } catch (error) {
    console.error("Error saving user data: ", error);
  }
};

let userInfo: any = {};
export const getUserData = async (key: string) => {
  try {
    const result: any = await AsyncStorage.getItem(key);
    const currentUser = JSON.parse(result);
    if (key === "userData") userInfo = currentUser;
    return currentUser;
  } catch (error) {
    console.error("Error retrieving user data: ", error);
    return null;
  }
};

export const getUserInfo = () => {
  return userInfo;
};

export const clearUserData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("User data cleared successfully.");
  } catch (error) {
    console.error("Error clearing user data: ", error);
  }
};

export const getFeeTypes = () => {
  const feeTypes: any = [
    {
      id: 0,
      name: "Hour",
    },
    {
      id: 1,
      name: "Day",
    },
    {
      id: 2,
      name: "Week",
    },
    {
      id: 3,
      name: "Month",
    },
  ];
  return feeTypes;
};

export const getCategoryList = () => {
  const Category: any = [
    {
      id: 1,
      name: "Academic",
    },
    {
      id: 2,
      name: "Competitive Exams",
    }
  ];
  return Category;
};
export const getNoQuestions = () => {
  const Category: any = [
    {
      id: 5,
      name: "5",
    },
    {
      id: 10,
      name: "10",
    }
  ];
  return Category;
};

export const getComplexityLevel = () => {
  const Category: any = [
    {
      id: 1,
      name: "Easy",
    },
    {
      id: 2,
      name: "Medium",
    },
    {
      id: 3,
      name: "Hard",
    },
    {
      id: 4,
      name: "Advanced",
    }
  ];
  return Category;
};

export const getLanguage = () => {
  const Language: any = [
    {
      id: 1,
      name: "Hindi",
    },
    {
      id: 2,
      name: "English",
    },
    {
      id: 3,
      name: "Urdu",
    },
    {
      id: 4,
      name: "Punjabi",
    },
    {
      id: 5,
      name: "Sanskrit",
    }
  ];
  return Language;
};

export const getDayList = () => {
  const days: any = [
    {
      id: 0,
      name: "Sunday",
    },
    {
      id: 1,
      name: "Monday",
    },
    {
      id: 2,
      name: "Tuesday",
    },
    {
      id: 3,
      name: "Wednesday",
    },
    {
      id: 4,
      name: "Thursday",
    },
    {
      id: 5,
      name: "Friday",
    },
    {
      id: 6,
      name: "Saturday",
    },
  ];
  return days;
};

export function getTypes() {
  const type: any = {
    //   File Extension   MIME Type
    abs: "audio/x-mpeg",
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aifc: "audio/x-aiff",
    aiff: "audio/x-aiff",
    aim: "application/x-aim",
    art: "image/x-jg",
    asf: "video/x-ms-asf",
    asx: "video/x-ms-asf",
    au: "audio/basic",
    avi: "video/x-msvideo",
    avx: "video/x-rad-screenplay",
    bcpio: "application/x-bcpio",
    bin: "application/octet-stream",
    bmp: "image/bmp",
    body: "text/html",
    cdf: "application/x-cdf",
    cer: "application/pkix-cert",
    class: "application/java",
    cpio: "application/x-cpio",
    csh: "application/x-csh",
    css: "text/css",
    dib: "image/bmp",
    doc: "application/msword",
    dtd: "application/xml-dtd",
    dv: "video/x-dv",
    dvi: "application/x-dvi",
    eot: "application/vnd.ms-fontobject",
    eps: "application/postscript",
    etx: "text/x-setext",
    exe: "application/octet-stream",
    gif: "image/gif",
    gtar: "application/x-gtar",
    gz: "application/x-gzip",
    hdf: "application/x-hdf",
    hqx: "application/mac-binhex40",
    htc: "text/x-component",
    htm: "text/html",
    html: "text/html",
    ief: "image/ief",
    jad: "text/vnd.sun.j2me.app-descriptor",
    jar: "application/java-archive",
    java: "text/x-java-source",
    jnlp: "application/x-java-jnlp-file",
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/javascript",
    jsf: "text/plain",
    json: "application/json",
    jspf: "text/plain",
    kar: "audio/midi",
    latex: "application/x-latex",
    m3u: "audio/x-mpegurl",
    mac: "image/x-macpaint",
    man: "text/troff",
    mathml: "application/mathml+xml",
    me: "text/troff",
    mid: "audio/midi",
    midi: "audio/midi",
    mif: "application/x-mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp1: "audio/mpeg",
    mp2: "audio/mpeg",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    mpa: "audio/mpeg",
    mpe: "video/mpeg",
    mpeg: "video/mpeg",
    mpega: "audio/x-mpeg",
    mpg: "video/mpeg",
    mpv2: "video/mpeg2",
    ms: "application/x-wais-source",
    nc: "application/x-netcdf",
    oda: "application/oda",
    odb: "application/vnd.oasis.opendocument.database",
    odc: "application/vnd.oasis.opendocument.chart",
    odf: "application/vnd.oasis.opendocument.formula",
    odg: "application/vnd.oasis.opendocument.graphics",
    odi: "application/vnd.oasis.opendocument.image",
    odm: "application/vnd.oasis.opendocument.text-master",
    odp: "application/vnd.oasis.opendocument.presentation",
    ods: "application/vnd.oasis.opendocument.spreadsheet",
    odt: "application/vnd.oasis.opendocument.text",
    otg: "application/vnd.oasis.opendocument.graphics-template",
    oth: "application/vnd.oasis.opendocument.text-web",
    otp: "application/vnd.oasis.opendocument.presentation-template",
    ots: "application/vnd.oasis.opendocument.spreadsheet-template",
    ott: "application/vnd.oasis.opendocument.text-template",
    ogx: "application/ogg",
    ogv: "video/ogg",
    oga: "audio/ogg",
    ogg: "audio/ogg",
    otf: "application/x-font-opentype",
    spx: "audio/ogg",
    flac: "audio/flac",
    anx: "application/annodex",
    axa: "audio/annodex",
    axv: "video/annodex",
    xspf: "application/xspf+xml",
    pbm: "image/x-portable-bitmap",
    pct: "image/pict",
    pdf: "application/pdf",
    pgm: "image/x-portable-graymap",
    pic: "image/pict",
    pict: "image/pict",
    pls: "audio/x-scpls",
    png: "image/png",
    pnm: "image/x-portable-anymap",
    pnt: "image/x-macpaint",
    ppm: "image/x-portable-pixmap",
    ppt: "application/vnd.ms-powerpoint",
    pps: "application/vnd.ms-powerpoint",
    ps: "application/postscript",
    psd: "image/vnd.adobe.photoshop",
    qt: "video/quicktime",
    qti: "image/x-quicktime",
    qtif: "image/x-quicktime",
    ras: "image/x-cmu-raster",
    rdf: "application/rdf+xml",
    rgb: "image/x-rgb",
    rm: "application/vnd.rn-realmedia",
    roff: "text/troff",
    rtf: "application/rtf",
    rtx: "text/richtext",
    sfnt: "application/font-sfnt",
    sh: "application/x-sh",
    shar: "application/x-shar",
    sit: "application/x-stuffit",
    snd: "audio/basic",
    src: "application/x-wais-source",
    sv4cpio: "application/x-sv4cpio",
    sv4crc: "application/x-sv4crc",
    svg: "image/svg+xml",
    svgz: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    t: "text/troff",
    tar: "application/x-tar",
    tcl: "application/x-tcl",
    tex: "application/x-tex",
    texi: "application/x-texinfo",
    texinfo: "application/x-texinfo",
    tif: "image/tiff",
    tiff: "image/tiff",
    tr: "text/troff",
    tsv: "text/tab-separated-values",
    ttf: "application/x-font-ttf",
    txt: "text/plain",
    ulw: "audio/basic",
    ustar: "application/x-ustar",
    vxml: "application/voicexml+xml",
    xbm: "image/x-xbitmap",
    xht: "application/xhtml+xml",
    xhtml: "application/xhtml+xml",
    xls: "application/vnd.ms-excel",
    xml: "application/xml",
    xpm: "image/x-xpixmap",
    xsl: "application/xml",
    xslt: "application/xslt+xml",
    xul: "application/vnd.mozilla.xul+xml",
    xwd: "image/x-xwindowdump",
    vsd: "application/vnd.visio",
    wav: "audio/x-wav",
    wbmp: "image/vnd.wap.wbmp",
    wml: "text/vnd.wap.wml",
    wmlc: "application/vnd.wap.wmlc",
    wmls: "text/vnd.wap.wmlsc",
    wmlscriptc: "application/vnd.wap.wmlscriptc",
    wmv: "video/x-ms-wmv",
    woff: "application/font-woff",
    woff2: "application/font-woff2",
    wrl: "model/vrml",
    wspolicy: "application/wspolicy+xml",
    z: "application/x-compress",
    zip: "application/zip",
  };
  return type;
}

export const downloadFile = (file: any, setLoading: any) => {
  setLoading(true);
  const types = getTypes();
  let file_ext: any = getFileExtension(file.fileLink);
  let file_ext2: any = "." + file_ext[0];
  RNFetchBlob.config({
    fileCache: true,
    appendExt: file_ext2,
  })
    .fetch("GET", file.fileLink)
    .then((res: any) => {
      Platform.OS == "ios"
        ? RNFetchBlob.ios.openDocument(res.path())
        : RNFetchBlob.android.actionViewIntent(res.path(), types[file_ext[0]]);
      setLoading(false);
    });
};

const getFileExtension = (fileUrl: any) => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};

export async function requestLocationPermission() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "This app needs access to your location to provide relevant information.",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission granted");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export const getLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;
        // resolve({ longitude, latitude });
        // getGeocodeFromCoordinates(latitude, longitude);
        // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${configData.MapBoxToken}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const address: any = {
              latitude: latitude,
              longitude: longitude,
              place: data.features[1].place_name,
              pincode: data.features[2].text,
              city: data.features[4].text,
              dist: data.features[5].text,
              state: data.features[6].text,
            };
            // console.log("address");
            // console.log(address);
            resolve(address);
          } else {
            throw new Error("Unable to retrieve address");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          throw error;
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: false, timeout: 3000, maximumAge: 10000 }
    );
  });
};

export const requestNotificationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: "Notification Permission",
        message: "App needs permission to show notifications",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Notification permission granted");
    } else {
      console.log("Notification permission denied");
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const GetFCMToken = () => {
  AsyncStorage.getItem("fcmtoken").then((result: any) => {
    if (!result) {
      const messaging = firebase.messaging();
      messaging
        .requestPermission()
        .then(() => {
          messaging
            .getToken()
            .then((fcmtoken: any) => {
              AsyncStorage.setItem("fcmtoken", fcmtoken);
              return fcmtoken;
            })
            .catch((error: any) => {
              console.log("Error retrieving FCM token:", error);
            });
        })
        .catch((error: any) => {
          console.log("Error requesting permission:", error);
        });
    } else if (result) {
      return result;
    }
  });
};

const notifyInfo: any = {
  channelId: "YomentorNotify",
  channelName: "Yo!Mentor",
  channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  playSound: true, // (optional) default: true
  soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  importance: 4, // (optional) default: 4. Int value of the Android notification importance
  vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
};

export const getNotifyInfo = () => {
  return notifyInfo;
};
