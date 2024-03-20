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
}) => {
  const navigation: any = useNavigation();

  const gotoBatchDetail = (item: any) => {
    navigation.navigate("AssignmentDetails", { selectedAssignment: item });
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
      <View style={[cardStyle.j_row, { marginBottom: 8 }]}>
        {isOpenEnroll && (
          <>
            <View style={cardStyle.row}>
              <Text style={cardStyle.subTitle}>Assign from my List</Text>
            </View>
            <View style={cardStyle.row}>
              <MaterialCommunityIcons name="plus" size={14} />
              <Text style={cardStyle.subTitle}>Create Assignment</Text>
            </View>
          </>
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
