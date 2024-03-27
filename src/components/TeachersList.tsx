import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { cardStyle, common } from "../assets/styles/Common";
import Loading from "../screens/Loading";
import NoDataView from "../screens/NoDataView";
import HeaderView from "./common/HeaderView";
import { getUserInfo } from "../shared/sharedDetails";
import { getUsersList } from "../apiconfig/SharedApis";
import { Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { YoColors } from "../assets/themes/YoColors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { Controller, useForm } from "react-hook-form";
import { YoImages } from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";

const TeachersList = () => {
  const { height } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomLoader, setIsBottomLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState<any>("");
  const [teacherList, setTeacherList] = useState<any>([]);

  useEffect(() => {
    setIsLoading(true);
    getUserList();
  }, []);

  useEffect(() => {
    getUserList();
  }, [pageIndex]);

  useEffect(() => {
    if (searchText?.length > 3) {
      getUserList();
    }
    if (searchText?.length === 0) {
      getUserList();
    }
  }, [searchText]);

  const getUserList = () => {
    const payload: any = {
      searchText: searchText,
      userType: 1,
      pageSize: 10,
      pageIndex: pageIndex,
    };
    getUsersList(payload)
      .then((response: any) => {
        if (response.data && response.data.length > 0) {
          if (pageIndex === 1) {
            setTeacherList([]);
            setTeacherList(response.data);
          }
          if (pageIndex > 1) {
            setTeacherList((prevList: any) => [...prevList, ...response.data]);
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

  const handleSearch = () => {
    setPageIndex(1);
    getUserList();
  };

  const handleLoadMore = () => {
    if (!isBottomLoader) {
      setIsBottomLoader(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate("UserDetails", { detail: item })}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          <Image
            source={image.DefaultUser}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
            }}
          />
          <View
            style={{
              width: "79%",
              paddingHorizontal: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.title]}>
                {item?.firstName + " " + item?.lastName}
              </Text>
            </View>
            {item?.phone && (
              <View style={cardStyle.row}>
                <MaterialCommunityIcons name="phone" size={12} />
                <Text style={common.rText}> {item?.phone}</Text>
              </View>
            )}

            <View style={cardStyle.row}>
              {item?.averageRating > 0 && (
                <Text style={common.rText}>
                  {Array.from(Array(item?.averageRating).keys())?.map(
                    (key: number) => (
                      <MaterialCommunityIcons
                        name="star"
                        size={12}
                        color={YoColors.start}
                        key={key}
                      />
                    )
                  )}{" "}
                  ({item?.reviewCount})
                </Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderView title="Teachers" />
      <View style={common.container}>
        {isLoading ? (
          <Loading />
        ) : teacherList && teacherList.length > 0 ? (
          <>
            <View style={common.row}>
              <TextInput
                placeholder="Search Teacher"
                onChangeText={(text: any) => setSearchText(text)}
                value={searchText}
                style={[common.input]}
                onSubmitEditing={handleSearch}
              />
              {searchText && searchText?.length > 0 ? (
                <Ionicons
                  onPress={() => setSearchText("")}
                  name="close-sharp"
                  size={21}
                  style={{ position: "absolute", right: 10, top: 12 }}
                />
              ) : (
                <Ionicons
                  name="search-outline"
                  size={21}
                  style={{ position: "absolute", right: 10, top: 12 }}
                />
              )}
            </View>
            <FlatList
              data={teacherList}
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

export default TeachersList;

const styles = StyleSheet.create({});
