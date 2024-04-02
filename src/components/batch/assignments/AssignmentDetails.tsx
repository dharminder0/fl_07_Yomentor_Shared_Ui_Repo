import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "@rneui/themed";
import { btnStyle, cardStyle, common } from "../../../assets/styles/Common";
import HeaderView from "../../common/HeaderView";
import moment from "moment";
import { getAssignmentDetailsById } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import AddAssignmentModal from "../../teacher/AddAssignmentModal";
import { downloadFile, getUserInfo } from "../../../shared/sharedDetails";
import Ionicons from "react-native-vector-icons/Ionicons";
import { uploadStyles } from "../../../assets/styles/UploadStyle";
import { Button } from "react-native-elements";

const AssignmentDetails = ({ route }: any) => {
  const assignmentInfo = route?.params?.selectedAssignment ?? {};
  const [assignmentDetails, setAssignmentDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isChangedSomething, setIsChangedSomething] = useState<boolean>(false);
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    setIsLoading(true);
    getAssignmentDetailsById(assignmentInfo.id)
      .then((response: any) => {
        setAssignmentDetails({});
        if (response.data && response.data.length > 0) {
          setAssignmentDetails(response.data[0]);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching assignment details: ", error);
      });
  };

  // Function to open links
  const handlePress = (url: any) => {
    Linking.openURL(url);
  };

  // Function to split text into parts, some are links and some are plain text
  const renderTextWithLinks = (text: any) => {
    const parts = text.split(/(\b(?:https?:\/\/|www\.)\S+\b)/gi); // Regex to split text and URLs
    return parts.map((part: any, index: any) => {
      if (part.match(/(?:https?:\/\/|www\.)\S+/gi)) {
        // If part is a URL, render it as a clickable link
        const url = part.startsWith("www.") ? `http://${part}` : part; // Prepend http:// if the URL starts with www.
        return (
          <Text
            key={index}
            style={{ color: "blue" }}
            onPress={() => handlePress(url)}
          >
            {part}
          </Text>
        );
      } else {
        // Otherwise, render it as plain text
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    getDetails();
  };

  return (
    <>
      <HeaderView title={assignmentInfo?.title} />
      <View style={[common.container, common.mtop10]}>
        {isLoading ? (
          <Loading />
        ) : assignmentDetails && Object.keys(assignmentDetails).length > 0 ? (
          <>
            <Card containerStyle={cardStyle.container}>
              <View style={[cardStyle.j_row, { margin: 0 }]}>
                <Text style={common.h3Title}>{assignmentDetails?.title}</Text>
                <View style={common.row}>
                  <Button
                    onPress={() => setModalVisible(true)}
                    icon={
                      <FontAwesomeIcon
                        name="pencil-alt"
                        size={12}
                        color={YoColors.primary}
                        onPress={() => setModalVisible(true)}
                      />
                    }
                    buttonStyle={[btnStyle.btnEdit]}
                    containerStyle={{ padding: 0 }}
                  />
                  <Text style={[common.rText, common.ph10]}>
                    {moment(assignmentDetails?.createdate).format(
                      "MMM DD, YYYY"
                    )}
                  </Text>
                </View>
              </View>
              <View>
                {assignmentDetails?.description && (
                  <Text>
                    {renderTextWithLinks(assignmentDetails?.description)}
                  </Text>
                )}
              </View>
              <View style={common.my10}>
                {assignmentDetails.uploadedFiles &&
                  assignmentDetails.uploadedFiles.length > 0 && (
                    <FlatList
                      data={assignmentDetails.uploadedFiles}
                      showsVerticalScrollIndicator={false}
                      renderItem={({
                        item,
                        index,
                      }: {
                        item: any;
                        index: number;
                      }) => {
                        return (
                          <View
                            key={index}
                            style={uploadStyles.fileCardNoBorder}
                          >
                            <Ionicons
                              name="document-text"
                              size={18}
                              color={YoColors.primary}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                downloadFile(item);
                              }}
                              style={{ marginEnd: 5, width: "90%" }}
                            >
                              <Text
                                numberOfLines={1}
                                style={{ color: YoColors.text }}
                              >
                                {item?.fileName}
                              </Text>
                              {item?.createdDate && (
                                <Text
                                  numberOfLines={1}
                                  style={{ fontSize: 12 }}
                                >
                                  Attached on{" "}
                                  {moment(
                                    item?.createdDate,
                                    "DD-MM-YYYY"
                                  ).format("MMM DD, YYYY")}
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                  )}
              </View>
            </Card>
          </>
        ) : (
          <NoDataView />
        )}
      </View>
      <AddAssignmentModal
        userId={userInfo?.id}
        onClose={onCloseUpdate}
        title="Update assignment"
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        dataToEdit={assignmentDetails}
      />
    </>
  );
};

export default AssignmentDetails;
