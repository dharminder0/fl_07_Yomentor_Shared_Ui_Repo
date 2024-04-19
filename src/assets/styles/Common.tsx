import { Dimensions, StyleSheet } from "react-native";

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
    color: "#124076",
  },
  h2Title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#124076",
  },
  h3Title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#124076",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#124076",
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
    flexWrap: "wrap",
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
  highLight: {
    borderColor: "#124076",
    borderWidth: 1,
  },
  mtop10: { marginTop: 10 },
  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  my5: { marginBottom: 5 },
  my10: { marginVertical: 10 },
  mr10: { marginEnd: 10 },
  ptop10: { paddingTop: 10 },
  pb5: { paddingBottom: 5 },
  ps5: { paddingStart: 5 },
  pb10: { paddingBottom: 10 },
  py10: { paddingVertical: 10 },
  ph10: { paddingHorizontal: 10 },
  p12: { padding: 12 },
  px12: { paddingHorizontal: 12 },
  fs12: { fontSize: 12 },
  p5: { padding: 5 },
});

export const btnStyle = StyleSheet.create({
  outline: {
    backgroundColor: "#fff",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.7,
    borderColor: "#124076",
  },
  outlineTitle: {
    color: "#124076",
  },
  solid: {
    backgroundColor: "#124076",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 0.7,
    borderColor: "#124076",
  },
  solidTitle: {
    color: "#fff",
  },
  btnCross: {
    paddingHorizontal: 15,
    paddingVertical: 0,
    backgroundColor: "#fff",
  },
  btnEdit: {
    padding: 0,
    backgroundColor: "#fff",
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
    color: "#124076",
  },
  title1: {
    fontSize: 18,
    fontWeight: "600",
    color: "#124076",
  },
  headTitle: {
    fontWeight: "600",
    // marginBottom: 5,
    color: "#124076",
  },
  subTitle: {
    marginStart: 5,
  },
  fs18: {
    fontSize: 18,
  },
});
