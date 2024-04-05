import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { YoImages } from "../../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import { getUsersDetails } from "../../apiconfig/SharedApis";
import { getUserInfo } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import Loading from "../../screens/Loading";
import { useToast } from "react-native-toast-notifications";
import UpdatePhoto from "../common/UpdatePhoto";
import ProfileUpdateModal from "./ProfileUpdateModal";
import { Button } from "react-native-elements";
import SpecialityModal from "./SpecialityModal";
import BasicInfoUpdateModal from "./BasicInfoUpdateModal";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserProfile = () => {
  const { height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const toast: any = useToast();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isBasicModal, setIsBasicModal] = useState<boolean>(false);
  const [isSpecilityModal, setIsSpecilityModal] = useState<boolean>(false);
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshLoader}
          onRefresh={() => {
            getUserDetails();
          }}
        />
      }
      style={{ backgroundColor: "#fff" }}
    >
      {isLoading ? (
        <View style={{ height: height }}>
          <Loading />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 25,
            }}
          >
            {userDetails?.image ? (
              <Image
                source={{ uri: userDetails?.image }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            ) : (
              <Image
                source={image.DefaultUser}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            )}
            <View
              style={{
                height: 36,
                width: 36,
                borderRadius: 18,
                right: 20,
                top: 25,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UpdatePhoto
                userId={userInfo?.id}
                mediaType={1}
                entityType={3}
                profileUrl={userDetails?.image}
              />
            </View>
          </View>
          <View
            style={[
              common.p12,
              { borderBottomWidth: 8, borderBottomColor: "#ccc" },
            ]}
          >
            <View>
              <View style={[cardStyle.j_row]}>
                <Text style={[common.h1Title]}>
                  {userDetails?.firstname + " " + userDetails?.lastname}
                </Text>
                <Button
                  onPress={() => setIsBasicModal(true)}
                  icon={<Icon name="pencil-alt" size={16} />}
                  buttonStyle={[
                    btnStyle.btnCross,
                    {
                      paddingHorizontal: 1,
                      paddingStart: 15,
                    },
                  ]}
                />
              </View>

              {userDetails?.phone && (
                <View style={[cardStyle.row, common.mb5]}>
                  <MaterialCommunityIcons name="phone" size={14} />
                  <Text> {userDetails?.phone}</Text>
                </View>
              )}

              {userDetails?.email && (
                <View style={[cardStyle.row, common.mb5]}>
                  <MaterialCommunityIcons name="email" size={14} />
                  <Text> {userDetails?.email}</Text>
                </View>
              )}

              {userDetails?.gender && (
                <View style={[cardStyle.row, common.mb5]}>
                  <MaterialCommunityIcons name="gender-male-female" size={14} />
                  <Text> {userDetails?.gender}</Text>
                </View>
              )}

              {userDetails?.address && (
                <View style={[cardStyle.row, common.mb5]}>
                  <Ionicons name="location-sharp" size={14} />
                  <Text> {userDetails?.address}</Text>
                </View>
              )}
            </View>
          </View>

          {userInfo?.type === 1 && (
            <>
              <View
                style={[
                  common.p12,
                  { borderBottomWidth: 8, borderBottomColor: "#ccc" },
                ]}
              >
                <View
                  style={[
                    common.j_row,
                    {
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <Text style={[common.mb5, common.h2Title]}>Profile</Text>

                  <Button
                    onPress={() => setModalVisible(true)}
                    icon={<Icon name="pencil-alt" size={16} />}
                    buttonStyle={[
                      btnStyle.btnCross,
                      {
                        paddingHorizontal: 1,
                        paddingStart: 15,
                      },
                    ]}
                  />
                </View>
                <View>
                  {userDetails?.teacherProfile?.education && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Icon
                        name="user-graduate"
                        size={16}
                        color={YoColors.primary}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.education}
                      </Text>
                    </View>
                  )}

                  {userDetails?.teacherProfile?.experience && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Icon
                        name="info-circle"
                        size={16}
                        color={YoColors.primary}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.experience +
                          " years of experience"}
                      </Text>
                    </View>
                  )}

                  {userDetails?.teacherProfile?.about && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Icon
                        name="info-circle"
                        size={16}
                        color={YoColors.primary}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.about}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={[common.p12]}>
                <View
                  style={[
                    common.j_row,
                    {
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <Text style={[common.mb5, common.h2Title]}>Specialties</Text>
                  <Button
                    onPress={() => setIsSpecilityModal(true)}
                    icon={<Icon name="pencil-alt" size={16} />}
                    buttonStyle={[
                      btnStyle.btnCross,
                      {
                        paddingHorizontal: 1,
                        paddingStart: 15,
                      },
                    ]}
                  />
                </View>

                {userDetails?.teacherSpeciality?.gradeSubjectList?.length > 0 &&
                  userDetails?.teacherSpeciality?.gradeSubjectList?.map(
                    (item: any, index: number) => (
                      <Text key={index}>
                        {item.gradeName + " - " + item.subjectName}
                      </Text>
                    )
                  )}
              </View>
            </>
          )}
        </>
      )}

      <ProfileUpdateModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />

      <SpecialityModal
        isSpecilityModal={isSpecilityModal}
        setIsSpecilityModal={setIsSpecilityModal}
      />

      <BasicInfoUpdateModal
        isBasicModal={isBasicModal}
        setIsBasicModal={setIsBasicModal}
      />
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
