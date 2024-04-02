import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { common } from "../../assets/styles/Common";
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
      }}
    >
      <Image
        source={image.icon}
        style={{ height: 65, width: 100, marginBottom: 30 }}
      />
      <Text style={[common.h1Title, { marginVertical: 20 }]}>
        Welcome to Yo!Mentor
      </Text>

      {userType === 3 && (
        <>
          <Text style={[common.h3Title, { marginVertical: 15 }]}>
            How does it work:{" "}
          </Text>

          <Text style={[common.mb10]}>
            You have not joined any batches yet. You can find a suitable batch
            and request to join.
          </Text>

          <View style={[common.row, common.mb5, { alignItems: "flex-start" }]}>
            <Icon name="check" size={13} style={{ marginTop: 4 }} />
            <Text style={{ paddingStart: 5 }}>
              Find a teacher as per your tuition needs, view the teacher
              profile, and read the feedback given by other students.
            </Text>
          </View>

          <View style={[common.row, common.mb5, { alignItems: "flex-start" }]}>
            <Icon name="check" size={13} style={{ marginTop: 4 }} />
            <Text style={{ paddingStart: 5 }}>
              Shortlist the batches of your interest and discuss your tuition
              needs and fee details with the teacher.
            </Text>
          </View>

          <View style={[common.row, common.mb5, { alignItems: "flex-start" }]}>
            <Icon name="check" size={13} style={{ marginTop: 4 }} />
            <Text style={{ paddingStart: 5 }}>
              Finally, enroll in the batch and keep going to excel in the
              subject.
            </Text>
          </View>

          <Button
            title="Find Teacher"
            onPress={() => navigation.navigate("TeachersList")}
            buttonStyle={{
              backgroundColor: YoColors.primary,
              marginTop: 20,
            }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "50%" }}
          />
        </>
      )}

      {userType === 1 && (
        <>
          <Text>
            You don't have any active batches. Create your first batch to
            establish your presence on our platform.{" "}
          </Text>
          <Text style={[common.h3Title, { marginVertical: 15 }]}>
            How does it work:{" "}
          </Text>

          <View>
            <View style={[common.row, { alignItems: "flex-start" }]}>
              <Icon name="check" size={13} style={{ marginTop: 4 }} />
              <Text style={{ paddingStart: 5 }}>
                Students/Parents can find the best batch as per their needs and
                enroll themselves in your batch.
              </Text>
            </View>

            <View style={[common.row, { alignItems: "flex-start" }]}>
              <Icon name="check" size={13} style={{ marginTop: 4 }} />
              <Text style={{ paddingStart: 5 }}>
                For your batch, you can manage student, attendance, assignments,
                assessments, and more.
              </Text>
            </View>

            <View style={[common.row, { alignItems: "flex-start" }]}>
              <Icon name="check" size={13} style={{ marginTop: 4 }} />
              <Text style={{ paddingStart: 5 }}>
                Parents can monitor the daily progress of their children
              </Text>
            </View>
          </View>
          <Button
            title="Create Your First Batch"
            onPress={onAddModalOpen}
            buttonStyle={{ backgroundColor: YoColors.primary, marginTop: 20 }}
            titleStyle={{ fontWeight: "600" }}
            containerStyle={{ width: "100%" }}
          />
        </>
      )}
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({});
