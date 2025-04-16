import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { BusinessHours } from "../BusinessHours";
import { useSelector } from "react-redux";

// Define the color palette based on the image (same as other components)
const primaryColor = "#a349a4"; // Purple
const secondaryColor = "#FF8C00"; // Your new, more vibrant orange (replace with actual code)
const backgroundColor = "#FFB347"; // Example lighter orange (adjust as needed)
const textColorPrimary = "#ffffff"; // White
const textColorSecondary = "#333333"; // Dark Gray
const inputBackgroundColor = textColorPrimary; // Assuming input fields are white
const buttonBackgroundColor = primaryColor;
const buttonTextColor = textColorPrimary;
const errorTextColor = "red";
const placeholderTextColor = "gray";

export function MainForm({
  onSubmit,
  setModalVis,
  addPhotos,
  hoursData,
  thumbNail,
  eventType = "company",
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      zip: "",
      state: "",
      hours: "",
      type: "",
      description: "",
      photos: [],
      price: "",
    },
  });
  const [hoursComp, setShowHoursComp] = useState(false);
  const navigation = useNavigation();
  const bizHours = useSelector((state) => state.counter.businessHours);
  const eventHours = useSelector((state) => state.counter.evenHours);
  console.log("MAIN FORM MAIN DAREN", eventType);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Name"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.errorText}>This is required.</Text>}

        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Address"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="address"
        />
        {errors.address && (
          <Text style={styles.errorText}>This is required.</Text>
        )}

        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="City"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="city"
        />
        {errors.city && <Text style={styles.errorText}>This is required.</Text>}

        <View style={styles.rowInputs}>
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="State"
                placeholderTextColor={placeholderTextColor}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.smallInput}
              />
            )}
            name="state"
          />
          {errors.state && (
            <Text style={styles.errorText}>This is required.</Text>
          )}
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Zip"
                placeholderTextColor={placeholderTextColor}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.smallInput}
              />
            )}
            name="zip"
          />
          {errors.zip && (
            <Text style={styles.errorText}>This is required.</Text>
          )}
        </View>
        <Pressable
          onPress={() => setShowHoursComp((prevState) => !prevState)}
          style={styles.input}
        >
          <Text style={styles.placeholderText}>Hours</Text>
          {bizHours && Object.keys(bizHours).length > 0 && (
            <Text style={styles.selectedHoursText}>Hours Added</Text>
          )}
        </Pressable>

        {hoursComp && <BusinessHours eventType={eventType} addCompany={true} />}
        {/* <BusinessHours addCompany={true} /> */}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Type"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="type"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={[styles.input, styles.multilineInput]}
              multiline
              numberOfLines={3}
            />
          )}
          name="description"
        />
        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Price"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              keyboardType="numeric" // 💸 ensures number-only keypad
            />
          )}
          name="price"
        />
        {errors.price && (
          <Text style={styles.errorText}>This is required.</Text>
        )}

        <View style={{ marginTop: 8, alignItems: "center" }}>{thumbNail}</View>
        <View style={styles.buttonContainer}>
          <Pressable onPress={addPhotos} style={styles.addPhotosButton}>
            <Text style={styles.addPhotosText}>Add Photos</Text>
          </Pressable>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  input: {
    height: 50,
    backgroundColor: inputBackgroundColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    color: textColorSecondary,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  smallInput: {
    flex: 1,
    height: 50,
    backgroundColor: inputBackgroundColor,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    marginHorizontal: 5,
    color: textColorSecondary,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  errorText: {
    color: errorTextColor,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 25,
    alignItems: "center",
    flexDirection: "row",
  },
  submitButton: {
    backgroundColor: buttonBackgroundColor,
    borderRadius: 8,
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  submitButtonText: {
    color: buttonTextColor,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  addPhotosButton: {
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: secondaryColor,
    width: "50%",
    paddingVertical: 15,
    justifyContent: "center",
    marginTop: 20,
  },
  addPhotosText: {
    color: buttonTextColor,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  placeholderText: {
    color: placeholderTextColor,
  },
  selectedHoursText: {
    color: primaryColor,
    fontSize: 14,
  },
});
