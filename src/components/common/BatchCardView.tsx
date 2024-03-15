import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { cardStyle, common } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";
import useStore from "../../store/useStore";

const BatchCardView = ({
  title = "",
  data = [],
  isOpenEnroll = false,
  onAddModalOpen = () => {},
  height = 150,
}) => {
  const navigation: any = useNavigation();
  const { isModalVisible, setModalVisible }: any = useStore();
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
          <Text style={cardStyle.headTitle}>{item?.batchName}</Text>
          {isOpenEnroll && (
            <Text>{moment(item?.startDate).format("MMM DD, YYYY")}</Text>
          )}
          {!isOpenEnroll && (
            <Icon
              onPress={() =>
                navigation.navigate("AddStudentAttendence", { batchItem: item })
              }
              name="user-check"
              size={16}
              color={YoColors.primary}
            />
          )}
        </View>

        {item?.description && (
          <Text style={{ marginBottom: 10 }} numberOfLines={2}>
            {item?.description}
          </Text>
        )}

        <View style={cardStyle.j_row}>
          <View style={cardStyle.row3}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}> Class {item?.className}</Text>
          </View>
          <View style={cardStyle.row3}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={13} />
            <Text style={common.rText}>
              {" "}
              {moment(item?.tuitionTime, "HH:mm:ss").format("h:mm A")}
            </Text>
          </View>
          <View style={cardStyle.row3}>
            <Icon name="money-bill-wave" size={12} />
            <Text style={common.rText}>
              {" "}
              {item?.fee.replace(".00", "")} / {item?.feeType}
            </Text>
          </View>
        </View>

        <View style={cardStyle.j_row}>
          <View style={cardStyle.row3}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {item?.subjectName}</Text>
          </View>
          <View style={cardStyle.row3}>
            <Icon name="calendar-day" size={12} style={{ marginEnd: 6 }} />
            {!!item?.days &&
              Array.isArray(item.days) &&
              item.days.map((dayItem: any, key: number) => (
                <Text
                  style={[common.rText, { textTransform: "uppercase" }]}
                  key={key}
                >
                  {key !== 0 && "/"}
                  {dayItem}
                </Text>
              ))}
          </View>
          <View style={cardStyle.row3}>
            <Icon name="users" size={13} />
            <Text style={common.rText}> {item?.studentCount}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={[cardStyle.row, { justifyContent: "space-between" }]}>
        {title && <Text style={cardStyle.title}>{title}</Text>}
        {isOpenEnroll && (
          <Pressable style={cardStyle.row} onPress={onAddModalOpen}>
            <MaterialCommunityIcons name="plus" size={14} />
            <Text style={cardStyle.subTitle}>Add</Text>
            {/* <AddBatchModalForm userId={userInfo?.id} /> */}
          </Pressable>
        )}
      </View>

      {data && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          style={{ height: height }}
          showsVerticalScrollIndicator={false}
          windowSize={height}
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

export default BatchCardView;

const styles = StyleSheet.create({});
