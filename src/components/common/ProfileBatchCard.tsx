import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Card } from "@rneui/themed";
import Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { cardStyle, common } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";
import { getUserInfo } from "../../shared/sharedDetails";
import { Button } from "react-native-elements";
import Loading from "../../screens/Loading";
import {
  assignFavouriteBatch,
  assignStudentBatch,
  updateEnrollmentStatus,
  updateFavouriteStatus,
} from "../../apiconfig/SharedApis";
import { useToast } from "react-native-toast-notifications";
import ConfirmationPopup from "./ConfirmationPopup";

const ProfileBatchCard = ({
  data = [],
  onAddModalOpen = () => {},
  height = 150,
  isLoading = false,
  refreshLoader = false,
  setRefreshLoader = (value: any) => {},
  reloadPage = () => {},
  intrested = false,
  usedStatusId = 1,
  withdraw = false,
}) => {
  const navigation: any = useNavigation();
  const userInfo: any = getUserInfo();
  const toast: any = useToast();
  const [isEnrollModal, setIsEnrollModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number>();

  const enrollBatch = () => {
    const payload: any = {
      student_Info: [
        {
          studentId: userInfo?.id,
          status: 1,
        },
      ],
      batchId: selectedBatchId,
    };
    if (selectedBatchId) {
      assignStudentBatch(payload)
        .then((response: any) => {
          if (response.data && response.data.response) {
            setIsEnrollModal(false);
            toast.show("Enroll Request Send", {
              type: "success",
              duration: 2000,
            });
          }
        })
        .catch((error: any) => {
          setIsEnrollModal(false);
          toast.show("Error in Enroll", {
            type: "danger",
            duration: 2000,
          });
        });
    }
  };

  const setFavoriteStatus = (batchId: number, useFor: boolean) => {
    if (!useFor) {
      const payload: any = {
        userId: userInfo?.id,
        isFavourite: true,
        entityTypeId: batchId,
        entityType: 1,
      };
      assignFavouriteBatch(payload).then((response: any) => {
        if (response.data && response.data.response) {
          reloadPage();
        }
      });
    } else {
      updateFavouriteStatus(userInfo?.id, batchId)
        .then((response: any) => {
          if (response.data && response.data.response) {
            reloadPage();
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  const studentEnrollmentStatus = () => {
    if (selectedBatchId) {
      updateEnrollmentStatus(4, userInfo?.id, selectedBatchId)
        .then((response: any) => {
          if (response.data && response.data.response) {
            setIsWithdrawModal(false);
            toast.show("Withdrawn Sucess", {
              type: "success",
              duration: 2000,
            });
            reloadPage();
          }
        })
        .catch((error: any) => {
          setIsWithdrawModal(false);
          toast.show("Something went wrong...", {
            type: "danger",
            duration: 2000,
          });
        });
    }
  };

  const renderItem = ({ item, index }: any) => (
    <Card
      containerStyle={[cardStyle.container, { paddingBottom: 5 }]}
      key={index}
    >
      <View style={[cardStyle.j_row, { margin: 0 }]}>
        <Text style={cardStyle.headTitle}>{item?.batchName}</Text>

        {item?.statusId === 1 && (
          <Text>{moment(item?.startDate).format("MMM DD, YYYY")}</Text>
        )}
      </View>

      {item?.teacherInformation?.firstName && userInfo?.type === 3 && (
        <Pressable
          style={[cardStyle.row, { marginVertical: 5 }]}
          onPress={() =>
            navigation.navigate("UserDetails", {
              userId: item?.teacherInformation?.id,
            })
          }
        >
          <Icon name="chalkboard-teacher" size={12} />
          <Text style={common.rText} numberOfLines={1}>
            {" "}
            {item?.teacherInformation?.firstName +
              " " +
              item?.teacherInformation?.lastName +
              " " +
              `(${item?.teacherInformation?.phone.trim()})`}
          </Text>
        </Pressable>
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
          <Text style={common.rText}> {item?.studentCount}</Text>
        </View>
      </View>

      {/* {intrested && item?.statusId === 1 && userInfo?.type === 3 && (
        <View
          style={[
            common.j_row,
            {
              borderTopWidth: 0.6,
              borderTopColor: "#dadada",
              paddingTop: 8,
              marginTop: 8,
            },
          ]}
        >
          {item?.enrollmentstatusId === 0 && (
            <Button
              title="Enroll Now"
              onPress={() => {
                setIsEnrollModal(true);
                setSelectedBatchId(item?.id);
              }}
              buttonStyle={{
                backgroundColor: YoColors.primary,
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
              containerStyle={{ padding: 0 }}
              titleStyle={common.rText}
            />
          )}

          {item?.enrollmentstatusId === 1 && (
            <Text style={common.rText}>{item?.enrollmentstatus}</Text>
          )}

          <Button
            title={!item?.isFavourite ? "Shortlist" : "Remove from shortlist"}
            onPress={() => setFavoriteStatus(item?.id, item?.isFavourite)}
            buttonStyle={{
              backgroundColor: "none",
              paddingHorizontal: 7,
              paddingVertical: 3,
            }}
            icon={
              <MaterialCommunityIcons
                name={item?.isFavourite ? "heart" : "heart-outline"}
                size={14}
                color={YoColors.primary}
              />
            }
            containerStyle={{ padding: 0 }}
            titleStyle={[
              common.rText,
              { color: YoColors.text, fontWeight: "500" },
            ]}
          />
        </View>
      )}
      {withdraw && userInfo?.type === 3 && (
        <View
          style={[
            common.j_row,
            {
              borderTopWidth: 0.6,
              borderTopColor: "#dadada",
              paddingTop: 8,
              marginTop: 8,
            },
          ]}
        >
          <View style={common.row}>
            {(item?.enrollmentstatusId === 1 ||
              item?.enrollmentstatusId === 2) && (
              <Button
                title="Withdraw Enrollment"
                onPress={() => {
                  setIsWithdrawModal(true);
                  setSelectedBatchId(item?.id);
                }}
                buttonStyle={{
                  backgroundColor: YoColors.white,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderWidth: 0.7,
                  borderColor: YoColors.primary,
                }}
                containerStyle={{ padding: 0 }}
                titleStyle={[
                  common.rText,
                  { color: YoColors.primary, fontWeight: "400" },
                ]}
              />
            )}
            <Text style={[common.rText, common.px12]}>
              {item?.enrollmentstatus}
            </Text>
          </View>
        </View>
      )} */}

      {item?.statusId === 1 && userInfo?.type === 3 && (
        <View
          style={[
            common.j_row,
            {
              borderTopWidth: 0.6,
              borderTopColor: "#dadada",
              paddingTop: 8,
              marginTop: 8,
            },
          ]}
        >
          <View style={common.row}>
            {item?.enrollmentstatusId === 0 && (
              <Button
                title="Enroll Now"
                onPress={() => {
                  setIsEnrollModal(true);
                  setSelectedBatchId(item?.id);
                }}
                buttonStyle={{
                  backgroundColor: YoColors.primary,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                }}
                containerStyle={{ padding: 0 }}
                titleStyle={common.rText}
              />
            )}

            {(item?.enrollmentstatusId === 1 ||
              item?.enrollmentstatusId === 2) && (
              <Button
                title="Withdraw Enrollment"
                onPress={() => {
                  setIsWithdrawModal(true);
                  setSelectedBatchId(item?.id);
                }}
                buttonStyle={{
                  backgroundColor: YoColors.white,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderWidth: 0.7,
                  borderColor: YoColors.primary,
                }}
                containerStyle={{ padding: 0 }}
                titleStyle={[
                  common.rText,
                  {
                    color: YoColors.primary,
                    fontWeight: "400",
                  },
                ]}
              />
            )}

            {item?.enrollmentstatusId !== 0 && (
              <Text style={[common.rText, common.px12]}>
                {item?.enrollmentstatus}
              </Text>
            )}
          </View>

          {intrested && (
            <Button
              title={!item?.isFavourite ? "Shortlist" : "Remove from shortlist"}
              onPress={() => setFavoriteStatus(item?.id, item?.isFavourite)}
              buttonStyle={{
                backgroundColor: "none",
                paddingHorizontal: 7,
                paddingVertical: 3,
              }}
              icon={
                <MaterialCommunityIcons
                  name={item?.isFavourite ? "heart" : "heart-outline"}
                  size={14}
                  color={YoColors.primary}
                />
              }
              containerStyle={{ padding: 0 }}
              titleStyle={[
                common.rText,
                { color: YoColors.text, fontWeight: "500" },
              ]}
            />
          )}
        </View>
      )}
    </Card>
  );

  return (
    <View>
      {isLoading && (
        <View style={{ height: height }}>
          <Loading />
        </View>
      )}
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
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "85%",
          }}
        >
          {userInfo?.type === 3 && usedStatusId === 1 && (
            <>
              <Text style={[common.h3Title, { textAlign: "center" }]}>
                Sorry, you do not have any shortlisted batches. Search for a
                teacher and enroll yourself.
              </Text>
              <Button
                title="Find Teacher"
                onPress={() => navigation.navigate("TeachersList")}
                buttonStyle={{
                  backgroundColor: YoColors.primary,
                  marginTop: 20,
                }}
                titleStyle={{ fontWeight: "600" }}
                containerStyle={{ width: "50%" }}
              />
            </>
          )}

          {userInfo?.type === 3 && usedStatusId == 2 && (
            <>
              <Text style={[common.h3Title, { textAlign: "center" }]}>
                Sorry, you do not have any ongoing batches. Search for a teacher
                and enroll yourself.
              </Text>
              <Button
                title="Find Teacher"
                onPress={() => navigation.navigate("TeachersList")}
                buttonStyle={{
                  backgroundColor: YoColors.primary,
                  marginTop: 20,
                }}
                titleStyle={{ fontWeight: "600" }}
                containerStyle={{ width: "50%" }}
              />
            </>
          )}

          {userInfo?.type === 3 && usedStatusId === 0 && (
            <Text style={[common.h3Title, { textAlign: "center" }]}>
              Sorry, there is no batch for Enrollment
            </Text>
          )}
        </View>
      )}

      <ConfirmationPopup
        message="Are you sure to want to enroll in this batch?"
        onSubmit={enrollBatch}
        isVisible={isEnrollModal}
        setIsVisible={setIsEnrollModal}
      />

      <ConfirmationPopup
        message="Are you sure to want to withdraw your enrollment?"
        onSubmit={studentEnrollmentStatus}
        isVisible={isWithdrawModal}
        setIsVisible={setIsWithdrawModal}
      />
    </View>
  );
};

export default ProfileBatchCard;

const styles = StyleSheet.create({});
