import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Card } from "@rneui/base";
import moment from "moment";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ConfirmationPopup from "./ConfirmationPopup";
import {
  assignFavouriteBatch,
  assignStudentBatch,
  updateEnrollmentStatus,
  updateFavouriteStatus,
} from "../../apiconfig/SharedApis";
import { useToast } from "react-native-toast-notifications";

const BatchSlideCard = ({
  title = "",
  viewTo = "",
  data = [],
  userInfo = {},
  enroll = false,
  withdraw = false,
  height = 180,
  reloadPage = () => {},
}: any) => {
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const toast: any = useToast();
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [isEnrollModal, setIsEnrollModal] = useState<boolean>(false);
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
          toast.show("Batch shortlisted successfully", {
            type: "success",
            duration: 2000,
          });
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
            <Card
              containerStyle={[cardStyle.container, { paddingBottom: 5 }]}
              key={index}
            >
              <View style={[cardStyle.j_row, { margin: 0 }]}>
                <Text
                  style={[
                    cardStyle.headTitle,
                    {
                      width: item?.statusId === 1 ? "72%" : "80%",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item?.batchName}
                </Text>

                {item?.statusId === 1 && (
                  <Text style={{ width: 90 }}>
                    {moment(item?.startDate).format("MMM DD, YYYY")}
                  </Text>
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
                <Text style={{ marginBottom: 10 }} numberOfLines={1}>
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
                  <Text style={common.rText}> {item?.studentCount}</Text>
                </View>
              </View>

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
                    {item?.enrollmentstatusId !== 0 && (
                      <Text style={[common.rText, { marginEnd: 5 }]}>
                        {item?.enrollmentstatus}
                      </Text>
                    )}

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
                  </View>

                  {enroll && (
                    <Button
                      title={
                        !item?.isFavourite
                          ? "Shortlist"
                          : "Remove from shortlist"
                      }
                      onPress={() =>
                        setFavoriteStatus(item?.id, item?.isFavourite)
                      }
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
          ))}
        </Swiper>
      </View>

      <ConfirmationPopup
        message="Are you sure to want to withdraw your enrollment?"
        onSubmit={studentEnrollmentStatus}
        isVisible={isWithdrawModal}
        setIsVisible={setIsWithdrawModal}
      />

      <ConfirmationPopup
        message="Are you sure to want to enroll in this batch?"
        onSubmit={enrollBatch}
        isVisible={isEnrollModal}
        setIsVisible={setIsEnrollModal}
      />
    </View>
  );
};

export default BatchSlideCard;

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
    backgroundColor: "#124076",
  },
});
