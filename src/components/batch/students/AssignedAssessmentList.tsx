import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../../assets/styles/Common";
import { getAssessmentsListByTeacherId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import { getUserInfo } from "../../../shared/sharedDetails";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import CardAssessment from "../../teacher/CardAssessment";
import NoDataView from "../../../screens/NoDataView";

const AssignedAssessmentList = ({ route }: any) => {
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const { height, width } = Dimensions.get("window");

  const selectedBatch = route.params?.selectedBatch ?? {};
  const selectedStudent = route.params?.selectedStudent ?? {};

  const [isLoading, setIsLoading] = useState(false);
  const [assessmentList, setAssessmentList] = useState<any>([]);

  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(20);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    getAssessmentList();
  }, []);

  const getAssessmentList = () => {
    const payload: any = {
      batchId: selectedBatch.id,
      pageSize: pageSize,
      studentId: selectedStudent.studentId,
      pageIndex: pageIndex,
    };

    getAssessmentsListByTeacherId(payload).then((result: any) => {
      setAssessmentList([]);
      if (result.data && result.data?.length > 0) {
        setAssessmentList(result.data);
      }
      setTimeout(() => {
        setIsLoading(false);
        setRefreshLoader(false);
      }, 500);
    });
  };

  return (
    <View style={common.container}>
      {isLoading && (
        <View style={{ height: height }}>
          <Loading />
        </View>
      )}
      {assessmentList && assessmentList?.length > 0 ? (
        <CardAssessment
          data={assessmentList}
          reload={getAssessmentList}
          setRefreshLoader={setRefreshLoader}
          refreshLoader={refreshLoader}
        />
      ) : (
        <NoDataView message="There are no assigned assessments" />
      )}
    </View>
  );
};

export default AssignedAssessmentList;

const styles = StyleSheet.create({});
