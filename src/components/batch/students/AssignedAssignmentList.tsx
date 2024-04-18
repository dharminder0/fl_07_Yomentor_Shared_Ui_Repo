import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { cardStyle, common } from "../../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import { getUserInfo } from "../../../shared/sharedDetails";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import AssignmentCardView from "../assignments/AssignmentCardView";
import NoDataView from "../../../screens/NoDataView";
import moment from "moment";
import { Card } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

const AssignedAssignmentList = ({ route }: any) => {
  const YoColors = useThemeColor();
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const { height, width } = Dimensions.get("window");

  const selectedBatch = route.params?.selectedBatch ?? {};
  const selectedStudent = route.params?.selectedStudent ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    getAssignmentsDataByBatchId();
  }, []);

  const getAssignmentsDataByBatchId = () => {
    const payload: any = {
      batchId: selectedBatch.id,
      pageSize: pageSize,
      studentId: selectedStudent.studentId,
      pageIndex: pageIndex,
    };

    getAssignmentsListByBatchId(payload)
      .then((response: any) => {
        setAssignmentsList([]);
        if (response.data && response.data.length > 0) {
          setAssignmentsList(response.data);
        }
        setTimeout(() => {
          setRefreshLoader(false);
          setIsLoading(false);
        }, 500);
      })
      .catch((error: any) => {
        setIsLoading(false);
        setRefreshLoader(false);
        console.error("Error fetching assignments: ", error);
      });
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("AssignmentDetails", { selectedAssignment: item })
      }
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text
            numberOfLines={2}
            style={[cardStyle.headTitle, { width: "72%" }]}
          >
            {item?.title}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {moment(item?.createdate).format("MMM DD, YYYY")}
          </Text>
        </View>

        {item?.description && (
          <Text style={{ marginBottom: 5, fontSize: 12 }} numberOfLines={2}>
            {item?.description}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[common.container, common.mtop10]}>
      {isLoading && (
        <View style={{ height: height }}>
          <Loading />
        </View>
      )}
      {assignmentsList && assignmentsList?.length > 0 ? (
        <FlatList
          data={assignmentsList}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          style={{ height: height }}
          windowSize={height}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoader}
              onRefresh={() => {
                setRefreshLoader(true);
                getAssignmentsDataByBatchId();
              }}
            />
          }
        />
      ) : (
        <NoDataView message="There are no assigned assignments" />
      )}
    </View>
  );
};

export default AssignedAssignmentList;

const styles = StyleSheet.create({});
