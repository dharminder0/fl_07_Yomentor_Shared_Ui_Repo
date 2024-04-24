import {
  Dimensions,
  Image,
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
import { YoImages } from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import {
  assignFavouriteBatch,
  assignStudentBatch,
  getBatchListbyEntity,
  getUsersDetails,
  updateEnrollmentStatus,
  updateFavouriteStatus,
} from "../apiconfig/SharedApis";
import { getUserInfo } from "../shared/sharedDetails";
import { useThemeColor } from "../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import moment from "moment";
import { Card } from "@rneui/base";
import Loading from "../screens/Loading";
import ConfirmationPopup from "./common/ConfirmationPopup";
import { useToast } from "react-native-toast-notifications";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const UserDetailList = ({ route }: { route: any }) => {
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
  const [ongoingBatchList, setOngoingBatchList] = useState<any>([]);
  const [userDetailList, setUserDetailList] = useState<any>({});

  const [isEnrollModal, setIsEnrollModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const [selectedBatchId, setSelectedBatchId] = useState<number>();

  useEffect(() => {
    setIsLoading(true);
    getBatchesListbyEntity(1);
    getBatchesListbyEntity(2);
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

  const getBatchesListbyEntity = (statusId: number) => {
    const payload: any = {
      teacherId: userId,
      studentId: userInfo?.id,
      statusId: [statusId],
      pageSize: 10,
      pageIndex: 1,
      isFavourite: true,
    };
    setOpenBatchList([]);
    setOngoingBatchList([]);
    getBatchListbyEntity(payload)
      .then((response: any) => {
        setIsLoading(true);
        if (response?.data && response?.data?.length) {
          if (statusId === 1) {
            setOpenBatchList(response?.data);
          }
          if (statusId === 2) {
            setOngoingBatchList(response?.data);
          }
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
          toast.show("Batch shortlisted successfully", {
            type: "success",
            duration: 2000,
          });
          getBatchesListbyEntity(1);
        }
      });
    } else {
      updateFavouriteStatus(userInfo?.id, batchId)
        .then((response: any) => {
          if (response.data && response.data.response) {
            getBatchesListbyEntity(1);
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
            getBatchesListbyEntity(1);
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
            getBatchesListbyEntity(1);
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
              getBatchesListbyEntity(1);
              getBatchesListbyEntity(2);
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
                    {userDetailList?.firstName + " " + userDetailList?.lastName}
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

                {userDetailList?.teacherProfile?.education && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon
                      name="user-graduate"
                      size={12}
                      style={{ marginEnd: 3 }}
                      color={YoColors.textTheme}
                    />
                    <Text
                      style={[common.rText, { textAlign: "justify" }]}
                      numberOfLines={2}
                    >
                      {" "}
                      {userDetailList?.teacherProfile?.education}
                    </Text>
                  </View>
                )}

                {userDetailList?.teacherProfile?.experience && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <FontAwesome5
                      name="chalkboard-teacher"
                      size={12}
                      style={{ marginTop: 3 }}
                      color={YoColors.textTheme}
                    />
                    <Text style={common.rText} numberOfLines={2}>
                      {" "}
                      {userDetailList?.teacherProfile?.experience +
                        " years of experience"}
                    </Text>
                  </View>
                )}

                {userDetailList?.phone && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <MaterialCommunityIcons
                      name="phone"
                      size={12}
                      color={YoColors.textTheme}
                    />
                    <Text style={common.rText}> {userDetailList?.phone}</Text>
                  </View>
                )}

                {userDetailList?.gender && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <FontAwesome5
                      name="transgender"
                      size={14}
                      color={YoColors.textTheme}
                      style={{ marginTop: 3 }}
                    />
                    <Text style={common.rText}> {userDetailList?.gender}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={common.my10}>
              {userDetailList?.teacherProfile?.about && (
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                  }}
                >
                  <Icon
                    name="info-circle"
                    size={12}
                    style={{ marginTop: 2 }}
                    color={YoColors.textTheme}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: "95%",
                      marginLeft: 2,
                    }}
                  >
                    <Text style={common.rText}>
                      {" "}
                      {userDetailList?.teacherProfile?.about}
                    </Text>
                  </View>
                </View>
              )}
              {(userDetailList?.userAddress?.address1 ||
                userDetailList?.userAddress?.address2) && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Ionicons
                    name="location"
                    size={14}
                    color={YoColors.textTheme}
                    style={{ marginTop: 3 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: "95%",
                    }}
                  >
                    {userDetailList?.userAddress?.address1 && (
                      <Text style={{ paddingStart: 5 }}>
                        {userDetailList?.userAddress?.address1}
                      </Text>
                    )}
                    {userDetailList?.userAddress?.address1 &&
                      userDetailList?.userAddress?.address2 && <Text>, </Text>}
                    {userDetailList?.userAddress?.address2 && (
                      <Text>{userDetailList?.userAddress?.address2}</Text>
                    )}
                    {userDetailList?.userAddress?.address2 &&
                      userDetailList?.userAddress?.city && <Text>, </Text>}
                    {userDetailList?.userAddress?.city && (
                      <Text>{userDetailList?.userAddress?.city}</Text>
                    )}
                    {userDetailList?.userAddress?.city &&
                      userDetailList?.userAddress?.stateName && <Text>, </Text>}
                    {userDetailList?.userAddress?.stateName && (
                      <Text>{userDetailList?.userAddress?.stateName}</Text>
                    )}
                    {userDetailList?.userAddress?.stateName &&
                      userDetailList?.userAddress?.pincode && <Text>, </Text>}
                    {userDetailList?.userAddress?.pincode && (
                      <Text>{userDetailList?.userAddress?.pincode}</Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {openBatchList && openBatchList?.length > 0 && (
              <View style={common.mtop10}>
                <Text style={common.title}>Batches Open for Enrollment</Text>
                <View style={[common.mtop10]}>
                  {openBatchList.map((item: any, index: number) => (
                    <Card
                      containerStyle={[
                        cardStyle.container,
                        {
                          paddingBottom: 5,
                          backgroundColor: YoColors.background,
                        },
                      ]}
                      key={index}
                    >
                      <View style={[cardStyle.j_row, { margin: 0 }]}>
                        <Text
                          style={[cardStyle.headTitle, { width: "72%" }]}
                          numberOfLines={2}
                        >
                          {item?.batchName}
                        </Text>

                        {item?.statusId === 1 && (
                          <Text style={{ width: 90 }}>
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
                          <Icon name="laptop" size={12} color={YoColors.icon} />
                          <Text style={common.rText}>{item?.gradeName}</Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <MaterialCommunityIcons
                            name="clock-time-four-outline"
                            size={13}
                            color={YoColors.icon}
                          />
                          <Text style={common.rText}>
                            {" "}
                            {moment(item?.tuitionTime, "HH:mm:ss").format(
                              "h:mm A"
                            )}
                          </Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <Icon
                            name="money-bill-wave"
                            size={12}
                            color={YoColors.icon}
                          />
                          <Text style={common.rText}>
                            {" "}
                            {item?.fee.replace(".00", "")} / {item?.feeType}
                          </Text>
                        </View>
                      </View>

                      <View style={cardStyle.j_row}>
                        <View style={cardStyle.row3}>
                          <Icon name="book" size={12} color={YoColors.icon} />
                          <Text style={common.rText}> {item?.subjectName}</Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <Icon
                            name="calendar-day"
                            size={12}
                            color={YoColors.icon}
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
                          <Icon name="users" size={13} color={YoColors.icon} />
                          <Text style={common.rText}>
                            {" "}
                            {item?.actualStudents + `/` + item?.studentCount}
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
                                titleStyle={[
                                  common.rText,
                                  { color: YoColors.white },
                                ]}
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
                  ))}

                  {/* <View style={{ justifyContent: "center" }}>
                    <Text style={[common.rText, { textAlign: "center" }]}>
                      Sorry, there is no batch for Enrollment
                    </Text>
                  </View> */}
                </View>
              </View>
            )}

            {ongoingBatchList && ongoingBatchList?.length > 0 && (
              <View style={common.mtop10}>
                <Text style={common.title}>Ongoing Batches</Text>
                <View style={[common.mtop10]}>
                  {ongoingBatchList.map((item: any, index: number) => (
                    <Card
                      containerStyle={[
                        cardStyle.container,
                        {
                          paddingBottom: 5,
                          backgroundColor: YoColors.background,
                        },
                      ]}
                      key={index}
                    >
                      <View style={[cardStyle.j_row, { margin: 0 }]}>
                        <Text
                          style={[cardStyle.headTitle, { width: "72%" }]}
                          numberOfLines={2}
                        >
                          {item?.batchName}
                        </Text>

                        {item?.statusId === 1 && (
                          <Text style={{ width: 90 }}>
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
                          <Icon name="laptop" size={12} color={YoColors.icon} />
                          <Text style={common.rText}>{item?.gradeName}</Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <MaterialCommunityIcons
                            name="clock-time-four-outline"
                            size={13}
                            color={YoColors.icon}
                          />
                          <Text style={common.rText}>
                            {" "}
                            {moment(item?.tuitionTime, "HH:mm:ss").format(
                              "h:mm A"
                            )}
                          </Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <Icon
                            name="money-bill-wave"
                            size={12}
                            color={YoColors.icon}
                          />
                          <Text style={common.rText}>
                            {" "}
                            {item?.fee.replace(".00", "")} / {item?.feeType}
                          </Text>
                        </View>
                      </View>

                      <View style={cardStyle.j_row}>
                        <View style={cardStyle.row3}>
                          <Icon name="book" size={12} color={YoColors.icon} />
                          <Text style={common.rText}> {item?.subjectName}</Text>
                        </View>
                        <View style={cardStyle.row3}>
                          <Icon
                            name="calendar-day"
                            size={12}
                            style={{ marginEnd: 6 }}
                            color={YoColors.icon}
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
                          <Icon name="users" size={13} color={YoColors.icon} />
                          <Text style={common.rText}>
                            {" "}
                            {item?.studentCount}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  ))}
                </View>
              </View>
            )}
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

export default UserDetailList;

const styles = StyleSheet.create({});
