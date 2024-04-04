import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderView from "../common/HeaderView";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { cardStyle, common } from "../../assets/styles/Common";
import { YoImages } from "../../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import { getUsersDetails } from "../../apiconfig/SharedApis";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Button } from "react-native-elements";
import moment from "moment";
import { Card } from "@rneui/base";
import Loading from "../../screens/Loading";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { useToast } from "react-native-toast-notifications";

const UserProfile = () => {
  const { height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const toast: any = useToast();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>({});

  useEffect(() => {
    getUserDetails();
  }, [userInfo?.id]);

  const getUserDetails = () => {
    setIsLoading(true);
    setUserDetails({});
    getUsersDetails(userInfo?.id, userInfo?.type)
      .then((response: any) => {
        if (response?.data) {
          setUserDetails(response?.data);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      })
      .catch((error: any) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      <HeaderView title="User Profile" />
      <ScrollView
        style={[common.px12]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoader}
            onRefresh={() => {
              getUserDetails();
            }}
          />
        }
      >
        {isLoading ? (
          <View style={{ height: height - 65 }}>
            <Loading />
          </View>
        ) : (
          <>
            <Text style={[common.my10, common.h3Title]}>Personal Details</Text>
            <Card containerStyle={[cardStyle.container]}>
              <View style={{ alignItems: "center" }}>
                {userDetails?.image ? (
                  <Image
                    source={{ uri: userDetails?.image }}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 40,
                    }}
                  />
                ) : (
                  <Image
                    source={image.DefaultUser}
                    style={{
                      width: 75,
                      height: 75,
                      borderRadius: 40,
                    }}
                  />
                )}
              </View>
              <View style={[cardStyle.row, common.mtop10]}>
                <View>
                  <View style={[cardStyle.j_row]}>
                    <Text style={[common.title]}>
                      {userDetails?.firstname + " " + userDetails?.lastname}
                    </Text>
                  </View>

                  {userDetails?.phone && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons name="phone" size={12} />
                      <Text style={common.rText}> {userDetails?.phone}</Text>
                    </View>
                  )}

                  {userDetails?.email && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons name="email" size={12} />
                      <Text style={common.rText}> {userDetails?.email}</Text>
                    </View>
                  )}

                  {userDetails?.gender && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons
                        name="gender-male-female"
                        size={12}
                      />
                      <Text style={common.rText}> {userDetails?.gender}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
            <Text style={[common.my10, common.h3Title]}>Profile</Text>
            <Card containerStyle={[cardStyle.container]}>
              <View style={[cardStyle.row, common.mtop10]}>
                <View>
                  <View style={[cardStyle.j_row]}>
                    <Text style={[common.title]}>
                      {userDetails?.firstname + " " + userDetails?.lastname}
                    </Text>
                  </View>

                  {userDetails?.phone && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons name="phone" size={12} />
                      <Text style={common.rText}> {userDetails?.phone}</Text>
                    </View>
                  )}

                  {userDetails?.email && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons name="email" size={12} />
                      <Text style={common.rText}> {userDetails?.email}</Text>
                    </View>
                  )}

                  {userDetails?.gender && (
                    <View style={[cardStyle.row, common.mb5]}>
                      <MaterialCommunityIcons
                        name="gender-male-female"
                        size={12}
                      />
                      <Text style={common.rText}> {userDetails?.gender}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Card>
            <Text style={[common.my10, common.h3Title]}>Specialties</Text>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
