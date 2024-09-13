import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Card, CheckBox } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getSkilsList, getSubjectByGradeId } from "../../apiconfig/SharedApis";
import AddSkillTestModal from "./AddSkillTestModal";
import Modal from "react-native-modal";
import SelectModal from "../common/SelectModal";
import { YoImages } from "../../assets/themes/YoImages";

const SkillsTestList = ({ route }: any) => {
  const { height, width } = Dimensions.get("window");
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const useFor = route.params?.useFor;
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isBottomLoader, setIsBottomLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchText, setSearchText] = useState<any>("");
  const [teacherList, setTeacherList] = useState<any>([]);
  const [subjectList, setSubjectList] = useState<any>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

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

  (() => {
    getSubjectByGradeId(userInfo?.studentGradeId).then((result: any) => {
      if (result?.data && result.data.length > 0) {
        setSubjectList(result.data);
      }
    });
  })();

  const getSkilsListData = () => {
    let payload: any = {
      searchText: searchText,
      pageSize: 10,
      pageIndex: pageIndex,
      subjectId: selectedSubject
    };
    useFor ? (payload['gradeId'] = !userInfo?.studentGradeId ? 0 : userInfo?.studentGradeId) : payload['userId'] = !useFor && userInfo.id;
    getSkilsList(payload)
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
    getSkilsListData();
  };

  const handleLoadMore = () => {
    if (!isBottomLoader) {
      setIsBottomLoader(true);
      setPageIndex(pageIndex + 1);
    }
  };

  const handleFilter = (type: any) => {
    if (type === 'clear') {
      setSelectedSubject(null)
    }
    getSkilsListData();
    setIsFilter(false);
  }

  useEffect(() => {
    if (!selectedSubject) {
      getSkilsListData();
    }
  }, [selectedSubject]);

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
        key={index}
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
                  <Icon name="shield-alt" size={12} />
                  <Text style={common.rText}> Avg Score: {item?.averageMarks}</Text>
                </View>
              )}
              {item?.attemptCount > 0 && (
                <View style={[cardStyle.row, common.ps5]}>
                  <Icon name="users" size={12} />
                  <Text style={common.rText}> Attempted By: {item?.attemptCount}</Text>
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

  return (
    <>
      <View style={common.container}>
        <View style={[common.j_row, common.mtop10, { alignItems: 'center' }]}>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: '82%' }}>
              <TextInput
                placeholder="Search Skill Test"
                onChangeText={(text: any) => setSearchText(text)}
                value={searchText}
                style={[common.input, { marginBottom: 0 }]}
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
            <View style={{ width: '15%' }}>
              {
                // isFilter &&
                <Button radius={"sm"} type="clear" onPress={() => setIsFilter(true)}>
                  <Icon name="filter" color={YoColors.primary} size={18} />
                </Button>
                // :
                // <Button radius={"sm"} type="clear" onPress={() => setIsFilter(true)}>
                //   <Icon name="filter" color={YoColors.primary} size={18} />
                // </Button>
              }
            </View>
          </View>
          {/* <View style={{ width: '48%' }}>
          <Button
            title="Create AI Skill Test"
            onPress={() => setIsOpenModal(true)}
            buttonStyle={[btnStyle.outline, common.px12, { height: 45 }]}
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
            containerStyle={[common.my10]}
          />
        </View> */}
        </View>

        {teacherList && teacherList.length > 0 ? (
          <FlatList
            data={teacherList}
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

      {isFilter &&
        <Modal
          isVisible={isFilter}
          onBackButtonPress={() => setIsFilter(false)}
          swipeDirection="down"
          onBackdropPress={() => setIsFilter(false)}
          style={{ margin: 0, alignItems: "center", justifyContent: 'flex-end' }}
          useNativeDriver
        >
          <View
            style={[common.px12, {
              backgroundColor: YoColors.background,
              minHeight: '42%',
              maxHeight: '70%',
              width: '100%',
            }]}
          >
            <Text style={[common.h3Title, common.my10]}>Select Filters</Text>

            <View>
              <View>
                <Text style={[common.title, common.mb10]}>Grade</Text>

                {userInfo?.studentGradeId &&
                  <Card containerStyle={[styles.cardContainer, { backgroundColor: YoColors.bgColor }]}>
                    <Image
                      style={styles.cardImage}
                      resizeMode="contain"
                      source={image.knowledge}
                    />
                    <Card.Title style={styles.cardTitle}>{userInfo?.studentGradeId}</Card.Title>
                  </Card>
                }
              </View>
              <View>
                <Text style={[common.title, common.mb10]}>Subject</Text>
                <View style={{ flexDirection: 'row' }}>
                  {subjectList && subjectList?.length > 0 ?
                    subjectList.map((item: any) => {
                      return (
                        <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (selectedSubject == item.id ? YoColors.bgColor : 'white') }]}>
                          <Pressable onPress={() => { setSelectedSubject(item.id); }}>
                            <Image
                              style={styles.cardImage}
                              resizeMode="contain"
                              source={image.subject}
                            />
                            <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
                          </Pressable>
                        </Card>
                      )
                    })
                    : null}
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Button
                  title="Clear"
                  type="outline"
                  buttonStyle={{ borderColor: YoColors.primary }}
                  titleStyle={btnStyle.outlineTitle}
                  containerStyle={{
                    width: '40%',
                    marginVertical: 10,
                    marginRight: 12
                  }}
                  onPress={() => handleFilter('clear')}
                />
                <Button
                  title="Apply"
                  buttonStyle={{
                    backgroundColor: YoColors.primary,
                    borderRadius: 3,
                  }}
                  containerStyle={{
                    width: '40%',
                    marginVertical: 10,
                  }}
                  onPress={() => handleFilter('apply')}
                />
              </View>
            </View>

          </View>
        </Modal>
      }
    </>
  );
};

export default SkillsTestList;

const styles = StyleSheet.create({
  cardContainer: {
    width: '24%',
    padding: 5,
    margin: 0,
    marginBottom: 10,
    marginRight: 5
  },

  cardImage: {
    width: "100%",
    height: 30,
    marginVertical: 5
  },
  cardTitle: {
    marginBottom: 0
  },
});
