import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { YoImages } from "../../assets/themes/YoImages";

const Welcome = ({ userType = 1, onAddModalOpen = () => {} }) => {
  const image: any = YoImages();
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
            <Text style={{ marginVertical: 5 }}>
              Students/Parents can find the best batch as per their needs and
              enroll themselves in your batch.
            </Text>
            <Text style={{ marginVertical: 5 }}>
              For your batch, you can manage student, attendance, assignments,
              assessments, and more.
            </Text>
            <Text style={{ marginVertical: 5 }}>
              Parents can monitor the daily progress of their children
            </Text>
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
