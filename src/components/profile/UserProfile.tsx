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
import { getUserInfo, saveAsyncData } from "../../shared/sharedDetails";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Loading from "../../screens/Loading";
import { useToast } from "react-native-toast-notifications";
import UpdatePhoto from "../common/UpdatePhoto";
import ProfileUpdateModal from "./ProfileUpdateModal";
import { Button } from "react-native-elements";
import SpecialityModal from "./SpecialityModal";
import BasicInfoUpdateModal from "./BasicInfoUpdateModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import moment from "moment";

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

  const updateInfo = (isUpdated: boolean) => {
    if (isUpdated) {
      getUserDetails();
    }
    setIsBasicModal(false);
    setModalVisible(false);
  };

  const getUserDetails = () => {
    setIsLoading(true);
    setUserDetails({});
    getUsersDetails(userInfo?.id, userInfo?.type)
      .then((response: any) => {
        if (response?.data) {
          setUserDetails(response?.data);
          saveAsyncData("userData", response?.data);
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
                updateInfo={(value) => updateInfo(value)}
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
                  {userDetails?.firstName + " " + userDetails?.lastName}
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
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Icon
                    name="phone-alt"
                    size={12}
                    color={YoColors.primary}
                    style={{ marginTop: 3 }}
                  />
                  <Text style={{ paddingStart: 5 }}>{userDetails?.phone}</Text>
                </View>
              )}

              {userDetails?.email && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <FontAwesome
                    name="envelope"
                    size={12}
                    color={YoColors.primary}
                    style={{ marginTop: 3 }}
                  />
                  <Text style={{ paddingStart: 5 }}>{userDetails?.email}</Text>
                </View>
              )}

              {userDetails?.gender && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <FontAwesome5
                    name="transgender"
                    size={14}
                    color={YoColors.primary}
                    style={{ marginTop: 3 }}
                  />
                  <Text style={{ paddingStart: 5 }}>{userDetails?.gender}</Text>
                </View>
              )}

              {userDetails?.dateOfBirth && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <FontAwesome5
                    name="birthday-cake"
                    size={14}
                    color={YoColors.primary}
                    style={{ marginTop: 3 }}
                  />
                  <Text style={{ paddingStart: 5 }}>
                    {moment(userDetails?.dateOfBirth).format("DD-MM-YYYY")}
                  </Text>
                </View>
              )}
            </View>
          </View>
          {(userDetails?.userAddress?.address1 ||
            userDetails?.userAddress?.address2) && (
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
                <Text style={[common.mb5, common.h2Title]}>Address</Text>
              </View>
              <View>
                {(userDetails?.userAddress?.address1 ||
                  userDetails?.userAddress?.address2) && (
                  <View style={{ flexDirection: "row", marginBottom: 5 }}>
                    <Ionicons
                      name="location"
                      size={14}
                      color={YoColors.primary}
                      style={{ marginTop: 3 }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                        width: "95%",
                      }}
                    >
                      {userDetails?.userAddress?.address1 && (
                        <Text style={{ paddingStart: 5 }}>
                          {userDetails?.userAddress?.address1}
                        </Text>
                      )}
                      {userDetails?.userAddress?.address1 &&
                        userDetails?.userAddress?.address2 && <Text>, </Text>}
                      {userDetails?.userAddress?.address2 && (
                        <Text>{userDetails?.userAddress?.address2}</Text>
                      )}
                      {userDetails?.userAddress?.address2 &&
                        userDetails?.userAddress?.city && <Text>, </Text>}
                      {userDetails?.userAddress?.city && (
                        <Text>{userDetails?.userAddress?.city}</Text>
                      )}
                      {userDetails?.userAddress?.city &&
                        userDetails?.userAddress?.stateName && <Text>, </Text>}
                      {userDetails?.userAddress?.stateName && (
                        <Text>{userDetails?.userAddress?.stateName}</Text>
                      )}
                      {userDetails?.userAddress?.stateName &&
                        userDetails?.userAddress?.pincode && <Text>, </Text>}
                      {userDetails?.userAddress?.pincode && (
                        <Text>{userDetails?.userAddress?.pincode}</Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

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
                        size={12}
                        color={YoColors.primary}
                        style={{ marginTop: 3 }}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.education}
                      </Text>
                    </View>
                  )}

                  {userDetails?.teacherProfile?.experience && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <FontAwesome5
                        name="chalkboard-teacher"
                        size={12}
                        color={YoColors.primary}
                        style={{ marginTop: 3 }}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.experience +
                          " years of experience"}
                      </Text>
                    </View>
                  )}

                  {userDetails?.teacherProfile?.about && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <FontAwesome5
                        name="chalkboard-teacher"
                        size={12}
                        color={YoColors.primary}
                        style={{ marginTop: 3 }}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.teacherProfile?.about}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* <View style={[common.p12]}>
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
              </View> */}
            </>
          )}
        </>
      )}

      {isBasicModal && (
        <BasicInfoUpdateModal
          isBasicModal={isBasicModal}
          closeModal={(value) => updateInfo(value)}
          dataToEdit={userDetails}
        />
      )}

      {isModalVisible && (
        <ProfileUpdateModal
          isBasicModal={isModalVisible}
          closeModal={(value) => updateInfo(value)}
          dataToEdit={userDetails}
        />
      )}

      <SpecialityModal
        isSpecilityModal={isSpecilityModal}
        setIsSpecilityModal={setIsSpecilityModal}
      />
    </ScrollView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
