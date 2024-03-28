import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssignmentCardView from "./AssignmentCardView";
import AddAssignmentModal from "../../teacher/AddAssignmentModal";
import { getUserInfo } from "../../../shared/sharedDetails";
import { Button } from "react-native-elements";
import { YoColors } from "../../../assets/themes/YoColors";
import AssignAssignmentModal from "./AssignAssignmentModal";

const AssignmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
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
              <Text style={[common.h3Title, common.mb10]}>
                You don't have any Assignment given to this batch
              </Text>
              <View style={[common.j_row, common.my10]}>
                <Button
                  title="Create New"
                  buttonStyle={{ backgroundColor: YoColors.primary }}
                  containerStyle={{ width: "45%" }}
                  onPress={() => useForm("addForm")}
                />
                <Button
                  title="Select Existing"
                  buttonStyle={{ backgroundColor: YoColors.primary }}
                  onPress={() => useForm("selectForm")}
                  containerStyle={{ width: "45%" }}
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
