import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '@rneui/themed'
import { getCategoryList, getUserInfo, saveAsyncData } from '../../shared/sharedDetails'
import { getCategories, getGradeList, upsertUserInfo } from '../../apiconfig/SharedApis'
import { common } from '../../assets/styles/Common'
import { YoImages } from '../../assets/themes/YoImages'
import { useThemeColor } from '../../assets/themes/useThemeColor'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

const screenWidth = Dimensions.get('window').width;
const StudentOnBoard = ({ isRefresh = (value: any) => { } }) => {
    const image: any = YoImages();
    const YoColors = useThemeColor();
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
            <View style={styles.container}>
                <Animated.View
                    style={{
                        flex: 1,
                        flexDirection: 'row', // To arrange both views side by side
                        transform: [{ translateX: translateXAnim }],
                        width: screenWidth * 2, // Width of both views combined
                    }}
                >
                    <View style={[{ width: screenWidth, justifyContent: 'center', backgroundColor: YoColors.bgColor }, common.px12]}>
                        <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
                            <Image source={require('../../assets/images/onboard.png')} style={{ width: '70%', height: 240 }} />
                            <Text style={[styles.title, { color: YoColors.primary }]}>Welcome to Yo!Mentor</Text>
                            <Text style={styles.subTitle}>We’re excited to have you onboard! Yo!Mentor supports your learning by creating personalized practice tests tailored to your preferences.</Text>
                        </View>
                        <Card.Title style={[styles.subTitle1, common.mb20, common.mt15, { color: YoColors.primary }]}>Tell us what you're preparing for</Card.Title>
                        <View style={[styles.cardWrapper]}>
                            {categoryList?.length > 0 && categoryList.map((item: any) => {
                                return (
                                    <Card
                                        key={item.id}
                                        containerStyle={[
                                            styles.cardContainer,
                                            {
                                                backgroundColor:
                                                    categoryType == item.id ? YoColors.bgColor : 'white',
                                                borderColor:
                                                    categoryType == item.id ? YoColors.secondary : 'white',
                                            },
                                        ]}
                                    >
                                        <Pressable onPress={() => handleCategorySelect(item.id)}>
                                            <Image
                                                style={[common.my10, styles.cardImage]}
                                                resizeMode="contain"
                                                source={!item?.icon ? image.knowledge : { uri: item?.icon }}
                                            />
                                            <Card.Title style={common.rText}>{item.categoryName}</Card.Title>
                                        </Pressable>
                                    </Card>
                                );
                            })}
                        </View>
                    </View>


                    <View style={[{ width: screenWidth, backgroundColor: YoColors.bgColor }, common.px12]}>
                        {isCategorySelected && (
                            <>
                                {classList?.length > 0 &&
                                    <><Card.Title style={[styles.subTitle1, common.mb20, common.mt15, { color: YoColors.primary }]}>Choose the area you're focusing on</Card.Title><ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                        <View style={styles.cardWrapper}>
                                            {classList.map((item: any) => {
                                                return (
                                                    <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (gradeId == item.id ? YoColors.bgColor : 'white'), borderColor: (gradeId == item.id ? YoColors.secondary : 'white') }]}>
                                                        <Pressable onPress={() => setGradeId(item.id)}>
                                                            <Image
                                                                style={[common.my10, styles.cardImage]}
                                                                resizeMode="contain"
                                                                source={!item?.icon ? image.knowledge : { uri: item?.icon }} />
                                                            <Card.Title style={common.rText} numberOfLines={2}>{item.name}</Card.Title>
                                                        </Pressable>
                                                    </Card>
                                                )
                                            })}
                                        </View>
                                    </ScrollView></>
                                }
                                <Button title='Get Started'
                                    onPress={handleGradeChange}
                                    buttonStyle={{ width: '100%', alignSelf: 'center', backgroundColor: YoColors.primary }}
                                    titleStyle={{ fontSize: 17 }}
                                    disabled={classList?.length > 0 && (!categoryType || !gradeId)}
                                />

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: YoColors.text }}>Need to adjust your goal?</Text>
                                    <Button
                                        onPress={goBack}
                                        title='Go back'
                                        type='clear'
                                        buttonStyle={{ alignSelf: 'center' }}
                                        titleStyle={{ fontSize: 15, color: YoColors.primary }}
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
        backgroundColor: '#fff'
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
        elevation: 0
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