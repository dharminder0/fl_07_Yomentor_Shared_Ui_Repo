import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import HeaderView from "../../common/HeaderView";
import CalendarView from "./CalendarView";
import NoDataView from "../../../screens/NoDataView";
import { Card } from "@rneui/themed";
import { cardStyle, common } from "../../../assets/styles/Common";
import { YoImages } from "../../../assets/themes/YoImages";
import { YoColors } from "../../../assets/themes/YoColors";
import {
  getStudentsAttendance,
  upsertAttendanceBulkAdd,
} from "../../../apiconfig/SharedApis";
import { Button } from "react-native-elements";
import Loading from "../../../screens/Loading";
import Icon from "react-native-vector-icons/FontAwesome5";
import PopupModal from "../../common/PopupModal";
import useStore from "../../../store/useStore";
import moment from "moment";

const AddStudentAttendance = ({ route }: any) => {
  const batchInfo = route?.params?.batchItem ?? {};
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForAttendance, setIsLoadingForAttendance] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [calendarDate, setCalendarDate] = useState<any>();
  const [attendanceList, setAttendanceList] = useState<any>({});
  const image: any = YoImages();
  const { height } = Dimensions.get("window");
  const { isPopupModal, setIsPopupModal }: any = useStore();

  useEffect(() => {
    setIsLoading(true);
    const payload: any = {
      batchId: batchInfo?.id,
      fromDate: calendarDate,
      toDate: calendarDate,
      pageSize: 100,
      pageIndex: 1,
    };
    getStudentsAttendance(payload)
      .then((response: any) => {
        setStudentsList([]);
        if (response.data && response.data.length > 0) {
          const attendanceObj: any = {};
          response.data.forEach((student: any) => {
            attendanceObj[student.studentId] =
              student.status == 1
                ? "present"
                : student.status == 2
                ? "absent"
                : "none"; // 'none', 'present', or 'absent'
          });
          setAttendanceList(attendanceObj);
          setStudentsList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching students: ", error);
      });
  }, [calendarDate]);

  const handleAttendance = (studentId: any, status: any) => {
    setAttendanceList({ ...attendanceList, [studentId]: status });
  };

  const addBulkAttendance = () => {
    setIsLoadingForAttendance(true);
    let payload: any = {
      student_attendance: [],
      batchId: batchInfo?.id,
      date: calendarDate,
      createDate: moment(),
      updateDate: moment(),
    };
    if (attendanceList && Object.keys(attendanceList).length > 0) {
      for (const [key, value] of Object.entries(attendanceList)) {
        let tempObj: any = {
          studentId: parseInt(key),
          status: value == "present" ? 1 : value == "absent" ? 2 : 0,
        };
        payload.student_attendance.push(tempObj);
      }
    }
    upsertAttendanceBulkAdd(payload)
      .then((response: any) => {
        if (response.data && response.data.response) {
          setIsPopupModal(true);
          setIsLoadingForAttendance(false);
        }
      })
      .catch((error: any) => {
        setIsLoadingForAttendance(false);
        console.error("Error update attendance: ", error);
      });
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity activeOpacity={0.7}>
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          <View style={{ marginRight: 10 }}>
            <Image
              source={image.DefaultUser}
              style={{
                width: 75,
                height: 75,
                borderRadius: 40,
              }}
            />
          </View>
          <View>
            <View style={[cardStyle.j_row]}>
              <Text
                style={[common.h3Title, { width: "72%" }]}
                numberOfLines={1}
              >
                {item?.firstName} {item?.lastName}
              </Text>
            </View>
            {item.phone && (
              <View style={cardStyle.row}>
                <Text style={common.rText}> {item.phone}</Text>
              </View>
            )}
          </View>
          <View style={styles.attendanceButtonsContainer}>
            <TouchableOpacity
              style={styles.attendanceButton}
              onPress={() => handleAttendance(item.studentId, "present")}
            >
              <Text
                style={[
                  styles.attendanceButtonText,
                  {
                    color:
                      attendanceList[item.studentId] === "present"
                        ? "green"
                        : "grey",
                  },
                ]}
              >
                <Icon name="user-check" size={18} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.attendanceButton}
              onPress={() => handleAttendance(item.studentId, "absent")}
            >
              <Text
                style={[
                  styles.attendanceButtonText,
                  {
                    color:
                      attendanceList[item.studentId] === "absent"
                        ? "red"
                        : "grey",
                  },
                ]}
              >
                <Icon name="user-times" size={18} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <HeaderView title={batchInfo.batchName} />
      <View>
        <CalendarView setCalendarDate={setCalendarDate} />
        <View style={common.container}>
          {isLoading ? (
            <Loading />
          ) : studentsList && studentsList.length > 0 ? (
            <View style={{ height: "100%" }}>
              <View
                style={{
                  height: Platform.OS == "ios" ? height - 265 : height - 180,
                }}
              >
                <FlatList
                  data={studentsList}
                  keyExtractor={(item: any) => item?.id}
                  renderItem={renderItem}
                />
              </View>
              <Button
                title="Submit"
                loading={isLoadingForAttendance}
                onPress={addBulkAttendance}
                buttonStyle={{
                  backgroundColor: YoColors.primary,
                  marginTop: 20,
                }}
                titleStyle={{ fontWeight: "600" }}
                containerStyle={{ width: "100%" }}
              />
            </View>
          ) : (
            <NoDataView />
          )}
          {isPopupModal && (
            <PopupModal
              message="Attendance marked successfully"
              icon={"checkmark-circle"}
              color={"green"}
              iconSize={40}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  attendanceButtonsContainer: {
    flexDirection: "row",
    position: "absolute",
    right: 0,
    top: 10,
  },
  attendanceButton: {
    padding: 5,
    borderRadius: 5,
    margin: 5,
  },
  attendanceButtonText: {
    color: "white",
  },
});

export default AddStudentAttendance;
