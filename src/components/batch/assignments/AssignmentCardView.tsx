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
import { cardStyle } from "../../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../../assets/themes/YoColors";

const AssignmentCardView = ({
  title = "",
  data = [],
  isOpenEnroll = false,
  role = "Student",
}) => {
  const navigation: any = useNavigation();

  const gotoBatchDetail = (item: any) => {
    if (!isOpenEnroll) {
      navigation.navigate("BatchDetailTab", { batchItem: item });
    }
    if (isOpenEnroll) {
      navigation.navigate("OpenBatchDetails", { batchItem: item });
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => gotoBatchDetail(item)}>
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text
            numberOfLines={2}
            style={[cardStyle.headTitle, { width: "72%" }]}
          >
            {item?.title}
          </Text>
          {isOpenEnroll && (
            <Text style={{ fontSize: 12 }}>
              {moment(item?.createdate).format("MMM DD, YYYY")}
            </Text>
          )}
        </View>

        {item?.description && (
          <Text style={{ marginBottom: 5, fontSize: 12 }} numberOfLines={2}>
            {item?.description}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      <View
        style={[
          cardStyle.row,
          { justifyContent: "space-between", marginBottom: 8 },
        ]}
      >
        <Text style={cardStyle.headTitle}>{title??''}</Text>
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

export default AssignmentCardView;

const styles = StyleSheet.create({});
