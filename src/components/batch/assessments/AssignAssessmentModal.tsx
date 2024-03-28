import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button, CheckBox } from "react-native-elements";
import { getUserInfo } from "../../../shared/sharedDetails";
import {
  getAssessmentsListByTeacherId,
  getAssignStudentAssessments,
} from "../../../apiconfig/SharedApis";
import ProcessLoader from "../../../screens/ProcessLoader";
import { btnStyle, cardStyle, common } from "../../../assets/styles/Common";
import { YoColors } from "../../../assets/themes/YoColors";
import { useToast } from "react-native-toast-notifications";
import Ionicons from "react-native-vector-icons/Ionicons";

const AssignAssessmentModal = ({
  userId = "",
  onClose = () => {},
  isModalVisible = false,
  setModalVisible = (value: any) => {},
  batchInfo,
}: any) => {
  const userInfo: any = getUserInfo();
  const toast: any = useToast();
  const { height, width } = Dimensions.get("window");

  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [assignmentList, setAssignmentList] = useState<any>([]);
  const [selectedIds, setSelectedIds] = useState<any>([]);
  const [checkedStates, setCheckedStates] = useState<any>({});

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility state
  };

  useEffect(() => {
    getAssignmentList();
  }, []);

  const getAssignmentList = () => {
    const payload: any = {
      teacherId: userInfo?.id,
      gradeId: batchInfo?.gradeId,
      subjectId: batchInfo?.subjectId,
      pageSize: 20,
      pageIndex: pageIndex,
    };
    getAssessmentsListByTeacherId(payload).then((result: any) => {
      setAssignmentList([]);
      if (result.data && result.data?.length > 0) {
        setAssignmentList(result.data);
      }
      setTimeout(() => {
        setIsLoading(false);
        setRefreshLoader(false);
      }, 500);
    });
  };

  const onSubmit = () => {
    if (selectedIds && selectedIds?.length > 0) {
      getAssignStudentAssessments({
        batchId: batchInfo?.id,
        assessmentId: selectedIds[0],
        status: 1,
      }).then((res: any) => {
        if (res.data && res.data.response) {
          toast.show("Assessment Assigned successfully", {
            type: "success",
            duration: 2000,
          });
          onClose();
        }
      });
    }
  };

  const handleCheckboxChange = (checkbox: any) => {
    setCheckedStates((prevCheckedStates: any) => ({
      ...prevCheckedStates,
      [checkbox?.id]: !prevCheckedStates[checkbox?.id], // Toggle checked state
    }));
    setSelectedIds((prevId: any) => {
      const index = prevId.indexOf(checkbox?.id);
      return index !== -1
        ? prevId.slice(0, index).concat(prevId.slice(index + 1))
        : [...prevId, checkbox?.id];
    });
  };

  const renderItem = ({ item }: any) => (
    <View>
      <CheckBox
        key={item?.id}
        // id={item?.id}
        title={item?.title}
        checked={checkedStates[item?.id]}
        checkedColor={YoColors.primary}
        onPress={() => handleCheckboxChange(item)}
      />
    </View>
  );

  const getItemCount = () => assignmentList.length;

  const getItem = (data: any, index: number) => assignmentList[index];

  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={toggleModal}
      onBackdropPress={toggleModal}
      onSwipeComplete={toggleModal}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
      {isProcessLoader && <ProcessLoader />}
      <>
        <View
          style={{
            backgroundColor: "#fff",
            height: height - 50,
            minHeight: 150,
          }}
        >
          <View style={[cardStyle.j_row, common.px12, common.py10]}>
            <Text style={common.h3Title}>Select Assessment</Text>
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

          <View style={{ height: height - 145 }}>
            <VirtualizedList
              data={assignmentList}
              renderItem={renderItem}
              keyExtractor={(item) => item.toString()}
              getItemCount={getItemCount}
              getItem={getItem}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={common.p12}>
            <Button
              title="Assign to batch"
              buttonStyle={{ backgroundColor: YoColors.primary }}
              onPress={onSubmit}
            />
          </View>
        </View>
      </>
    </Modal>
  );
};

export default AssignAssessmentModal;

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
