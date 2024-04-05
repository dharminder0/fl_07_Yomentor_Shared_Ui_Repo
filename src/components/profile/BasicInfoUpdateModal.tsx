import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import useStore from "../../store/useStore";
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { addBatch } from "../../apiconfig/SharedApis";
import ProcessLoader from "../../screens/ProcessLoader";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";

const BasicInfoUpdateModal = ({
  userId = "",
  onClose = () => {},
  setIsBasicModal = (value: any) => {},
  isBasicModal = false,
}) => {
  const YoColors = useThemeColor();

  const { height, width } = Dimensions.get("window");

  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);

  const { isPopupModal, setIsPopupModal }: any = useStore();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const toggleModal = () => {
    setIsBasicModal(!isBasicModal); // Toggle the modal visibility state
    reset();
  };

  useEffect(() => {
    setValue("teacherId", userId);
  }, []);

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    addBatch(data).then((response: any) => {
      if (response.data && response.data?.response) {
        setIsPopupModalVisible(true);
        onClose();
        setIsPopupModal(true);
        reset();
      }
      setTimeout(() => {
        setIsPopupModalVisible(false);
        setIsPopupModal(false);
        setIsProcessLoader(false);
      }, 500);
    });
  };

  return (
    <Modal
      isVisible={isBasicModal}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      onSwipeComplete={toggleModal}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
      {isPopupModalVisible && (
        <PopupModal
          message="Batch Created Successful"
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
      {isProcessLoader && <ProcessLoader />}
      <>
        <ScrollView
          style={{ maxHeight: height - 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: "#fff",
              height: height,
              minHeight: 150,
            }}
          >
            <View
              style={[cardStyle.j_row, { padding: 12, alignItems: "center" }]}
            >
              <Text style={common.h3Title}>Update Personal Info</Text>
              <Button
                onPress={toggleModal}
                icon={
                  <Ionicons
                    name="close-sharp"
                    size={24}
                    color={YoColors.primary}
                  />
                }
                buttonStyle={[
                  btnStyle.btnCross,
                  {
                    paddingHorizontal: 1,
                    paddingStart: 15,
                  },
                ]}
              />
            </View>
            <View style={{ paddingHorizontal: 12 }}>
              <Controller
                control={control}
                name="education"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        minHeight: 95,
                        textAlignVertical: "top",
                        borderColor: errors.education ? "red" : "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Education"
                    multiline
                  />
                )}
              />

              <Controller
                control={control}
                name="experience"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: errors.experience ? "red" : "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Year of Experience"
                  />
                )}
              />

              <Controller
                control={control}
                name="about"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        minHeight: 95,
                        textAlignVertical: "top",
                        borderColor: errors.about ? "red" : "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="About"
                    multiline
                  />
                )}
              />

              <View style={{ marginTop: 30 }}>
                <Button
                  title="Update Personal Info"
                  buttonStyle={{ backgroundColor: YoColors.primary }}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    </Modal>
  );
};

export default BasicInfoUpdateModal;

const styles = StyleSheet.create({
  input: {
    height: 45,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%", // Adjust width as needed
  },
});
