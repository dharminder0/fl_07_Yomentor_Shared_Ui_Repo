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
import { Card } from "@rneui/base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../../screens/Loading";
import NoDataView from "../../screens/NoDataView";
import { getSkilsList } from "../../apiconfig/SharedApis";

const SkillsTestList = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
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
      subjectId: !userInfo?.studentGradeId ? 0 : userInfo?.studentGradeId,
      pageSize: 10,
      pageIndex: pageIndex,
    };
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

  return (
    <View style={common.container}>
      <View style={[common.row, common.mtop10]}>
        <TextInput
          placeholder="Search Skill Test"
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
    </View>
  );
};

export default SkillsTestList;

const styles = StyleSheet.create({});
