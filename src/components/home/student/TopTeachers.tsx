import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import React from "react";
import { btnStyle, cardStyle, common } from "../../../assets/styles/Common";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../../assets/themes/YoImages";
import { YoColors } from "../../../assets/themes/YoColors";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/base";

const TopTeachers = ({ title = "", data = [] }) => {
  const image: any = YoImages();
  const navigation: any = useNavigation();
  const getItem = (data: any, index: any) => data[index];

  const getItemCount = () => data.length;

  const renderItem = ({ item, index }: any) => {
    return (
      <Pressable
        onPress={() => navigation.navigate("UserDetails", { detail: item })}
      >
        <View style={styles.item} key={index}>
          <View>
            <View style={[common.mb10, { alignItems: "center" }]}>
              <Image
                source={image.DefaultUser}
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: 33,
                }}
              />
            </View>
            <View style={{ alignItems: "center" }}>
              <View style={[cardStyle.j_row]}>
                <Text style={[common.title]} numberOfLines={1}>
                  {item?.firstName + " " + item?.lastName}
                </Text>
              </View>

              {item?.education && (
                <View style={cardStyle.row}>
                  <Text style={common.rText} numberOfLines={1}>
                    {item?.education}
                  </Text>
                </View>
              )}

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
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <View style={[common.j_row]}>
        {title && <Text style={[common.title, common.my10]}>{title}</Text>}
        <Button
          title="View All"
          onPress={() => navigation.navigate("TeachersList")}
          buttonStyle={[btnStyle.outline]}
          titleStyle={[btnStyle.outlineTitle, common.fs12]}
        />
      </View>

      <VirtualizedList
        contentContainerStyle={{ flexDirection: "row", marginBottom: 10 }}
        scrollEnabled={true}
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        initialNumToRender={5}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        getItemCount={getItemCount}
        getItem={getItem}
      />
    </View>
  );
};

export default TopTeachers;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    height: 160,
    width: 130,
    marginEnd: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
});
