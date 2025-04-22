import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { setCountry } from "@/store/globalState/globalState";
import { useDispatch } from "react-redux";
import { carnivalCountries } from "@/carnivalCountries";
const countries = [
  { country: "All Countries" },
  { country: "United States" },
  { country: " Trinidad and Tobago" },
];
export function CountrySelect() {
  const dispatch = useDispatch();
  return (
    <SelectDropdown
      data={carnivalCountries}
      search={true}
      searchPlaceHolder="Search Countries"
      onSelect={(selectedItem, index) => {
        dispatch(setCountry(selectedItem));
      }}
      renderButton={(selectedItem, isOpened) => (
        <View style={styles.dropdownButtonStyle}>
          <Text style={styles.dropdownButtonTxtStyle}>
            {selectedItem?.country || "Choose Your country"}
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
