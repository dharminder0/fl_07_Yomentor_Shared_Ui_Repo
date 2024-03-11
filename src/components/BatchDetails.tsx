import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { getStudentData } from "../shared/sharedDetails";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/themed";
import { cardStyle, common } from "../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import HeaderView from "./common/HeaderView";
import { YoImages } from "../assets/themes/YoImages";
import { YoColors } from "../assets/themes/YoColors";

const BatchDetails = ({ route }: any) => {
  const batchItem: any = route.params.batchItem;
  const studentData: any = getStudentData();
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
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={YoColors.primary}
              />
            </View>
            <View style={cardStyle.row}>
              <Ionicons
                name="location-sharp"
                size={14}
                color={YoColors.primary}
              />
              <Text style={cardStyle.subTitle}>{item?.address}</Text>
            </View>
            <View style={cardStyle.row}>
              <Icon name="phone-alt" size={13} color={YoColors.primary} />
              <Text style={cardStyle.subTitle}>{item?.phone}</Text>
            </View>
          </View>
        </View>

        <View style={[cardStyle.j_row, { marginTop: 10 }]}>
          <View style={cardStyle.row}>
            <Icon name="history" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>Att. History</Text>
          </View>
          <View style={cardStyle.row}>
            <Ionicons name="person" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>Profile</Text>
          </View>
          <View style={cardStyle.row}>
            <Ionicons name="chatbubble" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>Chat</Text>
          </View>
          <View style={cardStyle.row}>
            <MaterialCommunityIcons
              name="account-group"
              size={16}
              color={YoColors.primary}
            />
            <Text style={cardStyle.subTitle}>Assessments</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderView title={batchItem?.name} />
      <View style={common.container}>
        {studentData && studentData.length > 0 && (
          <FlatList
            data={studentData}
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </>
  );
};

export default BatchDetails;

const styles = StyleSheet.create({});
