import { Image, Pressable, StyleSheet, Text, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { getAttemptHitory } from '../../apiconfig/SharedApis';
import { getUserInfo } from '../../shared/sharedDetails';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { cardStyle, common } from '../../assets/styles/Common';
import { useThemeColor } from '../../assets/themes/useThemeColor';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';

const AttemptHistory = () => {
    const userInfo: any = getUserInfo();
    const YoColors = useThemeColor();
    const navigation: any = useNavigation();
    const [history, setHistory] = useState<any>([]);

    useFocusEffect(useCallback(() => {
        getHistory();
    }, []));

    const getHistory = () => {
        getAttemptHitory(userInfo?.id).then((response: any) => {
            if (response.data?.length >= 0) {
                setHistory(response.data);
            }
        })
    }

    const getItem = (history: any, index: any) => history[index];

    const getItemCount = () => history?.length;

    const renderItem = ({ item, index }: any) => {
        return (
            <Pressable
                onPress={() =>
                    navigation.navigate("SkillTestDetails", { skillId: item?.id })
                }
            >
                <View
                    style={styles.item}
                    key={index}
                >
                    <View>
                        <View style={[common.j_row]}>
                            <View style={[common.pe5, { alignItems: 'center' }]}>
                                {item?.subjectIconUrl &&
                                    <Image source={{ uri: item?.subjectIconUrl }} height={32} width={32} />
                                }
                                <Text style={[common.rText, { width: 50 }, common.mt5]} numberOfLines={1}> {item?.subjectName}</Text>
                            </View>
                            <View style={{ width: '85%' }}>
                                {item.skillTestTitle && (
                                    <View style={[cardStyle.row]}>
                                        <Text style={[common.title]}>
                                            {item.skillTestTitle}
                                        </Text>
                                    </View>
                                )}
                                {item?.startDate &&
                                    <Text style={common.rText}>Attempt on: {moment(item?.startDate).format('DD-MM-YYYY')}</Text>
                                }
                            </View>
                        </View>

                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={common.p12}>
            {history?.length > 0 &&
                <VirtualizedList
                    data={history}
                    initialNumToRender={5}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    style={{ backgroundColor: YoColors.background }}
                />
            }
        </View>
    )
}

export default AttemptHistory

const styles = StyleSheet.create({
    item: {
        width: "100%",
        marginBottom: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
})