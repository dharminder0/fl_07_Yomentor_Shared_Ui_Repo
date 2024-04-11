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
import { cardStyle, common } from "../../assets/styles/Common";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getUserInfo } from "../../shared/sharedDetails";
import { getBooksList, getUsersList } from "../../apiconfig/SharedApis";
import { Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import LoginPage from "../auth/LoginPage";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const BooksList = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const [isLoading, setIsLoading] = useState(false);
  const [isBottomLoader, setIsBottomLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState<any>("");
  const [booksList, setBooksList] = useState<any>([]);
  const [routes, setRoutes] = useState<any>([
    { key: "booksList", title: "Books" },
    { key: "requests", title: "My Requests" },
    { key: "offers", title: "My Offers" },
  ]);
  const [selectedActionTab, setSelectedActionTab] = useState<any>(
    routes[0].key
  );
  const [loadMoreTimeout, setLoadMoreTimeout] = useState<any>(null);
  //   let loadMoreTimeout: any = null;

  useEffect(() => {
    getBooksData();
  }, [refreshLoader, selectedActionTab, isBottomLoader]);

  const getBooksData = (searchedText?: string, index?: number) => {
    setIsLoading(true);
    const payload: any = {
      userId: userInfo.id,
      actionType:
        selectedActionTab === "requests"
          ? 1
          : selectedActionTab === "offers"
          ? 2
          : null,
      //"gradeId": 1,
      searchText: searchedText ?? searchText,
      pageSize: pageSize,
      pageIndex: index ?? pageIndex,
    };
    console.log("payload");
    console.log(payload);
    getBooksList(payload)
      .then((response: any) => {
        console.log("response");
        console.log(response.data);
        if (pageIndex === 1) {
          setBooksList([]);
        }
        if (response.data && response.data.length > 0) {
          setBooksList((prevList: any) => [...prevList, ...response.data]);
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

  const handleSearch = (text: string) => {
    clearTimeout(loadMoreTimeout);
    setPageIndex(1);
    setSearchText(text);
    setLoadMoreTimeout(
      setTimeout(() => {
        setBooksList([]);
        getBooksData(text, 1);
      }, 500)
    );
  };

  const handleTabChange = (key: string) => {
    setBooksList([]);
    setSearchText("");
    setPageIndex(1);
    setSelectedActionTab(key);
  };

  const handleLoadMore = () => {
    if (!isBottomLoader) {
      setIsBottomLoader(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity activeOpacity={0.7}>
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          <Image
            source={item.imageUrl ? { uri: item?.imageUrl } : image.DefaultBook}
            style={{
              width: 50,
              height: 50,
              borderRadius: 6,
            }}
          />
          <View
            style={{
              width: width - 95,
              paddingStart: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.title]}>{item?.title}</Text>
            </View>

            {item?.author && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="user" size={12} />
                <Text style={common.rText}> {item?.author}</Text>
              </View>
            )}

            {item?.gradeName && (
              <View style={[cardStyle.row, common.mb5]}>
                <FontAwesome5Icon name="laptop" size={10} />
                <Text style={common.rText}> {item?.gradeName}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {routes.map((route: any) => (
          <Button
            key={route.key}
            onPress={() => handleTabChange(route.key)}
            buttonStyle={[
              common.tabButton,
              {
                width: width / routes.length,
                borderColor:
                  selectedActionTab === route.key ? YoColors.primary : "#fff",
              },
            ]}
            title={route.title}
            titleStyle={{
              color:
                selectedActionTab === route.key
                  ? YoColors.primary
                  : YoColors.text,
              fontSize: 14,
              fontWeight: "500",
            }}
          />
        ))}
      </View>

      <View style={common.container}>
        {selectedActionTab === "booksList" && (
          <View style={[common.row, common.mtop10]}>
            <TextInput
              placeholder="Search Books"
              onChangeText={handleSearch}
              value={searchText}
              style={[common.input, common.mb5]}
              placeholderTextColor={YoColors.placeholderText}
            />
            {searchText && searchText?.length > 0 ? (
              <Ionicons
                onPress={() => {
                  handleSearch("");
                }}
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
        )}

        {booksList && booksList.length > 0 ? (
          <FlatList
            data={booksList}
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            style={{
              //height: Platform.OS === "ios" ? height - 250 : height - 165,
              height: height - 220,
              marginVertical: 10,
            }}
            //windowSize={Platform.OS === "ios" ? height - 250 : height - 165}
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
    </View>
  );
};

export default BooksList;

const styles = StyleSheet.create({});
