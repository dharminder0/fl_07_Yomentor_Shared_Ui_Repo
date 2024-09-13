import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LineChart } from "react-native-gifted-charts";
import { SkillTestStatics } from '../../apiconfig/SharedApis';
import { getUserInfo } from '../../shared/sharedDetails';

const SkillStastics = () => {
    const userInfo: any = getUserInfo();
    const [data, setData] = useState<any>();

    useEffect(() => {
        Statics();
    }, [])

    const Statics = () => {
        const payload = {
            "userId": userInfo.id,
            "startdate": "2024-08-10T12:40:19.678Z",
            "endDate": "2024-09-12T12:40:19.678Z"
        };
        SkillTestStatics(payload).then((result: any) => {
            if (result?.data && result.data.length > 0) {
                setData(result?.data);
            }
        });
    }

    // const data = [
    //     { value: 50, label: 'Jan' },
    //     { value: 80, label: 'Feb' },
    //     { value: 90, label: 'Mar' },
    //     { value: 70, label: 'Apr' }
    // ];

    return (
        <View>
            <LineChart data={data} areaChart />
        </View>
    )
}

export default SkillStastics

const styles = StyleSheet.create({})