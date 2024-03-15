import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import { getUserData } from "../../shared/sharedDetails";
import { getAssessmentsListByTeacherId } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { common } from "../../assets/styles/Common";
import AddAssessmentModal from "./AddAssessmentModal";
import useStore from "../../store/useStore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const TeacherAssessmentList = () => {
  const [userInfo, setUserInfo] = useState<any>();
  const [assessmentList, setAssessmentList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isModalVisible, setModalVisible }: any = useStore();
  useEffect(() => {
    setIsLoading(true);
    getUserData("userData").then((result: any) => {
      setUserInfo(result);
    });
    getAssignmentList();
  }, [userInfo?.id]);

  const getAssignmentList = () => {
    const payload: any = {
      teacherId: userInfo?.id,
      pageSize: 10,
      pageIndex: 1,
    };
    getAssessmentsListByTeacherId(payload).then((result: any) => {
      setAssessmentList([]);
      if (result.data && result.data?.length > 0) {
        setAssessmentList(result.data);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    });
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
          <View style={common.row}></View>
        </View>
      ) : (
        <View
          style={[
            common.container,
            { alignItems: "center", justifyContent: "center", height: "90%" },
          ]}
        >
          <Text style={common.h3Title}>No Assessment Available</Text>
          <Button
            title="Create Your First Assessment"
            onPress={() => setModalVisible(true)}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 50 }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "80%" }}
          />
        </View>
      )}
      <AddAssessmentModal />
    </>
  );
};

export default TeacherAssessmentList;

const styles = StyleSheet.create({});
