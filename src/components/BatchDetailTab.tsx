import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AssignmentList from "./batch/assignments/AssignmentList";
import AssessmentList from "./batch/assessments/AssessmentList";
import AnnouncementList from "./batch/announcements/AnnouncementList";
import StudentList from "./batch/students/StudentList";
import HeaderView from "./common/HeaderView";
import { YoColors } from "../assets/themes/YoColors";
import { getUserInfo } from "../shared/sharedDetails";

const BatchDetailTab = ({ route }: any) => {
  const batchInfo = route?.params?.batchItem ?? {};
  const [selectedBatch, setSelectedBatch] = useState(batchInfo);
  const [index, setIndex] = React.useState(0);

  const userInfo: any = getUserInfo();

  const [routes, setRoutes] = useState([
    { key: "assignment", title: "Assignments" },
    { key: "assessment", title: "Assessments" },
    { key: "announcement", title: "Announcements" },
  ]);

  useEffect(() => {
    if (
      userInfo?.type === 1 &&
      !routes.includes({ key: "student", title: "Students" })
    ) {
      setRoutes((prevRoutes) => [
        { key: "student", title: "Students" },
        ...prevRoutes,
      ]);
    }
  }, []);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "student":
        return <StudentList batchInfo={selectedBatch} />;
      case "assignment":
        return <AssignmentList batchInfo={selectedBatch} />;
      case "assessment":
        return <AssessmentList batchInfo={selectedBatch} />;
      case "announcement":
        return <AnnouncementList />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderView title={batchInfo.batchName} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {routes.map((route, idx) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => setIndex(idx)}
            style={{
              padding: 8,
              borderBottomWidth: index === idx ? 1 : 0,
              borderBottomColor: index === idx ? YoColors.primary : "",
            }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontWeight: "600",
                color: index === idx ? YoColors.primary : YoColors.text,
              }}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1, marginTop: 10 }}>
        {renderScene({ route: routes[index] })}
      </View>
    </View>
  );
};

export default BatchDetailTab;

const styles = StyleSheet.create({});
