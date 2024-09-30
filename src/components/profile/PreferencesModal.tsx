import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import {
  getCategories,
  getGradeList,
  upsertUserInfo,
} from "../../apiconfig/SharedApis";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import {
  getUserInfo,
  saveAsyncData,
} from "../../shared/sharedDetails";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Card } from "@rneui/base";
import { Image } from "react-native";
import { YoImages } from "../../assets/themes/YoImages";

const PreferencesModal = ({
  isPreferencesModal = false,
  closeModal = (value: boolean) => { },
}) => {
  const userInfo = getUserInfo();
  const image: any = YoImages();
  const navigation: any = useNavigation();
  const YoColors = useThemeColor();
  const [isProcessLoader, setIsProcessLoader] = useState<boolean>(false);
  const [categoryType, setCategoryType] = useState<number>(userInfo?.category || 1);
  const [academicClass, setAcademicClass] = useState(userInfo.studentGradeId);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [classList, setClassList] = useState<any>([]);
  const { height, width } = Dimensions.get("window");

  // const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);

  useEffect(() => {
    if (categoryType) {
      getGradeList(categoryType).then((result: any) => {
        if (result.data) {
          setClassList(result.data);
        }
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }, [categoryType]);

  useFocusEffect(useCallback(() => {
    getCategoryData();
  }, []));

  const getCategoryData = () => {
    getCategories().then((res: any) => {
      setCategoryList(res.data);
    }).catch((error: any) => {
      console.log('error', error)
    })
  }

  const toggleModal = (isUpdated: boolean = false) => {
    closeModal(isUpdated); // Toggle the modal visibility state
  };

  const handleGradeChange = (id: any) => {
    const payload: any = {
      id: userInfo.id,
      firstName: userInfo.firstName,
      lastName: !userInfo.lastName ? "" : userInfo.lastName,
      phone: userInfo.phone,
      email: !userInfo.email ? "" : userInfo.email,
      type: userInfo.type,
      dateOfBirth: !userInfo.dateOfBirth ? "" : userInfo.dateOfBirth,
      gender: !userInfo.gender ? "" : userInfo.gender,
      category: categoryType,
      gradeId: academicClass
    };
    setIsProcessLoader(true);
    console.log('payload', payload);
    upsertUserInfo(payload)
      .then((response: any) => {
        if (
          response.data &&
          response.data?.message === "Update_Suucessfully."
        ) {
          let dataObject = userInfo;
          dataObject.studentGradeId = id;
          dataObject.category = categoryType;
          saveAsyncData("userData", dataObject);
          // setIsPopupModalVisible(true);
          toggleModal(true);
          setIsProcessLoader(false); (false);
          navigation.goBack(null);
          navigation.navigate("Home");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching :", error);
      });
  };

  return (
    <Modal
      isVisible={isPreferencesModal}
      onBackButtonPress={() => toggleModal(false)}
      onBackdropPress={() => toggleModal(false)}
      onSwipeComplete={() => toggleModal(false)}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
      {/* {isPopupModalVisible && (
        <PopupModal
          message="Preferences has been successfully updated."
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )} */}
      <>
        <View
          style={{
            backgroundColor: YoColors.background,
            height: height - 100,
            minHeight: 150,
          }}
        >
          <View
            style={[
              cardStyle.j_row,
              common.p12
            ]}
          >
            <Text style={common.h3Title}>Update Preferences</Text>
            <Button
              onPress={() => toggleModal(false)}
              icon={
                <Ionicons
                  name="close-sharp"
                  size={24}
                  color={YoColors.primary}
                />
              }
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
          <ScrollView
            style={{ maxHeight: height - 180 }}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View style={styles.container}>
                <Card.Title style={[common.title, { textAlign: "left" }]}>
                  What are you preparing for?
                </Card.Title>
                <View style={styles.cardWrapper}>
                  {categoryList.map((item: any) => {
                    return (
                      <Card
                        key={item.id}
                        containerStyle={[
                          styles.cardContainer,
                          {
                            backgroundColor:
                              categoryType == item.id
                                ? YoColors.bgColor
                                : "white",
                          },
                        ]}
                      >
                        <Pressable
                          onPress={() => {
                            setCategoryType(item.id);
                          }}
                        >
                          <Image
                            style={[common.my10, styles.cardImage]}
                            resizeMode="contain"
                            source={{ uri: item.icon }}
                          />
                          <Text style={[common.rText, common.tCenter]}>{item.categoryName}</Text>
                        </Pressable>
                      </Card>
                    );
                  })}
                </View>
                {classList && classList?.length > 0 && (
                  <>
                    <Card.Title style={[{ textAlign: "left" }, common.title]}>Choose the area you're focusing on</Card.Title>
                    <View style={styles.cardWrapper}>
                      {classList.map((item: any) => {
                        return (
                          <Card
                            key={item.id}
                            containerStyle={[
                              styles.cardContainer,
                              {
                                backgroundColor:
                                  academicClass == item.id
                                    ? YoColors.bgColor
                                    : "white",
                              },
                            ]}
                          >
                            <Pressable
                              onPress={() => {
                                setAcademicClass(item.id);
                              }}
                            >
                              <Image
                                style={[common.my10, styles.cardImage]}
                                resizeMode="contain"
                                source={!item?.icon ? image.knowledge : { uri: item?.icon }}
                              />
                              <Text style={[common.rText, common.tCenter]}>{item.name}</Text>
                            </Pressable>
                          </Card>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
          <Button title='Update'
            loading={isProcessLoader}
            onPress={handleGradeChange}
            buttonStyle={[btnStyle.solid, { width: 120, alignSelf: 'center' }]}
            titleStyle={btnStyle.solidTitle}
            disabled={!categoryType || !academicClass}
          />
        </View>
      </>
    </Modal>
  );
};

export default PreferencesModal;

const styles = StyleSheet.create({
  input: {
    height: 45,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%", // Adjust width as needed
  },
  container: {
    paddingHorizontal: 12,
    //paddingTop: 40,
    overflow: "scroll",
  },
  cardWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardImage: {
    width: "100%",
    height: 30,
    marginVertical: 5
  },
  cardContainer: {
    width: "23%",
    padding: 5,
    margin: 0,
    marginHorizontal: 3,
    marginBottom: 10,
  },
});
