import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";

const ConfirmationPopup = ({
  message = "",
  onSubmit = () => {},
  isVisible = false,
  setIsVisible = (value: boolean) => {},
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
          minHeight: 120,
          maxHeight: 300,
          width: width - 30,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[common.h3Title, { marginVertical: 20 }]}>{message}</Text>
        <View style={[common.row, { alignSelf: "flex-end", marginEnd: 10 }]}>
          <Pressable
            style={{
              paddingHorizontal: 15,
              marginEnd: 7,
            }}
            onPress={onSubmit}
          >
            <Text style={{ color: YoColors.primary, fontWeight: "600" }}>
              Yes
            </Text>
          </Pressable>
          <Pressable style={{ paddingHorizontal: 15 }} onPress={closeModal}>
            <Text style={{ fontWeight: "600" }}>No</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;

const styles = StyleSheet.create({});
