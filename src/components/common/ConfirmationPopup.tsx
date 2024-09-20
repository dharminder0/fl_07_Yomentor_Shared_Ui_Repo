import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import { color } from "@rneui/base";

const ConfirmationPopup = ({
  message = "",
  onSubmit = () => { },
  isVisible = false,
  setIsVisible = (value: boolean) => { },
}) => {
  const YoColors = useThemeColor();
  const { width } = Dimensions.get("screen");

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      swipeDirection="down"
      onBackdropPress={closeModal}
      style={{ margin: 0, alignItems: "center" }}
      animationInTiming={300}
      useNativeDriver
    >
      <View
        style={{
          backgroundColor: YoColors.background,
          minHeight: 130,
          maxHeight: 300,
          width: width - 30,
          borderRadius: 12,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[common.h1Title, common.mb5]}>Are you ready?</Text>
        <Text style={[common.mb20, { color: YoColors.text }]}>{message}</Text>
        <View style={[common.row, { alignSelf: "flex-end" }]}>
          <Button
            title="No"
            type="outline"
            onPress={closeModal}
            buttonStyle={{
              width: 60,
              paddingVertical: 6,
              borderColor: YoColors.primary
            }}
            titleStyle={[common.fs12, { color: YoColors.primary }]}
            containerStyle={common.mr10}
          />
          <Button
            title="Yes"
            onPress={onSubmit}
            buttonStyle={{
              backgroundColor: YoColors.primary,
              borderRadius: 3,
              width: 60,
              paddingVertical: 6
            }}
            titleStyle={[common.fs12]}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;

const styles = StyleSheet.create({});
