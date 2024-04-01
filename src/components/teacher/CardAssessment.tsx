import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Card } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { cardStyle, common } from "../../assets/styles/Common";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoColors } from "../../assets/themes/YoColors";
import Ionicons from "react-native-vector-icons/Ionicons";

const CardAssessment = ({
  data = [],
  reload = () => {},
  setRefreshLoader = (value: any) => {},
  refreshLoader = false,
}) => {
  const { height } = Dimensions.get("window");
  const navigation: any = useNavigation();

  const gotoAssessmentDetail = (item: any) => {
    navigation.navigate("AssesmentDetails", { selectedAssessment: item });
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => gotoAssessmentDetail(item)}
    >
      <Card containerStyle={cardStyle.container} key={index}>
        <View style={[cardStyle.j_row, { margin: 0 }]}>
          <Text numberOfLines={2} style={[common.title, { width: "72%" }]}>
            {item?.title}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {moment(item?.createdate).format("MMM DD, YYYY")}
          </Text>
        </View>

        {item?.description && (
          <Text style={{ marginBottom: 5, fontSize: 12 }} numberOfLines={2}>
            {item?.description}
          </Text>
        )}

        <View style={[cardStyle.row, { margin: 0 }]}>
          <View style={[cardStyle.row, { marginEnd: 15 }]}>
            <Icon name="laptop" size={12} />
            <Text style={common.rText}> {item?.gradeName}</Text>
          </View>
          <View style={[cardStyle.row, { marginEnd: 10 }]}>
            <Icon name="book" size={12} />
            <Text style={common.rText}> {item?.subjectName}</Text>
          </View>
          {item?.maxmark > 0 && (
            <View style={[cardStyle.row, { marginEnd: 10 }]}>
              <MaterialCommunityIcons name="file-document-edit" size={14} />
              <Text style={common.rText}> {item?.maxmark}</Text>
            </View>
          )}
          {item?.filesCount > 0 && (
            <View style={[cardStyle.row, { marginEnd: 15 }]}>
              <Ionicons name="attach-outline" size={14} />
              <Text style={common.rText}>{item?.filesCount}</Text>
            </View>
          )}                                
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[cardStyle.row, { marginTop: 10 }]}>
      {data && data.length > 0 && (
        <FlatList
          data={data}
          style={{
            height: Platform.OS === "ios" ? height - 230 : height - 170,
          }}
          windowSize={Platform.OS === "ios" ? height - 230 : height - 170}
          keyExtractor={(item: any) => item?.id}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoader}
              onRefresh={() => {
                setRefreshLoader(true);
                reload();
              }}
            />
          }
        />
      )}
    </View>
  );
};

export default CardAssessment;

const styles = StyleSheet.create({});
