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
            style={[common.mr10, { width: 70, backgroundColor: YoColors.bgColor, alignItems: 'center', padding: 8 }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SkillsTestList", { subjectId: item.id })}
        >
            <Image source={{ uri: item.icon }} height={32} width={32} />
            <Text style={[common.rText, common.mt5]}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            {title &&
                <Text style={[common.h3Title, common.my10]}>Trending Subjects</Text>
            }
            <View style={[common.p12, { backgroundColor: YoColors.background, borderRadius: 6 }]}>
                {subjectList?.length > 0 &&
                    <VirtualizedList
                        horizontal
                        data={subjectList}
                        initialNumToRender={4}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()} // Ensure unique keys
                        getItem={getItem}
                        getItemCount={getItemCount}
                    />
                }
            </View>
        </View>
    )
}

export default TrendingSubjects

const styles = StyleSheet.create({})