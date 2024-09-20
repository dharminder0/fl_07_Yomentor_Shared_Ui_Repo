import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { YoImages } from "../../assets/themes/YoImages";
import { useNavigation } from "@react-navigation/native";
import { getGradeList, getUsersDetails } from "../../apiconfig/SharedApis";
import {
  getCategoryList,
  getUserInfo,
  requestLocationPermission,
  saveAsyncData,
} from "../../shared/sharedDetails";
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
import AddressUpdateModal from "./AddressUpdateModal";
import { Card } from "@rneui/base";
import PreferencesModal from "./PreferencesModal";

const UserProfile = () => {
  const { height } = Dimensions.get("window");
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const toast: any = useToast();
  const image: any = YoImages();
  const userInfo: any = getUserInfo();
  const categoryList: any = getCategoryList();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isAddressModal, setIsAddressModal] = useState<boolean>(false);
  const [isPreferencesModal, setIsPreferencesModal] = useState<boolean>(false);
  const [isBasicModal, setIsBasicModal] = useState<boolean>(false);
  const [isSpecilityModal, setIsSpecilityModal] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const [selectedGrade, setSelectedGrade] = useState<any>({});
  const [selectedCategory, setselectedCategory] = useState<any>({});
  const [categoryType, setCategoryType] = useState<number>(
    !userInfo?.category ? 1 : userInfo?.category
  );
  const [academicClass, setAcademicClass] = useState(userInfo.studentGradeId);

  useEffect(() => {
    setselectedCategory(
      categoryList.find((category: any) => category.id === categoryType)
    );
    getGradeList(categoryType).then((result: any) => {
      if (result.data) {
        setSelectedGrade(
          result.data.find((grade: any) => grade.id === academicClass)
        );
      }
    });
    requestLocationPermission();
    getUserDetails();
  }, []);

  const updateInfo = (isUpdated: boolean) => {
    if (isUpdated) {
      getUserDetails();
    }
    setIsBasicModal(false);
    setModalVisible(false);
    setIsAddressModal(false);
    setIsPreferencesModal(false);
  };

  const getUserDetails = () => {
    setIsLoading(true);
    setUserDetails({});
    getUsersDetails(userInfo?.id, userInfo?.type)
      .then((response: any) => {
        if (response?.data) {
          setUserDetails(response?.data);
          saveAsyncData("userData", response?.data);
          setCategoryType(response?.data?.category);
          setAcademicClass(response?.data?.studentGradeId);
          setselectedCategory(
            categoryList.find(
              (category: any) => category.id === response?.data?.category
            )
          );
          getGradeList(response?.data?.category).then((result: any) => {
            if (result.data) {
              setSelectedGrade(
                result.data.find(
                  (grade: any) => grade.id === response?.data?.studentGradeId
                )
              );
            }
          });
          console.log("User info res", response?.data);
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
      style={{ backgroundColor: YoColors.background }}
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
            <Image
              source={
                userDetails?.image
                  ? { uri: userDetails?.image }
                  : image.DefaultUser
              }
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
              }}
            />
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
                entityId={userInfo?.id}
                mediaType={1}
                entityType={3}
                profileUrl={userDetails?.image}
                updateInfo={(value) => updateInfo(value)}
              />
            </View>
          </View>
          <View
            style={[common.p12, { borderTopWidth: 8, borderTopColor: "#ccc" }]}
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
                onPress={() => setIsBasicModal(true)}
                title="EDIT"
                titleStyle={[common.rText, { color: YoColors.primary }]}
                buttonStyle={[
                  btnStyle.btnCross,
                  {
                    paddingHorizontal: 1,
                    paddingStart: 15,
                    backgroundColor: YoColors.background,
                  },
                ]}
              />
            </View>
            <View>
              {userDetails?.firstName && (
                <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Icon
                    name="user-alt"
                    size={12}
                    color={YoColors.primary}
                    style={{ marginTop: 3 }}
                  />
                  <Text style={{ paddingStart: 5, color: YoColors.primary }}>
                    {userDetails?.firstName + " " + userDetails?.lastName}
                  </Text>
                </View>
              )}

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

          <View
            style={[common.p12, { borderTopWidth: 8, borderTopColor: "#ccc" }]}
          >
            <View
              style={[
                common.j_row,
                {
                  alignItems: "flex-start",
                },
              ]}
            >
              <Text style={[common.mb5, common.h2Title]}>Prefrences</Text>
              <Button
                onPress={() => setIsPreferencesModal(true)}
                title="EDIT"
                titleStyle={[common.rText, { color: YoColors.primary }]}
                buttonStyle={[
                  btnStyle.btnCross,
                  {
                    paddingHorizontal: 1,
                    paddingStart: 15,
                    backgroundColor: YoColors.background,
                  },
                ]}
              />
            </View>
            <View>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    width: "95%",
                  }}
                >
                  <View style={styles.cardWrapper}>
                    {selectedCategory && (
                      <Card
                        key={selectedCategory.id}
                        containerStyle={[
                          styles.cardContainer,
                          common.py10,
                          common.mr10,
                          { width: 100 },
                        ]}
                      >
                        <Image
                          style={styles.cardImage}
                          resizeMode="contain"
                          source={
                            selectedCategory.id == 1
                              ? image.knowledge
                              : image.competition
                          }
                        />
                        <Card.Title style={[styles.cardTitle, common.fs12]}>
                          {selectedCategory.name}
                        </Card.Title>
                      </Card>
                    )}

                    {selectedGrade && (
                      <Card
                        key={selectedGrade.id}
                        containerStyle={[
                          styles.cardContainer,
                          common.py10,
                          common.mr10,
                          { width: 100 },
                        ]}
                      >
                        <Image
                          style={
                            categoryType == 1
                              ? styles.cardImage
                              : styles.cardImage
                          }
                          resizeMode="contain"
                          source={
                            categoryType == 1
                              ? image.knowledge
                              : image.competition
                          }
                        />
                        <Card.Title style={[styles.cardTitle, common.fs12]}>
                          {selectedGrade.name}
                        </Card.Title>
                      </Card>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View
            style={[common.p12, { borderTopWidth: 8, borderTopColor: "#ccc" }]}
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
              <Button
                onPress={() => setIsAddressModal(true)}
                title="EDIT"
                titleStyle={[common.rText, { color: YoColors.primary }]}
                buttonStyle={[
                  btnStyle.btnCross,
                  {
                    paddingHorizontal: 1,
                    paddingStart: 15,
                    backgroundColor: YoColors.background,
                  },
                ]}
              />
            </View>
            <View>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    width: "95%",
                  }}
                >
                  {userDetails?.userAddress?.address1 && (
                    <View style={{ flexDirection: "row", marginBottom: 5 }}>
                      <Ionicons
                        name="location"
                        size={14}
                        color={YoColors.primary}
                        style={{ marginTop: 3 }}
                      />
                      <Text style={{ paddingStart: 5 }}>
                        {userDetails?.userAddress?.address1}{" "}
                        {userDetails?.userAddress?.city}{" "}
                        {userDetails?.userAddress?.pincode}{" "}
                        {userDetails?.userAddress?.stateName}
                      </Text>
                    </View>
                  )}
                  {userDetails?.userAddress?.address2 && (
                    <Text>{userDetails?.userAddress?.address2} </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {userInfo?.type === 1 && (
            <>
              <View
                style={[
                  common.p12,
                  { borderTopWidth: 8, borderTopColor: "#ccc" },
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
                        backgroundColor: YoColors.background,
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
                      <Icon
                        name="info-circle"
                        size={12}
                        style={{ marginTop: 2 }}
                        color={YoColors.primary}
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

      {isAddressModal && (
        <AddressUpdateModal
          isAddressModal={isAddressModal}
          closeModal={(value) => updateInfo(value)}
          userId={userInfo?.id}
        />
      )}

      {isPreferencesModal && (
        <PreferencesModal
          isPreferencesModal={isPreferencesModal}
          closeModal={(value) => updateInfo(value)}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  cardWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrapper1: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardContainer: {
    width: "23%",
    padding: 5,
    margin: 0,
    marginBottom: 10,
    marginRight: 5.5,
  },
  cardContainer1: {
    width: "48%",
    padding: 5,
    margin: 0,
    marginBottom: 10,
  },
  cardImage1: {
    width: "100%",
    height: 60,
    marginVertical: 5,
  },
  cardImage: {
    width: "100%",
    height: 30,
    marginVertical: 5,
  },
  cardTitle: {
    marginBottom: 0,
  },
  stepContainer: {
    marginVertical: 20,
    paddingHorizontal: 12,
    position: "relative",
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
