import {
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import PopupModal from "../common/PopupModal";
import { common } from "../../assets/styles/Common";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import image from "../../assets/themes/YoImages";
import { deleteUser } from "../../apiconfig/SharedApis";
import { clearUserData } from "../../shared/sharedDetails";
import { useNavigation, useTheme } from "@react-navigation/native";
import useStore from "../../store/useStore";

const ProfileUpdateModal = ({
    isVisible = false,
    setIsVisible = (value: boolean) => { },
    userId = 0
}) => {
    const YoColors: any = useThemeColor();
    const { colors }: any = useTheme();
    const navigation: any = useNavigation();
    const [isProcessLoader, setIsProcessLoader] = useState(false);

    const onSubmit = () => {
        setIsProcessLoader(true);
        deleteUser(userId).then((response: any) => {
            console.log(response.data);
            if (response?.data?.success == true) {
                setIsVisible(false);
                clearUserData("userData");
            }
            setTimeout(() => {
                setIsProcessLoader(false);
                navigation.navigate("Startup");
            }, 1000);
        }).catch((error: any) => {
            setTimeout(() => {
                setIsVisible(false);
                setIsProcessLoader(false);
            }, 1000)
            console.log(error);
        })
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={() => setIsVisible(false)}
            onBackdropPress={() => setIsVisible(false)}
            onSwipeComplete={() => setIsVisible(false)}
            style={{ margin: 0, alignItems: 'center' }}
            animationInTiming={200}
            useNativeDriver
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[common.j_row]}>
                    <Image
                        style={{ height: 48, width: 48 }}
                        source={image?.DeleteIcon}
                    />
                    <Button
                        icon={{ name: 'close', type: 'ionicons', size: 26, color: YoColors.text, }}
                        type="clear"
                        onPress={() => setIsVisible(false)}
                        buttonStyle={common.p0}
                    />
                </View>
                <Text style={[common.h1Title, common.my10]}>Delete account</Text>
                <Text style={{ color: colors.text }}>Are you sure you want to delete this account? This action cannot be undone.</Text>
                <View style={[common.mt20]}>
                    <Button
                        title="Delete"
                        titleStyle={[common.h2Title, { color: YoColors.white }]}
                        containerStyle={common.mb10}
                        loading={isProcessLoader}
                        onPress={onSubmit}
                        buttonStyle={{ borderRadius: 8, backgroundColor: YoColors.danger, borderColor: YoColors.danger }}
                    />
                    <Button
                        title="Cancel"
                        type="outline"
                        onPress={() => setIsVisible(false)}
                        titleStyle={[common.h2Title, { color: colors.text }]}
                        buttonStyle={{ borderRadius: 8, borderColor: colors.text }}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default ProfileUpdateModal;

const styles = StyleSheet.create({
    container: {
        maxHeight: 300,
        width: '92%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18
    }
});
