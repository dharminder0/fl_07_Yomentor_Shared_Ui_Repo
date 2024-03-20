import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { common } from "../assets/styles/Common";
import BatchCardView from "./common/BatchCardView";
import { getUserData, getUserInfo } from "../shared/sharedDetails";
import HeaderView from "./common/HeaderView";
import { getOpenBatchListbyTeacherId } from "../apiconfig/SharedApis";
import Welcome from "./common/Welcome";
import Loading from "../screens/Loading";
import AddBatchModalForm from "./common/AddBatchModalForm";
import useStore from "../store/useStore";
import { Button } from "react-native-elements";
import { YoColors } from "../assets/themes/YoColors";

const DashboardPage = () => {
  const { height, width } = Dimensions.get("window");
  const userInfo: any = getUserInfo();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshLoader, setRefreshLoader] = useState<boolean>(false);
  const [openBatchList, setOpenBatchList] = useState([]);
  const [ongoingBatchList, setOngoingBatchList] = useState([]);
  const { isModalVisible, setModalVisible }: any = useStore();
  const [index, setIndex] = React.useState(0);
  useEffect(() => {
    getOpenBatchDatabyTeacherId(1);
    getOpenBatchDatabyTeacherId(2);
  }, [userInfo?.id]);

  const getOpenBatchDatabyTeacherId = (statusId: number) => {
    setIsLoading(true);
    setOpenBatchList([]);
    setOngoingBatchList([]);
    getOpenBatchListbyTeacherId({
      userid: userInfo?.id,
      userType: userInfo?.type,
      statusId: [statusId],
      pageSize: 20,
      pageIndex: 1,
    }).then((response: any) => {
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
      }, 1000);
    });
  };

  const [routes] = useState([
    { key: "ongoing", title: "Ongoing Batches" },
    { key: "open", title: "Open for Enrollment" },
  ]);

  const relaodPage = () => {
    getOpenBatchDatabyTeacherId(1);
    getOpenBatchDatabyTeacherId(2);
  };

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "ongoing":
        return (
          <BatchCardView
            data={ongoingBatchList}
            height={height - 90}
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
            height={height - 90}
            onAddModalOpen={() => setModalVisible(true)}
            usedStatusId={1}
            refreshLoader={refreshLoader}
            setRefreshLoader={setRefreshLoader}
            reloadPage={relaodPage}
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
            {routes.map((route, idx) => (
              <Button
                key={route.key}
                onPress={() => setIndex(idx)}
                buttonStyle={[
                  common.tabButton,
                  {
                    width: width / 2,
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
