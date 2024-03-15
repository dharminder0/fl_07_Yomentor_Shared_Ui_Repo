import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AssesmentCardView from "../common/AssesmentCardView";
import { common } from "../../assets/styles/Common";

const AnnouncementList = () => {
  const announcement: any = [
    {
      id: 1,
      title: "Chapter 4 prepare the notes for your learning",
      description:
        "please make noteds of the capter  4 and submit it for me review by tomorrow.",
      createdDate: "2024-03-06 12:15:46.103",
      files: [],
    },
    {
      id: 2,
      title: "Chapter 5 prepare the notes for your learning",
      description:
        "please make noteds of the capter  4 and submit it for me review by tomorrow.",
      createdDate: "2024-03-06 12:15:46.103",
      files: [],
    },
    {
      id: 3,
      title: "Chapter 6 prepare the notes for your learning",
      description:
        "please make noteds of the capter  4 and submit it for me review by tomorrow.",
      createdDate: "2024-03-06 12:15:46.103",
      files: [],
    },
  ];
  return (
    <View style={common.container}>
      <AssesmentCardView data={announcement} />
    </View>
  );
};

export default AnnouncementList;

const styles = StyleSheet.create({});
