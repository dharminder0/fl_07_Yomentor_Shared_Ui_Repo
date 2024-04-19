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
import React, { useCallback, useEffect, useState } from "react";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getUserInfo } from "../../shared/sharedDetails";
import { getBooksList } from "../../apiconfig/SharedApis";
import { Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-elements";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import CreateBookRequest from "./CreateBookRequest";
import useStore from "../../store/useStore";
import moment from "moment";

const BooksList = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      getBooksData();
    }, [refreshLoader, selectedActionTab, isBottomLoader])
  );

  // useEffect(() => {
  //   getBooksData();
  // }, [refreshLoader, selectedActionTab, isBottomLoader]);

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
    getBooksList(payload)
      .then((response: any) => {
        if (pageIndex === 1) {
          setBooksList([]);
        }
        if (response.data && response.data.length > 0) {
          setBooksList((prevList: any) => {
            const filteredData = response.data.filter((newItem: any) => {
              return !prevList.some((item: any) => item.id === newItem.id);
            });
            return [...prevList, ...filteredData];
          });
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

  const onCloseUpdate = () => {
    setModalVisible(false);
    setTimeout(() => {
      getBooksData();
    }, 500);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(
          selectedActionTab === "offers" ? "OffersBookDetails" : "BookDetails",
          {
            selectedBookDetails: item,
          }
        )
      }
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <View>
            <Image
              source={
                item.imageUrl ? { uri: item?.imageUrl } : image.DefaultBook
              }
              style={{
                width: 50,
                height: 50,
                borderRadius: 6,
              }}
            />
            {selectedActionTab == "booksList" && item?.statusName && (
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 5,
                  color: item.status == 1 || item.status == 2 ? "green" : "red",
                }}
              >
                {item?.statusName}
              </Text>
            )}
            {/* {selectedActionTab == "offers" && (
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 5,
                  color: item.available ? "green" : "red",
                }}
              >
                {item.available ? "Available" : "Not available"}
              </Text>
            )} */}
          </View>
          <View
            style={{
              width: width - 95,
              paddingStart: 10,
            }}
          >
            <View style={[cardStyle.j_row]}>
              <Text style={[common.title]}>{item?.title}</Text>
              <Text style={{ fontSize: 12 }}>
                {moment(item?.createDate).format("MMM DD, YYYY")}
              </Text>
            </View>

            {item?.author && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="user" size={12} />
                <Text style={common.rText}> {item?.author}</Text>
              </View>
            )}

            {item?.gradeName && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="laptop" size={10} />
                <Text style={common.rText}> {item?.gradeName}</Text>
              </View>
            )}
            {item?.subjectName && (
              <View style={[cardStyle.row, common.mb5]}>
                <Icon name="book" size={10} />
                <Text style={common.rText}> {item?.subjectName}</Text>
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
        {booksList &&
          booksList.length > 0 &&
          selectedActionTab === "offers" && (
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                marginVertical: 10,
              }}
            >
              <Button
                title="Add a Book to Share"
                onPress={() => setModalVisible(true)}
                icon={
                  <MaterialCommunityIcons
                    name="plus"
                    size={12}
                    color={YoColors.primary}
                  />
                }
                buttonStyle={[
                  btnStyle.outline,
                  {
                    width: 150,
                    height: 30,
                  },
                ]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
              />
            </View>
          )}
        {selectedActionTab === "booksList" && (
          <View style={[common.row, common.mtop10]}>
            <TextInput
              placeholder="Search book title or author"
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
          <View
            style={{
              height: 500,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ textAlign: "center", lineHeight: 22 }}>
              {selectedActionTab === "booksList" && "No avaiable books"}
              {selectedActionTab === "requests" &&
                "You haven't requested any books yet. Start exploring the available book list and request a book as per your need."}
              {selectedActionTab === "offers" &&
                "Share your books with others by creating an offer. Let fellow users borrow your books and help spread knowledge."}
            </Text>
            {selectedActionTab === "offers" && (
              <Button
                title="Add a Book to Share"
                onPress={() => setModalVisible(true)}
                icon={
                  <MaterialCommunityIcons
                    name="plus"
                    size={12}
                    color={YoColors.primary}
                  />
                }
                buttonStyle={[
                  btnStyle.outline,
                  {
                    width: 150,
                    height: 30,
                    marginTop: 10,
                  },
                ]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
              />
            )}
          </View>
        )}
      </View>

      <CreateBookRequest
        userId={userInfo?.id}
        isModalVisible={isModalVisible}
        onClose={onCloseUpdate}
      />
    </View>
  );
};

export default BooksList;

const styles = StyleSheet.create({});
