import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";

const CardAssignment = ({
  data = [],
  reload = () => {},
  setRefreshLoader = (value: any) => {},
  refreshLoader = false,
}) => {
  const { height } = Dimensions.get("window");
  const navigation: any = useNavigation();

  const gotoAssignmentDetail = (item: any) => {
    navigation.navigate("AssignmentDetails", { selectedAssignment: item });
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => gotoAssignmentDetail(item)}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text numberOfLines={2} style={[common.title, { width: "72%" }]}>
            {item?.title}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {moment(item?.createdate).format("MMM DD, YYYY")}
          </Text>
        </View>

        {item?.description && (
          <Text style={{ marginBottom: 5, fontSize: 12 }} numberOfLines={2}>
            {item?.description}
          </Text>
        )}

        <View style={[cardStyle.row, { margin: 0 }]}>
          <View style={[cardStyle.row, { marginEnd: 15 }]}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}> {item?.gradeName}</Text>
          </View>
          <View style={[cardStyle.row, { marginEnd: 15 }]}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {item?.subjectName}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[cardStyle.row, { marginTop: 10 }]}>
      {data && data.length > 0 && (
        <FlatList
          data={data}
          style={{ height: height - 70 }}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoader}
              onRefresh={() => {
                setRefreshLoader(true);
                reload();
              }}
            />
          }
        />
      )}
    </View>
  );
};

export default CardAssignment;

const styles = StyleSheet.create({});
