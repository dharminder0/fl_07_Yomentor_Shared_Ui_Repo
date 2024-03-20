import {
  FlatList,
  Pressable,
  RefreshControl,
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

const AssesmentCardView = ({
  data = [],
  userType = 1,
  useForm = (value: any) => {},
  refreshLoader = false,
  setRefreshLoader = (value: any) => {},
  reload = () => {},
  height = 400,
}) => {
  const navigation: any = useNavigation();

  const gotoBatchDetail = (item: any) => {
    navigation.navigate("AssesmentDetails", { selectedAssessment: item });
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
          {userType === 1 && (
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
        {userType === 1 && (
          <>
            <View style={cardStyle.row}>
              <Text style={cardStyle.subTitle}>Assign from my List</Text>
            </View>
            <Pressable style={cardStyle.row} onPress={() => useForm("addForm")}>
              <MaterialCommunityIcons name="plus" size={14} />
              <Text style={cardStyle.subTitle}>Create Assessment</Text>
            </Pressable>
          </>
        )}
      </View>

      {data && data?.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          style={{ height: height }}
          windowSize={height}
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

export default AssesmentCardView;

const styles = StyleSheet.create({});
