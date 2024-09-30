import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Swiper from 'react-native-swiper'
import { common } from '../../assets/styles/Common';
import { getUserInfo } from '../../shared/sharedDetails';
import { getBanners } from '../../apiconfig/SharedApis';
import { useFocusEffect } from '@react-navigation/native';

const Banner = () => {
    const userInfo: any = getUserInfo();
    const [bannerList, setBannerList] = useState<any>([]);

    useFocusEffect(useCallback(() => {
        getBanners(userInfo?.type, 1).then((response: any) => {
            if (response.data?.length >= 0) {
                setBannerList(response.data)
            }
        })
    }, []));

    return (
        <>
            {bannerList?.length > 0 &&

                <View style={[common.my10, { height: 185 }]}>
                    <Swiper style={styles.wrapper}
                        dotStyle={[styles.setDots]}
                        activeDotStyle={styles.activeDotStyle}
                    >
                        {bannerList?.length > 0 && bannerList?.map((item: any) => (
                            <View style={styles.slide}>
                                <ImageBackground
                                    style={[styles.backImgStyle]}
                                    source={{ uri: item?.bannerUrl }}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </Swiper>
                </View>
            }
        </>
    )
}

export default Banner

const styles = StyleSheet.create({
    wrapper: {},
    slide: {
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    slideItmes: {
        flex: 1,
        justifyContent: 'flex-end',
        borderRadius: 10,
        padding: 15,
        paddingBottom: 25,
    },
    setDots: {
        top: 35,
        backgroundColor: '#D9D9D9',
    },
    activeDotStyle: {
        top: 35,
        backgroundColor: '#124076',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
    backImgStyle: {
        height: '100%',
        borderRadius: 10,
        width: '100%',
        overflow: 'hidden',
    },
})