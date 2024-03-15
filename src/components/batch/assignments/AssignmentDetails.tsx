import React, { useEffect, useState } from "react";
import {
  FlatList,
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

const AssignmentDetails = ({ route }: any) => {
  const assignmentInfo = route?.params?.selectedAssignment ?? {};
  const [assignmentDetails, setAssignmentDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
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
  }, []);

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
              <Text style={common.rText}>
                {moment(assignmentDetails?.createdate).format("MMM DD, YYYY")}
              </Text>
            </View>
            <View>
              {assignmentDetails?.description && (
                <Text style={[common.mtop10]}>
                  {assignmentDetails?.description}
                </Text>
              )}
            </View>
          </Card>
        ) : (
          <NoDataView />
        )}
      </View>
    </>
  );
};

export default AssignmentDetails;
