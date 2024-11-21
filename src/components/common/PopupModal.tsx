import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Modal from "react-native-modal";
import useStore from "../../store/useStore";
import { common } from "../../assets/styles/Common";
import image from "../../assets/themes/YoImages";
import { useTheme } from '@react-navigation/native';

interface ModelProps {
  icon: string;
  message: string;
  color: string;
  iconSize: number;
}

const { height, width } = Dimensions.get("window");
const PopupModal: React.FC<ModelProps> = ({
  icon,
  message,
  color,
  iconSize = 40,
}) => {
  const { isPopupModal, setIsPopupModal }: any = useStore();

  const { colors } = useTheme();
  useEffect(() => {
    setTimeout(() => {
      setIsPopupModal(false);
    }, 2000);
  }, [isPopupModal]);

  return (
    <View>
      <Modal
        isVisible={isPopupModal}
        swipeDirection="down"
        onBackButtonPress={() => setIsPopupModal(false)}
        onBackdropPress={() => setIsPopupModal(false)}
        animationInTiming={300}
        style={{ margin: 0, alignItems: "center" }}
        useNativeDriver
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Image
            style={{ height: 54, width: 54 }}
            source={image?.confirm}
          />
          <Text style={[common.h1Title, { marginTop: 20 }]}>{message}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default PopupModal;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxHeight: 300,
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 21,
  }
});
