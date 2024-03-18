import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import { getUserData } from "../../shared/sharedDetails";
import { getAssignmentsListByTeacherId } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useStore from "../../store/useStore";
import CardAssignment from "./CardAssignment";
import AddAssignmentModal from "./AddAssignmentModal";

const TeacherAssignmentList = () => {
  const [userInfo, setUserInfo] = useState<any>();
  const [assessmentList, setAssessmentList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
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
    getAssignmentsListByTeacherId(payload).then((result: any) => {
      setAssessmentList([]);
      if (result.data && result.data?.length > 0) {
        setAssessmentList(result.data);
      }
      setTimeout(() => {
        setIsLoading(false);
        setRefreshLoader(false);
      }, 1000);
    });
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    setTimeout(() => {
      getAssignmentList();
    }, 500);
  };

  return (
    <>
      <HeaderView title="My Assignment" />
      {isLoading ? (
        <Loading />
      ) : assessmentList?.length > 0 ? (
        <View style={common.container}>
          <View style={{ alignItems: "flex-end" }}>
            <Pressable style={common.row} onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={16} />
              <Text>Create Assignment</Text>
            </Pressable>
          </View>
          <View style={common.row}>
            <CardAssignment
              data={assessmentList}
              reload={getAssignmentList}
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
          <Text style={common.h3Title}>No Assignment Available</Text>
          <Button
            title="Create Your First Assignment"
            onPress={() => setModalVisible(true)}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 50 }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "80%" }}
          />
        </View>
      )}
      <AddAssignmentModal
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
      />
    </>
  );
};

export default TeacherAssignmentList;

const styles = StyleSheet.create({});
