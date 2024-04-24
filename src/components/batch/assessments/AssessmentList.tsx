import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getAssessmentsListByBatchId } from "../../../apiconfig/SharedApis";
import { btnStyle, common } from "../../../assets/styles/Common";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import AssesmentCardView from "./AssesmentCardView";
import { getUserInfo } from "../../../shared/sharedDetails";
import AddAssessmentModal from "../../teacher/AddAssessmentModal";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import AssignAssessmentModal from "./AssignAssessmentModal";

const AssessmentList = ({ batchInfo }: any) => {
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
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
              <Text
                style={[common.h3Title, common.mb10, { textAlign: "center" }]}
              >
                No assessment has been given to this batch.
              </Text>

              <Text
                style={[common.rText, common.mb10, { textAlign: "center" }]}
              >
                Create a new assessment for this batch now. You can save it in
                your favorites list to use again later.
              </Text>

              <View
                style={[
                  common.my10,
                  {
                    alignItems: "center",
                  },
                ]}
              >
                <Button
                  title="Create new Assessment"
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={[common.mb10, { width: 170 }]}
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
                  You can select an existing assessment from your favorites
                  list.
                </Text>

                <Button
                  title="Select from favorite list"
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={[common.mb10, { width: 170 }]}
                  onPress={() => useForm("selectForm")}
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
        title="Create new assessment"
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
