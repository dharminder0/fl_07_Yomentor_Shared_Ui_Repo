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
import { getAssignmentDetailsById } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { YoColors } from "../../../assets/themes/YoColors";
import AddAssignmentModal from "../../teacher/AddAssignmentModal";
import { getUserInfo } from "../../../shared/sharedDetails";

const AssignmentDetails = ({ route }: any) => {
  const assignmentInfo = route?.params?.selectedAssignment ?? {};
  const [assignmentDetails, setAssignmentDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isChangedSomething, setIsChangedSomething] = useState<boolean>(false);
  const userInfo: any = getUserInfo();

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
          <Card containerStyle={cardStyle.container}>
            <View style={[cardStyle.j_row, { margin: 0 }]}>
              <Text style={common.h3Title}>{assignmentDetails?.title}</Text>
              <View style={common.row}>
                <FontAwesomeIcon
                  name="pencil-alt"
                  size={12}
                  color={YoColors.primary}
                  onPress={() => setModalVisible(true)}
                />
                <Text style={[common.rText, common.ph10]}>
                  {moment(assignmentDetails?.createdate).format("MMM DD, YYYY")}
                </Text>
              </View>
            </View>
            <View>
              {assignmentDetails?.description && (
                <Text style={[common.mtop10]}>
                  {/* {assignmentDetails?.description} */}
                  {renderTextWithLinks(assignmentDetails?.description)}
                </Text>
              )}
            </View>
          </Card>
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
