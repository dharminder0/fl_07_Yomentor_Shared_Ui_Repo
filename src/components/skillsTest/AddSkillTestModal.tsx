import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from "react-native-modal";
import useStore from "../../store/useStore";
import Icon from "react-native-vector-icons/FontAwesome5";
import { btnStyle, cardStyle, common } from "../../assets/styles/Common";
import { useForm, Controller } from "react-hook-form";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import {
    getCategoryList,
    getComplexityLevel,
    getDayList,
    getFeeTypes,
    getLanguage,
    getNoQuestions,
    getUserInfo,
} from "../../shared/sharedDetails";
import {
    addBatch,
    createSkillTest,
    getGradeList,
    getSubjectByGradeId,
} from "../../apiconfig/SharedApis";
import ProcessLoader from "../../screens/ProcessLoader";
import Ionicons from "react-native-vector-icons/Ionicons";
import PopupModal from '../common/PopupModal';
import SelectModal from '../common/SelectModal';
import { Category, ComplexityLevel, Language } from "../../shared/enum";
import { useNavigation } from '@react-navigation/native';
import AlertModal from '../common/AlertModal';

const AddSkillTestModal = ({ isOpenModal = false, setIsOpenModal = (value: boolean) => { } }) => {
    const feeTypes: any = getFeeTypes();
    const days: any = getDayList();
    const YoColors = useThemeColor();

    const { height, width } = Dimensions.get("window");
    const [time, setTime] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isPopupModalVisible, setIsPopupModalVisible] = useState(false);
    const [isProcessLoader, setIsProcessLoader] = useState(false);
    const [isClassTime, setIsClassTime] = useState(false);
    const [classList, setClassList] = useState<any>([]);
    const [subjectList, setSubjectList] = useState<any>([]);
    const [categoryType, setCategoryType] = useState<number>(1);
    const [isRefreshSelectModal, setIsRefreshSelectModal] = useState<number>(0);
    const { isAlertModal, setIsAlertModal }: any = useStore();


    const ComplexityLevel = getComplexityLevel();
    const Language = getLanguage();
    const Category = getCategoryList();
    const Questions = getNoQuestions();
    const userInfo: any = getUserInfo();
    const navigation: any = useNavigation();

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors, isValid },
    } = useForm();

    const toggleModal = () => {
        setIsOpenModal(!isOpenModal);
        reset();
    };

    useEffect(() => {
        getGradeList(categoryType).then((result: any) => {
            if (!!result.data) {
                setClassList(result.data);
            }
        });
        setIsRefreshSelectModal(0);
    }, [categoryType]);

    const handleGradeChange = (grade: any) => {
        setSubjectList([]);
        setValue("subject", "");
        getSubjectByGradeId(grade).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setSubjectList(result.data);
            }
        });
        setIsRefreshSelectModal(isRefreshSelectModal + 1);
    };

    const onSubmit = (data: any) => {
        const payload = data;
        payload['userId'] = userInfo.id;
        setIsProcessLoader(true);
        createSkillTest(payload)
            .then((response: any) => {
                setIsAlertModal(true);
                if (response.data) {
                    toggleModal();
                    navigation.navigate("SkillTestDetails", { skillId: response.data })
                    setTimeout(() => {
                        setIsAlertModal(false);
                        setIsProcessLoader(false);
                    }, 4000);
                }
            })
            .catch((error: any) => {
                setTimeout(() => {
                    setIsProcessLoader(false);
                    setIsAlertModal(false);
                }, 500);
                console.log("Error : ", error);
            });
    };

    return (
        <>
            <Modal
                isVisible={isOpenModal}
                onBackButtonPress={toggleModal}
                onBackdropPress={toggleModal}
                onSwipeComplete={toggleModal}
                style={{ margin: 0, justifyContent: "flex-end" }}
                useNativeDriver
            >
                {isProcessLoader &&
                    <View style={{
                        height: height,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.65)",
                    }}>
                        <ActivityIndicator size="large" />
                        <Text style={[common.h2Title, common.mtop10, { color: '#fff', textAlign: 'center' }]}>Yo!Mentor AI working on {'\n'}getting best questions</Text>
                    </View>
                }

                <ScrollView
                    style={{ maxHeight: height - 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            backgroundColor: YoColors.background,
                            height: height,
                            minHeight: 150,
                        }}
                    >
                        <View
                            style={[cardStyle.j_row, { padding: 12, alignItems: "center" }]}
                        >
                            <Text style={cardStyle.headTitle}>Create Skill Test</Text>
                            <Button
                                onPress={toggleModal}
                                icon={
                                    <Ionicons
                                        name="close-sharp"
                                        size={24}
                                        color={YoColors.primary}
                                    />
                                }
                                buttonStyle={[
                                    btnStyle.btnCross,
                                    { backgroundColor: YoColors.background },
                                ]}
                                containerStyle={{ padding: 0 }}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 12 }}>
                            <Controller
                                control={control}
                                name="category"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        fieldError={errors.gradeId ? true : false}
                                        data={Category}
                                        placeholder="Category"
                                        onChanged={(value: any) => {
                                            field.onChange(value?.id);
                                            setCategoryType(value?.id)
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"academicClass"}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        fieldError={errors.gradeId ? true : false}
                                        data={classList}
                                        placeholder={categoryType == 1 ? "Grade" : 'Exam Name'}
                                        onChanged={(value: any) => {
                                            field.onChange(value?.id);
                                            handleGradeChange(value?.id);
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="subject"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        refreshModal={isRefreshSelectModal}
                                        data={subjectList}
                                        placeholder="Subject"
                                        onChanged={(value: any) => setValue("subject", value?.id)}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="topic"
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        style={[
                                            styles.input,
                                            { borderColor: errors.name ? "red" : "#ccc" },
                                        ]}
                                        placeholderTextColor={YoColors.placeholderText}
                                        value={value}
                                        placeholder="Topic"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="complexityLevel"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        refreshModal={isRefreshSelectModal}
                                        data={ComplexityLevel}
                                        placeholder="Complexity"
                                        onChanged={(value: any) => {
                                            field.onChange(value?.id);
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="numberOfQuestions"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        refreshModal={isRefreshSelectModal}
                                        data={Questions}
                                        placeholder="No of Questions"
                                        onChanged={(value: any) => {
                                            field.onChange(value?.id);
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="language"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <SelectModal
                                        refreshModal={isRefreshSelectModal}
                                        data={Language}
                                        placeholder="Language"
                                        onChanged={(value: any) => {
                                            field.onChange(value?.id);
                                        }}
                                    />
                                )}
                            />

                            <View style={{ marginTop: 30, alignItems: "center" }}>
                                <Button
                                    title="Submit"
                                    buttonStyle={btnStyle.solid}
                                    titleStyle={btnStyle.solidTitle}
                                    onPress={handleSubmit(onSubmit)}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

            </Modal>

            {isAlertModal && (
                <AlertModal
                    message={`Yo!Mentor AI generated best questions`}
                    icon={"checkmark-circle"}
                    color={"green"}
                    iconSize={40}
                />
            )}
        </>
    )
}

export default AddSkillTestModal

const styles = StyleSheet.create({
    input: {
        height: 45,
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 10,
        width: "100%", // Adjust width as needed
    },
})