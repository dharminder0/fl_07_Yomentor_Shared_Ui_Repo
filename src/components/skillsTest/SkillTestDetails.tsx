import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getSkilDetailById } from "../../apiconfig/SharedApis";
import Loading from "../../screens/Loading";
import { cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useThemeColor } from "../../assets/themes/useThemeColor";

const SkillDetails = ({ route }: any) => {
  const skillId: any = route.params?.skillId;
  const YoColors = useThemeColor();
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [skillDetails, setSkillDetails] = useState<any>([]);

  useEffect(() => {
    getSkillDetail();
  }, [skillId]);

  const getSkillDetail = () => {
    setIsLoader(true);
    getSkilDetailById(skillId).then((response: any) => {
      if (response.data) {
        setSkillDetails(response.data);
        setIsLoader(false);
      }
    });
  };

  return (
    <>
      {isLoader && <Loading />}
      <ScrollView style={common.px12}>
        {skillDetails?.title && (
          <Text style={[common.h3Title, common.mtop10]}>
            {skillDetails?.title}
          </Text>
        )}

        <View style={[common.row, common.mtop10]}>
          {skillDetails?.averageMarks && (
            <>
              <Text style={[common.rText, { color: YoColors.primary }]}>
                Average Marks -{" "}
              </Text>
              <Text style={common.rText}>{skillDetails?.averageMarks}</Text>
            </>
          )}
        </View>

        <View style={[common.row, common.my10]}>
          <View style={cardStyle.row}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}>{skillDetails?.gradeName}</Text>
          </View>
          <View style={[cardStyle.row, common.ph10]}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {skillDetails?.subjectName}</Text>
          </View>
        </View>

        {skillDetails?.description && (
          <Text style={[common.rText, common.mtop10]}>
            {skillDetails?.description}
          </Text>
        )}
      </ScrollView>
    </>
  );
};

export default SkillDetails;

const styles = StyleSheet.create({});
