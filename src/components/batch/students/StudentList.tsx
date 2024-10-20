import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/themed";
import { cardStyle, common } from "../../../assets/styles/Common";
import { YoImages } from "../../../assets/themes/YoImages";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import { getStudentsListByBatchId } from "../../../apiconfig/SharedApis";
import Loading from "../../../screens/Loading";
import NoDataView from "../../../screens/NoDataView";
import { useNavigation } from "@react-navigation/native";

const StudentList = ({ batchInfo }: any) => {
  const [selectedBatch, setSelectedBatch] = useState(batchInfo ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();

  useEffect(() => {
    setIsLoading(true);
    getStudentsListByBatchId(selectedBatch.id)
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
  }, []);

  const image: any = YoImages();

  const renderItem = ({ item, index }: any) => (
    <Card
      containerStyle={[
        cardStyle.container,
        {
          backgroundColor: YoColors.background,
        },
      ]}
      key={index}
    >
      <View style={cardStyle.row}>
        <View
          style={{
            width: 75,
            height: 75,
          }}
        >
          {item?.image ? (
            <Image
              source={{ uri: item?.image }}
              style={{
                width: 75,
                height: 75,
                borderRadius: 40,
              }}
            />
          ) : (
            <Image
              source={image.DefaultUser}
              style={{
                width: 75,
                height: 75,
                borderRadius: 40,
              }}
            />
          )}
        </View>
        <View
          style={{
            width: "79%",
            paddingHorizontal: 10,
          }}
        >
          <View style={[cardStyle.j_row]}>
            <Text style={[common.title]}>{item?.name}</Text>
          </View>
          {item?.address && (
            <View style={cardStyle.row}>
              <Ionicons name="location-sharp" size={12} />
              <Text style={common.rText}>{item?.address}</Text>
            </View>
          )}
          {item?.phone && (
            <View style={cardStyle.row}>
              <MaterialCommunityIcons name="phone" size={12} />
              <Text style={common.rText}> {item?.phone}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={[cardStyle.j_row, { marginTop: 10 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("AssignedAssignmentList", {
              selectedStudent: item,
              selectedBatch: selectedBatch,
            })
          }
        >
          <View style={cardStyle.row}>
            <MaterialCommunityIcons
              name="account-group"
              size={12}
              color={YoColors.primary}
            />
            <Text style={common.rText}> Assignments</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("AssignedAssessmentList", {
              selectedStudent: item,
              selectedBatch: selectedBatch,
            })
          }
        >
          <View style={cardStyle.row}>
            <MaterialCommunityIcons
              name="account-group"
              size={12}
              color={YoColors.primary}
            />
            <Text style={common.rText}> Assessments</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate("StudentAttendanceDetails", {
              selectedStudent: item,
              selectedBatch: selectedBatch,
            })
          }
        >
          <View style={cardStyle.row}>
            <Icon name="history" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Att. History</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={cardStyle.row}>
            <Ionicons name="person" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Profile</Text>
          </View> */}
        {/* <View style={cardStyle.row}>
            <Ionicons name="chatbubble" size={12} color={YoColors.primary} />
            <Text style={common.rText}> Chat</Text>
          </View> */}
      </View>
    </Card>
  );

  return (
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
  );
};

export default StudentList;

const styles = StyleSheet.create({});
