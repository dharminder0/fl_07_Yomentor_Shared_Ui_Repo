import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
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
import { getUserInfo } from "../shared/sharedDetails";
import { getUsersList } from "../apiconfig/SharedApis";
import { Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeColor } from "../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import LoginPage from "./auth/LoginPage";

const TeachersList = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
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
        if (pageIndex === 1) {
          setTeacherList([]);
        }
        if (response.data && response.data.length > 0) {
          setTeacherList((prevList: any) => [...prevList, ...response.data]);
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
      onPress={() => navigation.navigate("UserDetails", { userId: item?.id })}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          {item?.profilePicture ? (
            <Image
              source={{ uri: item?.profilePicture }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />
          ) : (
            <Image
              source={image.DefaultUser}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />
          )}
          <View
            style={{
              width: width - 95,
              paddingStart: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.title]}>
                {item?.firstName + " " + item?.lastName}
              </Text>

              {item?.averageRating > 0 && (
                <Text style={common.rText}>
                  {Array.from(Array(item?.averageRating).keys())?.map(
                    (key: number) => (
                      <MaterialCommunityIcons
                        name="star"
                        size={12}
                        color={YoColors.star}
                        key={key}
                      />
                    )
                  )}{" "}
                  ({item?.reviewCount})
                </Text>
              )}
            </View>

            {item?.phone && (
              <View style={[cardStyle.row, common.mb5]}>
                <MaterialCommunityIcons name="phone" size={12} />
                <Text style={common.rText}> {item?.phone}</Text>
              </View>
            )}

            {item?.education && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="user-graduate" size={12} />
                <Text style={common.rText}> {item?.education}</Text>
              </View>
            )}

            {item?.experience && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="info-circle" size={12} />
                <Text style={common.rText}>
                  {" "}
                  {item?.experience + " years of experience"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={common.container}>
      <View style={[common.row, common.mtop10]}>
        <TextInput
          placeholder="Search Teacher"
          onChangeText={(text: any) => setSearchText(text)}
          value={searchText}
          style={[common.input, common.mb5]}
          onSubmitEditing={handleSearch}
          placeholderTextColor={YoColors.placeholderText}
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
      {teacherList && teacherList.length > 0 ? (
        <FlatList
          data={teacherList}
          keyExtractor={(item: any) => item?.id}
          renderItem={renderItem}
          style={{
            height: Platform.OS === "ios" ? height - 250 : height - 165,
            marginTop: 5,
          }}
          windowSize={Platform.OS === "ios" ? height - 250 : height - 165}
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
      ) : isLoading ? (
        <Loading />
      ) : (
        <NoDataView />
      )}
    </View>
  );
};

export default TeachersList;

const styles = StyleSheet.create({});
