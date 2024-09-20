import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart, LineChart } from "react-native-gifted-charts";
import { SkillTestStatics } from '../../apiconfig/SharedApis';
import { getUserInfo } from '../../shared/sharedDetails';
import { common } from '../../assets/styles/Common';
import { Button, Card } from 'react-native-elements';
import { useThemeColor } from '../../assets/themes/useThemeColor';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import moment from 'moment';

const SkillStastics = () => {
    const userInfo: any = getUserInfo();
    const YoColors = useThemeColor();
    const [data, setData] = useState<any>();
    const [isAllZero, setIsAllZero] = useState<boolean>(true);
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
                for (const item of result?.data || []) {
                    if (item.value > 0) {
                        setIsAllZero(false);
                        break;
                    } else if (item.value == 0) {
                        setIsAllZero(true);
                    }
                }
            }
        });
    }

    return (
        <View>
            <Text style={[common.h3Title, common.my10, { textAlign: 'left' }]}>Progress Over Time <Text style={[common.rText, { fontWeight: '400' }]}>(Number of tests you've completed daily to track your preparation journey)</Text></Text>

            <View style={[{ alignItems: 'center', backgroundColor: '#fff', borderRadius: 6 }]}>
                {
                    !isAllZero &&
                    <>
                        <View style={[common.row, common.my10, { justifyContent: 'space-around' }]}>
                            {filters?.map((item: any) => (
                                <Button
                                    type='outline'
                                    title={item.name}
                                    buttonStyle={{ borderColor: YoColors.primary, paddingHorizontal: 5, paddingVertical: 3 }}
                                    titleStyle={[common.fs12, { color: YoColors.primary }]}
                                    disabled={item.code == activeCode}
                                    onPress={() => setActiveCode(item.code)}
                                    containerStyle={{ marginRight: 5 }}
                                />
                            ))}

                        </View>

                        {/* <LineChart data={data}
                            areaChart
                            color1={YoColors.primary}
                            startFillColor={YoColors.primary}
                            xAxisLabelTextStyle={{ fontSize: 10 }}

                            initialSpacing={0}
                            spacing={41}
                            hideDataPoints
                        /> */}
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
                {
                    !!isAllZero &&
                    <View style={common.p12}>
                        <Text style={[common.h1Title, common.mb10, { textAlign: 'center' }]}>Oops</Text>
                        <Text style={{ textAlign: 'center' }}>No tests taken yet! Jump in now to boost your learning and track your progress!</Text>
                    </View>
                }
            </View>

        </View>
    )
}

export default SkillStastics

const styles = StyleSheet.create({})