import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Card } from "@rneui/base";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const SlideView = ({
  title = "",
  viewTo = "",
  data = [],
  usedStatusId = 0,
  userInfo = {},
  height = 160,
}) => {
  const navigation: any = useNavigation();

  const gotoBatchDetail = (item: any) => {
    if (item?.statusId === 2) {
      navigation.navigate("BatchDetailTab", { batchItem: item });
    }
    if (item?.statusId === 1) {
      navigation.navigate("OpenBatchDetails", { batchItem: item });
    }
  };

  return (
    <View>
      <View style={[common.j_row, common.mtop10]}>
        {title && <Text style={common.title}>{title}</Text>}
        {viewTo && (
          <Button
            title="View All"
            onPress={() => navigation.navigate(viewTo)}
            buttonStyle={[btnStyle.outline]}
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
          />
        )}
      </View>

      <View
        style={{
          height: height,
          marginTop: 6,
        }}
      >
        <Swiper
          dotStyle={[styles.setDots]}
          activeDotStyle={styles.activeDotStyle}
        >
          {data?.map((item: any, index: number) => (
            <Pressable onPress={() => gotoBatchDetail(item)}>
              <Card containerStyle={cardStyle.container} key={index}>
                <View style={[cardStyle.j_row, { margin: 0 }]}>
                  <Text style={cardStyle.headTitle}>{item?.batchName}</Text>

                  {item?.statusId === 1 && (
                    <Text>
                      {moment(item?.startDate).format("MMM DD, YYYY")}
                    </Text>
                  )}

                  {item?.statusId === 2 && userInfo?.type === 1 && (
                    <Pressable
                      onPress={() =>
                        navigation.navigate("AddStudentAttendence", {
                          batchItem: item,
                        })
                      }
                      style={{ padding: 4 }}
                    >
                      <Icon
                        name="user-check"
                        size={16}
                        color={YoColors.primary}
                      />
                    </Pressable>
                  )}
                </View>

                {item?.teacherInformation?.firstName &&
                  userInfo?.type === 3 && (
                    <View style={[cardStyle.row, { marginVertical: 5 }]}>
                      <Icon name="chalkboard-teacher" size={12} />
                      <Text style={common.rText} numberOfLines={1}>
                        {" "}
                        {item?.teacherInformation?.firstName +
                          " " +
                          item?.teacherInformation?.lastName +
                          " " +
                          `(${item?.teacherInformation?.phone})`}
                      </Text>
                    </View>
                  )}

                {item?.description && (
                  <Text style={{ marginBottom: 10 }} numberOfLines={2}>
                    {item?.description}
                  </Text>
                )}

                <View style={cardStyle.j_row}>
                  <View style={cardStyle.row3}>
                    <Icon name="laptop" size={12} />
                    <Text style={common.rText}>{item?.gradeName}</Text>
                  </View>
                  <View style={cardStyle.row3}>
                    <MaterialCommunityIcons
                      name="clock-time-four-outline"
                      size={13}
                    />
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
                    <Icon
                      name="calendar-day"
                      size={12}
                      style={{ marginEnd: 6 }}
                    />
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
                    <Text style={common.rText}>
                      {" "}
                      {item?.studentCount}
                      {usedStatusId === 1 && `/` + item?.actualStudents}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </Swiper>
      </View>
    </View>
  );
};

export default SlideView;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  setDots: {
    top: 20,
    backgroundColor: "#D9D9D9",
  },
  activeDotStyle: {
    top: 20,
    backgroundColor: YoColors.primary,
  },
});
