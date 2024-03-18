import { Pressable, Text, TouchableOpacity, View } from "react-native";
import React, { memo, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import moment from "moment";
import { getTypes } from "../../shared/sharedDetails";
import { YoColors } from "../../assets/themes/YoColors";
import Modal from "react-native-modal";
import { uploadStyles } from "../../assets/styles/UploadStyle";
import Ionicons from "react-native-vector-icons/Ionicons";

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
}) => {
  const types = getTypes();
  const [isBrowseFile, setIsBrowseFile] = useState(false);
  const [selectedFileToDelete, setSelectedFileToDelete] = useState<any>({});

  const handleSelectChange = (value: any) => {
    if (onChange) {
      onChange(value);
    }
  };

  const uploadFile = (type: string) => {
    let payload: any = {};
    const options: any = { mediaType: "photo", allowsEditing: true };

    if (type === "document") {
      //   DocumentPicker.pick({
      //     type: [DocumentPicker.types.allFiles],
      //     allowMultiSelection: false,
      //   }).then((result: any) => {
      //     if (result && result.length > 0) {
      //       uploadFileToDB(result[0]);
      //     }
      //   });
    } else if (type === "image") {
      //   launchImageLibrary(options).then((result: any) => {
      //     if (result && result.assets && result.assets.length > 0) {
      //       payload = {
      //         fileCopyUri: null,
      //         name: result.assets[0].fileName,
      //         size: result.assets[0].fileSize,
      //         type: result.assets[0].type,
      //         uri: result.assets[0].uri,
      //       };
      //       uploadFileToDB(payload);
      //     }
      //   });
    } else if (type === "camera") {
      //   launchCamera(options).then((result: any) => {
      //     if (result && result.assets && result.assets.length > 0) {
      //       payload = {
      //         fileCopyUri: null,
      //         name: result.assets[0].fileName,
      //         size: result.assets[0].fileSize,
      //         type: result.assets[0].type,
      //         uri: result.assets[0].uri,
      //       };
      //       uploadFileToDB(payload);
      //     }
      //   });
    }
    // setIsMainLoader(false);
  };

  const getFileExtention = (fileUrl: any) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const uploadFileToDB = (data: any) => {
    const fData: any = new FormData();
    fData.append("file", data);
    setIsBrowseFile(false);
    // uploadFileToBlob(fData, 3).then((result: any) => {
    //   console.log("upload file db", result.data);
    //   if (result.data && result.data.message == "Upload success") {
    //     setIsBrowseFile(false);
    //     handleSelectChange(result.data.data);
    //     showMessage({ message: result.data.message, type: "success" });
    //     addMediaByEntity(result.data.data);
    //   } else {
    //     showMessage({ message: result.data.message, type: "danger" });
    //   }
    //   setTimeout(() => {
    //     hideMessage();
    //   }, 1000);
    // });
  };

  const downloadFile = (fileLink: string) => {
    // setIsMainLoader(true);
    // let file_ext: any = getFileExtention(fileLink);
    // let file_ext2: any = "." + file_ext[0];
    // RNFetchBlob.config({
    //   fileCache: true,
    //   appendExt: file_ext2,
    // })
    //   .fetch("GET", fileLink)
    //   .then((res) => {
    //     Platform.OS == "ios"
    //       ? RNFetchBlob.ios.openDocument(res.path())
    //       : RNFetchBlob.android.actionViewIntent(
    //           res.path(),
    //           types[file_ext[0]]
    //         );
    //     setIsMainLoader(false);
    //   });
  };

  const addMediaByEntity = (file: any) => {
    let requestBody: any = {
      mediaTypeId: 0,
      entityTypeId: 3, //PatientSpecific
      entityId: appointmentId,
      fileName: !file.fileName ? file[0].fileName : file.fileName,
      bloblink: !file.fileLink ? file[0].uri : file.fileLink,
      docUsageType: docUseType, //docUsageType
    };

    // addMediaByEntityId(requestBody).then((result: any) => {
    //   if (result.data) {
    //     if (include === "Health") {
    //       requestBody["entityId"] = patientId;
    //       requestBody["docUsageType"] = 3;
    //       addMediaByEntityId(requestBody).then((result: any) => {});
    //     }
    //     setIsMainLoader(false);
    //   }
    // });
  };

  const handleDelete = (data: any) => {
    setSelectedFileToDelete(data);
  };

  const deleteMedia = (file?: any) => {
    let requestBody: any = {
      mediaTypeId: 0,
      entityTypeId: 3, //PatientSpecific
      entityId: appointmentId,
      bloblink: file.url,
    };

    // deleteMediaFile(requestBody).then((result: any) => {
    //   if (result.data) {
    //     if (include === "Health") {
    //       requestBody["entityId"] = patientId;
    //       deleteMediaFile(requestBody).then((result: any) => {});
    //     }
    //     showMessage({ message: "Deleted Successfully", type: "success" });
    //   } else {
    //     showMessage({ message: "Getting Some Error", type: "danger" });
    //   }
    //   setIsConfirmModal(false);
    // });
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
      {fileList && fileList.length > 0 && (
        <FlatList
          data={fileList}
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
                    {item?.[fileNameAs]}
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
