import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  const [shortlistedBatchList, setShortlistedBatchList] = useState([]);
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

  const getOpenBatchDatabyTeacherId = (statusId?: number) => {
    setIsLoading(true);
    const payload: any = {
      userid: userInfo?.id,
      userType: userInfo?.type,
      pageSize: 20,
      pageIndex: 1,
    };

    if (userInfo?.type === 1 || routes[index]?.key == "ongoing") {
      payload["statusId"] = [2];
    }

    if (routes[index]?.key == "enrolled" || routes[index]?.key == "open") {
      payload["statusId"] = [1];
    }

    if (userInfo?.type === 3 && routes[index]?.key == "shortlisted") {
      payload["isFavourite"] = true;
    }

    setOpenBatchList([]);
    setOngoingBatchList([]);
    setShortlistedBatchList([]);
    getBatchListbyUserid(payload)
      .then((response: any) => {
        if (response?.data && response?.data?.length) {
          if (routes[index]?.key == "open") {
            setOpenBatchList(response?.data);
          }
          if (routes[index]?.key == "enrolled" && userInfo?.type === 3) {
            setOpenBatchList(response?.data);
          }
          if (routes[index]?.key == "shortlisted") {
            setShortlistedBatchList(response?.data);
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
            height={Platform.OS === "ios" ? height - 232 : height - 165}
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
            height={Platform.OS === "ios" ? height - 265 : height - 185}
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
            data={shortlistedBatchList}
            height={Platform.OS === "ios" ? height - 232 : height - 165}
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
            height={Platform.OS === "ios" ? height - 232 : height - 165}
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
      getOpenBatchDatabyTeacherId(2);
    }, 500);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
