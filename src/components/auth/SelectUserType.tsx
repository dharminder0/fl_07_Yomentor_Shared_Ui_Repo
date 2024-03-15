import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { common } from "../../assets/styles/Common";
import { Card } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { YoColors } from "../../assets/themes/YoColors";
import Icon from "react-native-vector-icons/FontAwesome5";
import { YoImages } from "../../assets/themes/YoImages";

const { height } = Dimensions.get("window");
const SelectUserType = () => {
  const navigation: any = useNavigation();
  const image: any = YoImages();
  return (
    <View style={styles.container}>
      <Image source={image.icon} style={{ height: 102, width: 156 }} />

      <Text style={[common.h1Title, { marginTop: 30, marginBottom: 10 }]}>
        Who you are ?
      </Text>
      <View style={{ alignItems: "center" }}>
        <View style={common.j_row}>
          <Pressable
            style={styles.cardWrapper}
            onPress={() =>
              navigation.navigate("UserRegistration", { userType: 1 })
            }
          >
            <Card
              containerStyle={styles.card}
              wrapperStyle={{ alignItems: "center" }}
            >
              <Icon name="chalkboard-teacher" size={50} />
              <Text style={[common.h3Title, { marginTop: 15 }]}>Teacher</Text>
            </Card>
          </Pressable>
        </View>
        <View
          style={{
            justifyContent: "space-around",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Pressable
            style={styles.cardWrapper}
            onPress={() =>
              navigation.navigate("UserRegistration", { userType: 2 })
            }
          >
            <Card
              containerStyle={styles.card}
              wrapperStyle={{ alignItems: "center" }}
            >
              <Icon name="users" size={50} />
              <Text style={[common.h3Title, { marginTop: 15 }]}>Parent</Text>
            </Card>
          </Pressable>

          <Pressable
            style={styles.cardWrapper}
            onPress={() =>
              navigation.navigate("UserRegistration", { userType: 3 })
            }
          >
            <Card
              containerStyle={styles.card}
              wrapperStyle={{ alignItems: "center" }}
            >
              <Icon name="user-graduate" size={50} />
              <Text style={[common.h3Title, { marginTop: 15 }]}>Student</Text>
            </Card>
          </Pressable>
        </View>
      </View>
      <View
        style={[
          common.row,
          {
            marginTop: 20,
          },
        ]}
      >
        <Text style={common.rText}>Already have an account </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[common.rText, { color: YoColors.primary }]}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectUserType;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: "40%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    height: 125,
    borderRadius: 12,
    borderWidth: 0,
    justifyContent: "center",
  },
});
