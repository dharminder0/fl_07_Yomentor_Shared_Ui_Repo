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
import {
  getDayList,
  getFeeTypes,
  getUserData,
  getUserInfo,
} from "../../shared/sharedDetails";
import {
  addBatch,
  getGradeList,
  getSubjectByGradeId,
  upsertBookDetails,
} from "../../apiconfig/SharedApis";
import ProcessLoader from "../../screens/ProcessLoader";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";

const CreateBookRequest = ({ userId = "", onClose = () => {} }) => {
  const YoColors = useThemeColor();

  const { height, width } = Dimensions.get("window");

  const { setModalVisible, isModalVisible }: any = useStore();
  const [time, setTime] = useState(new Date());
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [classList, setClassList] = useState<any>([]);

  const { isPopupModal, setIsPopupModal }: any = useStore();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm();

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility state
    reset();
    setTime(new Date());
  };

  useEffect(() => {
    getGradeList().then((result: any) => {
      if (!!result.data) {
        setClassList(result.data);
      }
    });
  }, []);

  const onSubmit = (data: any) => {
    let paylaod: any = { ...data };
    paylaod["id"] = 0;
    console.log("paylaod");
    console.log(paylaod);
    if (paylaod.title && paylaod.author && paylaod.gradeId) {
      setIsProcessLoader(true);
      upsertBookDetails(data)
        .then((response: any) => {
          console.log("response", response.data);
          if (response.data && response.data?.success) {
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
        })
        .catch((error: any) => {
          setIsPopupModalVisible(false);
          setIsProcessLoader(false);
        });
    }
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      onSwipeComplete={toggleModal}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
      {isPopupModalVisible && (
        <PopupModal
          message="Book Created Successfully"
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
      <>
        <ScrollView
          style={{ maxHeight: height - 100 }}
          showsVerticalScrollIndicator={false}
        >
          {isProcessLoader ? (
            <ProcessLoader />
          ) : (
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
                <Text style={cardStyle.headTitle}>Create New Book</Text>
                <Button
                  onPress={toggleModal}
                  icon={
                    <Ionicons
                      name="close-sharp"
                      size={24}
                      color={YoColors.primary}
                    />
                  }
                  buttonStyle={btnStyle.btnCross}
                  containerStyle={{ padding: 0 }}
                />
              </View>
              <View style={{ paddingHorizontal: 12 }}>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={onChange}
                      style={[
                        styles.input,
                        { borderColor: errors.title ? "red" : "#ccc" },
                      ]}
                      placeholderTextColor={YoColors.placeholderText}
                      value={value}
                      placeholder="Title"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="author"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={onChange}
                      style={[
                        styles.input,
                        { borderColor: errors.author ? "red" : "#ccc" },
                      ]}
                      placeholderTextColor={YoColors.placeholderText}
                      value={value}
                      placeholder="Author"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="gradeId"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <SelectModal
                      fieldError={errors.gradeId ? true : false}
                      data={classList}
                      placeholder="Class"
                      onChanged={(value: any) => {
                        field.onChange(value?.id);
                      }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="remark"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      onChangeText={onChange}
                      style={[
                        styles.input,
                        {
                          height: 100,
                          textAlignVertical: "top",
                          borderColor: "#ccc",
                        },
                      ]}
                      placeholderTextColor={YoColors.placeholderText}
                      value={value}
                      placeholder="Remark"
                      multiline
                    />
                  )}
                />

                <View style={{ marginTop: 30 }}>
                  <Button
                    title="Create Book"
                    buttonStyle={{ backgroundColor: YoColors.primary }}
                    onPress={handleSubmit(onSubmit)}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </>
    </Modal>
  );
};

export default CreateBookRequest;

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
