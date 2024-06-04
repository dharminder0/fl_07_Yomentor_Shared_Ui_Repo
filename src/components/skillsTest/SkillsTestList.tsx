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
import { Button, Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getSkilsList } from "../../apiconfig/SharedApis";
import AddSkillTestModal from "./AddSkillTestModal";

const SkillsTestList = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBottomLoader, setIsBottomLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState<any>("");
  const [skillTestList, setSkillTestList] = useState<any>([]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Skill Test' },
    { key: 'second', title: 'My Skill Test' },
  ]);

  useEffect(() => {
    setIsLoading(true);
    getSkilsListData();
  }, []);

  useEffect(() => {
    getSkilsListData();
  }, [pageIndex]);

  useEffect(() => {
    if (searchText?.length > 3) {
      getSkilsListData();
    }
    if (searchText?.length === 0) {
      getSkilsListData();
    }
  }, [searchText]);

  const getSkilsListData = () => {
    const payload: any = {
      searchText: searchText,
      subjectId: !userInfo?.studentGradeId ? 0 : userInfo?.studentGradeId,
      pageSize: 10,
      pageIndex: pageIndex,
    };
    getSkilsList(payload)
      .then((response: any) => {
        if (pageIndex === 1) {
          setSkillTestList([]);
        }
        if (response.data && response.data.length > 0) {
          setSkillTestList((prevList: any) => [...prevList, ...response.data]);
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
    getSkilsListData();
  };

  const handleLoadMore = () => {
    if (!isBottomLoader) {
      setIsBottomLoader(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("SkillTestDetails", { skillId: item?.id })
      }
    >
      <Card
        containerStyle={[
          cardStyle.container,
          {
            backgroundColor: YoColors.background,
          },
        ]}
        key={item?.id}
      >
        <View style={cardStyle.row}>
          <View
            style={{
              width: width - 50,
            }}
          >
            <View style={[cardStyle.row]}>
              {item?.title && (
                <Text
                  style={[common.title, { width: "100%" }]}
                  numberOfLines={2}
                >
                  {item?.title}
                </Text>
              )}
            </View>

            <View style={[common.row, common.my5]}>
              <View style={cardStyle.row}>
                <Icon name="laptop" size={12} />
                <Text style={common.rText}>{item?.gradeName}</Text>
              </View>
              <View style={[cardStyle.row, common.ps5]}>
                <Icon name="book" size={12} />
                <Text style={common.rText}> {item?.subjectName}</Text>
              </View>
              {item?.averageMarks > 0 && (
                <View style={[cardStyle.row, common.ps5]}>
                  <Text style={common.rText}>
                    Avg Score: {item?.averageMarks}
                  </Text>
                </View>
              )}
              {item?.attemptCount > 0 && (
                <View style={[cardStyle.row, common.ps5]}>
                  <Text style={common.rText}>
                    Attempted By: {item?.attemptCount}
                  </Text>
                </View>
              )}
            </View>

            {item?.description && (
              <View style={[cardStyle.row, common.mb5]}>
                <Text style={common.rText} numberOfLines={2}>
                  {item?.description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderScene = ({ route }: any) => {
    return (
      <View style={common.container}>
        <View style={[common.j_row, common.mtop10, { alignItems: 'center' }]}>
          {
            route.key == "second" && !isSearchActive &&
            <View style={{ width: '80%' }}>
              <Button
                title="Create AI Skill Test"
                onPress={() => setIsOpenModal(true)}
                buttonStyle={[btnStyle.outline, common.px12, { height: 45 }]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}

              />
            </View>
          }
          <View style={{ width: route.key == "second" && !isSearchActive ? '20%' : '100%' }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              {!isSearchActive && route.key == "second" ? (
                <Button
                  icon={<Ionicons
                    name="search-outline"
                    size={21}
                  />}
                  onPress={() => setIsSearchActive(true)}
                  buttonStyle={[btnStyle.outline, common.px12, { height: 45 }]}
                  titleStyle={[btnStyle.outlineTitle, common.fs12]}

                />
              ) : (
                <>
                  <TextInput
                    placeholder="Search Skill Test"
                    onChangeText={(text: any) => setSearchText(text)}
                    value={searchText}
                    style={[common.input, { marginBottom: 0 }]}
                    onSubmitEditing={handleSearch}
                    placeholderTextColor={YoColors.placeholderText}
                    autoFocus={true} />
                  {
                    searchText ?
                      <Ionicons
                        onPress={() => {
                          setSearchText("");
                          setIsSearchActive(false);
                        }}
                        name="close-sharp"
                        size={21}
                        style={{ position: "absolute", right: 10 }} />
                      :
                      <Ionicons
                        onPress={() => setIsSearchActive(true)}
                        name="search-outline"
                        size={21}
                        style={{ position: "absolute", right: 10 }}
                      />
                  }
                </>
              )}
            </View>
          </View>

        </View>

        {skillTestList && skillTestList.length > 0 ? (
          <FlatList
            data={skillTestList}
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            style={{
              height: "90%",
              marginTop: 5,
            }}
            windowSize={Platform.OS === "ios" ? height - 205 : height - 165}
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

        {isOpenModal &&
          <AddSkillTestModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
        }
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={props => <TabBar
        {...props}
        style={{ backgroundColor: 'white' }}
        indicatorStyle={{ backgroundColor: YoColors.primary }}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color: focused ? YoColors.primary : 'gray' }}>
            {route.title}
          </Text>
        )}
      />}
    />
  );
};

export default SkillsTestList;

const styles = StyleSheet.create({});
