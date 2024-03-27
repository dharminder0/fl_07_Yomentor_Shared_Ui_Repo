import { Dimensions, StyleSheet } from "react-native";
import { YoColors } from "../themes/YoColors";

const { width } = Dimensions.get("window");
export const common = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
  },
  tabButton: {
    width: width / 2,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    height: 40,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "white",
  },
  rText: {
    fontSize: 12,
  },
  h1Title: {
    fontSize: 21,
    fontWeight: "600",
    color: YoColors.primary,
  },
  h2Title: {
    fontSize: 18,
    fontWeight: "600",
    color: YoColors.primary,
  },
  h3Title: {
    fontSize: 16,
    fontWeight: "600",
    color: YoColors.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: YoColors.primary,
  },
  j_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 45,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%", // Adjust width as needed
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginBottom: 5,
  },
  mtop10: {
    marginTop: 10,
  },
});
export const cardStyle = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 0,
    margin: 0,
    marginBottom: 10,
    padding: 12,
  },
  wrapper: {
    borderRadius: 6,
    borderWidth: 0,
    margin: 0,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  row3: {
    flexDirection: "row",
    alignItems: "center",
    width: "33.3%",
  },
  j_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "600",
    color: YoColors.primary,
  },
  headTitle: {
    fontWeight: "600",
    // marginBottom: 5,
    color: YoColors.primary,
  },
  subTitle: {
    marginStart: 5,
  },
  fs18: {
    fontSize: 18,
  },
});
