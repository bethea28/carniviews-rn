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
import { BusinessHours } from "../BusinessHours";
import { useSelector } from "react-redux";
import { useImagePicker } from "@/app/customHooks";
const primaryColor = "#a349a4";
const secondaryColor = "#FF8C00";
const backgroundColor = "#FFB347";
const textColorPrimary = "#ffffff";
const textColorSecondary = "#333333";
const inputBackgroundColor = textColorPrimary;
const buttonBackgroundColor = primaryColor;
const buttonTextColor = textColorPrimary;
const errorTextColor = "red";
const placeholderTextColor = "gray";

export function AmericanForm({ onSubmit, setModalVis, addPhotos, thumbNail }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
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
    },
  });

  const [hoursComp, setShowHoursComp] = useState(false);
  const bizHours = useSelector((state) => state.counter.businessHours);
  const { pickImages, allImages } = useImagePicker();

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
        <Controller
          control={control}
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
        <Controller
          control={control}
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

        <View style={styles.rowInputs}>
          <Controller
            control={control}
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
          <Controller
            control={control}
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
        </View>

        <Pressable
          onPress={() => setShowHoursComp((prev) => !prev)}
          style={styles.input}
        >
          <Text style={styles.placeholderText}>Hours</Text>
          {bizHours && Object.keys(bizHours).length > 0 && (
            <Text style={styles.selectedHoursText}>Hours Added</Text>
          )}
        </Pressable>

        {hoursComp && <BusinessHours eventType="company" addCompany={true} />}

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

        <View style={{ marginTop: 8, alignItems: "center" }}>{thumbNail}</View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => pickImages()}
            style={styles.addPhotosButton}
          >
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
