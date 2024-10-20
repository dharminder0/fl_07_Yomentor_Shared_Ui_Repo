import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import useStore from "../../store/useStore";
import { getUserInfo } from "../../shared/sharedDetails";
import { Button } from "react-native-elements";

const BatchCardView = ({
  title = "",
  data = [],
  onAddModalOpen = () => {},
  height = 150,
  usedStatusId = 0,
  refreshLoader = false,
  setRefreshLoader = (value: any) => {},
  reloadPage = () => {},
}) => {
  const navigation: any = useNavigation();
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();

  const gotoBatchDetail = (item: any) => {
    if (item?.statusId === 2) {
      navigation.navigate("BatchDetailTab", { batchItem: item });
    }
    if (item?.statusId === 1) {
      navigation.navigate("OpenBatchDetails", { batchItem: item });
    }
  };

  const renderItem = ({ item, index }: any) => (
    <Pressable onPress={() => gotoBatchDetail(item)}>
      <Card
        containerStyle={[
          cardStyle.container,
          {
            backgroundColor: YoColors.background,
          },
        ]}
        key={index}
      >
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text
            style={[cardStyle.headTitle, { width: "83%" }]}
            numberOfLines={1}
          >
            {item?.batchName}
          </Text>

          {item?.statusId === 1 && (
            <Text>{moment(item?.startDate).format("MMM DD, YYYY")}</Text>
          )}

          {item?.statusId === 2 && userInfo?.type === 1 && (
            <Pressable
              onPress={() =>
                navigation.navigate("AddStudentAttendence", { batchItem: item })
              }
              style={[common.row, { paddingHorizontal: 5 }]}
            >
              <Icon name="user-check" size={12} color={YoColors.primary} />
              <Text style={{ color: YoColors.textTheme }}> Att. </Text>
            </Pressable>
          )}
        </View>

        {item?.teacherInformation?.firstName && userInfo?.type === 3 && (
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
            <Text style={common.rText}>
              {" "}
              {item?.actualStudents}
              {usedStatusId === 1 && `/` + item?.studentCount}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View>
      <View style={[cardStyle.row, { justifyContent: "space-between" }]}>
        {title && <Text style={cardStyle.title1}>{title}</Text>}
        {userInfo?.type === 1 && usedStatusId === 1 && data.length > 0 && (
          <>
            <Button
              title=" Create New Batch"
              onPress={onAddModalOpen}
              icon={
                <MaterialCommunityIcons
                  name="plus"
                  size={12}
                  color={YoColors.primary}
                />
              }
              buttonStyle={[btnStyle.outline]}
              containerStyle={common.mb10}
              titleStyle={[btnStyle.outlineTitle, common.fs12]}
            />
          </>
        )}
      </View>

      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          style={{ height: height }}
          showsVerticalScrollIndicator={false}
          windowSize={height}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoader}
              onRefresh={() => {
                setRefreshLoader(true);
                reloadPage();
              }}
            />
          }
        />
      ) : (
        <View
          style={[
            common.container,
            { alignItems: "center", justifyContent: "center", height: "90%" },
          ]}
        >
          {usedStatusId === 1 && userInfo?.type === 1 && (
            <>
              <Text style={{ textAlign: "center", color: YoColors.textTheme }}>
                You don't have any batch open for enrollment. Create a new batch
                and share details with students to enroll.
              </Text>
              <Button
                title="Create New Batch"
                onPress={onAddModalOpen}
                buttonStyle={[btnStyle.outline, common.px12]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
                containerStyle={common.mtop10}
              />
            </>
          )}

          {usedStatusId === 2 && userInfo?.type === 1 && (
            <>
              <Text style={{ textAlign: "center", color: YoColors.textTheme }}>
                You don't have any ongoing batch. Create a new batch and share
                details with students to enroll.
              </Text>
              <Button
                title="Create New Batch"
                onPress={onAddModalOpen}
                buttonStyle={[btnStyle.outline, common.px12]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
                containerStyle={common.mtop10}
              />
            </>
          )}

          {usedStatusId === 1 && userInfo?.type === 3 && (
            <Text style={{ textAlign: "center", color: YoColors.textTheme }}>
              You don't have any opening batch for Enrollment
            </Text>
          )}

          {userInfo?.type === 3 && usedStatusId == 2 && (
            <>
              <Text style={{ textAlign: "center", color: YoColors.textTheme }}>
                Sorry, you do not have any ongoing batches. Search for a teacher
                and enroll yourself.
              </Text>
              <Button
                title="Find Teacher"
                onPress={() => navigation.navigate("TeachersList")}
                buttonStyle={[btnStyle.outline, common.px12]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
                containerStyle={common.mtop10}
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default BatchCardView;

const styles = StyleSheet.create({});
