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
import { getBookDetailsById } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome5";
import { Button, Image } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import CreateBookRequest from "./CreateBookRequest";
import UpdatePhoto from "../common/UpdatePhoto";

const BookDetails = ({ route }: any) => {
  const { height, width } = Dimensions.get("window");
  const image: any = YoImages();
  const selectedBookDetails = route?.params?.selectedBookDetails ?? {};
  const [bookDetails, setBookDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    // setIsBasicModal(false);
    // setModalVisible(false);
  };

  return (
    <>
      <HeaderView title={selectedBookDetails?.title} />
      <View style={[{ padding: 20}]}>
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
                borderBottomWidth:1,
                borderColor: '#ccc'

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
                  borderRadius: 6
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
                    <View style={common.row}>
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
                        buttonStyle={[btnStyle.btnEdit, {backgroundColor: 'transparent'}]}
                        containerStyle={{ padding: 0, marginHorizontal: 5 }}
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
                      <FontAwesome5Icon name="laptop" size={10} />
                      <Text style={common.rText}>
                        {" "}
                        {bookDetails?.gradeName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            {/* <Card containerStyle={cardStyle.container}>
              <View style={[cardStyle.j_row, { margin: 0 }]}>
                <View
                  style={{
                    width: width - 40,
                  }}
                >
                  <View style={[cardStyle.j_row]}>
                    <Text style={common.title}>{bookDetails?.title}</Text>
                    <View style={common.row}>
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
                        buttonStyle={[btnStyle.btnEdit]}
                        containerStyle={{ padding: 0 }}
                      />
                      <Text style={[common.rText, common.ph10]}>
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
                      <FontAwesome5Icon name="laptop" size={10} />
                      <Text style={common.rText}>
                        {" "}
                        {bookDetails?.gradeName}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Card> */}
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
    </>
  );
};

export default BookDetails;
