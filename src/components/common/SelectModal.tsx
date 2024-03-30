import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dimensions } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import { YoColors } from "../../assets/themes/YoColors";
import { common } from "../../assets/styles/Common";

interface CheckboxState {
  [id: string]: boolean;
}
const SelectModal = ({
  title = "",
  placeholder = "",
  data = [],
  onChanged = (value: any) => {},
  isMulti = false,
  isDisabled = false,
  fieldError = false,
}) => {
  const { width, height } = Dimensions.get("window");
  const [isSelectModal, setIsSelectModal] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [checkedStates, setCheckedStates] = useState<CheckboxState>({});

  const handleSelectChange = (value: any) => {
    setIsSelectModal(false);
    setSelectedValue([value.name]);
    if (onChanged) {
      onChanged(value);
    }
  };

  const handleCheckboxChange = (checkbox: any) => {
    setCheckedStates((prevCheckedStates) => ({
      ...prevCheckedStates,
      [checkbox?.id]: !prevCheckedStates[checkbox?.id], // Toggle checked state
    }));
    if (isMulti) {
      setSelectedValue((prevName) => {
        const index = prevName.indexOf(checkbox.name);
        return index !== -1
          ? prevName.slice(0, index).concat(prevName.slice(index + 1))
          : [...prevName, checkbox.name];
      });
      setSelectedIds((prevId) => {
        const index = prevId.indexOf(checkbox?.id);
        return index !== -1
          ? prevId.slice(0, index).concat(prevId.slice(index + 1))
          : [...prevId, checkbox?.id];
      });
    }
  };
  useEffect(() => {
    if (onChanged) {
      onChanged(selectedIds);
    }
  }, [selectedIds]);

  return (
    <View>
      {!isDisabled && (
        <>
          {title && (
            <Text
              style={{
                fontWeight: "600",
                color: YoColors.secondary,
                marginTop: 10,
              }}
            >
              {title}:
            </Text>
          )}
          <Button
            onPress={() => setIsSelectModal(true)}
            buttonStyle={[styles.selectBtn, fieldError && styles.borderRed]}
            disabledStyle={{
              opacity: 0.7,
              backgroundColor: "#fff",
            }}
            iconPosition="right"
            icon={<Ionicons name="chevron-down" size={20} />}
            disabled={isDisabled}
            title={
              <View
                style={{
                  flexDirection: "row",
                  maxWidth: "97%",
                }}
              >
                <Text numberOfLines={1}>
                  {selectedValue &&
                    selectedValue.length > 0 &&
                    selectedValue.map((item, key) => (
                      <Text key={key} style={[styles.fs12, styles.fw500]}>
                        {item}
                        {key != selectedValue?.length - 1 && ", "}
                      </Text>
                    ))}
                </Text>
                {placeholder && selectedValue.length <= 0 && (
                  <Text style={[styles.fs12, styles.fw500, { width: "90%" }]}>
                    {placeholder}
                  </Text>
                )}
              </View>
            }
          />
        </>
      )}

      <Modal
        isVisible={isSelectModal}
        onBackButtonPress={() => setIsSelectModal(false)}
        swipeDirection="down"
        onBackdropPress={() => setIsSelectModal(false)}
        style={{ margin: 0 }}
        useNativeDriver
      >
        <View
          style={{
            backgroundColor: "white",
            width: width,
            maxHeight: height - 200,
            position: "absolute",
            bottom: 0,
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: !isMulti ? "column" : "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={common.title}>{placeholder}</Text>
            {isMulti && (
              <TouchableOpacity
                style={{ paddingStart: 5 }}
                onPress={() => setIsSelectModal(false)}
              >
                <Text
                  style={{
                    color: YoColors.secondary,
                    borderWidth: 1,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderRadius: 2,
                    borderColor: YoColors.secondary,
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView>
            <View style={{ paddingHorizontal: 12, paddingBottom: 20 }}>
              {data.length > 0 ? (
                data.map((item: any, key: any) => (
                  <View key={key}>
                    {!isMulti ? (
                      <Pressable
                        onPress={() => handleSelectChange(item)}
                        style={{
                          height: 36,
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              item.name === selectedValue
                                ? YoColors.secondary
                                : "",
                            paddingHorizontal: 5,
                          }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    ) : (
                      <CheckBox
                        key={item?.id}
                        // id={item?.id}
                        title={item?.name}
                        checked={checkedStates[item?.id]}
                        checkedColor={YoColors.primary}
                        onPress={() => handleCheckboxChange(item)}
                      />
                    )}
                    {!isMulti && <View style={styles.hrLine}></View>}
                  </View>
                ))
              ) : (
                <Text>No Records</Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default memo(SelectModal);

const styles = StyleSheet.create({
  fs12: {
    fontSize: 12,
  },
  fw500: {
    fontWeight: "500",
  },
  selectBtn: {
    height: 45,
    padding: 8,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  hrLine: {
    borderBottomColor: "#CACCCD",
    borderBottomWidth: 1,
  },
  borderRed: {
    borderColor: "red",
  },
});
