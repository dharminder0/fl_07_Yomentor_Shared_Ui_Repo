import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  getSkilDetailById,
  upsertTestAttempt,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { getUserInfo } from "../../shared/sharedDetails";
import moment from "moment";

const { width } = Dimensions.get("window");
const SkillDetails = ({ route }: any) => {
  const skillTestId: any = route.params?.skillId;
  const YoColors = useThemeColor();
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isAttempModal, setIsAttempModal] = useState<boolean>(false);
  const [skillDetails, setSkillDetails] = useState<any>([]);
  const [attemptId, setAttemptId] = useState<any>();

  useFocusEffect(
    useCallback(() => {
      getSkillDetail();
    }, [skillTestId])
  );

  const getSkillDetail = () => {
    setIsLoader(true);
    getSkilDetailById(skillTestId, userInfo.id).then((response: any) => {
      if (response.data) {
        setSkillDetails(response.data);
        setIsLoader(false);
      }
    });
  };

  const handleAttempTest = () => {
    const payload: any = {
      attemptCode: "1",
      userId: userInfo.id,
      skillTestId: skillTestId,
      status: "0",
    };
    upsertTestAttempt(payload)
      .then((response: any) => {
        setAttemptId(response.data.content);
        if (response.data && response.data.success) {
          setIsAttempModal(false);
          navigation.navigate("AttemptSkillTest", {
            skillTestId: skillTestId,
            attemptId: response.data.content,
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <>
      {isLoader && (
        <View style={{ height: "100%" }}>
          <Loading />
        </View>
      )}
      <ScrollView style={common.px12}>
        {skillDetails?.title && (
          <Text style={[common.h3Title, common.mtop10]}>
            {skillDetails?.title}
          </Text>
        )}

        <View style={[common.row, common.mtop10]}>
          <View style={cardStyle.row}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}>{skillDetails?.gradeName}</Text>
          </View>
          <View style={[cardStyle.row, common.ps5]}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {skillDetails?.subjectName}</Text>
          </View>
          {skillDetails?.averageMarks > 0 && (
            <View style={[cardStyle.row, common.ps5]}>
              <Text style={common.rText}>
                Avg Score: {skillDetails?.averageMarks}
              </Text>
            </View>
          )}
          {skillDetails?.averageMarks > 0 && (
            <View style={[cardStyle.row, common.ps5]}>
              <Text style={common.rText}>
                Attempted By: {skillDetails?.attemptCount}
              </Text>
            </View>
          )}
        </View>

        {skillDetails?.description && (
          <Text style={[common.rText, common.my10]}>
            {skillDetails?.description}
          </Text>
        )}

        <View style={[common.my10, { alignItems: "center" }]}>
          <Button
            title="Attempt Now"
            onPress={() => setIsAttempModal(true)}
            buttonStyle={[btnStyle.outline, common.px12]}
            titleStyle={[btnStyle.outlineTitle, common.fs12]}
            containerStyle={[common.my10]}
          />
        </View>

        {skillDetails.attemptHistory &&
          skillDetails.attemptHistory?.length > 0 &&
          <Text style={[common.h3Title, common.my10]}>Attempt History</Text>
        }
        {skillDetails.attemptHistory &&
          skillDetails.attemptHistory?.length > 0 &&
          skillDetails.attemptHistory?.map((item: any, index: number) => (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate("AttemptedQuestionsPreview", {
                  skillTestId: skillTestId,
                  attemptId: item.attemptId,
                })
              }
            >
              <View
                style={[styles.item, { backgroundColor: YoColors.background }]}
                key={index}
              >
                <Text>{moment(item.attemptDate).format("DD, MMM, YYYY")}</Text>
                <Text>Score: {item.score}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
      {isAttempModal && (
        <ConfirmationPopup
          message="Are you sure to want to attempt this skill test?"
          onSubmit={handleAttempTest}
          isVisible={isAttempModal}
          setIsVisible={setIsAttempModal}
        />
      )}
    </>
  );
};

export default SkillDetails;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: width - 25,
    marginEnd: 8,
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
  },
});
