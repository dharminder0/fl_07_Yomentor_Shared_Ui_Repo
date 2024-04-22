import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import useStore from "../../store/useStore";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { common } from "../../assets/styles/Common";

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
  const YoColors: any = useThemeColor();
  useEffect(() => {
    setTimeout(() => {
      setIsAlertModal(false);
    }, 5000);
  }, []);

  return (
    <View>
      <Modal
        isVisible={isAlertModal}
        onBackButtonPress={() => setIsAlertModal(false)}
        swipeDirection="down"
        onBackdropPress={() => setIsAlertModal(false)}
        style={{ margin: 0, alignItems: "center" }}
        useNativeDriver
      >
        <View
          style={{
            backgroundColor: YoColors.background,
            minHeight: 150,
            maxHeight: 300,
            width: width - 40,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name={icon} size={iconSize} color={color} />
          <Text style={[common.h3Title, { marginTop: 20 }]}>{message}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  headText: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 10,
    paddingTop: 10,
  },
});
