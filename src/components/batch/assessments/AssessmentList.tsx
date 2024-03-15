import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAssessmentsListByBatchId } from "../../../apiconfig/SharedApis";
import { common } from "../../../assets/styles/Common";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssesmentCardView from "./AssesmentCardView";

const AssessmentList = ({ batchInfo }: any) => {
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const payload: any = {
      batchId: selectedBatch.id,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    getAssessmentsListByBatchId(payload)
      .then((response: any) => {
        setAssessmentsList([]);
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          setAssessmentsList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching assessments:", error);
      });
  }, []);

  return (
    <View style={common.container}>
      {isLoading ? (
        <Loading />
      ) : assessmentsList && assessmentsList.length > 0 ? (
        <AssesmentCardView
          //title="Assesments"
          data={assessmentsList}
          isOpenEnroll={true}
        />
      ) : (
        <NoDataView />
      )}
    </View>
  );
};

export default AssessmentList;

const styles = StyleSheet.create({});
