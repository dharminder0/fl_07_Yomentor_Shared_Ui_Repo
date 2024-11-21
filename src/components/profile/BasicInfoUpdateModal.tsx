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
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-elements";
import {
  upsertUserInfo,
} from "../../apiconfig/SharedApis";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { useTheme } from "@react-navigation/native";

const BasicInfoUpdateModal = ({
  isBasicModal = false,
  closeModal = (value: boolean) => { },
  dataToEdit = {},
}) => {
  const { colors }: any = useTheme();
  const { height, width } = Dimensions.get("window");
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dataToPreset, setDataToPreset]: any = useState(dataToEdit);
  const genderOptions = [
    { name: "Male", id: "male" },
    { name: "Female", id: "female" },
    { name: "Other", id: "other" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const toggleModal = (isUpdated: boolean = false) => {
    closeModal(isUpdated); // Toggle the modal visibility state
    reset();
  };

  useEffect(() => {
    reset({
      id: dataToPreset.id,
      firstName: dataToPreset.firstName,
      lastName: dataToPreset.lastName,
      phone: dataToPreset.phone,
      email: dataToPreset.email,
      type: dataToPreset.type,
      dateOfBirth: new Date(dataToPreset.dateOfBirth),
    });
  }, []);

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    const payload: any = {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      type: data.type,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      gradeId: dataToPreset.studentGradeId,
      category: dataToPreset.category,
    };
    upsertUserInfo(payload)
      .then((response: any) => {
        if (
          response.data &&
          response.data?.message === "Update_Suucessfully."
        ) {
          setIsPopupModalVisible(true);
          toggleModal(true);
        }
        setTimeout(() => {
          setIsPopupModalVisible(false);
          setIsProcessLoader(false);
        }, 500);
      })
      .catch((error: any) => {
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
      onBackButtonPress={() => toggleModal(false)}
      onBackdropPress={() => toggleModal(false)}
      onSwipeComplete={() => toggleModal(false)}
      style={{ margin: 0, justifyContent: 'flex-end' }}
      useNativeDriver
    >
      {isPopupModalVisible && (
        <PopupModal
          message="The user information has been successfully updated."
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[cardStyle.j_row, common.px12, { alignItems: "center" }]}>
            <Text style={common.h3Title}>Update Personal Info</Text>
            <Button
              onPress={() => toggleModal(false)}
              icon={
                <Ionicons
                  name="close-sharp"
                  size={24}
                  color={colors.text}
                />
              }
              type="clear"
            />
          </View>
          <View style={common.px12}>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  style={[
                    styles.input,
                    {
                      borderColor: errors.firstName ? "red" : "#ccc",
                      color: colors.inputText
                    },
                  ]}
                  placeholderTextColor={colors.placeholderText}
                  value={value}
                  placeholder="First Name"
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  style={[
                    styles.input,
                    {
                      borderColor: errors.lastName ? "red" : "#ccc",
                      color: colors.inputText
                    },
                  ]}
                  placeholderTextColor={colors.placeholderText}
                  value={value}
                  placeholder="Last Name"
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  style={[
                    styles.input,
                    {
                      borderColor: "#ccc",
                      color: colors.inputText
                    },
                  ]}
                  placeholderTextColor={colors.placeholderText}
                  value={value}
                  placeholder="Email"
                  keyboardType="email-address"
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <SelectModal
                  data={genderOptions}
                  placeholder="Gender"
                  defaultValue={genderOptions.find(
                    (item) => item.id === dataToPreset.gender
                  )}
                  onChanged={(values: any) => {
                    setValue("gender", values?.id);
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <View style={cardStyle.row}>
                  <Pressable
                    onPress={() => setIsCalendarOpen(true)}
                    style={[
                      styles.input,
                      cardStyle.row,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <Text style={{ color: colors.text }}>
                      {getValues().dateOfBirth
                        ? moment(getValues().dateOfBirth).format("DD-MM-YYYY")
                        : "Date of birth"}
                    </Text>
                    <Icon
                      name="calendar"
                      size={13}
                      color={colors.secondary}
                    />
                  </Pressable>
                </View>
              )}
            />

            {isCalendarOpen && (
              <DatePicker
                modal
                open={isCalendarOpen}
                date={getValues().dateOfBirth ?? new Date()}
                mode="date"
                maximumDate={new Date()}
                onConfirm={(value) => {
                  setIsCalendarOpen(false);
                  setValue("dateOfBirth", moment(value).format("YYYY-MM-DD"));
                }}
                onCancel={() => {
                  setIsCalendarOpen(false);
                }}
              />
            )}

            <View style={{ marginTop: 30, alignItems: "center" }}>
              <Button
                title="Update"
                loading={isProcessLoader}
                buttonStyle={btnStyle.solid}
                titleStyle={btnStyle.solidTitle}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default BasicInfoUpdateModal;

const styles = StyleSheet.create({
  container: {
    maxHeight: '93%',
    paddingVertical: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
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
