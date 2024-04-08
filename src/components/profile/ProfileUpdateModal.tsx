import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import ProcessLoader from "../../screens/ProcessLoader";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { upsertProfileInfo } from "../../apiconfig/SharedApis";

const ProfileUpdateModal = ({
  isBasicModal = false,
  setIsBasicModal = (value: any) => {},
  dataToEdit = {},
}) => {
  const YoColors = useThemeColor();

  const { height, width } = Dimensions.get("window");
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [dataToPreset, setDataToPreset]: any = useState(dataToEdit);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const toggleModal = () => {
    setIsBasicModal(!isBasicModal);
    reset();
  };

  useEffect(() => {
    reset({
      id: dataToPreset.id,
      teacherId: dataToPreset.teacherProfile?.teacherId,
      about: dataToPreset.teacherProfile?.about,
      education: dataToPreset.teacherProfile?.education,
      experience: dataToPreset.teacherProfile?.experience,
    });
  }, []);

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    const payload: any = {
      id: data.id,
      teacherId: data.teacherId,
      about: data.about,
      education: data.education,
      experience: data.experience,
    };
    console.log(payload);
    upsertProfileInfo(payload)
      .then((response: any) => {
        console.log(response.data);
        if (response.data && response.data.success) {
          setIsPopupModalVisible(true);
          toggleModal();
        }
        setTimeout(() => {
          setIsPopupModalVisible(false);
          setIsProcessLoader(false);
        }, 500);
      })
      .catch((error: any) => {
        console.log(error);
        setTimeout(() => {
          setIsProcessLoader(false);
          setIsPopupModalVisible(true);
        }, 500);
        console.error("Error fetching :", error);
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
          message="The profile information has been successfully updated."
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
              <Text style={common.h3Title}>Update Professional Info</Text>
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
                name="about"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        height: 75,
                        textAlignVertical: "top",
                        borderColor: "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="About"
                    multiline
                  />
                )}
              />
              <Controller
                control={control}
                name="education"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Education"
                  />
                )}
              />
              <Controller
                control={control}
                name="experience"
                render={({ field: { onChange, value } }) => (
                  <View style={[cardStyle.row]}>
                    <TextInput
                      onChangeText={onChange}
                      style={[
                        styles.input,
                        {
                          borderColor: "#ccc",
                          width: 100,
                        },
                      ]}
                      placeholderTextColor={YoColors.placeholderText}
                      value={value}
                      placeholder="Experience"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={{ marginLeft: 10 }}>Years of experience</Text>
                  </View>
                )}
              />

              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Button
                  title="Update"
                  buttonStyle={{ backgroundColor: YoColors.primary }}
                  onPress={handleSubmit(onSubmit)}
                  containerStyle={{ width: 180 }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    </Modal>
  );
};

export default ProfileUpdateModal;

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
