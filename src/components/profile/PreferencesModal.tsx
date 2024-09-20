import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import {
  getAddress,
  getGradeList,
  getStates,
  upsertAddress,
  upsertUserInfo,
} from "../../apiconfig/SharedApis";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import {
  getCategoryList,
  getLocation,
  getUserInfo,
  requestLocationPermission,
  saveAsyncData,
} from "../../shared/sharedDetails";
import { useFocusEffect } from "@react-navigation/native";
import { Card } from "@rneui/base";
import { Image } from "react-native";
import { YoImages } from "../../assets/themes/YoImages";

const PreferencesModal = ({
  isPreferencesModal = false,
  closeModal = (value: boolean) => {},
}) => {
  const userInfo = getUserInfo();
  const image: any = YoImages();
  const YoColors = useThemeColor();
  const [categoryType, setCategoryType] = useState<number>(userInfo?.category || 1);
  const [academicClass, setAcademicClass] = useState(userInfo.studentGradeId);
  const [classList, setClassList] = useState<any>([]);
  const { height, width } = Dimensions.get("window");

  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (categoryType) {
      getGradeList(categoryType).then((result: any) => {
        if (result.data) {
          setClassList(result.data);
          console.log('academicClass',academicClass)
          console.log('categoryType', categoryType)
          console.log(result.data)
        }
      });
    }
  }, [categoryType]);

  const toggleModal = (isUpdated: boolean = false) => {
    closeModal(isUpdated); // Toggle the modal visibility state
    reset();
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
      gradeId: id

    };
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
          setIsPopupModalVisible(true);
          setTimeout(() => {
            setIsPopupModalVisible(false);
            toggleModal(true);
          }, 1000);
        }
        console.log('response', response.data);
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
      {isPopupModalVisible && (
        <PopupModal
          message="Preferences has been successfully updated."
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
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
              { paddingHorizontal: 12, alignItems: "center" },
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
            style={{ maxHeight: height - 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ paddingHorizontal: 12 }}>
              <View style={styles.container}>
                <Card.Title
                  style={[common.my10, common.title, { textAlign: "left" }]}
                >
                  Are you preparing for:
                </Card.Title>
                <View style={styles.cardWrapper}>
                  {getCategoryList().map((item: any) => {
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
                            source={
                              item.id == 1 ? image.knowledge : image.competition
                            }
                          />
                          <Card.Title style={common.rText}>
                            {item.name}
                          </Card.Title>
                        </Pressable>
                      </Card>
                    );
                  })}
                </View>
                {classList && classList?.length > 0 && (
                  <>
                    <Card.Title style={[{ textAlign: "left" }, common.title]}>
                      {categoryType === 1
                        ? "Please choose your current grade or academic level to help us tailor the skill tests to your curriculum:"
                        : "Please choose the competitive exam you are preparing for so we can customize your practice tests:"}
                    </Card.Title>
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
                                handleGradeChange(item.id);
                              }}
                            >
                              <Image
                                style={[common.my10, styles.cardImage]}
                                resizeMode="contain"
                                source={
                                  categoryType == 1
                                    ? image.knowledge
                                    : image.competition
                                }
                              />
                              <Card.Title style={common.rText}>
                                {item.name}
                              </Card.Title>
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
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardImage: {
    width: "100%",
    height: 60,
  },
  cardContainer: {
    width: "48%",
    padding: 5,
    margin: 0,
    marginBottom: 10,
  },
});
