import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { cardStyle } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";

const BatchCardView = ({
  title = "",
  data = [],
  isOpenEnroll = false,
  role = "Student",
}) => {
  const navigation: any = useNavigation();

  const gotoBatchDetail = (item: any) => {
    if (!isOpenEnroll) {
      navigation.navigate("BatchDetail", { batchItem: item });
    }
    if (isOpenEnroll) {
      navigation.navigate("OpenBatchDetails", { batchItem: item });
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => gotoBatchDetail(item)}>
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text style={cardStyle.headTitle}>{item?.name}</Text>
          {isOpenEnroll && (
            <Text>{moment(item?.startdate).format("MMM DD, YYYY")}</Text>
          )}
        </View>

        {item?.classDescription && (
          <Text style={{ marginBottom: 5 }} numberOfLines={2}>
            {item?.classDescription}
          </Text>
        )}

        <View style={cardStyle.j_row}>
          <View style={cardStyle.row3}>
            <Icon name="laptop" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>{item?.className}</Text>
          </View>
          <View style={cardStyle.row3}>
            <MaterialCommunityIcons
              name="clock-time-four-outline"
              size={16}
              color={YoColors.primary}
            />
            <Text style={cardStyle.subTitle}>
              {moment(item?.tuitiontime, "HH:mm:ss").format("h:mm A")}
            </Text>
          </View>
          <View style={cardStyle.row3}>
            <Icon name="money-bill-wave" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>{item?.rate}</Text>
          </View>
        </View>

        <View style={cardStyle.j_row}>
          <View style={cardStyle.row3}>
            <Icon name="book" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>{item?.subjectName}</Text>
          </View>
          <View style={cardStyle.row3}>
            <Icon name="calendar-day" size={14} color={YoColors.primary} />
            <Text style={cardStyle.subTitle}>{item?.days}</Text>
          </View>
          <View style={cardStyle.row3}>
            <MaterialCommunityIcons
              name="history"
              size={16}
              color={YoColors.primary}
            />
            <Text style={cardStyle.subTitle}>{item?.expectedstudentcount}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={[cardStyle.row, { justifyContent: "space-between" }]}>
        <Text style={cardStyle.title}>{title}</Text>
        {isOpenEnroll && (
          <View style={cardStyle.row}>
            <MaterialCommunityIcons name="plus" size={14} />
            <Text style={cardStyle.subTitle}>Add</Text>
          </View>
        )}
      </View>

      {data && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default BatchCardView;

const styles = StyleSheet.create({});
