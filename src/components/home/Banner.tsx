import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Swiper from 'react-native-swiper'
import { common } from '../../assets/styles/Common';

const Banner = () => {
    const settings = {
        dots: true,
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        slidesPerView: 1,
        initialSlide: 0,
        speed: 1000,
    };

    return (
        <View style={[common.my10, { height: 170 }]}>
            <Swiper style={styles.wrapper}
                // {...settings}
                dotStyle={[styles.setDots]}
                activeDotStyle={styles.activeDotStyle}
            >
                <View style={styles.slide}>
                    <ImageBackground
                        style={[styles.backImgStyle]}
                        source={require('../../assets/images/Baaner-hd1.jpg')}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.slide}>
                    <ImageBackground
                        style={[styles.backImgStyle]}
                        source={require('../../assets/images/Banner2.png')}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.slide}>
                    <ImageBackground
                        style={[styles.backImgStyle]}
                        source={require('../../assets/images/Banner1.jpg')}
                        resizeMode="cover"
                    />
                </View>

            </Swiper>
        </View>
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
        // backgroundColor: '#0f0fff'
    },
    slideItmes: {
        flex: 1,
        justifyContent: 'flex-end',
        borderRadius: 10,
        padding: 15,
        paddingBottom: 25,
        // backgroundColor: 'rgba(6, 136, 138,0.5)',
    },
    setDots: {
        // top: 35,
        backgroundColor: '#D9D9D9',
    },
    activeDotStyle: {
        // top: 35,
        backgroundColor: '#38BABC',
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