import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card } from "@rneui/themed";
import { cardStyle, common } from "../assets/styles/Common";
import { useNavigation } from "@react-navigation/native";
import HeaderView from "./common/HeaderView";
import { YoImages } from "../assets/themes/YoImages";
import { YoColors } from "../assets/themes/YoColors";
import {
  getStudentsListByBatchId,
  updateBatchStatus,
  updateEnrollmentStatus,
} from "../apiconfig/SharedApis";
import NoDataView from "../screens/NoDataView";
import { Button } from "react-native-elements";
import ConfirmationPopup from "./common/ConfirmationPopup";
import { useToast } from "react-native-toast-notifications";

const OpenBatchDetails = ({ route }: any) => {
  const { width } = Dimensions.get("window");
  const toast = useToast();
  const navigation: any = useNavigation();
  const image: any = YoImages();
  const batchItem: any = route.params.batchItem;
  // const studentData: any = getStudentData();
  const [studentData, setStudentData] = useState([]);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [isBatchModal, setIsBatchModal] = useState<boolean>(false);
  const [isRejectModal, setIsRejectModal] = useState<boolean>(false);
  const [isAcceptModal, setIsAcceptModal] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number>();

  useEffect(() => {
    getStudentsDataByBatchId();
  }, [batchItem?.id]);

  const getStudentsDataByBatchId = () => {
    getStudentsListByBatchId(batchItem?.id).then((response: any) => {
      setStudentData([]);
      if (response && response?.data?.length > 0) {
        setStudentData(response?.data);
      }
      setTimeout(() => {
        setRefreshLoader(false);
      }, 1000);
    });
  };

  const startBatch = () => {
    updateBatchStatus(batchItem?.id, 2)
      .then((response: any) => {
        if (response.data && response.data.response) {
          setIsBatchModal(false);
          toast.show("Batch started successfully", {
            type: "success",
            duration: 2000,
          });
          setTimeout(() => {
            navigation.navigate("DashboardPage");
          }, 1500);
        }
      })
      .catch((error: any) => {
        setIsBatchModal(false);
        toast.show("Something went wrong...", {
          type: "danger",
          duration: 2000,
        });
      });
  };

  const studentEnrollmentStatus = (status: number) => {
    if (selectedStudentId) {
      updateEnrollmentStatus(status, selectedStudentId, batchItem?.id)
        .then((response: any) => {
          if (response.data && response.data.response) {
            setIsAcceptModal(false);
            setIsRejectModal(false);
            toast.show(status === 2 ? "Accepted" : "Rejected", {
              type: "success",
              duration: 2000,
            });
            getStudentsDataByBatchId();
          }
        })
        .catch((error: any) => {
          setIsAcceptModal(false);
          setIsRejectModal(false);
          toast.show("Something went wrong...", {
            type: "danger",
            duration: 2000,
          });
        });
    }
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity activeOpacity={0.7}>
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={cardStyle.row}>
          <View
            style={{
              width: 75,
              height: 75,
            }}
          >
            <Image
              source={image.DefaultUser}
              style={{
                width: 75,
                height: 75,
                borderRadius: 40,
              }}
            />
          </View>
          <View style={{ marginStart: 12, width: "73%" }}>
            <View style={[cardStyle.j_row]}>
              <Text style={[cardStyle.headTitle, cardStyle.fs18]}>
                {item?.name}
              </Text>
            </View>
            {item?.address && (
              <View style={cardStyle.row}>
                <Ionicons
                  name="location-sharp"
                  size={14}
                  color={YoColors.primary}
                />
                <Text style={cardStyle.subTitle}>{item?.address}</Text>
              </View>
            )}
            {item?.phone && (
              <View style={cardStyle.row}>
                <Icon name="phone-alt" size={13} color={YoColors.primary} />
                <Text style={cardStyle.subTitle}>{item?.phone}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={[cardStyle.row, { justifyContent: "flex-end" }]}>
          {item?.enrollmentstatus === 1 && (
            <>
              <Pressable
                style={[cardStyle.row, { marginHorizontal: 15 }]}
                onPress={() => {
                  setIsAcceptModal(true);
                  setSelectedStudentId(item?.studentId);
                }}
              >
                <Ionicons name="checkmark-circle" size={14} color={"green"} />
                <Text style={cardStyle.subTitle}>Accept</Text>
              </Pressable>
              <Pressable
                style={cardStyle.row}
                onPress={() => {
                  setIsRejectModal(true);
                  setSelectedStudentId(item?.studentId);
                }}
              >
                <Icon name="times" size={14} color={"red"} />
                <Text style={cardStyle.subTitle}>Reject</Text>
              </Pressable>
            </>
          )}

          {item?.enrollmentstatus !== 1 && (
            <Text style={cardStyle.subTitle}>{item?.enrollmentStatus}</Text>
          )}
        </View>
        {/* </View> */}
      </Card>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderView title={batchItem?.batchName} />
      <View style={[common.container, { marginTop: 5 }]}>
        {studentData && studentData.length > 0 ? (
          <FlatList
            data={studentData}
            style={{ height: "85.5%" }}
            keyExtractor={(item: any) => item?.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshLoader}
                onRefresh={() => {
                  setRefreshLoader(true);
                  getStudentsDataByBatchId();
                }}
              />
            }
          />
        ) : (
          <NoDataView />
        )}

        <Button
          title="Start Batch"
          onPress={() => setIsBatchModal(true)}
          // onPress={startBatch}
          buttonStyle={{
            backgroundColor: YoColors.primary,
            marginVertical: 10,
          }}
          titleStyle={{ fontWeight: "bold" }}
          containerStyle={{ width: "100%" }}
        />

        <ConfirmationPopup
          message="Are you sure to want to start this batch?"
          onSubmit={startBatch}
          isVisible={isBatchModal}
          setIsVisible={setIsBatchModal}
        />

        <ConfirmationPopup
          message="Are you sure to want to accept this student?"
          onSubmit={() => studentEnrollmentStatus(2)}
          isVisible={isAcceptModal}
          setIsVisible={setIsAcceptModal}
        />

        <ConfirmationPopup
          message="Are you sure to want to reject this student?"
          onSubmit={() => studentEnrollmentStatus(3)}
          isVisible={isRejectModal}
          setIsVisible={setIsRejectModal}
        />
      </View>
    </>
  );
};

export default OpenBatchDetails;

const styles = StyleSheet.create({});
