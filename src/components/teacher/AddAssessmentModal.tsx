import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";
import useStore from "../../store/useStore";
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useForm, Controller } from "react-hook-form";
import { Button, CheckBox } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { getDayList, getFeeTypes } from "../../shared/sharedDetails";
import {
  getAssignStudentAssessments,
  getGradeList,
  getSubjectByGradeId,
  upsertAssessments,
} from "../../apiconfig/SharedApis";
import ProcessLoader from "../../screens/ProcessLoader";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import FileUploadModal from "../common/FileUploadModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const AddAssessmentModal = ({
  userId = "",
  onClose = () => { },
  isModalVisible = false,
  setModalVisible = (value: any) => { },
  batchInfo = null,
  title = "",
  dataToEdit = {},
}: any) => {
  const feeTypes: any = getFeeTypes();
  const days: any = getDayList();
  const YoColors = useThemeColor();
  const { height, width } = Dimensions.get("window");

  // const { setModalVisible, isModalVisible }: any = useStore();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    !dataToEdit?.isFavorite ? false : true
  );
  const [isClassTime, setIsClassTime] = useState(false);
  const [classList, setClassList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);
  const [gradeId, setGradeId] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFilesList, setUploadedFilesList] = useState<any>([]);
  const { isPopupModal, setIsPopupModal }: any = useStore();
  const [isRefreshSelectModal, setIsRefreshSelectModal] = useState<number>(0);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useFocusEffect(useCallback(() => {
    reset(dataToEdit);
    if (dataToEdit.uploadedFiles && dataToEdit.uploadedFiles.length > 0) {
      setUploadedFilesList(dataToEdit.uploadedFiles);
    } else {
      setUploadedFilesList([]);
    }
    setIsRefreshSelectModal(0);
  }, [isModalVisible, reset]));

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility state
  };

  useEffect(() => {
    getGradeList().then((result: any) => {
      if (!!result.data) {
        setClassList(result.data);
      }
    });
  }, []);

  useEffect(() => {
    setValue("teacherId", userId);
    if (gradeId) {
      setValue("gradeId", gradeId);
      setValue("subjectId", getValues('subjectId'));
      getSubjectByGradeId(gradeId).then((result: any) => {
        if (!!result.data) {
          setSubjectList(result.data);
        }
      });
      if (batchInfo?.id) {
        setValue("gradeId", batchInfo?.gradeId);
        setValue("subjectId", batchInfo?.subjectId);
      }
      setIsRefreshSelectModal(isRefreshSelectModal + 1);
    }
  }, [gradeId]);

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    const payload: any = { ...data };
    payload.teacherId = !dataToEdit.teacherId ? userId : dataToEdit.teacherId;
    payload.uploadedFiles = [...uploadedFilesList];
    payload.isFavorite = isFavorite;
    upsertAssessments(payload)
      .then((response: any) => {
        if (response.data && response.data?.success) {
          if (batchInfo?.id) {
            getAssignStudentAssessments({
              batchId: batchInfo?.id,
              assessmentId: response.data?.content,
              status: 1,
            }).then((res: any) => {
              if (res.data && res.data.response) {
                console.log("res -----", res.data.response);
              }
            });
          }
          onClose();
          setTimeout(() => {
            setIsPopupModalVisible(true);
            setIsPopupModal(true);
          }, 100);
        }
        setTimeout(() => {
          setIsPopupModalVisible(false);
          setIsPopupModal(false);
          setIsProcessLoader(false);
        }, 1000);
      })
      .catch((error: any) => {
        console.log(error);
        setIsProcessLoader(false);
      });
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
          message="Assessment Created Successful"
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
              padding: 12,
              backgroundColor: YoColors.background,
              height: height,
              minHeight: 150,
            }}
          >
            <View style={[cardStyle.j_row, { marginBottom: 20 }]}>
              <Text style={common.h3Title}>{title}</Text>

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
                  { backgroundColor: YoColors.background },
                ]}
                containerStyle={{ padding: 0 }}
              />
            </View>
            <View style={{ paddingVertical: 12 }}>
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
                name="description"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        height: 100,
                        textAlignVertical: "top",
                        borderColor: errors.description ? "red" : "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Description"
                    multiline
                  />
                )}
              />
              {!batchInfo?.id && (
                <View style={cardStyle.j_row}>
                  <View style={{ width: "48%" }}>
                    <SelectModal
                      data={classList}
                      placeholder="Class"
                      onChanged={(value: any) => {
                        if (value?.id) {
                          setGradeId(value?.id);
                          setValue("gradeId", value?.id)
                        }
                      }}
                      defaultValue={
                        dataToEdit.gradeId
                          ? {
                            id: dataToEdit.gradeId,
                            name: dataToEdit.gradeName,
                          }
                          : null
                      }
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
                        dataToEdit.subjectId
                          ? {
                            id: dataToEdit.subjectId,
                            name: dataToEdit.subjectName,
                          }
                          : null
                      }
                    />
                  </View>
                </View>
              )}

              <Controller
                control={control}
                name="maxMark"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      { borderColor: errors.maxMark ? "red" : "#ccc" },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={typeof value === 'number' ? value.toString() : value}
                    placeholder="Max Mark"
                    keyboardType="numeric"
                  />
                )}
              />

              {batchInfo?.id && (
                <View style={{ alignItems: "center" }}>
                  <CheckBox
                    key={0}
                    title={"Save for later"}
                    checked={isFavorite}
                    checkedColor={YoColors.primary}
                    onPress={() => setIsFavorite(!isFavorite)}
                    containerStyle={{
                      marginBottom: 20,
                      width: "100%",
                    }}
                    textStyle={{ fontWeight: "500", fontSize: 12 }}
                  />
                </View>
              )}

              <View>
                <FileUploadModal
                  setIsLoading={setIsLoading}
                  uploadedFilesList={uploadedFilesList}
                  setUploadedFilesList={setUploadedFilesList}
                />
              </View>

              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Button
                  loading={isLoading}
                  title="Save Assessment"
                  buttonStyle={btnStyle.solid}
                  titleStyle={btnStyle.solidTitle}
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

export default AddAssessmentModal;

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
