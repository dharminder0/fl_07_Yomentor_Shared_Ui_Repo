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
import { btnStyle, cardStyle, common } from "../../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "../../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";

const AssignmentCardView = ({
  data = [],
  userType = 1,
  useForm = (value: any) => {},
  refreshLoader = false,
  setRefreshLoader = (value: any) => {},
  reload = () => {},
  height = 400,
}) => {
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();

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
      <View style={[cardStyle.j_row, { marginBottom: 10 }]}>
        {userType === 1 && (
          <>
            <Button
              title=" Select from favorite list"
              onPress={() => useForm("selectForm")}
              buttonStyle={[btnStyle.outline]}
              titleStyle={[btnStyle.outlineTitle, common.fs12]}
            />

            <Button
              title=" Create new Assignment"
              onPress={() => useForm("addForm")}
              icon={
                <MaterialCommunityIcons
                  name="plus"
                  size={12}
                  color={YoColors.primary}
                />
              }
              buttonStyle={[btnStyle.outline]}
              titleStyle={[btnStyle.outlineTitle, common.fs12]}
            />
          </>
        )}
      </View>

      {data && data.length > 0 && (
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

export default AssignmentCardView;

const styles = StyleSheet.create({});
