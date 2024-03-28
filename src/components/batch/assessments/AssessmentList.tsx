import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAssessmentsListByBatchId } from "../../../apiconfig/SharedApis";
import { common } from "../../../assets/styles/Common";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssesmentCardView from "./AssesmentCardView";
import { getUserInfo } from "../../../shared/sharedDetails";
import AddAssessmentModal from "../../teacher/AddAssessmentModal";
import { Button } from "react-native-elements";
import { YoColors } from "../../../assets/themes/YoColors";
import AssignAssessmentModal from "./AssignAssessmentModal";

const AssessmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
  const { height, width } = Dimensions.get("window");
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isAssignModalVisible, setIsAssignModalVisible] =
    useState<boolean>(false);
  const [pageSize, setPageSize] = useState(20);
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

    if (userInfo.type === 3) {
      payload["studentId"] = userInfo?.id;
    }

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
    if (useFor === "selectForm") {
      setIsAssignModalVisible(true);
    }
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    setIsAssignModalVisible(false);
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
              You don't have any Assessment for this batch
            </Text>
          )}
          {userInfo.type === 1 && (
            <>
              <Text style={[common.h3Title, common.mb10]}>
                You don't have any Assessment given to this batch
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
      <AddAssessmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        batchId={selectedBatch?.id}
      />

      <AssignAssessmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isAssignModalVisible}
        setModalVisible={setIsAssignModalVisible}
        batchInfo={selectedBatch}
      />
    </View>
  );
};

export default AssessmentList;

const styles = StyleSheet.create({});
