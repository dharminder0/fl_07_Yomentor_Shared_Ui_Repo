import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import { getUserInfo } from "../../shared/sharedDetails";
import { getAssignmentsListByTeacherId } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CardAssignment from "./CardAssignment";
import AddAssignmentModal from "./AddAssignmentModal";

const TeacherAssignmentList = () => {
  const userInfo: any = getUserInfo();
  const [assignmentList, setAssignmentList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);

  useEffect(() => {
    setIsLoading(true);
    getAssignmentList();
  }, [userInfo?.id]);

  const getAssignmentList = () => {
    const payload: any = {
      teacherId: userInfo?.id,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    getAssignmentsListByTeacherId(payload).then((result: any) => {
      setAssignmentList([]);
      if (result.data && result.data?.length > 0) {
        setAssignmentList(result.data);
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
      getAssignmentList();
    }, 500);
  };

  return (
    <>
      <HeaderView title="My Assignment" />
      {isLoading ? (
        <Loading />
      ) : assignmentList?.length > 0 ? (
        <View style={common.container}>
          <View style={{ alignItems: "flex-end" }}>
            <Pressable style={common.row} onPress={() => setModalVisible(true)}>
              <Icon name="plus" size={16} />
              <Text>Create Assignment</Text>
            </Pressable>
          </View>
          <View style={common.row}>
            <CardAssignment
              data={assignmentList}
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
          <Text style={common.h3Title}>You don't have any Assignment</Text>
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
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  );
};

export default TeacherAssignmentList;

const styles = StyleSheet.create({});
