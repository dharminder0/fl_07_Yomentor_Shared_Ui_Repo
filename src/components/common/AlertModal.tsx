import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Modal from "react-native-modal";
import useStore from "../../store/useStore";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { common } from "../../assets/styles/Common";
import image from "../../assets/themes/YoImages";
import { useTheme } from "@react-navigation/native";

interface ModelProps {
  icon: string;
  message: string;
  color: string;
  iconSize: number;
}

const { height, width } = Dimensions.get("window");
const AlertModal: React.FC<ModelProps> = ({
  icon,
  message,
  color,
  iconSize = 40,
}) => {
  const { isAlertModal, setIsAlertModal }: any = useStore();
  const { colors }: any = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setIsAlertModal(false);
    }, 5000);
  }, []);

  return (
    <View>
      <Modal
        isVisible={isAlertModal}
        swipeDirection="down"
        onBackButtonPress={() => setIsAlertModal(false)}
        onBackdropPress={() => setIsAlertModal(false)}
        style={{ margin: 0, alignItems: "center" }}
        animationInTiming={300}
        useNativeDriver
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={[common.j_row, { justifyContent: 'center' }]}>
            <Image
              style={{ height: 58, width: 58 }}
              source={image?.confirm}
            />
          </View>
          <Text style={[common.h2Title, common.my10]}>{message}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16
  }
});
