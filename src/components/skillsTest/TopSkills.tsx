import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  VirtualizedList,
} from "react-native";
import React from "react";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const TopSkills = ({ title = "", data = [] }) => {
  const image: any = YoImages();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const getItem = (data: any, index: any) => data[index];

  const getItemCount = () => data.length;

  const renderItem = ({ item, index }: any) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("SkillTestDetails", { skillId: item?.id })
        }
      >
        <View style={styles.item} key={index}>
          <View>
            {item.title && (
              <View style={cardStyle.j_row}>
                <Text style={[common.title]} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.averageMarks && (
                  <Text style={[common.rText]}>{item.averageMarks}</Text>
                )}
              </View>
            )}
            <View style={[common.row, common.mb5]}>
              <View style={cardStyle.row}>
                <Icon name="laptop" size={12} />
                <Text style={common.rText}>{item?.gradeName}</Text>
              </View>
              <View style={[cardStyle.row, common.ph10]}>
                <Icon name="book" size={12} />
                <Text style={common.rText}> {item?.subjectName}</Text>
              </View>
            </View>

            {item?.description && (
              <View style={cardStyle.row}>
                <Text style={common.rText} numberOfLines={1}>
                  {item?.description}
                </Text>
              </View>
            )}
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
          onPress={() => navigation.navigate("SkillsTestList")}
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

export default TopSkills;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    height: 100,
    width: width - 30,
    marginEnd: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
});
