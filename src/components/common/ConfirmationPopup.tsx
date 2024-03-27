import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { common } from "../../assets/styles/Common";
import { YoColors } from "../../assets/themes/YoColors";
import useStore from "../../store/useStore";

const ConfirmationPopup = ({
  message = "",
  onSubmit = () => {},
  isVisible = false,
  setIsVisible = (value: boolean) => {},
}) => {
  const { width } = Dimensions.get("screen");
  // const { isConfirmModal, setIsConfirmModal }: any = useStore();

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
      useNativeDriver
    >
      <View
        style={{
          backgroundColor: "white",
          minHeight: 120,
          maxHeight: 300,
          width: width - 40,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={[common.h3Title, { marginVertical: 20 }]}>{message}</Text>
        <View style={[common.row, { alignSelf: "flex-end", marginEnd: 10 }]}>
          <Pressable
            style={{
              paddingHorizontal: 10,
              marginEnd: 10,
            }}
            onPress={onSubmit}
          >
            <Text style={{ color: YoColors.primary, fontWeight: "600" }}>
              Yes
            </Text>
          </Pressable>
          <Pressable style={{ paddingHorizontal: 10 }} onPress={closeModal}>
            <Text style={{ fontWeight: "600" }}>No</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;

const styles = StyleSheet.create({});
