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
import SelectModal from "../common/SelectModal";
import { useToast } from "react-native-toast-notifications";

const CreateBookRequest = ({
  userId = "",
  isModalVisible = false,
  onClose = (value: boolean) => {},
  dataToEdit = {},
}) => {
  const YoColors = useThemeColor();
  const toast = useToast();
  const { height, width } = Dimensions.get("window");
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [classList, setClassList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);
  const [bookDetails, setBookDetails] = useState<any>({});
  const [isRefreshSelectModal, setIsRefreshSelectModal] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm();

  useEffect(() => {
    getGradeList().then((result: any) => {
      if (!!result.data) {
        setClassList(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (dataToEdit && Object.keys(dataToEdit).length > 0) {
      const bookInfo: any = { ...dataToEdit };
      setBookDetails(bookInfo);
      setIsEditMode(true);
      reset({
        id: bookInfo.id,
        title: bookInfo.title,
        author: bookInfo.author,
        gradeId: bookInfo.gradeId,
        subjectId: bookInfo.subjectId,
        remark: bookInfo.remark,
      });
      handleGradeChange(bookInfo.gradeId, bookInfo.subjectId);
      setIsRefreshSelectModal(0);
    }
  }, [dataToEdit]);

  const handleGradeChange = (grade: any, subjectId?: any) => {
    setSubjectList([]);
    if (!subjectId) {
      setValue("subjectId", "");
    }
    getSubjectByGradeId(grade).then((result: any) => {
      if (result?.data && result.data.length > 0) {
        setSubjectList(result.data);
      }
    });
    setIsRefreshSelectModal(isRefreshSelectModal + 1);
  };

  const onSubmit = (data: any) => {
    let paylaod: any = { ...data };
    paylaod["userId"] = userId;
    if (paylaod.title && paylaod.author && paylaod.gradeId) {
      setIsProcessLoader(true);
      upsertBookDetails(paylaod)
        .then((response: any) => {
          if (response.data && response.data?.success) {
            toast.show(
              isEditMode ? "The book info updated" : "A new book created",
              {
                type: "success",
                duration: 2000,
                placement: "top",
              }
            );
            onClose(true);
            reset();
          }
          setTimeout(() => {
            setIsProcessLoader(false);
          }, 500);
        })
        .catch((error: any) => {
          toast.show(
            isEditMode
              ? "The book info updation failed"
              : "A new book creation failed",
            {
              type: "danger",
              duration: 2000,
              placement: "top",
            }
          );
          setIsProcessLoader(false);
        });
    }
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={() => onClose(false)}
      onBackdropPress={() => onClose(false)}
      onSwipeComplete={() => onClose(false)}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
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
                <Text style={cardStyle.headTitle}>
                  {isEditMode ? "Update book details" : "Create new book"}
                </Text>
                <Button
                  onPress={() => onClose(false)}
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
                <View style={cardStyle.j_row}>
                  <View style={{ width: "48%" }}>
                    <Controller
                      control={control}
                      name="gradeId"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <SelectModal
                          defaultValue={{
                            name: bookDetails.gradeName,
                            id: bookDetails.gradeId,
                          }}
                          fieldError={errors.gradeId ? true : false}
                          data={classList}
                          placeholder="Class"
                          onChanged={(value: any) => {
                            if (value?.id) {
                              field.onChange(value.id);
                              handleGradeChange(value.id);
                            }
                          }}
                        />
                      )}
                    />
                  </View>
                  <View style={{ width: "48%" }}>
                    <SelectModal
                      refreshModal={isRefreshSelectModal}
                      data={subjectList}
                      placeholder="Subject"
                      onChanged={(value: any) =>
                        setValue("subjectId", value?.id)
                      }
                      defaultValue={
                        bookDetails.subjectId
                          ? {
                              id: bookDetails.subjectId,
                              name: bookDetails.subjectName,
                            }
                          : null
                      }
                    />
                  </View>
                </View>

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

                <View style={{ marginTop: 30, alignItems: "center" }}>
                  <Button
                    title={isEditMode ? "Update Book" : "Create Book"}
                    buttonStyle={btnStyle.solid}
                    titleStyle={btnStyle.solidTitle}
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
