import {
  Alert,
  Dimensions,
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
  getStates,
  upsertAddress,
} from "../../apiconfig/SharedApis";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from "../common/PopupModal";
import SelectModal from "../common/SelectModal";
import {
  getLocation,
  requestLocationPermission,
} from "../../shared/sharedDetails";
import { useFocusEffect } from "@react-navigation/native";

const AddressUpdateModal = ({
  isAddressModal = false,
  closeModal = (value: boolean) => {},
  userId = 0,
}) => {
  const YoColors = useThemeColor();

  const { height, width } = Dimensions.get("window");

  const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const [stateList, setStateList] = useState<any>([]);
  const [location, setLocation] = useState<any>({});
  const [userAddress, setUserAddress] = useState<any>();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const toggleModal = (isUpdated: boolean = false) => {
    closeModal(isUpdated); // Toggle the modal visibility state
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      getAddressDetail();
      getStateList();
    }, [])
  );

  const getAddressDetail = async () => {
    getAddress(userId).then((result: any) => {
      if (!!result.data) {
        setUserAddress(result.data);
      }
    });
  };

  useEffect(() => {
    reset({
      id: userAddress?.id,
      address1: userAddress?.address1,
      city: userAddress?.city,
      stateId: userAddress?.stateId,
      pincode: userAddress?.pincode,
      latitude: userAddress?.latitude,
      longitude: userAddress?.longitude,
    });
  }, [userAddress]);

  const getCurrentLocation = () => {
    setIsProcessLoader(true);
    getLocation()
      .then((location: any) => {
        setLocation(location);
        const fetchState: any = stateList.find(
          (item: any) => item.name == location.state
        );
        reset({
          address1: location.place,
          city: location.city,
          pincode: location.pincode,
          state: location.state,
          stateId: fetchState?.id,
        });

        setTimeout(() => {
          setIsProcessLoader(false);
        }, 500);
      })
      .catch((error) => {
        if (error.code == 2) {
          Alert.alert(
            "Turn on Location",
            "Please turn on location to get your current location",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
        }
        if (error.code == 1) {
          requestLocationPermission();
        }
        console.log("Error getting location:", error);
        setTimeout(() => {
          setIsProcessLoader(false);
        }, 1000);
      });
  };

  const getStateList = () => {
    getStates().then((response: any) => {
      if (response.data) {
        setStateList(response.data);
      }
    });
  };

  const onSubmit = (data: any) => {
    setIsProcessLoader(true);
    const payload: any = {
      id: !userAddress?.id ? 0 : userAddress?.id,
      userId: userId,
      address1: data?.address1,
      city: data.city,
      stateId: data.stateId,
      pincode: data.pincode,
      latitude: !location?.latitude
        ? userAddress?.longitude
        : location?.latitude,
      longitude: !location?.longitude
        ? userAddress?.longitude
        : location?.longitude,
    };

    upsertAddress(payload)
      .then((response: any) => {
        if (response.data && response.data?.message === "Upsert Successfully") {
          setIsPopupModalVisible(true);
          toggleModal(true);
        }
        setTimeout(() => {
          setIsPopupModalVisible(false);
          setIsProcessLoader(false);
        }, 1000);
      })
      .catch((error: any) => {
        setTimeout(() => {
          setIsProcessLoader(false);
          setIsPopupModalVisible(false);
        }, 500);
        console.error("Error fetching :", error);
      });
  };

  return (
    <Modal
      isVisible={isAddressModal}
      onBackButtonPress={() => toggleModal(false)}
      onBackdropPress={() => toggleModal(false)}
      onSwipeComplete={() => toggleModal(false)}
      style={{ margin: 0, justifyContent: "flex-end" }}
      useNativeDriver
    >
      {isPopupModalVisible && (
        <PopupModal
          message="Address has been successfully updated."
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
      <>
        <ScrollView
          style={{ maxHeight: height - 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              backgroundColor: YoColors.background,
              height: height,
              minHeight: 150,
            }}
          >
            <View
              style={[cardStyle.j_row, { padding: 12, alignItems: "center" }]}
            >
              <Text style={common.h3Title}>Update Address</Text>
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
            <View style={{ paddingHorizontal: 12 }}>
              <Button
                onPress={getCurrentLocation}
                title={"Use Current Location"}
                icon={
                  <Ionicons
                    name="location"
                    size={12}
                    color={YoColors.primary}
                  />
                }
                iconPosition="right"
                buttonStyle={[btnStyle.outline, common.px12]}
                titleStyle={[btnStyle.outlineTitle, common.fs12]}
                containerStyle={[common.mb10, { width: 155 }]}
              />

              <Controller
                control={control}
                name="address1"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: errors.address1 ? "red" : "#ccc",
                        height: 80,
                        verticalAlign: "top",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    multiline={true}
                    placeholder="Address 1"
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="City"
                  />
                )}
              />

              <Controller
                control={control}
                name="pincode"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    onChangeText={onChange}
                    style={[
                      styles.input,
                      {
                        borderColor: "#ccc",
                      },
                    ]}
                    placeholderTextColor={YoColors.placeholderText}
                    value={value}
                    placeholder="Pin Code"
                  />
                )}
              />

              <Controller
                control={control}
                name="stateId"
                render={({ field: { onChange, value } }) => (
                  <SelectModal
                    data={stateList}
                    placeholder="Select State"
                    defaultValue={stateList.find(
                      (item: any) =>
                        item.id ==
                        (!userAddress?.stateId
                          ? getValues("stateId")
                          : userAddress?.stateId)
                    )}
                    onChanged={(values: any) => {
                      setValue("stateId", values?.id);
                    }}
                  />
                )}
              />

              <View style={{ marginTop: 20, alignItems: "center" }}>
                <Button
                  title="Update"
                  loading={isProcessLoader}
                  buttonStyle={btnStyle.solid}
                  titleStyle={btnStyle.solidTitle}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </>
    </Modal>
  );
};

export default AddressUpdateModal;

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
});
