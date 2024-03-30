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
import { YoColors } from "../../assets/themes/YoColors";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import {
  getDayList,
  getFeeTypes,
  getUserData,
  getUserInfo,
} from "../../shared/sharedDetails";
import {
  getAssignStudentAssignments,
  getGradeList,
  getSubjectByGradeId,
  upsertAssignments,
} from "../../apiconfig/SharedApis";
import ProcessLoader from "../../screens/ProcessLoader";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import FileUploadModal from "../common/FileUploadModal";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddAssignmentModal = ({
  userId = "",
  onClose = () => {},
  isModalVisible = false,
  setModalVisible = (value: any) => {},
  batchId = null,
}) => {
  const feeTypes: any = getFeeTypes();
  const days: any = getDayList();

  const { height, width } = Dimensions.get("window");

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isClassTime, setIsClassTime] = useState(false);
  const [classList, setClassList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);
  const [gradeId, setGradeId] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedFilesList, setUploadedFilesList] = useState<any>([]);
  const { isPopupModal, setIsPopupModal }: any = useStore();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset();
    setUploadedFilesList([]);
  }, [isModalVisible, reset]);

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
    setValue("isfavorite", true);
    if (gradeId) {
      getSubjectByGradeId(gradeId).then((result: any) => {
        if (!!result.data) {
          setSubjectList(result.data);
        }
      });
    }
  }, [gradeId]);

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    const payload: any = { ...data };
    payload.uploadedFiles = [...uploadedFilesList];
    console.log(payload);
    upsertAssignments(data).then((response: any) => {
      if (response.data && response.data?.response) {
        if (batchId) {
          getAssignStudentAssignments({
            batchId: batchId,
            assignmentId: response.data?.content,
            status: 1,
          }).then((res: any) => {
            if (res.data && res.data.response) {
              console.log("res -----", res.data.response);
            }
          });
        }
        reset();
        onClose();
        setTimeout(() => {
          setIsPopupModalVisible(true);
          setIsPopupModal(true);
        }, 200);
      }
      setTimeout(() => {
        setIsPopupModalVisible(false);
        setIsPopupModal(false);
        setIsProcessLoader(false);
      }, 1000);
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
          message="Assignment Created Successful"
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
              backgroundColor: "#fff",
              height: height,
              minHeight: 150,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={common.h3Title}>Create New Assignment</Text>
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
                    value={value}
                    placeholder="Title"
                  />
                )}
              />
              {/* {errors.name && <Text>This field is required</Text>} */}

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
                    value={value}
                    placeholder="Description"
                    multiline
                  />
                )}
              />
              <View style={cardStyle.j_row}>
                <View style={{ width: "48%" }}>
                  <SelectModal
                    data={classList}
                    placeholder="Class"
                    onChanged={(value: any) => {
                      setValue("gradeId", value?.id);
                      setGradeId(value?.id);
                    }}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <SelectModal
                    data={subjectList}
                    placeholder={"Subject"}
                    onChanged={(value: any) => setValue("subjectId", value?.id)}
                  />
                </View>
              </View>

              <View>
                <FileUploadModal
                  setIsLoading={setIsLoading}
                  uploadedFilesList={uploadedFilesList}
                  setUploadedFilesList={setUploadedFilesList}
                />
              </View>

              <View style={{ marginTop: 30 }}>
                <Button
                  loading={isLoading}
                  title="Create Assignment"
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

export default AddAssignmentModal;

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
