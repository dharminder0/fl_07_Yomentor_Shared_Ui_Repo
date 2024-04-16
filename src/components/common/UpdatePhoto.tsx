import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import React, { memo, useState, useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import moment from "moment";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { downloadFile, getTypes } from "../../shared/sharedDetails";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker, {
  openCamera,
  openPicker,
} from "react-native-image-crop-picker";
import { uploadStyles } from "../../assets/styles/UploadStyle";
import {
  addMediaImage,
  deleteMediaFile,
  uploadFileToBlob,
} from "../../apiconfig/SharedApis";
import { useToast } from "react-native-toast-notifications";
import ProcessLoader from "../../screens/ProcessLoader";

const UpdatePhoto = ({
  setUploadedFilesList = (value: any) => {},
  userId = 0,
  mediaType = 1,
  entityType = 3,
  profileUrl = "",
  updateInfo = (value: boolean) => {},
}) => {
  const YoColors = useThemeColor();
  const [isBrowseFile, setIsBrowseFile] = useState(false);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>({});
  const [profileImage, setProfileImage] = useState<any>();
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storagePermission, setStoragePermission] = useState<string | null>(
    null
  );
  const toast = useToast();

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      // Request CAMERA permission for Android
      const cameraPermissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      setCameraPermission(cameraPermissionStatus);

      // Request WRITE_EXTERNAL_STORAGE permission for Android
      const storagePermissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      setStoragePermission(storagePermissionStatus);
    } else {
      // Request CAMERA permission for iOS
      // You can add iOS specific permissions here if needed
    }
  };

  const uploadFile = (type: string) => {
    let payload: any = {};
    const options: any = { mediaType: "photo", cropping: true };
    if (type === "remove") {
      setIsLoading(true);
      const payload: any = {
        entityTypeId: entityType,
        entityId: userId,
        bloblink: profileUrl,
      };
      deleteMediaFile(payload)
        .then((response: any) => {
          if (response.data.success) {
            toast.show("Profile image deleted successfully", {
              type: "success",
              duration: 2000,
              placement: "top",
            });
            updateInfo(true);
          } else {
            toast.show("Failed to delete profile image", {
              type: "danger",
              duration: 2000,
              placement: "top",
            });
          }
          setTimeout(() => {
            setIsBrowseFile(false);
            setIsLoading(false);
          }, 1000);
        })
        .catch((error: any) => {
          console.log(error);
          toast.show("Failed to delete profile image", {
            type: "danger",
            duration: 3000,
            placement: "top",
          });
          setIsBrowseFile(false);
          setIsLoading(false);
        });
    } else if (type === "image") {
      ImagePicker.openPicker({
        height: 512,
        width: 512,
        cropping: true,
        mediaType: "photo",
        // compressImageMaxWidth: 200,
        // compressImageMaxHeight: 200,
        //cropperCircleOverlay: true,
        //cropperToolbarTitle: 'Crop Image',
        // cropperToolbarColor: '#3498db', // Customize the color of the toolbar
        // cropperToolbarWidgetColor: '#fff', // Customize the color of the toolbar icons
        // cropperActiveWidgetColor: '#3498db', // Customize the color of the active toolbar icon
        // cropperStatusBarColor: 'black', // Customize the color of the status bar on Android
        // cropperStatusBarTranslucent: true, // Make the status bar translucent on Android
        // cropperToolbarWidgetTitle: 'Done', // Change the title of the toolbar button
        // cropperToolbarCancelTitle: 'Cancel', // Change the title of the cancel button
        freeStyleCropEnabled: true, // Enable free-style crop
      })
        .then((result) => {
          if (result && result.path) {
            payload = {
              fileCopyUri: null,
              name: result.modificationDate,
              size: result.size,
              type: result.mime,
              uri: result.path,
            };
            uploadFileToDB(payload);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (type === "camera") {
      ImagePicker.openCamera({
        height: 512,
        width: 512,
        cropping: true,
        mediaType: "photo",
        //cropperCircleOverlay: true,
        //cropperToolbarTitle: 'Crop Image',
        // cropperToolbarColor: '#3498db', // Customize the color of the toolbar
        // cropperToolbarWidgetColor: '#fff', // Customize the color of the toolbar icons
        // cropperActiveWidgetColor: '#3498db', // Customize the color of the active toolbar icon
        // cropperStatusBarColor: 'black', // Customize the color of the status bar on Android
        // cropperStatusBarTranslucent: true, // Make the status bar translucent on Android
        // cropperToolbarWidgetTitle: 'Done', // Change the title of the toolbar button
        // cropperToolbarCancelTitle: 'Cancel', // Change the title of the cancel button
        freeStyleCropEnabled: true, // Enable free-style crop
      })
        .then((result) => {
          if (result && result.path) {
            payload = {
              fileCopyUri: null,
              name: result.modificationDate,
              size: result.size,
              type: result.mime,
              uri: result.path,
            };
            uploadFileToDB(payload);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const uploadFileToDB = (data: any) => {
    const fData: any = new FormData();
    fData.append("file", data);
    setIsLoading(true);
    uploadFileToBlob(fData, 3).then((result: any) => {
      if (result.data && result.data.message == "Upload success") {
        setUploadedFilesList(result.data.data);
        uploadMediaImage(result.data.data);
      } else {
        toast.show(result.data.message, {
          type: "danger",
          duration: 2000,
          placement: "top",
        });
        setTimeout(() => {
          setIsBrowseFile(false);
          setIsLoading(false);
        }, 1000);
      }
    });
  };

  const uploadMediaImage = (file: any) => {
    const payload: any = {
      entityTypeId: entityType,
      mediaTypeId: mediaType,
      entityId: userId,
      fileName: file?.fileName,
      bloblink: file?.fileLink,
    };
    addMediaImage(payload).then((response: any) => {
      if (response.data) {
        toast.show("Profile image updated successfully", {
          type: "success",
          duration: 2000,
          placement: "top",
        });
        updateInfo(true);
      }
      setTimeout(() => {
        setIsBrowseFile(false);
        setIsLoading(false);
      }, 1000);
    });
  };

  return (
    <View>
      <Button
        buttonStyle={{ backgroundColor: "#fff", borderRadius: 30 }}
        onPress={() => {
          requestPermissions();
          setIsBrowseFile(true);
        }}
        icon={<Ionicons name="camera" size={21} color={YoColors.primary} />}
      />

      <Modal
        isVisible={isBrowseFile}
        onBackButtonPress={() => setIsBrowseFile(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsBrowseFile(false)}
        onBackdropPress={() => setIsBrowseFile(false)}
        style={{ margin: 0 }}
        useNativeDriver
      >
        {isLoading ? (
          <ProcessLoader />
        ) : (
          <View style={uploadStyles.browseWrapper}>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={uploadStyles.browseIcon}
                onPress={() => uploadFile("remove")}
              >
                <Ionicons name="trash" size={32} color={YoColors.primary} />
              </TouchableOpacity>
              <Text style={uploadStyles.browseText}>Remove</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={uploadStyles.browseIcon}
                onPress={() => uploadFile("image")}
              >
                <Ionicons
                  name="image-sharp"
                  size={32}
                  color={YoColors.primary}
                />
              </TouchableOpacity>
              <Text style={uploadStyles.browseText}>Gallery</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={uploadStyles.browseIcon}
                onPress={() => uploadFile("camera")}
              >
                <Ionicons name="camera" size={32} color={YoColors.primary} />
              </TouchableOpacity>
              <Text style={uploadStyles.browseText}>Camera</Text>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default memo(UpdatePhoto);
