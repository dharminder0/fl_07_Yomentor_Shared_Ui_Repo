import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AssignmentList from "./batch/assignments/AssignmentList";
import AssessmentList from "./batch/assessments/AssessmentList";
import AnnouncementList from "./batch/announcements/AnnouncementList";
import StudentList from "./batch/students/StudentList";
import HeaderView from "./common/HeaderView";
import { YoColors } from "../assets/themes/YoColors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BatchDetailTab = ({ route }: any) => {
  const batchInfo = route?.params?.batchItem ?? {};
  const [selectedBatch, setSelectedBatch] = useState(batchInfo);
  const [index, setIndex] = React.useState(0);

  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const [routes, setRoutes] = useState([
    { key: "assignment", title: "Assignment" },
    { key: "assessment", title: "Assessment" },
    { key: "announcement", title: "Announcement" },
  ]);
  if (userData?.type === 1) {
    // Add a new route to the routes array
    setRoutes((prevRoutes) => [
      ...prevRoutes,
      { key: "student", title: "Student" },
    ]);
  }

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
          borderBottomWidth: 1,
        }}
      >
        {routes.map((route, idx) => (
          <TouchableOpacity
            key={route.key}
            onPress={() => setIndex(idx)}
            style={{ padding: 8 }}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontWeight: index === idx ? "bold" : "normal",
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
