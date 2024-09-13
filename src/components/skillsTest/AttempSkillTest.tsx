import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  questionsAnswersBySkillId,
  upsertBulkAttempt,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import useStore from "../../store/useStore";
import PopupModal from "../common/PopupModal";
import AlertModal from "../common/AlertModal";

const AttemptSkillTest = ({ route, navigation }: any) => {
  const skillTestId = route.params?.skillTestId;
  const attemptId = route.params?.attemptId;
  const YoColors: any = useThemeColor();
  const [questions, setQuestions] = useState<any>([]);
  const [message, setMessage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { isAlertModal, setIsAlertModal }: any = useStore();

  useEffect(() => {
    setIsLoading(true);
    getQuestionAnswerBySkillTestId();
  }, [skillTestId, attemptId]);

  const getQuestionAnswerBySkillTestId = () => {
    questionsAnswersBySkillId(skillTestId)
      .then((response: any) => {
        if (response.data && response.data?.length > 0) {
          setQuestions(response.data);
        }
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.log("error: ", error);
      });
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});

  const handleOptionClick = (index: number) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: index,
    }));
  };

  const handleSubmit = () => {
    const submittedAnswers = questions.map((question: any, index: any) => {
      const selectedOptionIndex = selectedAnswers[index];
      const selectedOption =
        selectedOptionIndex !== undefined
          ? question.answerOptions[selectedOptionIndex]
          : null;
      return {
        questionId: question.questionId,
        answerId: selectedOption ? selectedOption.id : null,
        isCorrect: selectedOption ? selectedOption.isCorrect : null,
      };
    });

    const payload: any = {
      attemptId: attemptId,
      attemptedQuestions: submittedAnswers,
    };
    upsertBulkAttempt(payload)
      .then((response: any) => {
        setIsAlertModal(true);
        if (response.data && response.data.success) {
          setMessage(response.data?.content);
          setTimeout(() => {
            setIsAlertModal(false);
            navigation.goBack(null);
          }, 2000);
        }
      })
      .catch((error: any) => {
        setTimeout(() => {
          setIsAlertModal(false);
        }, 500);
        console.log("Error : ", error);
      });
  };

  const isNextButtonDisabled =
    selectedAnswers[currentQuestionIndex] === undefined;

  return (
    <>
      {isLoading && (
        <View style={{ height: "100%" }}>
          <Loading />
        </View>
      )}
      {questions && questions?.length > 0 && (
        <View style={styles.container}>
          <Text style={styles.question}>
            {currentQuestionIndex + 1}.{" "}
            {questions[currentQuestionIndex].questionTitle}
          </Text>
          <Text style={common.rText}>
            {questions[currentQuestionIndex].questionDescription}
          </Text>
          <View style={styles.optionsContainer}>
            {questions[currentQuestionIndex].answerOptions.map(
              (option: any, index: any) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.option,
                    selectedAnswers[currentQuestionIndex] === index &&
                    styles.selectedOption,
                  ]}
                  onPress={() => handleOptionClick(index)}
                >
                  <Text
                    style={[
                      common.rText,
                      selectedAnswers[currentQuestionIndex] === index && {
                        color: "#fff",
                      },
                    ]}
                  >
                    {String.fromCharCode(65 + index)}. {option.title}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              title="Submit"
              buttonStyle={{ backgroundColor: YoColors.primary }}
              titleStyle={{ fontWeight: "600", fontSize: 12 }}
              onPress={handleSubmit}
              disabled={isNextButtonDisabled}
              containerStyle={{ width: 100, alignSelf: "flex-end" }}
              disabledStyle={{ borderWidth: 1, borderColor: YoColors.primary }}
            />
          ) : (
            <Button
              title="Next"
              buttonStyle={{ backgroundColor: YoColors.primary }}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              titleStyle={{ fontSize: 12 }}
              disabled={isNextButtonDisabled}
              containerStyle={{ width: 100, alignSelf: "flex-end" }}
              disabledStyle={{ borderWidth: 1, borderColor: YoColors.primary }}
            />
          )}
        </View>
      )}

      {questions?.length === 0 && !isLoading && (
        <Text>There is no questions for this skill test</Text>
      )}

      {isAlertModal && (
        <AlertModal
          message={`You have attempted ${message?.totalQuestions} questions \n Your correct answers: ${message?.totalCorrectAnswers} \n Score: ${message?.percentageCorrect}%`}
          icon={"checkmark-circle"}
          color={"green"}
          iconSize={40}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  question: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "600",
    color: "#124076",
  },
  questionDescription: {
    fontSize: 12,
    marginBottom: 20,
  },
  optionsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  option: {
    backgroundColor: "#e4e5f1",
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginVertical: 5,
    width: "100%",
    borderRadius: 6,
  },
  selectedOption: {
    backgroundColor: "#124076",
  },
});

export default AttemptSkillTest;
