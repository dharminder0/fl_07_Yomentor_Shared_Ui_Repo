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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { YoImages } from "../../assets/themes/YoImages";
import CreateBookRequest from "./CreateBookRequest";
import UpdatePhoto from "../common/UpdatePhoto";
import { useToast } from "react-native-toast-notifications";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { useNavigation } from "@react-navigation/native";

const BookDetails = ({ route }: any) => {
  const { height, width } = Dimensions.get("window");
  const image: any = YoImages();
  const toast = useToast();
  const navigation: any = useNavigation();
  const selectedBookDetails = route?.params?.selectedBookDetails ?? {};
  const selectedActionTab = route?.params?.selectedActionTab ?? "";
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
    getBookDetailsById(selectedBookDetails.id)
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

  return (
    <>
      <HeaderView title={selectedBookDetails?.title} />
      <View style={[{ padding: 20 }]}>
        {isLoading ? (
          <Loading />
        ) : bookDetails && Object.keys(bookDetails).length > 0 ? (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 25,
                paddingBottom: 20,
                borderBottomWidth: 1,
                borderColor: "#ccc",
              }}
            >
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
                  right: (width - 40) / 2 - 45,
                  top: 45,
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
            <View style={[cardStyle.j_row, { margin: 0 }]}>
              <View
                style={{
                  width: width - 40,
                }}
              >
                <View style={[cardStyle.j_row]}>
                  <Text style={common.title}>{bookDetails?.title}</Text>
                  <View>
                    <View style={common.row}>
                      {selectedActionTab == "offers" && (
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
                      )}
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
                    {selectedActionTab == "booksList" &&
                      bookDetails?.statusName && (
                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              color:
                                bookDetails.status == 1 ||
                                bookDetails.status == 2
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {bookDetails?.statusName}
                          </Text>
                        </View>
                      )}
                    {selectedActionTab == "offers" && (
                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: bookDetails.available ? "green" : "red",
                          }}
                        >
                          {bookDetails.available
                            ? "Available"
                            : "Not available"}
                        </Text>
                      </View>
                    )}
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
          </>
        ) : (
          <NoDataView />
        )}
      </View>
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

export default BookDetails;
