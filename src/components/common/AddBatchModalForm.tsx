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
import SelectModal from "./SelectModal";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import DatePicker from "react-native-date-picker";
import moment from "moment";
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
} from "../../apiconfig/SharedApis";
import PopupModal from "./PopupModal";
import ProcessLoader from "../../screens/ProcessLoader";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddBatchModalForm = ({ userId = "", onClose = () => {} }) => {
  const feeTypes: any = getFeeTypes();
  const days: any = getDayList();
  const YoColors = useThemeColor();

  const { height, width } = Dimensions.get("window");

  const { setModalVisible, isModalVisible }: any = useStore();
  const [time, setTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [isClassTime, setIsClassTime] = useState(false);
  const [classList, setClassList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);

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

  const handleGradeChange = (grade: any) => {
    setSubjectList([]);
    setValue("subjectId", "");
    getSubjectByGradeId(grade).then((result: any) => {
      if (result?.data && result.data.length > 0) {
        setSubjectList(result.data);
      }
    });
  };

  const onSubmit = (data: any) => {
    let paylaod: any = { ...data };
    paylaod["id"] = 0;
    paylaod["teacherId"] = userId;
    if (
      paylaod.gradeId &&
      paylaod.classTime &&
      paylaod.date &&
      paylaod.days &&
      paylaod.name &&
      paylaod.numberOfStudents &&
      paylaod.fee &&
      paylaod.feeType &&
      paylaod.subjectId &&
      paylaod.teacherId
    ) {
      setIsProcessLoader(true);
      // console.log("paylaod");
      // console.log(paylaod);
      // console.log("data");
      // console.log(data);
      addBatch(paylaod)
        .then((response: any) => {
          // console.log("response", response.data);
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
              <Text style={cardStyle.headTitle}>Create New Batch</Text>
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
                name="name"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      { borderColor: errors.name ? "red" : "#ccc" },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Name"
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: "#ccc",
                        minHeight: 80,
                        height: "auto",
                        verticalAlign: "top",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Description (optional)"
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
                        fieldError={errors.gradeId ? true : false}
                        data={classList}
                        placeholder="Class"
                        onChanged={(value: any) => {
                          field.onChange(value?.id);
                          handleGradeChange(value?.id);
                        }}
                      />
                    )}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <Controller
                    control={control}
                    name="subjectId"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <SelectModal
                        fieldError={errors.subjectId ? true : false}
                        data={subjectList}
                        placeholder={"Subject"}
                        onChanged={(value: any) => field.onChange(value?.id)}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="days"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <SelectModal
                    data={days}
                    fieldError={errors.days ? true : false}
                    placeholder="Select Days"
                    onChanged={(value: any) => setValue("days", value)}
                    isMulti={true}
                  />
                )}
              />

              <Controller
                control={control}
                name="classTime"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View style={cardStyle.row}>
                    <Pressable
                      onPress={() => setIsClassTime(true)}
                      style={[
                        styles.input,
                        cardStyle.row,
                        {
                          justifyContent: "space-between",
                          borderColor: errors.classTime ? "red" : "#ccc",
                        },
                      ]}
                    >
                      <Text>
                        {getValues().classTime
                          ? getValues().classTime
                          : "Time (HH:mm)"}
                      </Text>
                      <Icon name="clock" size={13} color={YoColors.secondary} />
                    </Pressable>
                  </View>
                )}
              />

              {isClassTime && (
                <DatePicker
                  modal
                  open={isClassTime}
                  date={
                    getValues().classTime
                      ? moment(getValues().classTime, "HH:mm").toDate()
                      : new Date()
                  }
                  mode="time"
                  minuteInterval={15}
                  onConfirm={(value) => {
                    setIsClassTime(false);
                    setValue("classTime", moment(value).format("HH:mm"));
                  }}
                  onCancel={() => {
                    setIsClassTime(false);
                  }}
                />
              )}

              <View style={cardStyle.j_row}>
                <View style={{ width: "48%" }}>
                  <Controller
                    control={control}
                    name="fee"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        onChangeText={onChange}
                        style={[
                          styles.input,
                          cardStyle.row,
                          {
                            justifyContent: "space-between",
                            borderColor: errors.fee ? "red" : "#ccc",
                          },
                        ]}
                        placeholderTextColor={YoColors.placeholderText}
                        value={value}
                        placeholder="Fee"
                        keyboardType="numeric"
                      />
                    )}
                  />
                </View>

                <View style={{ width: "48%" }}>
                  <Controller
                    control={control}
                    name="feeType"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <SelectModal
                        data={feeTypes}
                        placeholder="Fee Type"
                        onChanged={(value: any) =>
                          setValue("feeType", value?.id)
                        }
                        fieldError={errors.feeType ? true : false}
                      />
                    )}
                  />
                </View>
              </View>

              <Controller
                control={control}
                name="numberOfStudents"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: errors.numberOfStudents ? "red" : "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Number of Students"
                    keyboardType="numeric"
                  />
                )}
              />

              <Controller
                control={control}
                name="date"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <View style={cardStyle.row}>
                    <Pressable
                      onPress={() => setIsCalendarOpen(true)}
                      style={[
                        styles.input,
                        cardStyle.row,
                        {
                          justifyContent: "space-between",
                          borderColor: errors.date ? "red" : "#ccc",
                        },
                      ]}
                    >
                      <Text>
                        {getValues().date
                          ? getValues().date
                          : "Batch Start Date (DD-MM-YYYY)"}
                      </Text>
                      <Icon
                        name="calendar"
                        size={13}
                        color={YoColors.secondary}
                      />
                    </Pressable>
                  </View>
                )}
              />

              {isCalendarOpen && (
                <DatePicker
                  modal
                  open={isCalendarOpen}
                  date={
                    getValues().date &&
                    moment(getValues().date, "YYYY-MM-DD").isValid()
                      ? new Date(getValues().date)
                      : new Date()
                  }
                  mode="date"
                  onConfirm={(value) => {
                    setIsCalendarOpen(false);
                    setValue("date", moment(value).format("YYYY-MM-DD"));
                  }}
                  onCancel={() => {
                    setIsCalendarOpen(false);
                  }}
                />
              )}
              <View style={{ marginTop: 30 }}>
                <Button
                  title="Create Batch"
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

export default AddBatchModalForm;

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
