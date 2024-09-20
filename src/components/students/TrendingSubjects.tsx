import { Image, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { common } from '../../assets/styles/Common'
import { getSubjectByGradeId } from '../../apiconfig/SharedApis'
import { useThemeColor } from '../../assets/themes/useThemeColor'
import { useNavigation } from '@react-navigation/native'

const TrendingSubjects = ({ title = '', id = 0 }) => {
    const YoColors = useThemeColor();
    const navigation: any = useNavigation();
    const [subjectList, setSubjectList] = useState<any>([]);

    useEffect(() => {
        getSubjectByGradeId(id).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setSubjectList(result.data);
            }
        })
    }, [id])

    const getItem = (subjectList: any, index: any) => subjectList[index];

    // Function to get the total count of items
    const getItemCount = (subjectList: any) => subjectList.length;

    // Render each item
    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={[{ backgroundColor: YoColors.bgColor }, styles.card]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SkillsTestList", { subjectId: item.id })}
        >
            <Image source={{ uri: item.icon }} height={32} width={32} />
            <Text style={styles.text} numberOfLines={2}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            {title && subjectList?.length > 0 &&
                <Text style={[common.h3Title, common.my10]}>Trending Subjects</Text>
            }
            {subjectList?.length > 0 &&
                <VirtualizedList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={subjectList}
                    initialNumToRender={4}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} // Ensure unique keys
                    getItem={getItem}
                    getItemCount={getItemCount}
                />
            }
        </View>
    )
}

export default TrendingSubjects

const styles = StyleSheet.create({
    card: {
        width: 120,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginRight: 10,
    },
    text: {
        marginTop: 5,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '600'
    }

})