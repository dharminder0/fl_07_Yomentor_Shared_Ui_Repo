import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";

const ProcessLoader = () => {
  return (
    <View
      style={{
        height: "94%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.65)",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default ProcessLoader;

const styles = StyleSheet.create({});
