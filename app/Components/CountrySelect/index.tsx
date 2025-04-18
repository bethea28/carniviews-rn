import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCountry } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
// const emojisWithIcons = [
//   { title: "happy", icon: "emoticon-happy-outline" },
//   { title: "cool", icon: "emoticon-cool-outline" },
//   { title: "lol", icon: "emoticon-lol-outline" },
//   { title: "sad", icon: "emoticon-sad-outline" },
//   { title: "cry", icon: "emoticon-cry-outline" },
//   { title: "angry", icon: "emoticon-angry-outline" },
//   { title: "confused", icon: "emoticon-confused-outline" },
//   { title: "excited", icon: "emoticon-excited-outline" },
//   { title: "kiss", icon: "emoticon-kiss-outline" },
//   { title: "devil", icon: "emoticon-devil-outline" },
//   { title: "dead", icon: "emoticon-dead-outline" },
//   { title: "wink", icon: "emoticon-wink-outline" },
//   { title: "sick", icon: "emoticon-sick-outline" },
//   { title: "frown", icon: "emoticon-frown-outline" },
// ];
const countries = [
  { country: "United States" },
  { country: " Trinidad and Tobago" },
];
export function CountrySelect() {
  const dispatch = useDispatch();
  return (
    <SelectDropdown
      data={countries}
      onSelect={(selectedItem, index) => {
        console.log("Selected:", selectedItem, "at index", index);
        dispatch(setCountry(selectedItem));
      }}
      renderButton={(selectedItem, isOpened) => (
        <View style={styles.dropdownButtonStyle}>
          {selectedItem && (
            <Icon
              name={selectedItem.icon}
              style={styles.dropdownButtonIconStyle}
            />
          )}
          <Text style={styles.dropdownButtonTxtStyle}>
            {(selectedItem && selectedItem.country) || "Choose your country"}
          </Text>
          <Icon
            name={isOpened ? "chevron-up" : "chevron-down"}
            style={styles.dropdownButtonArrowStyle}
          />
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={[
            styles.dropdownItemStyle,
            isSelected && { backgroundColor: "#D2D9DF" },
          ]}
        >
          <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
          <Text style={styles.dropdownItemTxtStyle}>{item.country}</Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
