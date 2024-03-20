import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAssessmentsListByBatchId } from "../../../apiconfig/SharedApis";
import { common } from "../../../assets/styles/Common";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssesmentCardView from "./AssesmentCardView";
import { getUserInfo } from "../../../shared/sharedDetails";
import AddAssessmentModal from "../../teacher/AddAssessmentModal";

const AssessmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
  const { height, width } = Dimensions.get("window");
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    getAssessmentsDataByBatchId();
  }, []);

  const getAssessmentsDataByBatchId = () => {
    const payload: any = {
      batchId: selectedBatch.id,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    getAssessmentsListByBatchId(payload)
      .then((response: any) => {
        setAssessmentsList([]);
        if (response.data && response.data.length > 0) {
          setAssessmentsList(response.data);
        }
        setTimeout(() => {
          setRefreshLoader(false);
          setIsLoading(false);
        });
      })
      .catch((error: any) => {
        setIsLoading(false);
        setRefreshLoader(false);
        console.error("Error fetching assessments: ", error);
      });
  };

  const useForm = (useFor: string) => {
    if (useFor === "addForm") {
      setModalVisible(true);
    }
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    getAssessmentsDataByBatchId();
  };

  return (
    <View style={common.container}>
      {isLoading ? (
        <Loading />
      ) : assessmentsList && assessmentsList.length > 0 ? (
        <AssesmentCardView
          data={assessmentsList}
          height={height - 100}
          userType={userInfo?.type}
          useForm={useForm}
          refreshLoader={refreshLoader}
          setRefreshLoader={setRefreshLoader}
          reload={getAssessmentsDataByBatchId}
        />
      ) : (
        <View style={{ justifyContent: "center" }}>
          <NoDataView message="You don't have any Assessment given to this batch" />
        </View>
      )}
      <AddAssessmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        batchId={selectedBatch?.id}
      />
    </View>
  );
};

export default AssessmentList;

const styles = StyleSheet.create({});
