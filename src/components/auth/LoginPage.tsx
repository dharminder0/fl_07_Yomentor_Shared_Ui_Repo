import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Text, Image } from "react-native";
import { Input, Button } from "react-native-elements";
import { useForm, Controller } from "react-hook-form";
import { saveAsyncData } from "../../shared/sharedDetails";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { common } from "../../assets/styles/Common";
import { YoColors } from "../../assets/themes/YoColors";
import { userLogin } from "../../apiconfig/AuthService";
import { YoImages } from "../../assets/themes/YoImages";

const { height, width } = Dimensions.get("window");
const LoginPage = () => {
  const image: any = YoImages();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  }: any = useForm();

  const navigation: any = useNavigation();

  const onSubmit = (data: any) => {
    if (!!data?.phone && !!data?.password) {
      userLogin(data).then((result: any) => {
        setIsLoggedIn(result?.data.success);
        if (result?.data && result?.data.success) {
          saveAsyncData("userData", result?.data?.content);
          navigation.navigate("Startup");
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 80 }}>
        <Image source={image.icon} style={{ height: 102, width: 156 }} />
      </View>

      <Controller
        control={control}
        name="phone"
        defaultValue=""
        rules={{ required: "Phone Number is required" }}
        render={({ field: { onChange, value } }) => (
          <>
            <Input
              placeholder="Phone Number"
              leftIcon={{ type: "Ionicons", name: "phone" }}
              onChangeText={onChange}
              value={value}
              containerStyle={{ height: 55, marginBottom: 10 }}
              errorStyle={{ fontSize: 10 }}
              errorMessage={errors.phone?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        rules={{ required: "Password is required" }}
        render={({ field: { onChange, value } }) => (
          <>
            <Input
              placeholder="Password"
              leftIcon={{ type: "Ionicons", name: "lock" }}
              secureTextEntry
              onChangeText={onChange}
              value={value}
              containerStyle={{ height: 55, marginBottom: 10 }}
              errorStyle={{ fontSize: 10 }}
              errorMessage={errors.password?.message}
            />
          </>
        )}
        name="password"
        defaultValue=""
      />
      {!isLoggedIn && (
        <Text style={[common.errorText, { marginTop: 10, marginStart: 15 }]}>
          Incorrect Phone Number or Password
        </Text>
      )}

      <Button
        title="Login"
        onPress={handleSubmit(onSubmit)}
        buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 20 }}
        titleStyle={{ fontWeight: "600" }}
        containerStyle={{ width: "100%" }}
      />
      <View
        style={[
          common.row,
          {
            marginTop: 10,
            justifyContent: "flex-end",
          },
        ]}
      >
        <Text style={common.rText}>Create a new account</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SelectUserType")}>
          <Text style={[common.rText, { color: YoColors.primary }]}>
            {" "}
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default LoginPage;
