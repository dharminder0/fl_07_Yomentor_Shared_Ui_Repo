import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderView from "./common/HeaderView";
import Loading from "../screens/Loading";
import { cardStyle, common } from "../assets/styles/Common";
import NoDataView from "../screens/NoDataView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/base";
import { YoImages } from "../assets/themes/YoImages";
import { getReviews } from "../apiconfig/SharedApis";
import moment from "moment";
import { useThemeColor } from "../assets/themes/useThemeColor";

const Reviews = ({ route }: { route: any }) => {
  const { height } = Dimensions.get("screen");
  const image: any = YoImages();
  const YoColors = useThemeColor();
  const teacherId = route.params.teacherId;
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomLoader, setIsBottomLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [reviewList, setReviewList] = useState<any>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [idx, setIdx] = useState<number>();
  const textRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    getReviewList();
  }, []);

  const getReviewList = () => {
    const payload: any = {
      addedFor: teacherId,
      pageSize: 10,
      pageIndex: pageIndex,
    };
    getReviews(payload)
      .then((response: any) => {
        if (response.data && response.data.length > 0) {
          if (pageIndex === 1) {
            setReviewList([]);
            setReviewList(response.data);
          }
          if (pageIndex > 1) {
            setReviewList((prevList: any) => [...prevList, ...response.data]);
          }
        }
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
          setIsBottomLoader(false);
        }, 500);
      })
      .catch((error: any) => {
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
          setIsBottomLoader(false);
        }, 500);
        console.error("Error fetching :", error);
      });
  };

  const handleLoadMore = () => {
    if (!isBottomLoader) {
      setIsBottomLoader(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const toggleExpand = (id: any) => {
    setIdx(id);
    setIsExpanded(!isExpanded);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      //   onPress={() => navigation.navigate("UserDetails", { detail: item })}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          {item?.studentImage ? (
            <Image
              source={{ uri: item?.studentImage }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
              }}
            />
          ) : (
            <Image
              source={image.DefaultUser}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
              }}
            />
          )}
          <View
            style={{
              width: "83%",
              paddingHorizontal: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.title]}>{item?.batchTitle}</Text>
              <Text style={common.rText}>
                {moment(item?.createDate).format("DD MMM YYYY")}
              </Text>
            </View>
            <View style={[cardStyle.row]}>
              <Text numberOfLines={isExpanded && item?.id == idx ? 0 : 3}>
                {item?.review}
              </Text>
            </View>
            {/* <View style={[cardStyle.row, { justifyContent: "flex-end" }]}>
              {isExpanded && item?.id == idx ? (
                <Pressable onPress={() => toggleExpand(item?.id)}>
                  <Text style={{ color: YoColors.primary }}>Read Less</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => toggleExpand(item?.id)}>
                  <Text style={{ color: YoColors.primary }}>Read More</Text>
                </Pressable>
              )}
            </View> */}
          </View>
        </View>
        <View style={[cardStyle.j_row, common.mtop10]}>
          {item?.addedByFirstName && (
            <Text style={[common.rText]}>
              {item?.addedByFirstName + " " + item?.addedByLastName}
            </Text>
          )}
          <View style={[cardStyle.row, { marginStart: 15 }]}>
            {Array.from(Array(item?.rating).keys())?.map((key: number) => (
              <MaterialCommunityIcons
                name="star"
                size={12}
                color={YoColors.star}
                key={key}
              />
            ))}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderView title="Reviews" />
      <View style={common.container}>
        {isLoading ? (
          <Loading />
        ) : reviewList && reviewList.length > 0 ? (
          <>
            <FlatList
              data={reviewList}
              keyExtractor={(item: any) => item?.id}
              renderItem={renderItem}
              style={{ height: height - 125, marginTop: 5 }}
              windowSize={height - 125}
              showsVerticalScrollIndicator={false}
              onScrollEndDrag={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshLoader}
                  onRefresh={() => {
                    setRefreshLoader(true);
                    setPageIndex(1);
                  }}
                />
              }
              ListFooterComponent={
                <>
                  {isBottomLoader && (
                    <View style={{ height: 50 }}>
                      <ActivityIndicator size="large" />
                    </View>
                  )}
                </>
              }
            />
          </>
        ) : (
          <NoDataView />
        )}
      </View>
    </>
  );
};

export default Reviews;

const styles = StyleSheet.create({});
