import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
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
import { cardStyle, common } from "../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import HeaderView from "./common/HeaderView";
import { YoImages } from "../assets/themes/YoImages";
import { YoColors } from "../assets/themes/YoColors";
import { getStudentsListByBatchId } from "../apiconfig/SharedApis";
import NoDataView from "../screens/NoDataView";

const OpenBatchDetails = ({ route }: any) => {
  const batchItem: any = route.params.batchItem;
  // const studentData: any = getStudentData();
  const [studentData, setStudentData] = useState([]);
  const [refreshLoader, setRefreshLoader] = useState(false);
  useEffect(() => {
    getStudentsDataByBatchId();
  }, [batchItem?.id]);

  const getStudentsDataByBatchId = () => {
    getStudentsListByBatchId(batchItem?.id).then((response: any) => {
      setStudentData([]);
      if (response && response?.data?.length > 0) {
        setStudentData(response?.data);
      }
      setTimeout(() => {
        setRefreshLoader(false);
      }, 1000);
    });
  };

  const navigation: any = useNavigation();
  const image: any = YoImages();

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
          <View style={{ marginStart: 12, width: "73%" }}>
            <View style={[cardStyle.j_row]}>
              <Text style={[cardStyle.headTitle, cardStyle.fs18]}>
                {item?.name}
              </Text>
            </View>
            <View style={cardStyle.row}>
              <Ionicons
                name="location-sharp"
                size={14}
                color={YoColors.primary}
              />
              <Text style={cardStyle.subTitle}>
                {item?.address ? item?.address : "-"}
              </Text>
            </View>
            <View style={cardStyle.row}>
              <Icon name="phone-alt" size={13} color={YoColors.primary} />
              <Text style={cardStyle.subTitle}>
                {item?.phone ? item?.phone : "-"}
              </Text>
            </View>
          </View>
        </View>

        <View style={[cardStyle.j_row, { marginTop: 10 }]}>
          <View style={cardStyle.row}>
            <Ionicons name="person" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>Profile</Text>
          </View>
          <Pressable style={cardStyle.row}>
            <Ionicons name="checkmark-circle" size={14} color={"green"} />
            <Text style={cardStyle.subTitle}>Accept</Text>
          </Pressable>
          <Pressable style={cardStyle.row}>
            <Icon name="times" size={14} color={"red"} />
            <Text style={cardStyle.subTitle}>Reject</Text>
          </Pressable>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderView title={batchItem?.batchName} />
      <View style={[common.container, { marginTop: 5 }]}>
        {studentData && studentData.length > 0 ? (
          <FlatList
            data={studentData}
            style={{ height: "94%" }}
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshLoader}
                onRefresh={() => {
                  setRefreshLoader(true);
                  getStudentsDataByBatchId();
                }}
              />
            }
          />
        ) : (
          <NoDataView />
        )}
      </View>
    </>
  );
};

export default OpenBatchDetails;

const styles = StyleSheet.create({});
