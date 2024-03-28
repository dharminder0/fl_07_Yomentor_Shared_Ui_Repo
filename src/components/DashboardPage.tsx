import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { common } from "../assets/styles/Common";
import BatchCardView from "./common/BatchCardView";
import { getUserInfo } from "../shared/sharedDetails";
import HeaderView from "./common/HeaderView";
import { getBatchListbyUserid } from "../apiconfig/SharedApis";
import Welcome from "./common/Welcome";
import Loading from "../screens/Loading";
import AddBatchModalForm from "./common/AddBatchModalForm";
import useStore from "../store/useStore";
import { Button } from "react-native-elements";
import { YoColors } from "../assets/themes/YoColors";
import ProfileBatchCard from "./common/ProfileBatchCard";
import { useFocusEffect } from "@react-navigation/native";

const DashboardPage = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState([]);
  const [ongoingBatchList, setOngoingBatchList] = useState([]);
  const { isModalVisible, setModalVisible }: any = useStore();
  const [index, setIndex] = React.useState(0);

  const [routes, setRoutes] = useState<any>([]);

  const allRoutes = [
    { key: "ongoing", title: "Ongoing" },
    { key: "open", title: "Open for Enrollment" },
    { key: "enrolled", title: "Enrolled" },
    { key: "shortlisted", title: "Shortlisted" },
  ];

  useEffect(() => {
    const filteredRoutes: any = allRoutes.filter((route) => {
      if (userInfo?.type === 1) {
        if (route.key === "open" || route.key === "ongoing") {
          return true;
        }
      }

      if (userInfo?.type === 3) {
        if (
          route.key === "shortlisted" ||
          route.key === "ongoing" ||
          route.key === "enrolled"
        ) {
          return true;
        }
      }

      return false;
    });

    setRoutes(filteredRoutes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      getOpenBatchDatabyTeacherId(1);
      getOpenBatchDatabyTeacherId(2);
    }, [userInfo?.id, index])
  );

  const getOpenBatchDatabyTeacherId = (statusId: number) => {
    setIsLoading(true);
    const payload: any = {
      userid: userInfo?.id,
      userType: userInfo?.type,
      pageSize: 20,
      pageIndex: 1,
    };

    if (routes[index]?.key == "ongoing" || routes[index]?.key == "open") {
      payload["statusId"] = [statusId];
    }

    if (routes[index]?.key == "enrolled") {
      payload["statusId"] = [1, 2, 3, 4];
    }

    if (userInfo?.type === 3) {
      payload["isFavourite"] = true;
    }

    // setIsLoading(true);
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
        }
        setTimeout(() => {
          setIsLoading(false);
          setRefreshLoader(false);
        }, 200);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const relaodPage = () => {
    getOpenBatchDatabyTeacherId(1);
    getOpenBatchDatabyTeacherId(2);
  };

  const renderScene = ({ route }: any) => {
    switch (route?.key) {
      case "ongoing":
        return (
          <BatchCardView
            data={ongoingBatchList}
            height={Platform.OS === "ios" ? height - 150 : height - 102}
            onAddModalOpen={() => setModalVisible(true)}
            usedStatusId={2}
            refreshLoader={refreshLoader}
            setRefreshLoader={setRefreshLoader}
            reloadPage={relaodPage}
          />
        );

      case "open":
        return (
          <BatchCardView
            title=" "
            data={openBatchList}
            height={Platform.OS === "ios" ? height - 235 : height - 135}
            onAddModalOpen={() => setModalVisible(true)}
            usedStatusId={1}
            refreshLoader={refreshLoader}
            setRefreshLoader={setRefreshLoader}
            reloadPage={relaodPage}
          />
        );

      case "shortlisted":
        return (
          <ProfileBatchCard
            data={openBatchList}
            height={Platform.OS === "ios" ? height - 190 : height - 135}
            isLoading={isLoading}
            refreshLoader={refreshLoader}
            setRefreshLoader={setRefreshLoader}
            reloadPage={relaodPage}
            usedStatusId={1}
            intrested={true}
          />
        );

      case "enrolled":
        return (
          <ProfileBatchCard
            data={openBatchList}
            height={height - 102}
            isLoading={isLoading}
            refreshLoader={refreshLoader}
            setRefreshLoader={setRefreshLoader}
            reloadPage={relaodPage}
            usedStatusId={1}
            withdraw={true}
          />
        );

      default:
        null;
    }
  };

  const onCloseUpdate = () => {
    setModalVisible(false);
    setTimeout(() => {
      getOpenBatchDatabyTeacherId(1);
    }, 500);
  };

  console.log(openBatchList);

  return (
    <>
      <HeaderView title="Dashboard" type="drawer" />
      {isLoading ? (
        <Loading />
      ) : ongoingBatchList?.length > 0 || openBatchList?.length > 0 ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            {routes.map((route: any, idx: number) => (
              <Button
                key={route.key}
                onPress={() => setIndex(idx)}
                buttonStyle={[
                  common.tabButton,
                  {
                    width: width / routes.length,
                    borderColor: index === idx ? YoColors.primary : "#fff",
                  },
                ]}
                title={route.title}
                titleStyle={{
                  color: index === idx ? YoColors.primary : YoColors.text,
                  fontSize: 14,
                  fontWeight: "500",
                }}
              />
            ))}
          </View>
          <View style={{ marginTop: 10, paddingHorizontal: 12 }}>
            {renderScene({ route: routes[index] })}
          </View>
        </View>
      ) : (
        <Welcome
          userType={userInfo?.type}
          onAddModalOpen={() => setModalVisible(true)}
        />
      )}

      <AddBatchModalForm
        userId={userInfo?.id}
        onClose={() => onCloseUpdate()}
      />
    </>
  );
};

export default DashboardPage;

const styles = StyleSheet.create({});
