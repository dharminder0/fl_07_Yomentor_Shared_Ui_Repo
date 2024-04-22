import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { getAssessmentDetailsById } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AddAssessmentModal from "../../teacher/AddAssessmentModal";
import { downloadFile, getUserInfo } from "../../../shared/sharedDetails";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { uploadStyles } from "../../../assets/styles/UploadStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";

const AssesmentDetails = ({ route }: any) => {
  const assessmentInfo = route?.params?.selectedAssessment ?? {};
  const [assessmentDetails, setAssessmentDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    setIsLoading(true);
    getAssessmentDetailsById(assessmentInfo.id)
      .then((response: any) => {
        setAssessmentDetails({});
        if (response.data && response.data.length > 0) {
          setAssessmentDetails(response.data[0]);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching assessment details: ", error);
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
      <HeaderView title={assessmentInfo?.title} />
      <View style={[common.container, common.mtop10]}>
        {isLoading ? (
          <Loading />
        ) : assessmentDetails && Object.keys(assessmentDetails).length > 0 ? (
          <>
            <Card
              containerStyle={[
                cardStyle.container,
                {
                  backgroundColor: YoColors.background,
                },
              ]}
            >
              <View style={[cardStyle.j_row, { margin: 0 }]}>
                <Text style={common.title}>{assessmentDetails?.title}</Text>
                <View style={common.row}>
                  {userInfo.type === 1 && (
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
                  )}
                  <Text style={[common.rText, common.ph10]}>
                    {moment(assessmentDetails?.createDate).format(
                      "MMM DD, YYYY"
                    )}
                  </Text>
                </View>
              </View>
              <View>
                <View style={[cardStyle.row, { marginBottom: 5 }]}>
                  <View style={[cardStyle.row, { marginEnd: 15 }]}>
                    <Icon name="laptop" size={12} />
                    <Text style={common.rText}>
                      {" "}
                      {assessmentDetails?.gradeName}
                    </Text>
                  </View>
                  <View style={[cardStyle.row, { marginEnd: 10 }]}>
                    <Icon name="book" size={12} />
                    <Text style={common.rText}>
                      {" "}
                      {assessmentDetails?.subjectName}
                    </Text>
                  </View>
                </View>
                {assessmentDetails?.description && (
                  <Text>
                    {renderTextWithLinks(assessmentDetails?.description)}
                  </Text>
                )}
              </View>
              <View style={common.my10}>
                {assessmentDetails.uploadedFiles &&
                  assessmentDetails.uploadedFiles.length > 0 && (
                    <FlatList
                      data={assessmentDetails.uploadedFiles}
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
                                downloadFile(item, setIsLoading);
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
                {isLoading && (
                  <ActivityIndicator size="large" color="#0000ff" />
                )}
              </View>
            </Card>
          </>
        ) : (
          <NoDataView />
        )}
      </View>
      <AddAssessmentModal
        userId={userInfo?.id}
        onClose={onCloseUpdate}
        title="Update assessment"
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        dataToEdit={assessmentDetails}
      />
    </>
  );
};

export default AssesmentDetails;
