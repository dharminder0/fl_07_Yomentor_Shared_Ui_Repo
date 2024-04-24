import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import HeaderView from "../common/HeaderView";
import moment from "moment";
import {
  getBookDetailsById,
  upsertBookExchange,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { Button, Image } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserInfo } from "../../shared/sharedDetails";

const BookDetails = ({ route }: any) => {
  const { height, width } = Dimensions.get("window");
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const selectedBookDetails = route?.params?.selectedBookDetails ?? {};
  const [bookDetails, setBookDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingRequest, setIsLoadingRequest] = useState<boolean>(false);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    setIsLoading(true);
    const paylaod: any = {
      id: selectedBookDetails.id,
      userId: userInfo.id,
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

  const handleBookRequest = (statusId: number) => {
    const payload = {
      senderId: bookDetails?.userId,
      receiverId: userInfo.id,
      bookId: selectedBookDetails.id,
      status: statusId, ///Requested and Cancel
    };
    setIsLoadingRequest(true);
    upsertBookExchange(payload)
      .then((response: any) => {
        if (response.data && response.data.success) {
          setTimeout(() => {
            setIsLoadingRequest(false);
            getDetails();
          }, 500);
        } else {
          setTimeout(() => {
            setIsLoadingRequest(false);
          }, 500);
        }
      })
      .catch((error: any) => {
        setIsLoadingRequest(false);
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
                {bookDetails?.statusName && (
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
                )}
              </View>
              <View>
                <View style={[common.j_row, { width: width - 100 }]}>
                  <Text style={[common.title]}>{bookDetails?.title}</Text>
                  <View style={common.row}>
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
            <View
              style={[
                common.j_row,
                {
                  alignItems: "flex-start",
                },
              ]}
            >
              <Text style={[common.mb5, common.h3Title]}>
                Donar Information
              </Text>
            </View>
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
                    bookDetails?.userInfo?.userImage
                      ? { uri: bookDetails?.userInfo?.userImage }
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
                  {bookDetails?.userInfo?.firstName}{" "}
                  {bookDetails?.userInfo?.lastName}
                </Text>
                {bookDetails?.userInfo?.phone && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="phone-alt" size={12} />
                    <Text style={common.rText}>
                      {" "}
                      {bookDetails?.userInfo?.phone}
                    </Text>
                  </View>
                )}

                {bookDetails?.userInfo?.email && (
                  <View style={[cardStyle.row, common.mb5]}>
                    <Icon name="envelope" size={12} />
                    <Text style={common.rText}>
                      {" "}
                      {bookDetails?.userInfo?.email}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View>
              <Text style={[common.mb5, common.h3Title]}>
                Pickup Instructions
              </Text>
              {bookDetails?.remark && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Icon
                    name="comment"
                    size={12}
                    style={{ width: 12, marginTop: 1 }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: "95%",
                    }}
                  >
                    <Text style={[common.rText, { paddingStart: 5 }]}>
                      {bookDetails?.remark}
                    </Text>
                  </View>
                </View>
              )}
              {(bookDetails?.userInfo?.userAddress?.address1 ||
                bookDetails?.userInfo?.userAddress?.address2) && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Ionicons name="location" size={14} style={{ width: 12 }} />
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: "95%",
                    }}
                  >
                    {bookDetails?.userInfo?.userAddress?.address1 && (
                      <Text style={[common.rText, { paddingStart: 5 }]}>
                        {bookDetails?.userInfo?.userAddress?.address1}
                      </Text>
                    )}
                    {bookDetails?.userInfo?.userAddress?.address1 &&
                      bookDetails?.userInfo?.userAddress?.address2 && (
                        <Text>, </Text>
                      )}
                    {bookDetails?.userInfo?.userAddress?.address2 && (
                      <Text style={[common.rText]}>
                        {bookDetails?.userInfo?.userAddress?.address2}
                      </Text>
                    )}
                    {bookDetails?.userInfo?.userAddress?.address2 &&
                      bookDetails?.userInfo?.userAddress?.city && (
                        <Text>, </Text>
                      )}
                    {bookDetails?.userInfo?.userAddress?.city && (
                      <Text style={[common.rText]}>
                        {bookDetails?.userInfo?.userAddress?.city}
                      </Text>
                    )}
                    {bookDetails?.userInfo?.userAddress?.city &&
                      bookDetails?.userInfo?.userAddress?.stateName && (
                        <Text>, </Text>
                      )}
                    {bookDetails?.userInfo?.userAddress?.stateName && (
                      <Text style={[common.rText]}>
                        {bookDetails?.userInfo?.userAddress?.stateName}
                      </Text>
                    )}
                    {bookDetails?.userInfo?.userAddress?.stateName &&
                      bookDetails?.userInfo?.userAddress?.pincode && (
                        <Text>, </Text>
                      )}
                    {bookDetails?.userInfo?.userAddress?.pincode && (
                      <Text style={[common.rText]}>
                        {bookDetails?.userInfo?.userAddress?.pincode}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
            <View style={{ marginTop: 50, alignItems: "center" }}>
              {!bookDetails.status && (
                <Button
                  title="Borrow book"
                  loading={isLoadingRequest}
                  onPress={() => handleBookRequest(1)}
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={[common.my10]}
                />
              )}
              {bookDetails.status === 1 && (
                <Button
                  title="Cancel request"
                  loading={isLoadingRequest}
                  onPress={() => handleBookRequest(5)}
                  buttonStyle={[btnStyle.outline, common.px12]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}
                  containerStyle={[common.my10]}
                />
              )}
            </View>
          </View>
        </>
      ) : (
        <NoDataView />
      )}
    </>
  );
};

export default BookDetails;
