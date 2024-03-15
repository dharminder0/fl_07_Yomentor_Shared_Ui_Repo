import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

const NoDataAvailable = () => {
  return (
    <View
      style={{
        height: "94%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>No data available</Text>
    </View>
  );
};

export default NoDataAvailable;

const styles = StyleSheet.create({});
