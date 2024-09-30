import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { questionsAnswersBySkillId } from "../../apiconfig/SharedApis";
import { common } from "../../assets/styles/Common";
import { PieChart } from "react-native-gifted-charts";
import { useThemeColor } from "../../assets/themes/useThemeColor";

const AttemptedQuestionsPreview = ({ route }: any) => {
  const skillDetails: any = route.params?.skillDetails;
  const attemptId: any = route.params?.attemptId;
  const YoColors = useThemeColor();
  const [attemptedQuestions, setAttemptedQuestions] = useState<any>([]);
  const [chartData, setChartData] = useState<any>([{ value: 0, color: '#4CAF50' }, { color: '#F44336', value: 0, }]);

  useEffect(() => {
    getQuestionAnswerBySkillTestId();
  }, [skillDetails?.id, attemptId]);

  const getQuestionAnswerBySkillTestId = () => {
    questionsAnswersBySkillId(skillDetails?.id, attemptId)
      .then((response: any) => {
        if (response.data && response.data?.length > 0) {
          setAttemptedQuestions(response.data);
          getCorrectAndWrongCount(response.data);
        }
      })
      .catch((error: any) => {
        console.log("error: ", error);
      });
  };

  const getCorrectAndWrongCount = (questions: any[]) => {
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((question) => {
      const selectedAnswer = question.answerOptions.find(
        (option: any) => option.id === question.selectedAnswerId
      );

      if (selectedAnswer?.isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });
    setChartData([
      { value: correctCount, color: '#4CAF50' },
      { value: wrongCount, color: '#F44336', },
    ]);
    return { correctCount, wrongCount };
  };

  const renderDot = (color: any) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={[common.h3Title, common.mb10]}>{skillDetails?.title}</Text>
      <View style={common.j_row}>
        <PieChart
          data={chartData}
          donut
          showGradient
          sectionAutoFocus
          radius={50}
          innerRadius={25}
          innerCircleColor={'#232B5D'}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{(chartData[0]?.value / attemptedQuestions?.length) * 100}%</Text>
              </View>
            );
          }}
        />

        <View style={{ width: '58%' }}>
          <View style={common.row}>
            {renderDot('#4CAF50')}
            <Text>Correct Answers: {chartData[0].value}</Text>
          </View>
          <View style={common.row}>
            {renderDot('#F44336')}
            <Text>Wrong Answers: {chartData[1].value}</Text>
          </View>
        </View>

      </View>
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
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    // backgroundColor: "rgba(255,0,0, 0.7)",
    borderColor: "#F44336",
  },
});

export default AttemptedQuestionsPreview;
