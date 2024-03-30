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
import { cardStyle, common } from "../../../assets/styles/Common";
import HeaderView from "../../common/HeaderView";
import moment from "moment";
import { getAssessmentDetailsById } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AddAssessmentModal from "../../teacher/AddAssessmentModal";
import { getUserInfo } from "../../../shared/sharedDetails";
import { YoColors } from "../../../assets/themes/YoColors";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";

const AssesmentDetails = ({ route }: any) => {
  const assessmentInfo = route?.params?.selectedAssessment ?? {};
  const [assessmentDetails, setAssessmentDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const userInfo: any = getUserInfo();

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
          <Card containerStyle={cardStyle.container}>
            {/* <View style={[cardStyle.j_row, { margin: 0 }]}>
              <Text style={common.h3Title}>{assessmentDetails?.title}</Text>
              <Text style={common.rText}>
                {moment(assessmentDetails?.createdate).format("MMM DD, YYYY")}
              </Text>
            </View> */}
            <View style={[cardStyle.j_row, { margin: 0 }]}>
              <Text style={common.h3Title}>{assessmentDetails?.title}</Text>
              <View style={common.row}>
                <FontAwesomeIcon
                  name="pencil-alt"
                  size={12}
                  color={YoColors.primary}
                  onPress={() => setModalVisible(true)}
                />
                <Text style={[common.rText, common.ph10]}>
                  {moment(assessmentDetails?.createdate).format("MMM DD, YYYY")}
                </Text>
              </View>
            </View>
            <View>
              {assessmentDetails?.description && (
                <Text style={[common.mtop10]}>
                  {renderTextWithLinks(assessmentDetails?.description)}
                </Text>
              )}
            </View>
          </Card>
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
