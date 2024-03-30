import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../../assets/styles/Common";
import SlideView from "../common/SlideView";
import { getUserInfo } from "../../shared/sharedDetails";
import { getBatchListbyUserid, getUsersList } from "../../apiconfig/SharedApis";
import TopTeachers from "./student/TopTeachers";
import BatchSlideCard from "../common/BatchSlideCard";
import { Button } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../screens/Loading";
import Icon from "react-native-vector-icons/FontAwesome5";
import Welcome from "../common/Welcome";

const HomeScreen = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState([]);
  const [ongoingBatchList, setOngoingBatchList] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [teacherList, setTeacherList] = useState<any>([]);

  useEffect(() => {
    setIsLoading(true);
    getOpenBatchDatabyTeacherId(1);
    getOpenBatchDatabyTeacherId(2);
    getOpenBatchDatabyTeacherId(3);
    getOpenBatchDatabyTeacherId(0);
    getTeacherList();
  }, [userInfo?.id, refreshLoader]);

  const getOpenBatchDatabyTeacherId = (statusId: number) => {
    const payload: any = {
      userid: userInfo?.id,
      userType: userInfo?.type,
      pageSize: 5,
      pageIndex: 1,
    };

    if (userInfo?.type === 1 && (statusId === 1 || statusId === 2)) {
      payload["statusId"] = [statusId];
    }

    if (userInfo?.type === 3) {
      payload["isFavourite"] = true;
      if (statusId === 3) {
        payload["statusId"] = [1, 2, 3, 4];
      }
    }

    setOpenBatchList([]);
    setOngoingBatchList([]);
    getBatchListbyUserid(payload)
      .then((response: any) => {
        if (response?.data && response?.data?.length) {
          if (statusId === 1) {
            setOpenBatchList(response?.data);
          }
          if (statusId === 2) {
            setOngoingBatchList(response?.data);
          }
          if (statusId === 3) {
            setShortlisted(response?.data);
          }
          if (statusId === 0) {
            setEnrolled(response?.data);
          }
        }
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 200);
      })
      .catch((error: any) => {
        console.log(error);
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 200);
      });
  };

  const getTeacherList = () => {
    const payload: any = {
      userType: 1,
      pageSize: 5,
      pageIndex: 1,
    };
    getUsersList(payload)
      .then((response: any) => {
        setTeacherList([]);
        if (response.data && response.data.length > 0) {
          setTeacherList(response.data);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching :", error);
      });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[common.px12]}
      refreshControl={
        <RefreshControl
          refreshing={refreshLoader}
          onRefresh={() => {
            setRefreshLoader(true);
          }}
        />
      }
    >
      {isLoading ? (
        <View
          style={{
            flex: 1,
            height: Platform.OS === "ios" ? height - 100 : height - 70,
          }}
        >
          <Loading />
        </View>
      ) : (
        <>
          {ongoingBatchList && ongoingBatchList?.length > 0 && (
            <SlideView
              title={`Ongoing Batches (${ongoingBatchList?.length})`}
              viewTo="DashboardPage"
              data={ongoingBatchList}
              usedStatusId={2}
              userInfo={userInfo}
            />
          )}

          {userInfo?.type === 1 && openBatchList?.length > 0 && (
            <SlideView
              title={`Open for Enrollment (${openBatchList?.length})`}
              viewTo="DashboardPage"
              data={openBatchList}
              usedStatusId={1}
              userInfo={userInfo}
            />
          )}

          {userInfo?.type === 3 && (
            <>
              {enrolled?.length > 0 && (
                <BatchSlideCard
                  title={`Enrolled Batches (${enrolled?.length})`}
                  viewTo="DashboardPage"
                  data={enrolled}
                  userInfo={userInfo}
                  withdraw={true}
                  height={enrolled?.length > 1 ? 200 : 180}
                />
              )}

              {shortlisted && shortlisted?.length > 0 && (
                <BatchSlideCard
                  title={`Shortlisted Batches (${shortlisted?.length})`}
                  viewTo="DashboardPage"
                  data={shortlisted}
                  userInfo={userInfo}
                  enroll={true}
                  height={shortlisted?.length > 1 ? 200 : 180}
                />
              )}
            </>
          )}
          {enrolled?.length <= 0 && ongoingBatchList?.length <= 0 && (
            <View
              style={{
                flexDirection: "row",
                height: height - 92,
              }}
            >
              <Welcome userType={userInfo?.type} />
            </View>
          )}

          {userInfo?.type === 3 && teacherList && teacherList?.length > 0 && (
            <TopTeachers title="Top Teachers" data={teacherList} />
          )}
        </>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
