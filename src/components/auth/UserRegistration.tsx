import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "react-native-elements";
import { common } from "../../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";
import { upsertUser, userLogin } from "../../apiconfig/AuthService";
import PopupModal from "../common/PopupModal";
import useStore from "../../store/useStore";
import { YoImages } from "../../assets/themes/YoImages";
import { saveAsyncData } from "../../shared/sharedDetails";

const UserRegistration = ({ route }: any) => {
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const userType: any = route.params.userType;
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
          navigation.navigate("Login");
        }, 3000);
      }
    });
  };

  return (
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
        name="firstname"
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
                  borderColor: errors.firstname ? "red" : "#ccc",
                },
              ]}
            />
            {errors.firstname && (
              <Text style={common.errorText}>{errors.firstname.message}</Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="lastname"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            placeholder="Last Name"
            style={[common.input]}
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
            />
            {errors.password && (
              <Text style={common.errorText}>{errors.password.message}</Text>
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
            marginTop: 20,
            justifyContent: "flex-end",
          },
        ]}
      >
        <Text style={common.rText}>Already have an account</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[common.rText, { color: YoColors.primary }]}>
            {" "}
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
