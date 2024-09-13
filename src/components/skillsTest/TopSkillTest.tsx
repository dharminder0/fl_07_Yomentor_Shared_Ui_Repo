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
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../assets/themes/colors";

const { width } = Dimensions.get("window");
const TopSkillTest = ({ title = "", data = [], isTop = true }) => {
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
        <View
          style={styles.item}
          key={index}
        >
          <View>
            {item.title && (
              <View style={cardStyle.row}>
                <Text style={[common.title]} numberOfLines={1}>
                  {item.title}
                </Text>
              </View>
            )}
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
                  <Text style={common.rText}> Avg Score: {item?.averageMarks}
                  </Text>
                </View>
              )}
              {item?.attemptCount > 0 && (
                <View style={[cardStyle.row, common.ps5]}>
                  <Icon name="users" size={12} />
                  <Text style={common.rText}> Attempted By: {item?.attemptCount}
                  </Text>
                </View>
              )}
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
      <View style={common.j_row}>
        {title && <Text style={[common.title, common.my10]}>{title}</Text>}
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}> */}
        {
          !isTop && data && data?.length > 0 && (
            <Button
              title="Create Skill Test"
              onPress={() => navigation.navigate("CreateSkillTest")}
              type="outline"
              buttonStyle={{ paddingHorizontal: 8, paddingVertical: 2, borderColor: YoColors.primary }}
              titleStyle={[btnStyle.outlineTitle, common.fs12]}
              containerStyle={common.mr10}
            />
          )}
        {data && data?.length > 0 && (
          <Button
            title="View All"
            icon={{
              name: 'eye',
              type: 'font-awesome',
              size: 12,
              color: YoColors.primary
            }}
            onPress={() => navigation.navigate("SkillsTestList", { useFor: isTop })}
            type="clear"
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
          />
        )}
        {/* </View> */}
      </View>

      {!isTop && !data || data?.length <= 0 && (
        <View style={[styles.item, common.mb10, { alignItems: 'center', backgroundColor: 'white', borderRadius: 6 }]}>
          <Image
            style={[common.mtop10, { width: '90%', height: 240 }]}
            resizeMode="contain"
            source={image.skillsTest}
          />
          <Text style={[common.mb10, { color: YoColors.primary, textAlign: 'center' }]}>You haven't created any tests yet! Design a test tailored to your needs and take control of your learning.</Text>
          <Button
            title="Create Skill Test"
            onPress={() => navigation.navigate("CreateSkillTest")}
            buttonStyle={[btnStyle.solid]}
            titleStyle={[common.fs12]}
            containerStyle={[common.mr10, { width: 150 }]}
          />
        </View>
      )
      }

      {data && data?.length > 0 &&
        <VirtualizedList
          contentContainerStyle={{ marginVertical: 10 }}
          data={data}
          initialNumToRender={5}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id}
          getItemCount={getItemCount}
          getItem={getItem}
          style={{ backgroundColor: YoColors.background }}
        />
      }

      {/* {isOpenModal &&
        <AddSkillTestModal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      } */}
    </View>
  );
};

export default TopSkillTest;

const styles = StyleSheet.create({
  item: {
    width: "100%",
    marginEnd: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
});
