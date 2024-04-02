import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "./common/HeaderView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { cardStyle, common } from "../assets/styles/Common";
import { AccordionItem, AccordionList } from "react-native-accordion-list-view";
import { YoImages } from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import {
  assignFavouriteBatch,
  assignStudentBatch,
  getBatchListbyEntity,
  getBatchListbyUserid,
  getUsersDetails,
  updateEnrollmentStatus,
  updateFavouriteStatus,
} from "../apiconfig/SharedApis";
import { getUserInfo } from "../shared/sharedDetails";
import BatchCardView from "./common/BatchCardView";
import ProfileBatchCard from "./common/ProfileBatchCard";
import { useThemeColor } from "../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import moment from "moment";
import { Card } from "@rneui/base";
import Loading from "../screens/Loading";
import ConfirmationPopup from "./common/ConfirmationPopup";
import { useToast } from "react-native-toast-notifications";

const UserDetails = ({ route }: { route: any }) => {
  const { height } = Dimensions.get("window");
  const userId: any = route.params.userId;
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const toast: any = useToast();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState<any>([]);
  const [userDetailList, setUserDetailList] = useState<any>({});

  const [isEnrollModal, setIsEnrollModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number>();

  useEffect(() => {
    setIsLoading(true);
    getBatchesListbyEntity();
    getUserDetail();
  }, [userInfo?.id]);

  const getUserDetail = () => {
    setUserDetailList({});
    getUsersDetails(userId, 1)
      .then((response: any) => {
        if (response?.data) {
          setUserDetailList(response?.data);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const getBatchesListbyEntity = () => {
    const payload: any = {
      teacherId: userId,
      studentId: userInfo?.id,
      statusId: [1],
      pageSize: 10,
      pageIndex: 1,
      isFavourite: true,
    };
    setOpenBatchList([]);
    getBatchListbyEntity(payload)
      .then((response: any) => {
        setIsLoading(true);
        if (response?.data && response?.data?.length) {
          setOpenBatchList(response?.data);
        }
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 1000);
      })
      .catch((error: any) => {
        console.log(error);
      });
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
          getBatchesListbyEntity();
        }
      });
    } else {
      updateFavouriteStatus(userInfo?.id, batchId)
        .then((response: any) => {
          if (response.data && response.data.response) {
            getBatchesListbyEntity();
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

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
            getBatchesListbyEntity();
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
    <>
      <HeaderView title="Teacher Details" />
      <ScrollView
        style={[common.px12]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoader}
            onRefresh={() => {
              setIsLoading(true);
              getBatchesListbyEntity();
              getUserDetail();
            }}
          />
        }
      >
        {isLoading ? (
          <View style={{ height: height - 65 }}>
            <Loading />
          </View>
        ) : (
          <>
            <View style={[cardStyle.row, common.mtop10]}>
              {userDetailList?.image ? (
                <Image
                  source={{ uri: userDetailList?.image }}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 40,
                  }}
                />
              ) : (
                <Image
                  source={image.DefaultUser}
                  style={{
                    width: 75,
                    height: 75,
                    borderRadius: 40,
                  }}
                />
              )}
              <View
                style={{
                  width: "79%",
                  paddingHorizontal: 10,
                }}
              >
                <View style={[cardStyle.j_row]}>
                  <Text style={[common.h3Title]}>
                    {userDetailList?.firstname + " " + userDetailList?.lastname}
                  </Text>

                  {userDetailList?.averageRating > 0 && (
                    <Pressable
                      style={[cardStyle.row]}
                      onPress={() =>
                        navigation.navigate("Reviews", {
                          teacherId: userDetailList?.id,
                        })
                      }
                    >
                      {userDetailList?.averageRating > 0 && (
                        <Text style={common.rText}>
                          {Array.from(
                            Array(userDetailList?.averageRating).keys()
                          )?.map((key: number) => (
                            <MaterialCommunityIcons
                              name="star"
                              size={12}
                              color={YoColors.star}
                              key={key}
                            />
                          ))}{" "}
                          ({userDetailList?.reviewCount})
                        </Text>
                      )}
                    </Pressable>
                  )}
                </View>

                {userDetailList?.education && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="user-graduate" size={12} />
                    <Text style={common.rText} numberOfLines={2}>
                      {" "}
                      {userDetailList?.education}
                    </Text>
                  </View>
                )}

                {userDetailList?.experience && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="info-circle" size={12} />
                    <Text style={common.rText} numberOfLines={2}>
                      {" "}
                      {userDetailList?.experience + " years of experience"}
                    </Text>
                  </View>
                )}

                {userDetailList?.phone && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <MaterialCommunityIcons name="phone" size={12} />
                    <Text style={common.rText}> {userDetailList?.phone}</Text>
                    {userDetailList?.gender && (
                      <>
                        <MaterialCommunityIcons name="phone" size={12} />
                        <Text style={common.rText}>
                          {" "}
                          {userDetailList?.gender}
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            </View>
            <View style={common.my10}>
              {userDetailList?.about && (
                <Text style={[common.rText, { textAlign: "justify" }]}>
                  {userDetailList?.about}
                </Text>
              )}

              {userDetailList?.address && (
                <View style={[common.mtop10, common.row]}>
                  <Ionicons name="location-sharp" size={12} />
                  <Text style={[common.rText]} numberOfLines={2}>
                    {" "}
                    {userDetailList?.address}
                  </Text>
                </View>
              )}
            </View>
            <View style={common.mtop10}>
              <Text style={common.title}>Batches Open for Enrollment</Text>
              <View style={[common.mtop10]}>
                {openBatchList && openBatchList?.length > 0 ? (
                  openBatchList.map((item: any, index: number) => (
                    <Card
                      containerStyle={[
                        cardStyle.container,
                        { paddingBottom: 5 },
                      ]}
                      key={index}
                    >
                      <View style={[cardStyle.j_row, { margin: 0 }]}>
                        <Text style={cardStyle.headTitle}>
                          {item?.batchName}
                        </Text>

                        {item?.statusId === 1 && (
                          <Text>
                            {moment(item?.startDate).format("MMM DD, YYYY")}
                          </Text>
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
                          <Text style={common.rText}>{item?.gradeName}</Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <MaterialCommunityIcons
                            name="clock-time-four-outline"
                            size={13}
                          />
                          <Text style={common.rText}>
                            {" "}
                            {moment(item?.tuitionTime, "HH:mm:ss").format(
                              "h:mm A"
                            )}
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
                                style={[
                                  common.rText,
                                  { textTransform: "uppercase" },
                                ]}
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
                          </Text>
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
                                name={
                                  item?.isFavourite ? "heart" : "heart-outline"
                                }
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
                    </Card>
                  ))
                ) : (
                  <View
                    style={{ height: height / 3, justifyContent: "center" }}
                  >
                    <Text style={[common.title, { textAlign: "center" }]}>
                      Sorry, there is no batch for Enrollment
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

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
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({});
