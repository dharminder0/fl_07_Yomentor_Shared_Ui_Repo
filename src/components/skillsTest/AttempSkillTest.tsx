import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import {
  questionsAnswersBySkillId,
  upsertBulkAttempt,
} from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";

const AttemptSkillTest = ({ route, navigation }: any) => {
  const skillTestId = route.params?.skillTestId;
  const attemptId = route.params?.attemptId;
  const [questions, setQuestions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getQuestionAnswerBySkillTestId();
  }, [skillTestId, attemptId]);

  const getQuestionAnswerBySkillTestId = () => {
    questionsAnswersBySkillId(skillTestId)
      .then((response: any) => {
        console.log(response.data);
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
    console.log("Submitted answers:", payload);
    upsertBulkAttempt(payload).then((response: any) => {
      console.log(response.data);
      if (response.data && response.data.success) {
        navigation.goBack(null);
      }
    });
    // You can send this payload to your backend or perform any other action here
  };

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
          <Text style={styles.questionDescription}>
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
                  <Text>
                    {String.fromCharCode(65 + index)}. {option.title}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button title="Submit" onPress={handleSubmit} />
          ) : (
            <Button
              title="Next"
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            />
          )}
        </View>
      )}

      {questions?.length === 0 && !isLoading && (
        <Text>There is no questions for this skill test</Text>
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
    fontSize: 20,
    marginBottom: 10,
  },
  questionDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
  selectedOption: {
    backgroundColor: "lightblue",
  },
});

export default AttemptSkillTest;
