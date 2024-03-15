import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssignmentCardView from "./AssignmentCardView";

const AssignmentList = ({ batchInfo }: any) => {
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const payload: any = {
      batchId: selectedBatch.id,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    getAssignmentsListByBatchId(payload)
      .then((response: any) => {
        setAssignmentsList([]);
        if (response.data && response.data.length > 0) {
          setAssignmentsList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching assignments: ", error);
      });
  }, []);

  return (
    <View style={common.container}>
      {isLoading ? (
        <Loading />
      ) : assignmentsList && assignmentsList.length > 0 ? (
        <AssignmentCardView
          //title="Assignment"
          data={assignmentsList}
          isOpenEnroll={true}
        />
      ) : (
        <NoDataView />
      )}
    </View>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({});
