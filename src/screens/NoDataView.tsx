import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { common } from "../assets/styles/Common";

const NoDataView = ({ message = "No Records Available" }) => {
  return (
    <View
      style={{
        height: "94%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={common.h2Title}>{message}</Text>
    </View>
  );
};

export default NoDataView;

const styles = StyleSheet.create({});
