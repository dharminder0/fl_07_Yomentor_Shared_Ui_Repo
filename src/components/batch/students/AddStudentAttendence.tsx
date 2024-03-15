import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import HeaderView from "../../common/HeaderView";
import { getStudentData } from "../../../shared/sharedDetails";
import { Calendar, Agenda } from "react-native-calendars";
import moment from "moment";

const AddStudentAttendence = ({ route }: any) => {
  const batchName = route?.params?.batchItem?.batchName;
  const [selectedDate, setSelectedDate] = useState<any>(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [items, setItems] = useState<any>({
    "2024-03-11": [{ name: "Item 1 - any js object" }],
    "2024-03-12": [{ name: "Item 2 - any js object", height: 80 }],
    "2024-03-13": [],
    "2024-03-14": [
      { name: "Item 3 - any js object" },
      { name: "Item 4 - any js object" },
    ],
  });

  const handleDayPress = (e: any) => {
    setSelectedDate(e.dateString);
  };

  const renderItem = (item: any) => {
    return (
      <View style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10 }}>
        <Text>{item?.name}</Text>
      </View>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 10 }}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderView title={batchName} />
      <Agenda
        items={items}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        renderEmptyDate={renderEmptyDate}
        pastScrollRange={36}
        futureScrollRange={5}
        maxDate={new Date().toString()}
      />
    </View>
  );
};

export default AddStudentAttendence;

const styles = StyleSheet.create({});
