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
import { deleteBookById, getBookDetailsById } from "../../apiconfig/SharedApis";
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

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    setIsLoading(true);
    const paylaod: any = {
      id: selectedBookDetails.id,
      type: 2
    };
    console.log('paylaod', paylaod)
    getBookDetailsById(paylaod)
      .then((response: any) => {
        setBookDetails({});
        if (response.data && Object.keys(response.data)) {
          setBookDetails(response.data);
          console.log('response', response.data)
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
                  //borderBottomWidth: 0.5,
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
                {/* {bookDetails?.statusName && (
                  <Text
                    style={{
                      fontSize: 12,
                      marginTop: 5,
                      textAlign: "center",
                      color:
                        bookDetails.status == 1 || bookDetails.status == 2
                          ? "green"
                          : "red",
                    }}
                  >
                    {bookDetails?.statusName}
                  </Text>
                )} */}
                {/* <Text
                  style={{
                    fontSize: 12,
                    marginTop: 20,
                    textAlign: "center",
                    color: bookDetails.available ? "green" : "red",
                  }}
                >
                  {bookDetails.available ? "Available" : "Not available"}
                </Text> */}
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
            {/* <View
              style={[
                common.j_row,
                {
                  alignItems: "flex-start",
                },
              ]}
            >
              <Text style={[common.mb5, common.h3Title]}>Request List</Text>
            </View>
            {bookDetails?.receiverUsers &&
              bookDetails?.receiverUsers.length > 0 &&
              bookDetails?.receiverUsers.map((item: any) => (
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
                    <Text style={[common.title, common.mb5]}>
                      {item.firstName} {item.lastName}
                    </Text>
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
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
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
                          <Text style={[common.rText, { paddingStart: 5 }]}>
                            {item?.userAddress?.address1}
                          </Text>
                        )}
                        {item?.userAddress?.address1 &&
                          item?.userAddress?.address2 && <Text>, </Text>}
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
                          item?.userAddress?.stateName && <Text>, </Text>}
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
                </View>
              ))} */}
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
