import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { common } from "../../assets/styles/Common";
import SlideView from "../common/SlideView";
import { getUserInfo } from "../../shared/sharedDetails";
import { getBatchListbyUserid, getUsersList } from "../../apiconfig/SharedApis";
import TopTeachers from "./TopTeachers";
import BatchSlideCard from "../common/BatchSlideCard";
import { Button } from "react-native-elements";
import { useThemeColor } from "../../assets/themes/useThemeColor";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loading from "../../screens/Loading";
import Icon from "react-native-vector-icons/FontAwesome5";
import Welcome from "../common/Welcome";
import AddBatchModalForm from "../common/AddBatchModalForm";
import useStore from "../../store/useStore";

const HomeScreen = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const YoColors = useThemeColor();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMainLoading, setMainIsLoading] = useState<boolean>(false);
  const { isModalVisible, setModalVisible }: any = useStore();
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState([]);
  const [ongoingBatchList, setOngoingBatchList] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [teacherList, setTeacherList] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      setMainIsLoading(true);
      getOpenBatchDatabyTeacherId(1);
      getOpenBatchDatabyTeacherId(2);
      getOpenBatchDatabyTeacherId(3);
      getTeacherList();
    }, [userInfo?.id, refreshLoader])
  );

  const getOpenBatchDatabyTeacherId = (statusId: number) => {
    setIsLoading(true);
    const payload: any = {
      userid: userInfo?.id,
      userType: userInfo?.type,
      pageSize: 5,
      pageIndex: 1,
    };

    if (statusId === 1 || statusId === 2) {
      payload["statusId"] = [statusId];
    }

    if (userInfo?.type === 3 && statusId === 3) {
      payload["isFavourite"] = true;
    }

    setOpenBatchList([]);
    setOngoingBatchList([]);
    setShortlisted([]);
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
        }
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 1000);
      })
      .catch((error: any) => {
        console.log(error);
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 500);
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
        setTimeout(() => {
          setMainIsLoading(false);
        }, 1000);
      })
      .catch((error: any) => {
        console.error("Error fetching :", error);
      });
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    setTimeout(() => {
      getOpenBatchDatabyTeacherId(1);
      getOpenBatchDatabyTeacherId(2);
      getOpenBatchDatabyTeacherId(3);
    }, 500);
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
      {isMainLoading || isLoading ? (
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
              {openBatchList?.length > 0 && (
                <BatchSlideCard
                  title={`Enrolled Batches (${openBatchList?.length})`}
                  viewTo="DashboardPage"
                  data={openBatchList}
                  userInfo={userInfo}
                  withdraw={true}
                  reloadPage={() => setRefreshLoader(true)}
                  height={openBatchList?.length > 1 ? 200 : 190}
                />
              )}

              {shortlisted && shortlisted?.length > 0 && (
                <BatchSlideCard
                  title={`Shortlisted Batches (${shortlisted?.length})`}
                  viewTo="DashboardPage"
                  data={shortlisted}
                  userInfo={userInfo}
                  enroll={true}
                  reloadPage={() => setRefreshLoader(true)}
                  height={shortlisted?.length > 1 ? 200 : 190}
                />
              )}
            </>
          )}

          {openBatchList?.length === 0 &&
            ongoingBatchList?.length === 0 &&
            userInfo?.type === 1 && (
              <View
                // style={{
                //   height: Platform.OS === "ios" ? height - 185 : height - 135,
                // }}
              >
                <Welcome
                  userType={userInfo?.type}
                  onAddModalOpen={() => setModalVisible(true)}
                />
              </View>
            )}

          {openBatchList?.length === 0 &&
            ongoingBatchList?.length === 0 &&
            shortlisted?.length === 0 &&
            userInfo?.type === 3 && (
              <View
                // style={{
                //   height: Platform.OS === "ios" ? height - 185 : height - 135,
                // }}
              >
                <Welcome
                  userType={userInfo?.type}
                  onAddModalOpen={() => setModalVisible(true)}
                />
              </View>
            )}

          {userInfo?.type === 3 && teacherList && teacherList?.length > 0 && (
            <TopTeachers title="Top Teachers" data={teacherList} />
          )}
        </>
      )}

      <AddBatchModalForm userId={userInfo?.id} onClose={onCloseUpdate} />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
