import {
  Dimensions,
  FlatList,
  Image,
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

const TeachersList = () => {
  const { height } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const image: any = YoImages();
  const [isLoading, setIsLoading] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  }: any = useForm();

  useEffect(() => {
    setIsLoading(true);
    getUserList();
  }, []);

  const getUserList = () => {
    const payload: any = {
      searchText: "",
      userType: 1,
      grade: "5",
      subject: [1],
      pageSize: 10,
      pageIndex: 1,
    };
    getUsersList(payload)
      .then((response: any) => {
        if (response.data && response.data.length > 0) {
          setTeacherList(response.data);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error("Error fetching :", error);
      });
  };

  const handleSearch = (input: any) => {
    console.log(input);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      //   onPress={() => gotoBatchDetail(item?.id)}
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
              <MaterialCommunityIcons name="star" size={12} />
              <Text style={common.rText}>
                {" "}
                {item?.averageRating} Rating({item?.reviewCount})
              </Text>
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
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      onChangeText={onChange}
                      value={value}
                      placeholder="Search Teacher"
                      style={[
                        common.input,
                        {
                          borderColor: errors.name ? "red" : "#ccc",
                        },
                      ]}
                      onSubmitEditing={handleSearch}
                    />
                    <Ionicons
                      name="search-outline"
                      size={21}
                      style={{ position: "absolute", right: 10, top: 12 }}
                    />
                  </>
                )}
              />
            </View>
            <FlatList
              data={teacherList}
              keyExtractor={(item: any) => item?.id}
              renderItem={renderItem}
              style={{ height: height - 125, marginTop: 5 }}
              windowSize={height - 125}
              showsVerticalScrollIndicator={false}
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
