import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { questionsAnswersBySkillId } from "../../apiconfig/SharedApis";
import { common } from "../../assets/styles/Common";

const AttemptedQuestionsPreview = ({ route }: any) => {
  const skillDetails: any = route.params?.skillDetails;
  const attemptId: any = route.params?.attemptId;
  const [attemptedQuestions, setAttemptedQuestions] = useState<any>([]);

  useEffect(() => {
    getQuestionAnswerBySkillTestId();
  }, [skillDetails?.id, attemptId]);

  const getQuestionAnswerBySkillTestId = () => {
    questionsAnswersBySkillId(skillDetails?.id, attemptId)
      .then((response: any) => {
        if (response.data && response.data?.length > 0) {
          setAttemptedQuestions(response.data);
        }
      })
      .catch((error: any) => {
        console.log("error: ", error);
      });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[common.h3Title, common.mb20]}>{skillDetails?.title}</Text>
      {attemptedQuestions &&
        attemptedQuestions.length > 0 &&
        attemptedQuestions.map((question: any, index: number) => {
          // Find the selected answer
          const selectedOption = question.answerOptions.find(
            (option: any) => option.id === question.selectedAnswerId
          );

          return (
            <View key={index} style={styles.questionContainer}>
              <Text style={styles.questionTitle}>
                {`${index + 1}. ${question.questionTitle}`}
              </Text>
              <Text style={styles.questionDescription}>
                {question.questionDescription}
              </Text>
              {question.answerOptions.map((option: any, optionIndex: number) => (
                <View
                  key={option.id}
                  style={[
                    styles.option,
                    option.id === question.selectedAnswerId && !option.isCorrect
                      ? styles.incorrectOption
                      : null,
                    option.isCorrect ? styles.correctOption : null,
                    option.id === question.selectedAnswerId && option.isCorrect
                      ? styles.correctOption
                      : null,
                  ]}
                >
                  <Text style={styles.optionText}>
                    {option.title}
                  </Text>
                </View>
              ))}
              {selectedOption && selectedOption.explanations && (
                <Text style={styles.questionDescription}>
                  {selectedOption.explanations}
                </Text>
              )}
            </View>
          );
        })}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#124076",
  },
  questionDescription: {
    fontSize: 12,
    marginBottom: 10
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 5,
  },
  optionText: {
    fontSize: 14,
  },
  correctOption: {
    // backgroundColor: "rgba(0,128,0, 0.6)",
    borderColor: "green",
  },
  incorrectOption: {
    // backgroundColor: "rgba(255,0,0, 0.7)",
    borderColor: "red",
  },
});

export default AttemptedQuestionsPreview;
