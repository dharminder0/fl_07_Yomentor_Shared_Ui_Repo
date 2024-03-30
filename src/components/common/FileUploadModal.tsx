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
import { getTypes } from "../../shared/sharedDetails";
import { YoColors } from "../../assets/themes/YoColors";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { uploadStyles } from "../../assets/styles/UploadStyle";
import { uploadFileToBlob } from "../../apiconfig/SharedApis";
import FlashMessage, {
  hideMessage,
  showMessage,
} from "react-native-flash-message";

const FileUploadModal = ({
  title = "",
  appointmentId = "",
  fileList = [],
  onChange = (value: any) => {},
  docUseType = 0,
  include = "",
  isDisabled = false,
  patientId = "",
  fileNameAs = "filename",
  urlAs = "url",
  setIsDisabled = (value: boolean) => {},
}) => {
  const types = getTypes();
  const [isBrowseFile, setIsBrowseFile] = useState(false);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>({});
  const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [storagePermission, setStoragePermission] = useState<string | null>(
    null
  );
  const [uploadedFilesList, setUploadedFilesList] = useState<any>([]);

  // useEffect(() => {
  //   requestPermissions();
  // }, [isBrowseFile]);

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
    const options: any = { mediaType: "photo" };
    if (type === "document") {
      // if (storagePermission === 'granted') {
      //   DocumentPicker.pick({type: [DocumentPicker.types.allFiles],allowMultiSelection: false}).then((result:any) => {
      //     if(result && result.length > 0){
      //       uploadFileToDB(result[0]);
      //     }
      //   });
      // } else {
      //   Alert.alert('Permission Required', 'Please grant storage permission to access files.');
      // }
      DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      }).then((result: any) => {
        if (result && result.length > 0) {
          uploadFileToDB(result[0]);
        }
      });
    } else if (type === "image") {
      // if (storagePermission === 'granted') {
      //   launchImageLibrary(options).then((result:any) => {
      //     if(result && result.assets && result.assets.length > 0){
      //       payload = {
      //         "fileCopyUri": null,
      //         "name": result.assets[0].fileName,
      //         "size": result.assets[0].fileSize,
      //         "type": result.assets[0].type,
      //         "uri": result.assets[0].uri
      //       }
      //       uploadFileToDB(payload);
      //     }
      //   });
      // } else {
      //   Alert.alert('Permission Required', 'Please grant storage permission to access photos.');
      // }
      launchImageLibrary(options).then((result: any) => {
        if (result && result.assets && result.assets.length > 0) {
          payload = {
            fileCopyUri: null,
            name: result.assets[0].fileName,
            size: result.assets[0].fileSize,
            type: result.assets[0].type,
            uri: result.assets[0].uri,
          };
          uploadFileToDB(payload);
        }
      });
    } else if (type === "camera") {
      // if (cameraPermission === 'granted' && storagePermission === 'granted') {
      //   launchCamera(options).then((result:any) => {
      //     if(result && result.assets && result.assets.length > 0){
      //       payload = {
      //         "fileCopyUri": null,
      //         "name": result.assets[0].fileName,
      //         "size": result.assets[0].fileSize,
      //         "type": result.assets[0].type,
      //         "uri": result.assets[0].uri
      //       }
      //       uploadFileToDB(payload);
      //     }
      //   });
      // } else {
      //   Alert.alert(
      //     'Permissions Required',
      //     'Please grant camera and storage permissions to use the camera.',
      //   );
      // }
      launchCamera(options).then((result: any) => {
        if (result && result.assets && result.assets.length > 0) {
          payload = {
            fileCopyUri: null,
            name: result.assets[0].fileName,
            size: result.assets[0].fileSize,
            type: result.assets[0].type,
            uri: result.assets[0].uri,
          };
          uploadFileToDB(payload);
        }
      });
    }
    setIsLoaderVisible(false);
  };

  const getFileExtention = (fileUrl: any) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const uploadFileToDB = (data: any) => {
    const fData: any = new FormData();
    fData.append("file", data);
    setIsBrowseFile(false);
    setIsDisabled(true);
    setIsLoaderVisible(true);
    uploadFileToBlob(fData, 3).then((result: any) => {
      if (result.data && result.data.message == "Upload success") {
        setIsBrowseFile(false);
        showMessage({ message: result.data.message, type: "success" });
        const updatedList = [...uploadedFilesList, result.data.data];
        setUploadedFilesList(updatedList);
        setIsLoaderVisible(false);
      } else {
        setIsBrowseFile(false);
        showMessage({ message: result.data.message, type: "danger" });
      }
      setTimeout(() => {
        setIsDisabled(false);
        hideMessage();
      }, 1000);
    });
  };

  const downloadFile = (fileLink: string) => {
    // Handle file download
  };

  const addMediaByEntity = (file: any) => {
    // Handle adding media by entity
  };

  const handleDelete = (data: any) => {
    // Handle delete action
  };

  const deleteMedia = (file?: any) => {
    let requestBody: any = {
      mediaTypeId: 0,
      entityTypeId: 3, //PatientSpecific
      entityId: appointmentId,
      bloblink: file.url,
    };
  };

  return (
    <View>
      {title && (
        <Text
          style={{
            fontWeight: "600",
            color: YoColors.secondary,
            marginVertical: 5,
          }}
        >
          {title}:
        </Text>
      )}
      {!isDisabled && (
        <Button
          disabled={isDisabled}
          buttonStyle={uploadStyles.fileUploadCard}
          onPress={() => {
            requestPermissions();
            setIsBrowseFile(true);
          }}
          icon={
            <Ionicons name="cloud-upload" size={30} color={YoColors.primary} />
          }
          title={
            <>
              <Text style={uploadStyles.headTitle}>Upload File</Text>
              <Text style={uploadStyles.subTitle}>
                Support Format: JPEG, PNG, GIF, MP4, PDF, Word, PPT
              </Text>
            </>
          }
        />
      )}
      <FlashMessage
        position="top"
        style={{ borderRadius: 4, alignItems: "center" }}
      />
      <Modal
        isVisible={isBrowseFile}
        onBackButtonPress={() => setIsBrowseFile(false)}
        swipeDirection="down"
        onSwipeComplete={() => setIsBrowseFile(false)}
        onBackdropPress={() => setIsBrowseFile(false)}
        style={{ margin: 0 }}
      >
        <View style={uploadStyles.browseWrapper}>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={uploadStyles.browseIcon}
              onPress={() => uploadFile("document")}
            >
              <Ionicons name="document" size={32} color={YoColors.primary} />
            </TouchableOpacity>
            <Text style={uploadStyles.browseText}>Document</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={uploadStyles.browseIcon}
              onPress={() => uploadFile("image")}
            >
              <Ionicons name="image-sharp" size={32} color={YoColors.primary} />
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
      </Modal>
      {uploadedFilesList && uploadedFilesList.length > 0 && (
        <FlatList
          data={uploadedFilesList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: { item: any; index: number }) => {
            return (
              <View key={index} style={uploadStyles.fileCard}>
                <Ionicons
                  name="document-text"
                  size={34}
                  color={YoColors.primary}
                />
                <TouchableOpacity
                  onPress={() => {
                    downloadFile(item?.[urlAs]);
                  }}
                  style={{ marginEnd: 5, width: isDisabled ? "90%" : "80%" }}
                >
                  <Text numberOfLines={1} style={{ color: YoColors.text }}>
                    {item?.fileName}
                  </Text>
                  {item?.createdDate && (
                    <Text numberOfLines={1} style={{ fontSize: 12 }}>
                      Attached on{" "}
                      {moment(item?.createdDate, "DD-MM-YYYY").format(
                        "MMM DD, YYYY"
                      )}
                    </Text>
                  )}
                </TouchableOpacity>
                {!isDisabled && (
                  <Pressable onPress={() => deleteMedia(item)}>
                    <Ionicons name="trash" size={21} color={YoColors.primary} />
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default memo(FileUploadModal);
