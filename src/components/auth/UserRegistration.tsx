import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-native-elements";
import { common } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { upsertUser, userLogin } from "../../apiconfig/AuthService";
import PopupModal from "../common/PopupModal";
import useStore from "../../store/useStore";
import { YoImages } from "../../assets/themes/YoImages";
import { saveAsyncData } from "../../shared/sharedDetails";

const { height, width } = Dimensions.get("window");

const UserRegistration = ({ route }: any) => {
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const userType: any = route.params.userType;
  const [regError, setRegError] = useState<string>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  }: any = useForm();

  const { isPopupModal, setIsPopupModal }: any = useStore();

  useEffect(() => {
    setValue("type", userType);
  }, []);

  const onSubmit = (data: any) => {
    upsertUser(data).then((result: any) => {
      if (result.data && result.data?.success) {
        setIsPopupModal(true);
        setTimeout(() => {
          userLogin({ phone: data?.phone, password: data?.password }).then(
            (response: any) => {
              if (response?.data && response?.data.success) {
                saveAsyncData("userData", response?.data?.content);
                navigation.navigate("Startup");
              }
            }
          );
        }, 1000);
      }

      if (!result.data?.success && result.data) {
        setRegError(result.data.message);
        setTimeout(() => {
          setRegError("");
        }, 4000);
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {isPopupModal && (
            <PopupModal
              message="Registration Successful"
              icon={"checkmark-circle"}
              color={"green"}
              iconSize={40}
            />
          )}

          <View style={{ alignItems: "center", marginBottom: 50 }}>
            <Image source={image.icon} style={{ height: 102, width: 156 }} />
          </View>

          <Text style={[common.h2Title, { marginBottom: 20 }]}>
            Enter your details
          </Text>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: "First Name is required" }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="First Name"
                  style={[
                    common.input,
                    {
                      borderColor: errors.firstName ? "red" : "#ccc",
                    },
                  ]}
                  placeholderTextColor={YoColors.placeholderText}
                />
                {errors.firstName && (
                  <Text style={common.errorText}>
                    {errors.firstName.message}
                  </Text>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Last Name"
                style={[common.input]}
                placeholderTextColor={YoColors.placeholderText}
              />
            )}
          />
          {/* Repeat similar blocks for other fields */}
          {/* Email */}
          {/* <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              style={[
                common.input,
                {
                  borderColor: errors.name ? "red" : "#ccc",
                },
              ]}
            />
            {errors.email && (
              <Text style={common.errorText}>{errors.email.message}</Text>
            )}
          </>
        )}
      /> */}
          {/* Phone Number */}
          <Controller
            control={control}
            name="phone"
            rules={{ required: "Phone number is required" }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="Phone Number"
                  style={[
                    common.input,
                    {
                      borderColor: errors.phone ? "red" : "#ccc",
                    },
                  ]}
                  placeholderTextColor={YoColors.placeholderText}
                />
                {errors.phone && (
                  <Text style={common.errorText}>{errors.phone.message}</Text>
                )}
              </>
            )}
          />
          {/* Address */}
          {/* <Controller
        control={control}
        name="address"
        rules={{ required: "Address is required" }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Address"
              multiline
              style={[
                common.input,
                {
                  borderColor: errors.name ? "red" : "#ccc",
                  height: 60,
                },
              ]}
            />
            {errors.address && (
              <Text style={common.errorText}>{errors.address.message}</Text>
            )}
          </>
        )}
      /> */}
          {/* Password */}
          <Controller
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="Password"
                  secureTextEntry={true}
                  style={[
                    common.input,
                    {
                      borderColor: errors.name ? "red" : "#ccc",
                    },
                  ]}
                  placeholderTextColor={YoColors.placeholderText}
                />
                {errors.password && (
                  <Text style={common.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </>
            )}
          />
          {/* Confirm Password */}
          {/* <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Confirm Password is required",
          validate: (value) =>
            value === control.fieldsRef.current.password.value ||
            "Passwords do not match",
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Confirm Password"
              secureTextEntry={true}
              style={[
                common.input,
                {
                  borderColor: errors.name ? "red" : "#ccc",
                },
              ]}
            />
            {errors.confirmPassword && (
              <Text style={common.errorText}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}
      /> */}

          {regError && (
            <Text style={[common.errorText, { textTransform: "capitalize" }]}>
              {regError}
            </Text>
          )}

          <Button
            title="Register"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 20 }}
            titleStyle={{ fontWeight: "600" }}
          />
          <View
            style={[
              common.row,
              {
                marginTop: 12,
                justifyContent: "flex-end",
              },
            ]}
          >
            <Text style={common.rText}>Already have an account</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
              style={{ paddingVertical: 6 }}
            >
              <Text style={[common.rText, { color: YoColors.primary }]}>
                {" "}
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserRegistration;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 20,
    height: height,
  },
});
