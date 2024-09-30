import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from "react-native-gifted-charts";
import { SkillTestStatics } from '../../apiconfig/SharedApis';
import { getUserInfo } from '../../shared/sharedDetails';
import { common } from '../../assets/styles/Common';
import { Button } from 'react-native-elements';
import { useThemeColor } from '../../assets/themes/useThemeColor';
import { useNavigation } from '@react-navigation/native';

const SkillStastics = () => {
    const userInfo: any = getUserInfo();
    const YoColors = useThemeColor();
    const navigation: any = useNavigation();
    const [data, setData] = useState<any>([]);
    const [activeCode, setActiveCode] = useState('Weekly');

    const [filters, setFilters] = useState([
        { id: 1, code: 'Weekly', name: 'Last 7 days' },
        { id: 2, code: 'Monthly', name: 'Last 1 Month' },
        { id: 3, code: 'SixMonthly', name: 'Last 6 Months' },
        { id: 4, code: 'Yearly', name: 'Last Year' },
    ]);

    useEffect(() => {
        Statics();
    }, [activeCode])

    // const data = [{ "label": "S", "value": 5 }, { "label": "M", "value": 10 }, { "label": "T", "value": 15 }, { "label": "W", "value": 20 }, { "label": "TH", "value": 10 }, { "label": "F", "value": 15 }, { "label": "ST", "value": 18 }];

    const Statics = () => {
        const payload = {
            userId: userInfo.id,
            attemptRange: activeCode
        };
        SkillTestStatics(payload).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setData(result?.data);
            }
        });
    }

    return (
        <View>
            <Text style={[common.h3Title, common.mtop10, { textAlign: 'left' }]}>Your Statistics </Text>
            <Text style={[common.rText, common.mb10, { fontWeight: '400' }]}>Track the number of tests you've completed over time</Text>
            <View style={[{ alignItems: 'center', backgroundColor: '#fff', borderRadius: 6 }]}>
                {data?.length > 0 && !data?.every((obj: any) => obj.value == 0) &&
                    <>
                        <View style={[common.row, common.my10, { justifyContent: 'space-around' }]}>
                            {filters?.map((item: any) => (
                                <Button
                                    type='outline'
                                    title={item.name}
                                    buttonStyle={{ paddingHorizontal: 5, paddingVertical: 3, borderColor: YoColors.placeholderText }}
                                    titleStyle={[common.fs12, { color: YoColors.placeholderText }]}
                                    disabled={item.code == activeCode}
                                    disabledStyle={{ borderColor: YoColors.primary }}
                                    disabledTitleStyle={{ color: YoColors.primary }}
                                    onPress={() => setActiveCode(item.code)}
                                    containerStyle={{ marginRight: 5 }}
                                />
                            ))}
                        </View>
                        <View>
                            <BarChart
                                isAnimated={true}
                                // barWidth={15}
                                // showXAxisIndices
                                noOfSections={3}
                                initialSpacing={5}
                                endSpacing={5}
                                barBorderRadius={4}
                                frontColor={YoColors.primary}
                                data={data}
                                xAxisColor={YoColors.primary}
                                // yAxisColor={YoColors.primary}
                                hideYAxisText
                                yAxisThickness={0}
                                labelsExtraHeight={10}
                                adjustToWidth={true}
                                xAxisLabelTextStyle={{ fontSize: 10 }}
                            // yAxisTextStyle={{ fontSize: 10 }}
                            // showValuesAsTopLabel
                            // topLabelTextStyle={{ fontSize: 10, marginBottom: 5 }}
                            />
                        </View>
                    </>
                }
                {data?.length > 0 && data?.every((obj: any) => obj.value == 0) &&
                    <View style={common.p12}>
                        <Text style={[common.h1Title, common.mb10, { textAlign: 'center' }]}>Oops</Text>
                        <Text style={[common.tCenter, common.mb10]}>No tests taken yet! Jump in now to boost your learning and track your progress!</Text>
                        <Button title='Explore Available Tests'
                            onPress={() => navigation.navigate('SkillsTestList')}
                            titleStyle={[common.fs12]}
                            buttonStyle={{ borderColor: YoColors.primary, backgroundColor: YoColors.primary, width: 170 }}
                            containerStyle={{ alignSelf: 'center' }}
                        />
                    </View>
                }
            </View>

        </View>
    )
}

export default SkillStastics

const styles = StyleSheet.create({})