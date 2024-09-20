import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, Image, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Card } from '@rneui/themed';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import SelectModal from '../common/SelectModal';
import {
    getCategoryList,
    getComplexityLevel,
    getDayList,
    getFeeTypes,
    getLanguage,
    getNoQuestions,
    getTimeBounds,
    getUserInfo,
} from "../../shared/sharedDetails";
import { createSkillTest, getGradeList, getSubjectByGradeId } from '../../apiconfig/SharedApis';
import useStore from '../../store/useStore';
import AlertModal from '../common/AlertModal';
import { YoImages } from '../../assets/themes/YoImages';
import { btnStyle, common } from '../../assets/styles/Common';
import { useThemeColor } from '../../assets/themes/useThemeColor';
import ProcessLoader from '../../screens/ProcessLoader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { Touchable } from 'react-native';

const CreateSkillTest = () => {
    const image: any = YoImages();
    const userInfo: any = getUserInfo();
    const navigation: any = useNavigation();
    const YoColors: any = useThemeColor();
    const categoryList: any = getCategoryList();

    const [step, setStep] = useState(0); // Current step
    const [isTimeModal, setIsTimeModal] = useState(false);
    const [isTry, setIsTry] = useState(false);
    const [category, setCategory] = useState(!userInfo?.category ? 1 : userInfo?.category);
    const [categoryType, setCategoryType] = useState<number>(!userInfo?.category ? 1 : userInfo?.category);
    const [academicClass, setAcademicClass] = useState(userInfo.studentGradeId);
    const [subject, setSubject] = useState(null);
    const [topic, setTopic] = useState('');
    const [complexityLevel, setComplexityLevel] = useState(null);
    const [numberOfQuestions, setNumberOfQuestions] = useState(null);
    const [language, setLanguage] = useState(null);
    const [timerValue, setTimerValue] = useState(null);
    const [isTimer, setIsTimer] = useState(false);
    const [classList, setClassList] = useState<any>([]);
    const [subjectList, setSubjectList] = useState<any>([]);
    const [isRefreshSelectModal, setIsRefreshSelectModal] = useState<number>(0);
    const [isProcessLoader, setIsProcessLoader] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<any>({});
    const [selectedCategory, setselectedCategory] = useState<any>({});

    // const selectedCategory: any = categoryList.find((category: any) => category.id === userInfo?.category);

    const { isAlertModal, setIsAlertModal }: any = useStore();

    const nextStep = () => setStep((prevStep) => prevStep + 1);
    useEffect(() => {
        !isTry && setselectedCategory(categoryList.find((category: any) => category.id === categoryType));
        getGradeList(categoryType).then((result: any) => {
            if (result.data) {
                setClassList(result.data);
                setSelectedGrade(result.data.find((grade: any) => grade.id === academicClass));
            }
        });
        setIsRefreshSelectModal(0);
        handleGradeChange(userInfo.studentGradeId);
    }, [categoryType]);

    const handleGradeChange = (grade: any) => {
        setSubjectList([]);
        setSubject(null);
        getSubjectByGradeId(grade).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setSubjectList(result.data);
            }
        });
        setIsRefreshSelectModal(isRefreshSelectModal + 1);
    };

    const handleToggle = () => {
        // setIsTry(!isTry);
        setIsTry(true);
    }

    const handleSubmit = () => {
        const payload = {
            userId: userInfo.id,
            category,
            academicClass,
            subject,
            topic,
            complexityLevel,
            numberOfQuestions,
            language,
            timerValue,
            isEnableTimer: isTimer
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
    };

    const renderStep = () => {
        return (
            <>
                <View style={[common.j_row, { alignItems: 'baseline' }]}>
                    <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>You are preparing for</Card.Title>
                    <TouchableOpacity onPress={handleToggle}>
                        <Text style={[{ color: YoColors.primary, textDecorationLine: 'underline' }, common.fs12]}>Want to try something else?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardWrapper}>
                    {!isTry && selectedCategory &&
                        <Card key={selectedCategory.id} containerStyle={[styles.cardContainer1, common.py10, common.mr10, { width: '30%' }]}>
                            <Pressable onPress={() => { setCategory(selectedCategory.id); setCategoryType(selectedCategory.id); }}>
                                <Image
                                    style={styles.cardImage}
                                    resizeMode="contain"
                                    source={selectedCategory.id == 1 ? image.knowledge : image.competition}
                                />
                                <Card.Title style={[styles.cardTitle, common.fs12]}>{selectedCategory.name}</Card.Title>
                            </Pressable>
                        </Card>
                    }

                    {!isTry && selectedGrade &&
                        <Card key={selectedGrade.id} containerStyle={[categoryType == 1 ? styles.cardContainer : styles.cardContainer1, common.py10, { width: '30%' }]}>
                            <Pressable onPress={() => { setAcademicClass(selectedGrade.id); handleGradeChange(selectedGrade.id); }}>
                                <Image
                                    style={categoryType == 1 ? styles.cardImage : styles.cardImage}
                                    resizeMode="contain"
                                    source={categoryType == 1 ? image.knowledge : image.competition}
                                />
                                <Card.Title style={[styles.cardTitle, common.fs12]}>{selectedGrade.name}</Card.Title>
                            </Pressable>
                        </Card>
                    }
                    {isTry && categoryList.map((item: any) => {
                        return (
                            <Card key={item.id} containerStyle={[styles.cardContainer1, common.py10, common.mr10, { width: '30%', backgroundColor: (categoryType == item.id ? YoColors.bgColor : 'white') }]}>
                                <Pressable onPress={() => { setCategory(item.id); setCategoryType(item.id); }}>
                                    <Image
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                        source={item.id == 1 ? image.knowledge : image.competition}
                                    />
                                    <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
                                </Pressable>
                            </Card>
                        )
                    })}
                </View>


                {
                    isTry &&
                    <>
                        <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>
                            {categoryType === 1 ?
                                <>
                                    <Text>Grade </Text>
                                    <Text style={[common.rText, { fontWeight: '400' }]}>(Select your grade level)</Text>
                                </>
                                :
                                <>
                                    <Text>Exam Name </Text>
                                    <Text style={[common.rText, { fontWeight: '400' }]}>(Select an exam you are preparing for)</Text>
                                </>}
                        </Card.Title>
                        <View style={styles.cardWrapper1}>
                            {classList.map((item: any) => {
                                return (
                                    <Card key={item.id} containerStyle={[categoryType == 1 ? styles.cardContainer : styles.cardContainer1, common.py10, { backgroundColor: (academicClass == item.id ? YoColors.bgColor : 'white') }]}>
                                        <Pressable onPress={() => { setAcademicClass(item.id); handleGradeChange(item.id); }}>
                                            <Image
                                                style={categoryType == 1 ? styles.cardImage : styles.cardImage1}
                                                resizeMode="contain"
                                                source={categoryType == 1 ? image.knowledge : image.competition} />
                                            <Card.Title style={styles.cardTitle}>{item.name}</Card.Title>
                                        </Pressable>
                                    </Card>
                                );
                            })}
                        </View>
                    </>
                }


                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>Subject
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Choose a subject to tailor the test)</Text>
                </Card.Title>
                <View style={[styles.cardWrapper, common.mb10]}>
                    {subjectList.map((item: any) => {
                        return (
                            <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (subject == item.id ? YoColors.bgColor : 'white') }]}>
                                <Pressable onPress={() => { setSubject(item.id); }}>
                                    <Image
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                        source={image.subject}
                                    />
                                    <Card.Title style={[styles.cardTitle, common.fs12]}>{item.name}</Card.Title>
                                </Pressable>
                            </Card>
                        )
                    })}
                </View>

                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>Topic
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Enter a topic (e.g., Algebra) to focus on a specific area)</Text>
                </Card.Title>
                <TextInput
                    style={styles.input}
                    placeholder="Enter topic (e.g., Algebra)"
                    value={topic}
                    onChangeText={(text) => setTopic(text)}
                // onEndEditing={() => nextStep()}
                />

                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>Complexity
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Choose the complexity level to match your skill level)</Text>
                </Card.Title>
                <View style={styles.cardWrapper}>
                    {getComplexityLevel().map((item: any) => {
                        return (
                            <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (complexityLevel == item.id ? YoColors.bgColor : 'white') }]}>
                                <Pressable onPress={() => { setComplexityLevel(item.id); }}>
                                    <Image
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                        source={image.complexity}
                                    />
                                    <Card.Title style={[styles.cardTitle, common.fs12]}>{item.name}</Card.Title>
                                </Pressable>
                            </Card>
                        )
                    })}
                </View>

                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>No. of questions
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Choose the number of questions to adjust the length of your test)</Text>
                </Card.Title>
                <View style={styles.cardWrapper}>
                    {getNoQuestions().map((item: any) => {
                        return (
                            <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (numberOfQuestions == item.id ? YoColors.bgColor : 'white') }]}>
                                <Pressable onPress={() => { setNumberOfQuestions(item.id); }}>
                                    <Image
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                        source={image.question}
                                    />
                                    <Card.Title style={[styles.cardTitle, common.fs12]}>{item.name}</Card.Title>
                                </Pressable>
                            </Card>
                        )
                    })}
                </View>

                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>Language
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Select the language for your test to ensure it matches your preferred language)</Text>
                </Card.Title>
                <View style={styles.cardWrapper}>
                    {getLanguage().map((item: any) => {
                        return (
                            <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (language == item.id ? YoColors.bgColor : 'white') }]}>
                                <Pressable onPress={() => { setLanguage(item.id); }}>
                                    <View style={[styles.cardImage, common.mt15]}>
                                        <Card.Title style={[styles.cardTitle, common.fs12]}>{item.label}</Card.Title>
                                    </View>
                                </Pressable>
                            </Card>
                        )
                    })}
                </View>

                <Card.Title style={{ textAlign: 'left', color: YoColors.primary }}>Time bound
                    <Text style={[common.rText, { fontWeight: '400' }]}> (Optional)</Text>
                </Card.Title>
                <Button
                    title={!timerValue ? "Select Time" : `${timerValue} minute`}
                    onPress={() => setIsTimeModal(true)}
                    type='outline'
                    icon={
                        <Ionicons
                            name="chevron-down" // Ionicons' chevron-down icon
                            size={15}
                            color={YoColors.gray}
                        />
                    }
                    iconPosition='right'
                    buttonStyle={[common.px12, common.py10, { justifyContent: 'space-between', borderColor: YoColors.gray }]}
                    titleStyle={[common.fs12, { color: YoColors.gray }]}
                    containerStyle={[common.mb10]}
                />

                <Button
                    title="Create Test"
                    onPress={handleSubmit}
                    buttonStyle={{ backgroundColor: YoColors.primary, paddingHorizontal: 25 }}
                    titleStyle={[common.fs12]}
                    disabled={!language || !subject || !complexityLevel || !numberOfQuestions || !topic || !category || !academicClass}
                    containerStyle={[common.my10, { alignSelf: 'center' }]}
                />


                <Modal
                    isVisible={isTimeModal}
                    useNativeDriver
                    style={{ justifyContent: 'flex-end', width: '100%', margin: 0 }}
                    onBackdropPress={() => setIsTimeModal(false)} // Close on backdrop press
                >
                    <View
                        style={[{ backgroundColor: 'white' }, common.p12]}
                    >
                        {getTimeBounds().map((item: any) => (
                            <Button
                                type='outline'
                                title={item.name}
                                titleStyle={[common.fs12, { color: YoColors.primary }]}
                                disabled={item.isActive}
                                buttonStyle={{ borderColor: YoColors.primary }}
                                onPress={() => { setTimerValue(item.value); setIsTimeModal(false); setIsTimer(true); }}
                                containerStyle={[common.mb5, { width: '100%' }]}
                            />
                        ))}

                    </View>
                </Modal>
            </>


        );
    };

    return (
        <><ScrollView>
            <View style={styles.stepContainer}>{renderStep()}</View>
            {isAlertModal && (
                <AlertModal
                    message={`Yo!Mentor AI generated best questions`}
                    icon={"checkmark-circle"}
                    color={"green"}
                    iconSize={40} />
            )}
        </ScrollView>

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
                    <ActivityIndicator size="large" />
                </View>
            }
        </>
    );
};

export default CreateSkillTest;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12
    },
    cardWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    cardWrapper1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    cardContainer: {
        width: '23%',
        padding: 5,
        margin: 0,
        marginBottom: 10,
        marginRight: 5.5,
    },
    cardContainer1: {
        width: '48%',
        padding: 5,
        margin: 0,
        marginBottom: 10
    },
    cardImage1: {
        width: "100%",
        height: 60,
        marginVertical: 5
    },
    cardImage: {
        width: "100%",
        height: 30,
        marginVertical: 5
    },
    cardTitle: {
        marginBottom: 0
    },
    stepContainer: {
        marginVertical: 20,
        paddingHorizontal: 12,
        position: 'relative'
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
