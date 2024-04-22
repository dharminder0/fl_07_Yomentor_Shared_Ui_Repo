import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "@rneui/themed";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import HeaderView from "../common/HeaderView";
import moment from "moment";
import {
  deleteBookById,
  getBookDetailsById,
  updateBookStatus,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { Button, Image } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { YoImages } from "../../assets/themes/YoImages";
import CreateBookRequest from "./CreateBookRequest";
import UpdatePhoto from "../common/UpdatePhoto";
import { useToast } from "react-native-toast-notifications";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const OffersBookDetails = ({ route }: any) => {
  const { height, width } = Dimensions.get("window");
  const image: any = YoImages();
  const toast = useToast();
  const navigation: any = useNavigation();
  const selectedBookDetails = route?.params?.selectedBookDetails ?? {};
  const [bookDetails, setBookDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteModalVissible, setIsDeleteModalVissible] =
    useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const [isLoadingAccept, setIsLoadingAccept] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    setIsLoading(true);
    const paylaod: any = {
      id: selectedBookDetails.id,
      type: 2,
    };
    getBookDetailsById(paylaod)
      .then((response: any) => {
        setBookDetails({});
        if (response.data && Object.keys(response.data)) {
          setBookDetails(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching book details: ", error);
      });
  };

  const onCloseUpdate = (isSubmitted: boolean) => {
    setModalVisible(false);
    if (isSubmitted) {
      getDetails();
    }
  };

  const updateInfo = (isUpdated: boolean) => {
    if (isUpdated) {
      getDetails();
    }
  };

  const handleBookDelete = () => {
    deleteBookById(selectedBookDetails.id)
      .then((response: any) => {
        setIsDeleteModalVissible(false);
        if (response) {
          toast.show("The book has been deleted successfully", {
            type: "success",
            duration: 2000,
            placement: "top",
          });
        } else {
          toast.show("Deleting book failed", {
            type: "danger",
            duration: 2000,
            placement: "top",
          });
        }
        navigation.navigate("BooksList");
      })
      .catch((error: any) => {
        setIsDeleteModalVissible(false);
        toast.show("Deleting book failed", {
          type: "danger",
          duration: 2000,
          placement: "top",
        });
      });
  };

  const handleUpdateStatus = (statusId: number, userId: number) => {
    setIsLoadingAccept(true);
    updateBookStatus(selectedBookDetails.id, statusId, userId)
      .then((response: any) => {
        setTimeout(() => {
          setIsLoadingAccept(false);
          getDetails();
        }, 500);
      })
      .catch((error: any) => {
        setIsLoadingAccept(false);
        console.error("Error in request: ", error);
      });
  };

  return (
    <>
      <HeaderView title={selectedBookDetails?.title} />
      {isLoading ? (
        <Loading />
      ) : bookDetails && Object.keys(bookDetails).length > 0 ? (
        <>
          <View style={{ paddingHorizontal: 10, paddingVertical: 20, flex: 1 }}>
            <View
              style={[
                common.row,
                {
                  alignItems: "flex-start",
                  paddingBottom: 10,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#ccc",
                  marginBottom: 10,
                },
              ]}
            >
              <View style={common.mr10}>
                <Image
                  source={
                    bookDetails?.imageUrl
                      ? { uri: bookDetails?.imageUrl }
                      : image.DefaultBook
                  }
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 6,
                  }}
                />
                <View
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 18,
                    right: 15,
                    top: 50,
                    position: "absolute",
                    backgroundColor: "#fff",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UpdatePhoto
                    entityId={bookDetails?.id}
                    mediaType={1}
                    entityType={4}
                    profileUrl={bookDetails?.imageUrl}
                    updateInfo={(value) => updateInfo(value)}
                  />
                </View>
              </View>
              <View>
                <View style={[common.j_row, { width: width - 100 }]}>
                  <Text style={[common.title]}>{bookDetails?.title}</Text>
                  <View style={common.row}>
                    <Button
                      onPress={() => setModalVisible(true)}
                      icon={
                        <MaterialCommunityIcons
                          name="delete"
                          size={16}
                          color={YoColors.primary}
                          onPress={() => setIsDeleteModalVissible(true)}
                        />
                      }
                      buttonStyle={[
                        btnStyle.btnEdit,
                        { backgroundColor: "transparent" },
                      ]}
                      containerStyle={{ padding: 0, marginHorizontal: 5 }}
                    />
                    <Button
                      onPress={() => setModalVisible(true)}
                      icon={
                        <FontAwesomeIcon
                          name="pencil-alt"
                          size={12}
                          color={YoColors.primary}
                          onPress={() => setModalVisible(true)}
                        />
                      }
                      buttonStyle={[
                        btnStyle.btnEdit,
                        { backgroundColor: "transparent" },
                      ]}
                      containerStyle={{ padding: 0, marginHorizontal: 10 }}
                    />
                    <Text style={[common.rText]}>
                      {moment(bookDetails?.createDate).format("MMM DD, YYYY")}
                    </Text>
                  </View>
                </View>

                {bookDetails?.author && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="user" size={12} />
                    <Text style={common.rText}> {bookDetails?.author}</Text>
                  </View>
                )}

                {bookDetails?.gradeName && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="laptop" size={10} />
                    <Text style={common.rText}> {bookDetails?.gradeName}</Text>
                  </View>
                )}
                {bookDetails?.subjectName && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="book" size={10} />
                    <Text style={common.rText}>
                      {" "}
                      {bookDetails?.subjectName}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View>
              {bookDetails?.receiverUsers &&
                bookDetails?.receiverUsers.length > 0 && (
                  <>
                    <Text style={[common.mb10, common.h3Title]}>
                      Request List
                    </Text>
                    <View>
                      {bookDetails?.receiverUsers.map((item: any) => (
                        <View
                          style={[
                            common.row,
                            {
                              alignItems: "flex-start",
                              paddingBottom: 10,
                              borderBottomWidth: 0.5,
                              borderBottomColor: "#ccc",
                              marginBottom: 10,
                            },
                          ]}
                        >
                          <View style={common.mr10}>
                            <Image
                              source={
                                item.userImage
                                  ? { uri: item.userImage }
                                  : image.DefaultUser
                              }
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                              }}
                            />
                          </View>
                          <View>
                            <View
                              style={[common.j_row, { width: width - 100 }]}
                            >
                              <Text style={[common.title]}>
                                {item.firstName} {item.lastName}
                              </Text>
                              <View style={common.row}>
                                <Text
                                  style={[
                                    {
                                      color:
                                        item.receiverStatusId === 1 ||
                                        item.receiverStatusId === 2
                                          ? YoColors.success
                                          : YoColors.danger,
                                      fontWeight: "bold",
                                      fontSize: 10,
                                    },
                                  ]}
                                >
                                  {item.receiverStatus}{" "}
                                </Text>
                                <Icon
                                  name={
                                    item.receiverStatusId === 1 ||
                                    item.receiverStatusId === 2
                                      ? "check"
                                      : "times"
                                  }
                                  size={10}
                                  color={
                                    item.receiverStatusId === 1 ||
                                    item.receiverStatusId === 2
                                      ? YoColors.success
                                      : YoColors.danger
                                  }
                                />
                              </View>
                            </View>
                            {item?.phone && (
                              <View style={[cardStyle.row, common.mb5]}>
                                <Icon name="phone-alt" size={12} />
                                <Text style={common.rText}> {item.phone}</Text>
                              </View>
                            )}

                            {item?.email && (
                              <View style={[cardStyle.row, common.mb5]}>
                                <Icon name="envelope" size={12} />
                                <Text style={common.rText}> {item.email}</Text>
                              </View>
                            )}
                          </View>
                          {(item?.userAddress?.address1 ||
                            item?.userAddress?.address2) && (
                            <View
                              style={{ flexDirection: "row", marginTop: 5 }}
                            >
                              <Ionicons
                                name="location"
                                size={14}
                                style={{ width: 12 }}
                              />
                              <View
                                style={{
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  alignItems: "center",
                                  width: "95%",
                                }}
                              >
                                {item?.userAddress?.address1 && (
                                  <Text
                                    style={[common.rText, { paddingStart: 5 }]}
                                  >
                                    {item?.userAddress?.address1}
                                  </Text>
                                )}
                                {item?.userAddress?.address1 &&
                                  item?.userAddress?.address2 && (
                                    <Text>, </Text>
                                  )}
                                {item?.userAddress?.address2 && (
                                  <Text style={[common.rText]}>
                                    {item?.userAddress?.address2}
                                  </Text>
                                )}
                                {item?.userAddress?.address2 &&
                                  item?.userAddress?.city && <Text>, </Text>}
                                {item?.userAddress?.city && (
                                  <Text style={[common.rText]}>
                                    {item?.userAddress?.city}
                                  </Text>
                                )}
                                {item?.userAddress?.city &&
                                  item?.userAddress?.stateName && (
                                    <Text>, </Text>
                                  )}
                                {item?.userAddress?.stateName && (
                                  <Text style={[common.rText]}>
                                    {item?.userAddress?.stateName}
                                  </Text>
                                )}
                                {item?.userAddress?.stateName &&
                                  item?.userAddress?.pincode && <Text>, </Text>}
                                {item?.userAddress?.pincode && (
                                  <Text style={[common.rText]}>
                                    {item?.userAddress?.pincode}
                                  </Text>
                                )}
                              </View>
                            </View>
                          )}

                          {item?.receiverStatusId === 1 && (
                            <View
                              style={[
                                cardStyle.row,
                                common.mtop10,
                                {
                                  justifyContent: "flex-end",
                                  width: width - 20,
                                },
                              ]}
                            >
                              <Button
                                title="Accept"
                                onPress={() =>
                                  handleUpdateStatus(2, item?.userId)
                                }
                                buttonStyle={{
                                  backgroundColor: YoColors.success,
                                  marginEnd: 10,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                }}
                                titleStyle={{
                                  fontWeight: "bold",
                                  fontSize: 10,
                                }}
                              />
                              <Button
                                title="Decline"
                                onPress={() =>
                                  handleUpdateStatus(3, item?.userId)
                                }
                                buttonStyle={{
                                  backgroundColor: YoColors.danger,
                                  paddingHorizontal: 10,
                                  paddingVertical: 5,
                                }}
                                titleStyle={{
                                  fontWeight: "bold",
                                  fontSize: 10,
                                }}
                              />
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </>
                )}
            </View>
            {isLoadingAccept && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
          </View>
        </>
      ) : (
        <NoDataView />
      )}
      <CreateBookRequest
        userId={userInfo?.id}
        isModalVisible={isModalVisible}
        dataToEdit={bookDetails}
        onClose={(value: boolean) => onCloseUpdate(value)}
      />
      <ConfirmationPopup
        message="Are you sure to want to delete this book?"
        onSubmit={handleBookDelete}
        isVisible={isDeleteModalVissible}
        setIsVisible={setIsDeleteModalVissible}
      />
    </>
  );
};

export default OffersBookDetails;
