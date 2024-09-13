import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from '@rneui/themed'
import { getCategoryList, getUserInfo, saveAsyncData } from '../../shared/sharedDetails'
import { getGradeList, upsertUserInfo } from '../../apiconfig/SharedApis'
import { common } from '../../assets/styles/Common'
import { YoImages } from '../../assets/themes/YoImages'
import { useThemeColor } from '../../assets/themes/useThemeColor'

const StudentOnBoard = ({ isRefresh = (value: any) => { } }) => {
    const image: any = YoImages();
    const YoColors = useThemeColor();
    const [categoryType, setCategoryType] = useState(null);
    const [classList, setClassList] = useState<any>([]);
    const userInfo = getUserInfo();

    useEffect(() => {
        if (categoryType) {
            getGradeList(categoryType).then((result: any) => {
                if (result.data) {
                    setClassList(result.data);
                }
            });
        }
    }, [categoryType]);

    const handleGradeChange = (id: any) => {
        const payload: any = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: !userInfo.lastName ? '' : userInfo.lastName,
            phone: userInfo.phone,
            email: !userInfo.email ? '' : userInfo.email,
            type: userInfo.type,
            dateOfBirth: !userInfo.dateOfBirth ? '' : userInfo.dateOfBirth,
            gender: !userInfo.gender ? '' : userInfo.gender,
            gradeId: id,
        };
        upsertUserInfo(payload)
            .then((response: any) => {
                if (
                    response.data &&
                    response.data?.message === "Update_Suucessfully."
                ) {
                    let dataObject = userInfo;
                    dataObject.studentGradeId = id;
                    saveAsyncData('userData', dataObject);
                    isRefresh(true);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching :", error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={[common.h1Title, common.mb10, { textAlign: 'center' }]}>Welcome to Yo!Mentor</Text>
            <Text style={[{ textAlign: 'center' }, common.mb10]}>We’re excited to have you onboard. Yo!Mentor is here to support your learning journey by helping you build personalized skill tests tailored to your subjects and topics of interest. To get started, we’d like to know more about your goals.</Text>

            <Card.Title style={[common.my10, common.title, { textAlign: 'left' }]}>Are you preparing for:</Card.Title>
            <View style={styles.cardWrapper}>
                {getCategoryList().map((item: any) => {
                    return (
                        <Card key={item.id} containerStyle={[styles.cardContainer, { backgroundColor: (categoryType == item.id ? YoColors.bgColor : 'white') }]}>
                            <Pressable onPress={() => { setCategoryType(item.id); }}>
                                <Image
                                    style={[common.my10, styles.cardImage]}
                                    resizeMode="contain"
                                    source={item.id == 1 ? image.knowledge : image.competition}
                                />
                                <Card.Title style={common.rText}>{item.name}</Card.Title>
                            </Pressable>
                        </Card>
                    )
                })}
            </View>
            {
                !!classList && classList?.length > 0 && (
                    <><Card.Title style={[{ textAlign: 'left' }, common.title]}>{categoryType === 1 ? 'Please choose your current grade or academic level to help us tailor the skill tests to your curriculum:' : 'Please choose the competitive exam you are preparing for so we can customize your practice tests:'}</Card.Title>
                        <View style={styles.cardWrapper}>
                            {classList.map((item: any) => {
                                return (
                                    <Card key={item.id} containerStyle={styles.cardContainer}>
                                        <Pressable onPress={() => { handleGradeChange(item.id) }}>
                                            <Image
                                                style={[common.my10, styles.cardImage]}
                                                resizeMode="contain"
                                                source={categoryType == 1 ? image.knowledge : image.competition} />
                                            <Card.Title style={common.rText}>{item.name}</Card.Title>
                                        </Pressable>
                                    </Card>
                                )
                            })}
                        </View>
                    </>
                )
            }

        </View>
    )
}

export default StudentOnBoard

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingTop: 40,
    },
    cardWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    cardImage: {
        width: "100%", height: 60
    },
    cardContainer: {
        width: '48%',
        padding: 5,
        margin: 0,
        marginBottom: 10
    },
})