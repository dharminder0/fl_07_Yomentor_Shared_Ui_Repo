import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/FontAwesome5";
import { common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import useStore from "../../store/useStore";
import { useNavigation } from "@react-navigation/native";
import { upsertTestAttempt } from "../../apiconfig/SharedApis";
import { getUserInfo } from "../../shared/sharedDetails";

const SkillResultModal = ({
    score = 0,
    attemptId = 0,
    skillDetails = {},
}: any) => {
    const YoColors = useThemeColor();
    const navigation: any = useNavigation();
    const { width } = Dimensions.get("screen");
    const { isAlertModal, setIsAlertModal }: any = useStore();
    const userInfo: any = getUserInfo();
    const closeModal = () => {
        setIsAlertModal(false);
    };

    const handleAttempTest = () => {
        const payload: any = {
            attemptCode: "1",
            userId: userInfo.id,
            skillTestId: skillDetails?.id,
            status: "0",
        };
        closeModal();
        upsertTestAttempt(payload)
            .then((response: any) => {
                // setAttemptId(response.data.content);
                if (response.data && response.data.success) {
                    //   setIsAttempModal(false);
                    navigation.goBack(null);
                    navigation.navigate("AttemptSkillTest", {
                        skillTestId: skillDetails?.id,
                        attemptId: response.data.content,
                    });
                }
            })
            .catch((error: any) => {
                console.log(error);
            });
    };

    return (
        <Modal
            isVisible={isAlertModal}
            onBackButtonPress={closeModal}
            swipeDirection="down"
            onBackdropPress={closeModal}
            style={{ margin: 0, alignItems: "center" }}
            animationInTiming={300}
            useNativeDriver
        >
            <View
                style={{
                    backgroundColor: YoColors.background,
                    minHeight: 150,
                    maxHeight: 400,
                    width: width - 30,
                    borderRadius: 12,
                    padding: 12,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={{ position: 'relative', width: '100%' }}>
                    <Button
                        onPress={() => { navigation.goBack(null); closeModal(); navigation.navigate('Home'); }}
                        icon={{
                            name: 'close',
                            type: 'ionicons',
                            size: 16,
                            color: '#000',
                        }}
                        type="clear"
                        buttonStyle={{
                            height: 32,
                            width: 32,
                            padding: 0,
                            borderRadius: 16,
                        }}
                        containerStyle={{ alignSelf: 'flex-end' }}
                    />
                </View>
                <View>
                    {score < 40 &&
                        <Text style={[common.h2Title]}>Don't worry, give it another shot!</Text>
                    }
                    {(score >= 40 && score < 80) &&
                        <Text style={[common.h2Title, common.mb10]}>Good job! Almost there, keep going!</Text>
                    }
                    {score >= 80 &&
                        <Text style={common.h2Title}>Awesome work! You nailed it!</Text>
                    }

                    <Text style={[common.mb20, { color: YoColors.text, fontSize: 36, fontWeight: '600', textAlign: 'center' }]}>{`${score}%`}</Text>
                </View>
                <View style={[common.row, common.mb10, { alignSelf: "flex-end" }]}>
                    <Button
                        title="Summary"
                        type="outline"
                        onPress={() => {
                            navigation.goBack(null);
                            navigation.navigate("AttemptedQuestionsPreview", {
                                skillDetails: skillDetails,
                                attemptId: attemptId,
                            }); closeModal();
                        }}
                        buttonStyle={{
                            width: 100,
                            paddingVertical: 6,
                            borderColor: YoColors.primary
                        }}
                        titleStyle={[common.fs12, { color: YoColors.primary }]}
                        containerStyle={common.mr10}
                    />
                    {
                        score < 80 &&
                        <Button
                            title="Retake"
                            onPress={handleAttempTest}
                            buttonStyle={{
                                backgroundColor: YoColors.primary,
                                borderRadius: 3,
                                width: 100,
                                paddingVertical: 6
                            }}
                            titleStyle={[common.fs12]}
                        />
                    }
                </View>
            </View>
        </Modal>
    );
};

export default SkillResultModal;

const styles = StyleSheet.create({});
