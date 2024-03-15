import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import { getUserData } from "../../shared/sharedDetails";

const TeacherAssignmentList = () => {
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    getUserData("userData").then((result: any) => {
      setUserInfo(result);
    });
  }, [userInfo?.id]);

  return (
    <>
      <HeaderView title="My Assignment" />
      <View>
        <Text>Assignment List</Text>
      </View>
    </>
  );
};

export default TeacherAssignmentList;

const styles = StyleSheet.create({});
