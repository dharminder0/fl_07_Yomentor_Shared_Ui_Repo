import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  createSkillTest,
  getSkilDetailById,
  SuggestedSkillTests,
  upsertTestAttempt,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ConfirmationPopup from "../common/ConfirmationPopup";
import { getComplexityLevel, getUserInfo } from "../../shared/sharedDetails";
import moment from "moment";
import useStore from "../../store/useStore";
import AlertModal from "../common/AlertModal";
import TopSkillTest from "./TopSkillTest";

const { width } = Dimensions.get("window");
const SkillDetails = ({ route }: any) => {
  const skillTestId: any = route.params?.skillId;
  const YoColors = useThemeColor();
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isAttempModal, setIsAttempModal] = useState<boolean>(false);
  const [skillDetails, setSkillDetails] = useState<any>([]);
  const [suggestedSkillTestData, setSuggestedSkillTestData] = useState<any>([]);
  const [attemptId, setAttemptId] = useState<any>();

  const [isProcessLoader, setIsProcessLoader] = useState(false);
  const { isAlertModal, setIsAlertModal }: any = useStore();

  useFocusEffect(
    useCallback(() => {
      getSkillDetail();
    }, [skillTestId])
  );

  useFocusEffect(
    useCallback(() => {
      SuggestedSkillTest();
    }, [skillDetails])
  );

  const getSkillDetail = () => {
    setIsLoader(true);
    getSkilDetailById(skillTestId, userInfo.id).then((response: any) => {
      if (response.data) {
        setSkillDetails(response.data);
      }
      setTimeout(() => {
        setIsLoader(false);
      }, 1000)
    }).catch((error: any) => {
      console.log('Error: ', error)
      setTimeout(() => {
        setIsLoader(false);
      }, 1000)
    });
  };

  const SuggestedSkillTest = () => {
    const reqPayload: any = {
      searchText: skillDetails?.title,
      gradeId: skillDetails.gradeId,
      subjectId: skillDetails.subjectId,
      pageSize: 5,
      pageIndex: 1,
      userId: userInfo?.id,
      skillTestId: skillDetails.id,
      complexityLevel: skillDetails.complexity
    }
    SuggestedSkillTests(reqPayload).then((response: any) => {
      if (response.data) {
        setSuggestedSkillTestData(response.data);
      }
    }).catch((error: any) => {
      console.log('Error: ', error)
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
            skillDetails: skillDetails,
            attemptId: response.data.content,
          });
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };


  const handleRegenerate = () => {
    const payload = {
      userId: userInfo.id,
      category: skillDetails.category,
      topic: skillDetails.title,
      numberOfQuestions: skillDetails.numberOfQuestions,
      language: skillDetails.language,
      timerValue: skillDetails.timerValue,
      academicClass: skillDetails.gradeId,
      subject: skillDetails.subjectId,
      skillTestId: skillDetails.id,
      complexityLevel: skillDetails.complexity,
      isEnableTimer: skillDetails.isEnableTimer,
    };

    setIsProcessLoader(true);

    createSkillTest(payload)
      .then((response: any) => {
        setIsAlertModal(true);
        if (response.data) {
          setTimeout(() => {
            setIsAlertModal(false);
            setIsProcessLoader(false);
            navigation.navigate("SkillTestDetails", { skillId: response.data })
          }, 2000);
        }
      })
      .catch((error: any) => {
        setTimeout(() => {
          setIsProcessLoader(false);
          setIsAlertModal(false);
        }, 500);
        console.log("Error : ", error);
      });
  }

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
          <View style={[cardStyle.row, common.pe5]}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}>{skillDetails?.gradeName}</Text>
          </View>
          <View style={[cardStyle.row, common.pe5]}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {skillDetails?.subjectName}</Text>
          </View>
          {skillDetails?.averageMarks > 0 && (
            <View style={[cardStyle.row, common.pe5]}>
              <Icon name="shield-alt" size={12} />
              <Text style={common.rText}> Avg Score: {skillDetails?.averageMarks}</Text>
            </View>
          )}
          {skillDetails?.numberOfQuestions > 0 && (
            <View style={[cardStyle.row, common.pe5]}>
              <Icon name="list-ol" size={12} />
              <Text style={common.rText}> Questions: {skillDetails?.numberOfQuestions}</Text>
            </View>
          )}
          {skillDetails?.complexity > 0 && (
            <View style={[cardStyle.row, common.pe5]}>
              <Icon name="chart-bar" size={12} />
              <Text style={common.rText}> Level: {getComplexityLevel().find((complexity: any) => complexity.id == skillDetails?.complexity).name}</Text>
            </View>
          )}
          {skillDetails?.timerValue > 0 && (
            <View style={[cardStyle.row, common.pe5]}>
              <Icon name="clock" size={12} />
              <Text style={common.rText}> Time: {skillDetails?.timerValue} minute</Text>
            </View>
          )}
        </View>

        {skillDetails?.description && (
          <Text style={[common.rText, common.my10]}>
            {skillDetails?.description}
          </Text>
        )}

        <View style={[common.row, { justifyContent: 'flex-end' }]}>
          <Button
            title="Attempt Now"
            onPress={() => setIsAttempModal(true)}
            buttonStyle={[btnStyle.solid, common.px12, { height: 'auto' }]}
            titleStyle={[btnStyle.solidTitle, common.fs12]}
            containerStyle={[common.my10, common.mr10]}
          />
          {/* <Button
            title="Regenarate"
            onPress={handleRegenerate}
            buttonStyle={[btnStyle.solid, common.px12, { height: 'auto' }]}
            titleStyle={[btnStyle.solidTitle, common.fs12]}
            containerStyle={[common.my10]}
            /> */}
        </View>

        {/* <View style={[common.my10, common.row, { justifyContent: 'flex-end' }]}>
          <Button
            title="Attempt Now"
            onPress={() => setIsAttempModal(true)}
            buttonStyle={[btnStyle.solid, common.px12, { height: 'auto' }]}
            titleStyle={[btnStyle.solidTitle, common.fs12]}
            containerStyle={[common.my10, common.mr10]}
          />
          <Button
            title="Regenarate"
            onPress={handleRegenerate}
            buttonStyle={[btnStyle.solid, common.px12, { height: 'auto' }]}
            titleStyle={[btnStyle.solidTitle, common.fs12]}
            containerStyle={[common.my10]}
          />
        </View> */}

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
                  skillDetails: skillDetails,
                  attemptId: item.attemptId,
                })
              }
            >
              <View
                style={[styles.item, { backgroundColor: YoColors.background }]}
                key={index}
              >
                <Text>{moment(item.attemptDate).format("DD-MMM-YYYY")}</Text>
                <Text>Score: {item.score}</Text>
              </View>
            </TouchableOpacity>
          ))}

        {suggestedSkillTestData && suggestedSkillTestData?.length > 0 &&
          <>
            <Text style={[common.h3Title, common.mtop10]}>Explore Similar Tests
              <Text style={[common.rText, { fontWeight: '400' }]}> (Check out these related tests to sharpen your skills and boost your preparation!)</Text>
            </Text>
            <TopSkillTest data={suggestedSkillTestData} isTop={true} isView={false} />
          </>
        }
        <View style={[common.my10]}>
          <Text style={[common.rText, common.my10, { fontWeight: '400', textAlign: 'center' }]}>If you need more practice on this topic? Ask AI to create a new test for you!</Text>
          <Button title='Generate New Test' type="outline"
            onPress={handleRegenerate}
            buttonStyle={[{ borderColor: YoColors.primary, paddingHorizontal: 5, paddingVertical: 3, width: 120 }]}
            containerStyle={{ alignSelf: 'center' }}
            titleStyle={[common.fs12, { color: YoColors.primary }]} />
        </View>

      </ScrollView>
      {isAttempModal && (
        <ConfirmationPopup
          message="You want to attempt this skill test"
          onSubmit={handleAttempTest}
          isVisible={isAttempModal}
          setIsVisible={setIsAttempModal}
        />
      )}
      {isProcessLoader &&
        <View
          style={{
            height: "100%",
            width: '100%',
            position: 'absolute',
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        >
          <Text style={[{ fontSize: 16, color: YoColors.white }, common.mb10]}>Regenerating...</Text>
          <ActivityIndicator size="large" />
        </View>
      }

      {isAlertModal && (
        <AlertModal
          message={`Yo!Mentor AI re-generated best questions`}
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40} />
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
