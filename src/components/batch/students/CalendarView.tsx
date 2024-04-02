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

const YoColors = useThemeColor();

const CalendarView = ({ setCalendarDate }: any) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  // Generate an array of dates for the calendar (e.g., 7 days)
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    let date = moment().add(i, "days");
    dates.push(date);
  }

  // Function to handle date selection
  const handleDateSelect = (date: any) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setCalendarDate(selectedDate);
  }, [selectedDate]);

  // Function to render individual date item
  const renderDateItem = (date: any) => {
    const isSelected = date.isSame(selectedDate, "day");
    return (
      <TouchableOpacity
        key={date.format("YYYY-MM-DD")}
        onPress={() => handleDateSelect(date)}
        style={[styles.dateItem, isSelected && styles.selectedDateItem]}
      >
        <Text style={isSelected && styles.selectedDateText}>
          {date.format("D")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    // <View>
    //   <ScrollView horizontal>
    //     <View style={styles.container}>
    //       {dates.map((date) => renderDateItem(date))}
    //     </View>
    //   </ScrollView>
    // </View>
    <View style={styles.container}>
      {dates.map((date) => renderDateItem(date))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  dateItem: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#e7e7e7",
    width: "11%",
    alignItems: "center",
  },
  selectedDateItem: {
    backgroundColor: YoColors.primary,
  },
  selectedDateText: {
    color: "white",
  },
});

export default CalendarView;
