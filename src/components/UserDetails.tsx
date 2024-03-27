import {
  Dimensions,
  Image,
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
import { getBatchListbyUserid } from "../apiconfig/SharedApis";
import { getUserInfo } from "../shared/sharedDetails";
import BatchCardView from "./common/BatchCardView";
import ProfileBatchCard from "./common/ProfileBatchCard";

const UserDetails = ({ route }: { route: any }) => {
  const { height } = Dimensions.get("window");
  const detail: any = route.params.detail;
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState([]);

  useEffect(() => {
    getOpenBatchDatabyTeacherId();
  }, [userInfo?.id]);

  const getOpenBatchDatabyTeacherId = () => {
    const payload: any = {
      userid: detail?.id,
      userType: 1,
      statusId: [1],
      isFavourite: true,
      pageSize: 10,
      pageIndex: 1,
    };
    setIsLoading(true);
    setOpenBatchList([]);
    getBatchListbyUserid(payload).then((response: any) => {
      if (response?.data && response?.data?.length) {
        setOpenBatchList(response?.data);
      }
      setTimeout(() => {
        setIsLoading(false);
        setRefreshLoader(false);
      }, 1000);
    });
  };

  return (
    <>
      <HeaderView
        title={
          detail?.firstName
            ? detail?.firstName + " " + detail?.lastName
            : "User Details"
        }
      />
      <View style={common.container}>
        <View style={[cardStyle.row, common.mtop10]}>
          <Image
            source={image.DefaultUser}
            style={{
              width: 75,
              height: 75,
              borderRadius: 40,
            }}
          />
          <View
            style={{
              width: "79%",
              paddingHorizontal: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.h3Title]}>
                {detail?.firstName + " " + detail?.lastName}
              </Text>

              {detail?.averageRating > 0 && (
                <Pressable
                  style={[cardStyle.row]}
                  onPress={() => navigation.navigate("Reviews")}
                >
                  {detail?.averageRating > 0 && (
                    <Text style={common.rText}>
                      {Array.from(Array(detail?.averageRating).keys())?.map(
                        (key: number) => (
                          <MaterialCommunityIcons
                            name="star"
                            size={12}
                            color={"#FF7400"}
                            key={key}
                          />
                        )
                      )}{" "}
                      ({detail?.reviewCount})
                    </Text>
                  )}
                </Pressable>
              )}
            </View>
            {detail?.phone && (
              <View style={cardStyle.row}>
                <MaterialCommunityIcons name="phone" size={12} />
                <Text style={common.rText}> {detail?.phone}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={common.mtop10}>
          <AccordionItem
            customTitle={() => (
              <Text style={common.title}>Batches Open for Enrollment</Text>
            )}
            customBody={() => (
              <View style={common.mtop10}>
                <ProfileBatchCard
                  data={openBatchList}
                  height={height - 190}
                  isLoading={isLoading}
                  refreshLoader={refreshLoader}
                  setRefreshLoader={setRefreshLoader}
                  reloadPage={getOpenBatchDatabyTeacherId}
                  intrested={true}
                  usedStatusId={0}
                />
              </View>
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
          />
        </View>
      </View>
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({});
