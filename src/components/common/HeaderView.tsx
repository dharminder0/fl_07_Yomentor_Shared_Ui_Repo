import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { cardStyle } from "../../assets/styles/Common";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useThemeColor } from "../../assets/themes/useThemeColor";

const HeaderView = ({ title = "", type = "back" }) => {
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const openDrawerScreen = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <View
      style={[
        cardStyle.row,
        {
          backgroundColor: YoColors.primary,
          alignItems: "center",
          paddingHorizontal: 15,
          paddingVertical: 5
          // marginBottom: 5,
        },
      ]}
    >
      {type === "back" && (
        <MaterialCommunityIcons
          name="arrow-left"
          size={25}
          color={"#fff"}
          style={{ borderRadius: 15 }}
          onPress={() => navigation.goBack()}
        />
      )}
      {type === "drawer" && (
        <MaterialCommunityIcons
          name="menu"
          size={27}
          color={"#fff"}
          onPress={openDrawerScreen}
        />
      )}
      <Text
        style={{
          color: "#fff",
          fontSize: 21,
          marginVertical: 10,
          fontWeight: "500",
          textAlign: "center",
          width: "86%",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default HeaderView;

const styles = StyleSheet.create({});
