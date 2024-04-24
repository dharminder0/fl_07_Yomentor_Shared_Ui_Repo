import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { btnStyle, common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { YoImages } from "../../assets/themes/YoImages";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const Welcome = ({ userType = 1, onAddModalOpen = () => {} }) => {
  const image: any = YoImages();
  const YoColors = useThemeColor();
  const navigation: any = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        backgroundColor: "#fff",
        marginVertical: 20,
        borderRadius: 6,
      }}
    >
      <Text style={[common.h1Title, common.mb10]}>Welcome to Yo!Mentor</Text>

      {userType === 3 && (
        <>
          <Text style={[common.mb10]}>
            You have not joined any batches yet. You can find a suitable batch
            and request to join.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              marginVertical: 5,
            }}
          >
            <Icon
              name="check"
              size={13}
              style={{ position: "absolute", left: 0, top: 2 }}
            />
            <Text style={{ paddingLeft: 20 }}>
              Find a teacher as per your tuition needs, view the teacher
              profile, and read the feedback given by other students.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              marginVertical: 5,
            }}
          >
            <Icon
              name="check"
              size={13}
              style={{ position: "absolute", left: 0, top: 2 }}
            />
            <Text style={{ paddingLeft: 20 }}>
              Shortlist the batches of your interest and discuss your tuition
              needs and fee details with the teacher.
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              marginVertical: 5,
            }}
          >
            <Icon
              name="check"
              size={13}
              style={{ position: "absolute", left: 0, top: 2 }}
            />
            <Text style={{ paddingLeft: 20 }}>
              Finally, enroll in the batch and keep going to excel in the
              subject.
            </Text>
          </View>

          <Button
            title="Find Teacher"
            onPress={() => navigation.navigate("TeachersList")}
            buttonStyle={[btnStyle.outline, common.px12]}
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
            containerStyle={[common.my10]}
          />
        </>
      )}

      {userType === 1 && (
        <>
          <Text style={[common.mb10]}>
            You don't have any active batches. Create your first batch to
            establish your presence on our platform.{" "}
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                marginVertical: 5,
              }}
            >
              <Icon
                name="check"
                size={13}
                style={{ position: "absolute", left: 0, top: 2 }}
              />
              <Text style={{ paddingLeft: 20 }}>
                Students/Parents can find the best batch as per their needs and
                enroll themselves in your batch.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                marginVertical: 5,
              }}
            >
              <Icon
                name="check"
                size={13}
                style={{ position: "absolute", left: 0, top: 2 }}
              />
              <Text style={{ paddingLeft: 20 }}>
                For your batch, you can manage student, attendance, assignments,
                assessments, and more.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                marginVertical: 5,
              }}
            >
              <Icon
                name="check"
                size={13}
                style={{ position: "absolute", left: 0, top: 2 }}
              />
              <Text style={{ paddingLeft: 20 }}>
                Parents can monitor the daily progress of their children
              </Text>
            </View>
          </View>
          <Button
            title="Create Your First Batch"
            onPress={onAddModalOpen}
            buttonStyle={[btnStyle.outline, common.px12]}
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
            containerStyle={[common.my10]}
          />
        </>
      )}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
