import React, { useEffect, useState } from "react";
import { View } from "react-native";
import moment from "moment";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import HeaderView from "../../common/HeaderView";
import { getStudentsAttendanceHistory } from "../../../apiconfig/SharedApis";
import { Calendar } from "react-native-calendars";
import { getUserInfo } from "../../../shared/sharedDetails";

const StudentAttendanceDetails = ({ route, batchDetail = {} }: any) => {
  const YoColors = useThemeColor();
  const userInfo: any = getUserInfo();
  const selectedStudent = route?.params?.selectedStudent ?? {};
  const selectedBatch = !route?.params?.selectedBatch
    ? batchDetail
    : route?.params?.selectedBatch;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [markedAttendances, setMarkedAttendances] = useState<any>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(
    moment().format("YYYY-MM-DD")
  );

  useEffect(() => {
    setIsLoading(true);
    const startDate = moment(selectedMonth)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDate = moment(selectedMonth).endOf("month").format("YYYY-MM-DD");

    const payload: any = {
      batchId: selectedBatch.id,
      studentId:
        !selectedStudent.studentId && userInfo.type == 3
          ? userInfo.id
          : selectedStudent.studentId,
      fromDate: startDate,
      toDate: endDate,
      pageSize: 50,
      pageIndex: 1,
    };
    getStudentsAttendanceHistory(payload)
      .then((response: any) => {
        setAttendanceList([]);
        let markedAttendance: any = {};
        if (response.data && response.data.length > 0) {
          response.data.forEach((item: any) => {
            markedAttendance[moment(item?.date).format("YYYY-MM-DD")] = {
              selected: true,
              selectedColor:
                item.status == 1 ? "green" : item.status == 2 ? "red" : "",
            };
          });
          setMarkedAttendances(markedAttendance);
          setAttendanceList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching student attendance: ", error);
      });
  }, [selectedMonth]);

  return (
    <>
      {selectedStudent && selectedStudent?.name && (
        <HeaderView title={selectedStudent?.name} />
      )}

      <View style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}>
        <Calendar
          onDayPress={(day: any) => {
            console.log("selected day", day);
          }}
          onMonthChange={(month: any) => {
            setSelectedMonth(month.dateString);
          }}
          theme={{
            arrowColor: YoColors.primary,
          }}
          markedDates={markedAttendances}
          disableArrowRight={
            moment(selectedMonth).year() === moment().year() &&
            moment(selectedMonth).month() === moment().month()
          }
        />
      </View>
    </>
  );
};

export default StudentAttendanceDetails;
