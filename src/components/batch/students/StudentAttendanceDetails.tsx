import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import moment from "moment";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import NoDataView from "../../../screens/NoDataView";
import HeaderView from "../../common/HeaderView";
import Loading from "../../../screens/Loading";
import { getStudentsAttendance } from "../../../apiconfig/SharedApis";
import { Calendar, LocaleConfig } from "react-native-calendars";

const StudentAttendanceDetails = ({ route }: any) => {
  const YoColors = useThemeColor();
  const selectedStudent = route?.params?.selectedStudent ?? {};
  const selectedBatch = route?.params?.selectedBatch ?? {};
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
      studentId: selectedStudent.studentId,
      fromDate: startDate,
      toDate: endDate,
      pageSize: 50,
      pageIndex: 1,
    };
    console.log("payload", payload);
    getStudentsAttendance(payload)
      .then((response: any) => {
        setAttendanceList([]);
        let markedAttendance: any = {};
        console.log(response.data);
        if (response.data && response.data.length > 0) {
          response.data.forEach((item: any) => {
            markedAttendance[moment(item?.date).format("YYYY-MM-DD")] = {
              selected: true,
              selectedColor: YoColors.primary,
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
      <HeaderView title={selectedStudent?.name} />
      <View style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}>
        <Calendar
          onDayPress={(day) => {
            console.log("selected day", day);
          }}
          onMonthChange={(month) => {
            console.log("month", month.dateString);
            setSelectedMonth(month.dateString);
          }}
          markedDates={markedAttendances}
          //maxDate={moment().clone().add(1, 'month').format("YYYY-MM-DD")}
        />
      </View>
    </>
  );
};

export default StudentAttendanceDetails;
