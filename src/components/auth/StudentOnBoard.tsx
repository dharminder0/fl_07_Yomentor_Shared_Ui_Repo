import { Animated, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@rneui/themed'
import { getCategoryList, getUserInfo, saveAsyncData } from '../../shared/sharedDetails'
import { getCategories, getGradeList, upsertUserInfo } from '../../apiconfig/SharedApis'
import { common } from '../../assets/styles/Common'
import image from '../../assets/themes/YoImages'
import { useThemeColor } from '../../assets/themes/useThemeColor'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native'

const screenWidth = Dimensions.get('window').width;
const StudentOnBoard = ({ isRefresh = (value: any) => { } }) => {

    const { colors }: any = useTheme();
    const navigation: any = useNavigation();
    const [categoryType, setCategoryType] = useState(null);
    const [gradeId, setGradeId] = useState(null);
    const [classList, setClassList] = useState<any>([]);
    const [categoryList, setCategoryList] = useState<any>([]);
    const userInfo = getUserInfo();

    const [isCategorySelected, setIsCategorySelected] = useState(false); // To track whether a category is selected

    const translateXAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (categoryType) {
            getGradeList(categoryType).then((result: any) => {
                if (result.data) {
                    setClassList(result.data);
                }
            });
        }
    }, [categoryType]);

    useFocusEffect(useCallback(() => {
        getCategoryData();
    }, []));

    const getCategoryData = async () => {
        getCategories().then((res: any) => {
            setCategoryList(res.data);
        }).catch((error: any) => {
            console.log('error', error)
        })
    }


    const handleCategorySelect = (id: any) => {
        setCategoryType(id);
        // Animate the sliding effect for transition
        Animated.timing(translateXAnim, {
            toValue: -screenWidth, // Slide the first view out of the screen to the left
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsCategorySelected(true); // After sliding, show the second view
        });
    };

    const goBack = () => {
        Animated.timing(translateXAnim, {
            toValue: 0, // Slide the second view back in
            duration: 300, // Adjust duration as needed
            useNativeDriver: true,
        }).start(() => {
            setIsCategorySelected(false); // Reset the state to show the first view
        });
    }

    const handleGradeChange = () => {
        const payload: any = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: !userInfo.lastName ? '' : userInfo.lastName,
            phone: userInfo.phone,
            email: !userInfo.email ? '' : userInfo.email,
            type: userInfo.type,
            dateOfBirth: !userInfo.dateOfBirth ? '' : userInfo.dateOfBirth,
            gender: !userInfo.gender ? '' : userInfo.gender,
            gradeId: gradeId,
            category: categoryType
        };

        upsertUserInfo(payload)
            .then((response: any) => {
                if (
                    response.data &&
                    response.data?.message === "Update_Suucessfully."
                ) {
                    let dataObject = userInfo;
                    dataObject.studentGradeId = gradeId;
                    dataObject.category = categoryType;
                    saveAsyncData('userData', dataObject);
                }
                setTimeout(() => {
                    navigation.navigate("Startup");
                }, 2000)
            })
            .catch((error: any) => {
                console.error("Error fetching :", error);
            });
    }

    return (
        <>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Animated.View
                    style={{
                        flex: 1,
                        flexDirection: 'row', // To arrange both views side by side
                        transform: [{ translateX: translateXAnim }],
                        width: screenWidth * 2, // Width of both views combined
                    }}
                >
                    <View style={[{ width: screenWidth, justifyContent: 'center', backgroundColor: colors.lightBackground }, common.px12]}>
                        <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                            <Image source={require('../../assets/img/onboard.png')} style={{ width: '70%', height: 240 }} />
                            <Text style={[styles.title, { color: colors.primary }]}>Welcome to Yo!Mentor</Text>
                            <Text style={[styles.subTitle, { color: colors.text }]}>We’re excited to have you onboard! Yo!Mentor supports your learning by creating personalized practice tests tailored to your preferences.</Text>
                        </View>
                        <Card.Title style={[styles.subTitle1, common.mb20, common.mt15, { color: colors.primary }]}>Tell us what you're preparing for</Card.Title>
                        <View style={[styles.cardWrapper]}>
                            {categoryList?.length > 0 && categoryList.map((item: any) => {
                                return (
                                    <View
                                        key={item.id}
                                        style={[
                                            styles.cardContainer,
                                            {
                                                backgroundColor:
                                                    categoryType == item.id ? colors.lightBackground : colors.card,
                                                borderColor:
                                                    categoryType == item.id ? colors.primary : 'white',
                                            },
                                        ]}
                                    >
                                        <Pressable onPress={() => handleCategorySelect(item.id)}>
                                            <Image
                                                style={[common.my10, styles.cardImage]}
                                                resizeMode="contain"
                                                source={!item?.icon ? image.knowledge : { uri: item?.icon }}
                                            />
                                            <Card.Title style={[common.fs12, { color: colors.text }]}>{item.categoryName}</Card.Title>
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </View>
                    </View>


                    <View style={[{ width: screenWidth, backgroundColor: colors.lightBackground, height: Platform.OS == 'ios' ? '90%' : '96%' }, common.px12]}>
                        {isCategorySelected && (
                            <>
                                {classList?.length > 0 &&
                                    <><Card.Title style={[styles.subTitle1, common.mb20, common.mt15, { color: colors.primary }]}>Choose the area you're focusing on</Card.Title><ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                        <View style={styles.cardWrapper}>
                                            {classList.map((item: any) => {
                                                return (
                                                    <View key={item.id} style={[styles.cardContainer, { backgroundColor: (gradeId == item.id ? colors.lightBackground : colors.card), borderColor: (gradeId == item.id ? colors.primary : 'white') }]}>
                                                        <Pressable onPress={() => setGradeId(item.id)}>
                                                            <Image
                                                                style={[common.my10, styles.cardImage]}
                                                                resizeMode="contain"
                                                                source={!item?.icon ? image.knowledge : { uri: item?.icon }} />
                                                            <Card.Title style={[common.fs12, { color: colors.text }]} numberOfLines={2}>{item.name}</Card.Title>
                                                        </Pressable>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </ScrollView></>
                                }
                                <Button title='Get Started'
                                    onPress={handleGradeChange}
                                    buttonStyle={{ width: '100%', alignSelf: 'center', backgroundColor: colors.primary }}
                                    titleStyle={{ fontSize: 17 }}
                                    disabled={classList?.length > 0 && (!categoryType || !gradeId)}
                                />

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text }}>Need to adjust your goal?</Text>
                                    <Button
                                        onPress={goBack}
                                        title='Go back'
                                        type='clear'
                                        buttonStyle={{ alignSelf: 'center' }}
                                        titleStyle={{ fontSize: 15, color: colors.primary }}
                                    />

                                </View>
                            </>
                        )}
                    </View>
                </Animated.View>
            </View>
        </>

    )
}

export default StudentOnBoard

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
    },
    cardWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cardImage: {
        width: "100%",
        height: 40
    },
    cardContainer: {
        width: '23%',
        padding: 0,
        margin: 0,
        paddingHorizontal: 3,
        marginHorizontal: 3,
        marginBottom: 10,
        borderRadius: 6,
        borderWidth: 0.6
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 15,
    },
    subTitle1: {
        textAlign: 'left',
        fontSize: 18
    }
})