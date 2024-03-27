import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssignmentCardView from "./AssignmentCardView";
import AddAssignmentModal from "../../teacher/AddAssignmentModal";
import { getUserInfo } from "../../../shared/sharedDetails";

const AssignmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
  const { height, width } = Dimensions.get("window");
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
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
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
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
        <>
          <NoDataView message="You don't have any Assignment given to this batch" />
        </>
      )}

      <AddAssignmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        batchId={selectedBatch.id}
      />
    </View>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({});
