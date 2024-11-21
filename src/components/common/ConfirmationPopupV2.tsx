import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import image from "../../assets/themes/YoImages";
import { useTheme } from "@react-navigation/native";

const ConfirmationPopupV2 = ({
  isLoader = false,
  message = "",
  onSubmit = () => { },
  isVisible = false,
  setIsVisible = (value: boolean) => { },
}) => {
  const YoColors: any = useThemeColor();
  const { colors }: any = useTheme();
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
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={[common.j_row]}>
          <Image
            style={{ height: 48, width: 48 }}
            source={image?.confirm}
          />
          <Button
            icon={{ name: 'close', type: 'ionicons', size: 26, color: colors.text, }}
            type="clear"
            onPress={() => setIsVisible(false)}
            buttonStyle={common.p0}
          />
        </View>
        <Text style={[common.h1Title, common.my10]}>Are you ready?</Text>
        <Text style={{ color: colors.text }}>{message}</Text>
        <View style={[common.mt20]}>
          <Button
            title="Confirm"
            titleStyle={[common.h2Title, { color: YoColors.white }]}
            containerStyle={common.mb10}
            loading={isLoader}
            onPress={onSubmit}
            buttonStyle={{ borderRadius: 8, backgroundColor: colors.primary, borderColor: colors.primary }}
          />
          <Button
            title="Cancel"
            type="outline"
            onPress={closeModal}
            titleStyle={[common.h2Title, { color: colors.text }]}
            buttonStyle={{ borderRadius: 8, borderColor: colors.text, borderWidth: 0.6 }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopupV2;

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    width: '92%',
    borderRadius: 12,
    padding: 16
  }
});
