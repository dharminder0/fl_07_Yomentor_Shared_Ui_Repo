import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { btnStyle, common } from "../../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssignmentCardView from "./AssignmentCardView";
import AddAssignmentModal from "../../teacher/AddAssignmentModal";
import { getUserInfo } from "../../../shared/sharedDetails";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import AssignAssignmentModal from "./AssignAssignmentModal";

const AssignmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const { height, width } = Dimensions.get("window");
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isAssignModalVisible, setIsAssignModalVisible] =
    useState<boolean>(false);
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
      pageIndex: pageIndex,
    };
    if (userInfo.type === 3) {
      payload["studentId"] = userInfo?.id;
    }
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

  const useForm = (useFor: string) => {
    if (useFor === "addForm") {
      setModalVisible(true);
    }
    if (useFor === "selectForm") {
      setIsAssignModalVisible(true);
    }
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    setIsAssignModalVisible(false);
    getAssignmentsDataByBatchId();
  };

  return (
    <View style={common.container}>
      {isLoading ? (
        <Loading />
      ) : assignmentsList && assignmentsList?.length > 0 ? (
        <AssignmentCardView
          data={assignmentsList}
          userType={userInfo?.type}
          useForm={useForm}
          height={height - 100}
          refreshLoader={refreshLoader}
          setRefreshLoader={setRefreshLoader}
          reload={getAssignmentsDataByBatchId}
        />
      ) : (
        <View
          style={{
            height: height - 120,
            justifyContent: "center",
          }}
        >
          {userInfo.type === 3 && (
            <Text
              style={[common.h3Title, common.mb10, { textAlign: "center" }]}
            >
              You don't have any Assignment for this batch
            </Text>
          )}

          {userInfo.type === 1 && (
            <>
              <Text
                style={[common.h3Title, common.mb10, { textAlign: "center" }]}
              >
                No assignment has been given to this batch.
              </Text>

              <Text
                style={[common.rText, common.mb10, { textAlign: "center" }]}
              >
                Create a new assignment for this batch now. You can save it in
                your favorites list to use again later.
              </Text>

              <View style={[common.my10, { alignItems: "center" }]}>
                <Button
                  title="Create new Assignment"
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={[common.mb10, { width: 160 }]}
                  onPress={() => useForm("addForm")}
                />

                <Text
                  style={[common.h3Title, common.mb10, { textAlign: "center" }]}
                >
                  OR
                </Text>

                <Text
                  style={[common.rText, common.mb10, { textAlign: "center" }]}
                >
                  You can select an existing assignment from your favorites
                  list.
                </Text>

                <Button
                  title="Select from favorite list"
                  onPress={() => useForm("selectForm")}
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={{ width: 160 }}
                />
              </View>
            </>
          )}
        </View>
      )}

      <AddAssignmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        batchId={selectedBatch.id}
        title="Create new assignment"
      />

      <AssignAssignmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isAssignModalVisible}
        setModalVisible={setIsAssignModalVisible}
        batchInfo={selectedBatch}
      />
    </View>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({});
