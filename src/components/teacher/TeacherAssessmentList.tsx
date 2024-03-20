import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import { getUserData, getUserInfo } from "../../shared/sharedDetails";
import { getAssessmentsListByTeacherId } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { common } from "../../assets/styles/Common";
import AddAssessmentModal from "./AddAssessmentModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CardAssessment from "./CardAssessment";

const TeacherAssessmentList = () => {
  const userInfo: any = getUserInfo();
  const [assessmentList, setAssessmentList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getAssessmentList();
  }, [userInfo?.id]);

  const getAssessmentList = () => {
    const payload: any = {
      teacherId: userInfo?.id,
      pageSize: pageSize,
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

  const onCloseUpdate = () => {
    setModalVisible(false);
    setTimeout(() => {
      getAssessmentList();
    }, 500);
  };

  return (
    <>
      <HeaderView title="My Assessment" />
      {isLoading ? (
        <Loading />
      ) : assessmentList?.length > 0 ? (
        <View style={common.container}>
          <View style={{ alignItems: "flex-end" }}>
            <Pressable style={common.row} onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={16} />
              <Text>Create Assessment</Text>
            </Pressable>
          </View>
          <View style={common.row}>
            <CardAssessment
              data={assessmentList}
              reload={getAssessmentList}
              setRefreshLoader={setRefreshLoader}
              refreshLoader={refreshLoader}
            />
          </View>
        </View>
      ) : (
        <View
          style={[
            common.container,
            { alignItems: "center", justifyContent: "center", height: "90%" },
          ]}
        >
          <Text style={common.h3Title}>You don't have any Assessment</Text>
          <Button
            title="Create Your First Assessment"
            onPress={() => setModalVisible(true)}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 50 }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "80%" }}
          />
        </View>
      )}
      <AddAssessmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default TeacherAssessmentList;

const styles = StyleSheet.create({});
