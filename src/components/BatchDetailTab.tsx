import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AssignmentList from "./batch/assignments/AssignmentList";
import AssessmentList from "./batch/assessments/AssessmentList";
import AnnouncementList from "./batch/announcements/AnnouncementList";
import StudentList from "./batch/students/StudentList";
import HeaderView from "./common/HeaderView";
import { YoColors } from "../assets/themes/YoColors";
import { getUserInfo } from "../shared/sharedDetails";
import AddReview from "./common/AddReview";

const BatchDetailTab = ({ route }: any) => {
  const batchInfo = route?.params?.batchItem ?? {};
  const [selectedBatch, setSelectedBatch] = useState(batchInfo);
  const [index, setIndex] = React.useState(0);
  const userInfo: any = getUserInfo();

  const [routes, setRoutes] = useState([]);

  const allRoutes = [
    { key: "student", title: "Students" },
    { key: "assignment", title: "Assignments" },
    { key: "assessment", title: "Assessments" },
    // { key: "announcement", title: "Announcements" },
    { key: "review", title: "Review" },
  ];

  useEffect(() => {
    const filteredRoutes: any = allRoutes.filter((route) => {
      if (userInfo?.type === 1) {
        if (
          route.key === "student" ||
          route.key === "assignment" ||
          route.key === "assessment" ||
          route.key === "announcement"
        ) {
          return true;
        }
      }

      if (userInfo?.type === 3) {
        if (
          route.key === "review" ||
          route.key === "assignment" ||
          route.key === "assessment" ||
          route.key === "announcement"
        ) {
          return true;
        }
      }

      return false;
    });

    setRoutes(filteredRoutes);
  }, []);

  const renderScene = ({ route }: any) => {
    switch (route?.key) {
      case "student":
        return <StudentList batchInfo={selectedBatch} />;
      case "assignment":
        return <AssignmentList batchInfo={selectedBatch} />;
      case "assessment":
        return <AssessmentList batchInfo={selectedBatch} />;
      // case "announcement":
      //   return <AnnouncementList />;
      case "review":
        return <AddReview batchDetail={selectedBatch} />;
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
        {routes.map((route: any, idx) => (
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
