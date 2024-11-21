import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import { common } from "../../assets/styles/Common";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { Button } from "react-native-elements";
import useStore from "../../store/useStore";
import { useNavigation, useTheme } from "@react-navigation/native";
import image from "../../assets/themes/YoImages";

const SkillResultModal = ({
    score = 0,
    attemptId = 0,
    skillDetails = {},
    handleAttempTest = () => { },
}: any) => {
    const YoColors: any = useThemeColor();
    const { colors }: any = useTheme();
    const navigation: any = useNavigation();
    const { width } = Dimensions.get("screen");
    const { isSkillModal, setIsSkillModal }: any = useStore();
    const closeModal = () => {
        setIsSkillModal(false);
    };

    const gotoSummary = () => {
        navigation.goBack(null);
        setTimeout(() => {
            navigation.navigate("AttemptedQuestionsPreview", {
                skillDetails: skillDetails,
                attemptId: attemptId,
            });
            closeModal();
        }, 200);
    }

    return (
        <Modal
            isVisible={isSkillModal}
            onBackButtonPress={closeModal}
            swipeDirection="down"
            onBackdropPress={closeModal}
            style={{ margin: 0, alignItems: "center" }}
            animationInTiming={300}
            useNativeDriver
        >
            <View style={[styles.container, { backgroundColor: colors.card }]}>
                <View style={[common.j_row]}>
                    <Image
                        style={{ height: 48, width: 48 }}
                        source={image?.confirm}
                    />
                    <Button
                        icon={{ name: 'close', type: 'ionicons', size: 26, color: YoColors.text, }}
                        type="clear"
                        onPress={() => { navigation.goBack(null); closeModal(); navigation.navigate('Home'); }}
                        buttonStyle={common.p0}
                    />
                </View>
                <View>
                    {score < 40 &&
                        <Text style={[common.h1Title]}>Don't worry, give it another shot!</Text>
                    }
                    {(score >= 40 && score < 80) &&
                        <Text style={[common.h1Title, common.mb10]}>Good job! Almost there, keep going!</Text>
                    }
                    {score >= 80 &&
                        <Text style={common.h1Title}>Awesome work! You nailed it!</Text>
                    }
                    <Text style={[common.mt15, { color: YoColors.text, fontSize: 36, fontWeight: '600', textAlign: 'center' }]}>{`${score}%`}</Text>
                </View>
                <View style={[common.mt20]}>
                    <Button
                        title="Summary"
                        type="outline"
                        onPress={gotoSummary}
                        titleStyle={[common.h2Title, { color: YoColors.white }]}
                        containerStyle={common.mb10}
                        buttonStyle={{ borderRadius: 8, backgroundColor: YoColors.primary, borderColor: YoColors.primary }}
                    />

                    {
                        score < 80 &&
                        <Button
                            title="Retake"
                            type="outline"
                            onPress={() => { closeModal(); handleAttempTest(); }}
                            titleStyle={[common.h2Title, { color: colors.text }]}
                            buttonStyle={{ borderRadius: 8, borderColor: colors.text, borderWidth: 0.6 }}
                        />
                    }
                </View>
            </View>
        </Modal>
    );
};

export default SkillResultModal;

const styles = StyleSheet.create({
    container: {
        maxHeight: 320,
        width: '92%',
        borderRadius: 12,
        padding: 16
    }
});
