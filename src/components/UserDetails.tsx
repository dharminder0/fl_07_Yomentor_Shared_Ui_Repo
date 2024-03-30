import {
  Dimensions,
  Image,
  Platform,
  Pressable,
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
  getBatchListbyEntity,
  getBatchListbyUserid,
  getUsersDetails,
} from "../apiconfig/SharedApis";
import { getUserInfo } from "../shared/sharedDetails";
import BatchCardView from "./common/BatchCardView";
import ProfileBatchCard from "./common/ProfileBatchCard";
import { YoColors } from "../assets/themes/YoColors";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserDetails = ({ route }: { route: any }) => {
  const { height } = Dimensions.get("window");
  const userId: any = route.params.userId;
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState<any>([]);
  const [userDetailList, setUserDetailList] = useState<any>({});

  useEffect(() => {
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
    };
    setIsLoading(true);
    setOpenBatchList([]);
    getBatchListbyEntity(payload)
      .then((response: any) => {
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

  console.log(openBatchList);
  return (
    <>
      <HeaderView
        title={
          userDetailList?.firstname
            ? userDetailList?.firstname + " " + userDetailList?.lastname
            : "User Details"
        }
      />
      <View style={common.container}>
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
                    <Text style={common.rText}> {userDetailList?.gender}</Text>
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
            <ProfileBatchCard
              data={openBatchList}
              isLoading={isLoading}
              height={Platform.OS === "ios" ? height - 390 : height - 320}
              refreshLoader={refreshLoader}
              setRefreshLoader={setRefreshLoader}
              reloadPage={getBatchesListbyEntity}
              intrested={true}
              usedStatusId={0}
            />
          </View>
          {/* <AccordionItem
            customTitle={() => (
              <Text style={common.title}>Batches Open for Enrollment</Text>
              
            )}
            customBody={() => (
              
            )}
            customIcon={() => (
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={"#000"}
                style={{ paddingEnd: 5 }}
              />
            )}
            containerStyle={{ backgroundColor: "#EDEFFC" }}
            animationDuration={400}
            isOpen={true}
          /> */}
        </View>
      </View>
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({});
