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
import SkillResultModal from "../common/SkillResultModal";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { ScrollView } from "react-native-gesture-handler";

const AttemptSkillTest = ({ route, navigation }: any) => {
  const skillDetails = route.params?.skillDetails;
  const attemptId = route.params?.attemptId;
  const YoColors: any = useThemeColor();
  const [questions, setQuestions] = useState<any>([]);
  const [message, setMessage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isSkillModal, setIsSkillModal }: any = useStore();

  useEffect(() => {
    setIsLoading(true);
    getQuestionAnswerBySkillTestId();
  }, [skillDetails?.id, attemptId]);

  console.log(skillDetails?.id, attemptId)

  const getQuestionAnswerBySkillTestId = () => {
    questionsAnswersBySkillId(skillDetails?.id)
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
        setIsSkillModal(true);
        if (response.data && response.data.success) {
          setMessage(response.data?.content);
        }
      })
      .catch((error: any) => {
        setTimeout(() => {
          setIsSkillModal(false);
        }, 2000);
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
        <>
          <View style={[common.p12, { alignItems: 'center' }]}>

            {skillDetails?.title &&
              <Text style={[common.h3Title, common.mb20]}>{skillDetails?.title}</Text>
            }

            {skillDetails?.timerValue > 0 &&
              <CountdownCircleTimer
                isPlaying
                size={100}
                strokeWidth={5}
                duration={skillDetails?.timerValue * 60} // Convert minutes to seconds
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[60, 30, 10, 0]} // Change colors based on time left
                onComplete={() => {
                  handleSubmit();
                  console.log('Time is up!');
                  // You can trigger quiz submission or other actions here
                  return { shouldRepeat: false }; // Do not repeat the timer
                }}
              >
                {({ remainingTime }) => {
                  const minutes = Math.floor(remainingTime / 60);
                  const seconds = remainingTime % 60;
                  return (
                    <Text style={{ fontSize: 24 }}>
                      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </Text>
                  );
                }}
              </CountdownCircleTimer>
            }
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </>

      )}

      {questions?.length === 0 && !isLoading && (
        <Text>There is no questions for this skill test</Text>
      )}


      <SkillResultModal
        // message={`You have attempted ${message?.totalQuestions} questions \n Your correct answers: ${message?.totalCorrectAnswers} \n Score: ${message?.percentageCorrect}%`}
        // message={`${message?.percentageCorrect}%`}
        score={message?.percentageCorrect}
        attemptId={message?.attemptId}
        skillDetails={skillDetails}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
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
