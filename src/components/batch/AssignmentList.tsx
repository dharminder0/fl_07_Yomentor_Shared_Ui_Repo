import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../assets/styles/Common";
import { getAssignmentsListByBatchId } from "../../apiconfig/SharedApis";
import AssesmentCardView from "../common/AssesmentCardView";
import NoDataAvailable from "../../screens/NoDataAvailable";
import Loading from "../../screens/Loading";

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
        console.error("Error fetching assignments:", error);
      });
  }, []);

  return (
    <View style={common.container}>
      {isLoading ? (
        <Loading />
      ) : assignmentsList && assignmentsList.length > 0 ? (
        <AssesmentCardView
          title="Assignment"
          data={assignmentsList}
          isOpenEnroll={true}
        />
      ) : (
        <NoDataAvailable />
      )}
    </View>
  );
};

export default AssignmentList;

const styles = StyleSheet.create({});
