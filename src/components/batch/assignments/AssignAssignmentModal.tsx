import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Button, CheckBox } from "react-native-elements";
import { getUserInfo } from "../../../shared/sharedDetails";
import {
  getAssignStudentAssignments,
  getAssignmentsListByTeacherId,
} from "../../../apiconfig/SharedApis";
import ProcessLoader from "../../../screens/ProcessLoader";
import { btnStyle, cardStyle, common } from "../../../assets/styles/Common";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import { useToast } from "react-native-toast-notifications";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { Card } from "@rneui/base";

const AssignAssignmentModal = ({
  userId = "",
  onClose = () => {},
  isModalVisible = false,
  setModalVisible = (value: any) => {},
  batchInfo,
}: any) => {
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const { height, width } = Dimensions.get("window");
  const toast: any = useToast();
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [assignmentList, setAssignmentList] = useState<any>([]);
  const [selectedId, setSelectedId] = useState<number>(0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility state
  };

  useEffect(() => {
    getAssignmentList();
  }, []);

  useEffect(() => {
    setSelectedId(0);
  }, [isModalVisible]);

  const getAssignmentList = () => {
    const payload: any = {
      teacherId: userInfo?.id,
      gradeId: batchInfo?.gradeId,
      subjectId: batchInfo?.subjectId,
      pageSize: 20,
      pageIndex: pageIndex,
    };
    getAssignmentsListByTeacherId(payload).then((result: any) => {
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
    const payload: any = {
      batchId: batchInfo?.id,
      assignmentId: selectedId,
      status: 1,
    };

    getAssignStudentAssignments(payload)
      .then((res: any) => {
        if (res.data && res.data.response) {
          toast.show("Assignment has been successfully assigned.", {
            type: "success",
            duration: 2000,
            placement: "top",
          });
          onClose();
        }
      })
      .catch((error: any) => {
        console.log(error);
        toast.show("Assignment has failed to be assigned successfully.", {
          type: "danger",
          duration: 2000,
          placement: "top",
        });
      });
  };
  const renderItem = ({ item }: any) => (
    <View style={common.p5}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedId(item.id)}
      >
        <Card
          containerStyle={[
            cardStyle.container,
            selectedId === item.id && common.highLight,
          ]}
        >
          <View style={[cardStyle.j_row, { margin: 0 }]}>
            <Text numberOfLines={2} style={[common.title, { width: "72%" }]}>
              {item?.title}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {moment(item?.createdate).format("MMM DD, YYYY")}
            </Text>
          </View>
          <View style={[cardStyle.row, { marginBottom: 5 }]}>
            <View style={[cardStyle.row, { marginEnd: 15 }]}>
              <Icon name="laptop" size={12} />
              <Text style={common.rText}> {item.gradeName}</Text>
            </View>
            <View style={[cardStyle.row, { marginEnd: 10 }]}>
              <Icon name="book" size={12} />
              <Text style={common.rText}> {item.subjectName}</Text>
            </View>
          </View>
          {item?.description && (
            <Text style={{ marginBottom: 5, fontSize: 12 }} numberOfLines={2}>
              {item?.description}
            </Text>
          )}
        </Card>
      </TouchableOpacity>
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
            height: height - 30,
            minHeight: 150,
          }}
        >
          <View style={[cardStyle.j_row, common.px12, common.py10]}>
            <Text style={common.h3Title}>Select Assignment</Text>
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
              disabled={selectedId <= 0}
              onPress={onSubmit}
            />
          </View>
        </View>
      </>
    </Modal>
  );
};

export default AssignAssignmentModal;

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
