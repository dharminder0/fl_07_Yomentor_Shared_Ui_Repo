import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import moment from "moment";
import HeaderView from "../../common/HeaderView";
import Loading from "../../../screens/Loading";
import CalendarView from "./CalendarView";
import NoDataView from "../../../screens/NoDataView";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/themed";
import { cardStyle, common } from "../../../assets/styles/Common";
import { YoImages } from "../../../assets/themes/YoImages";
import { YoColors } from "../../../assets/themes/YoColors";
import { getStudentsAttendance } from "../../../apiconfig/SharedApis";

const AddStudentAttendance = ({ route }: any) => {
  const batchInfo = route?.params?.batchItem ?? {};
  const [selectedBatch, setSelectedBatch] = useState(batchInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [calendarDate, setCalendarDate] = useState<any>();
  const [pageSize, setPageSize] = useState(100);
  const [pageIndex, setPageIndex] = useState(1);
  const image: any = YoImages();

  useEffect(() => {
    setIsLoading(true);
    const payload: any = {
      batchId: batchInfo?.id,
      fromDate: calendarDate,
      toDate: calendarDate,
      pageSize: pageSize,
      pageIndex: pageIndex,
    };

    getStudentsAttendance(payload)
      .then((response: any) => {
        setStudentsList([]);
        if (response.data && response.data.length > 0) {
          setStudentsList(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching students: ", error);
      });
  }, [calendarDate]);

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      //   onPress={() => gotoBatchDetail(item?.id)}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          <View
            style={{
              width: 75,
              height: 75,
            }}
          >
            <Image
              source={image.DefaultUser}
              style={{
                width: 75,
                height: 75,
                borderRadius: 40,
              }}
            />
          </View>
          <View
            style={{
              width: "79%",
              paddingHorizontal: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.h3Title]}>{item?.name}</Text>
            </View>
            <View style={cardStyle.row}>
              <Ionicons name="location-sharp" size={12} />
              <Text style={common.rText}>{item?.address}</Text>
            </View>
            <View style={cardStyle.row}>
              <MaterialCommunityIcons name="phone" size={12} />
              <Text style={common.rText}> {item?.phone}</Text>
            </View>
          </View>
        </View>

        <View style={[cardStyle.j_row, { marginTop: 10 }]}>
          <View style={cardStyle.row}>
            <Icon name="history" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Att. History</Text>
          </View>
          <View style={cardStyle.row}>
            <Ionicons name="person" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Profile</Text>
          </View>
          <View style={cardStyle.row}>
            <Ionicons name="chatbubble" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Chat</Text>
          </View>
          <View style={cardStyle.row}>
            <MaterialCommunityIcons
              name="account-group"
              size={12}
              color={YoColors.primary}
            />
            <Text style={common.rText}> Assessments</Text>
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
            <FlatList
              data={studentsList}
              keyExtractor={(item: any) => item?.id}
              renderItem={renderItem}
            />
          ) : (
            <NoDataView />
          )}
        </View>
      </View>
    </View>
  );
};

export default AddStudentAttendance;
