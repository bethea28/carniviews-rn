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
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { BusinessHours } from "../BusinessHours";
import { useSelector } from "react-redux";
import { useImagePicker } from "@/app/customHooks";
import { Notifier, Easing } from "react-native-notifier";
import { useNavigation } from "@react-navigation/native";
import { useAddEventMutation, useEditEventMutation } from "@/store/api/api";

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

export function MainEventForm({
  setModalVis,
  addPhotos,
  thumbNail,
  country,
  eventType,
  editEventData,
  operation,
  eventId,
}) {
  const countrySpecific = country?.country;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: editEventData?.name,
      addressLine1: editEventData?.addressLine1,
      addressLine2: editEventData?.addressLine2,
      city: editEventData?.city,
      postal: editEventData?.postal,
      region: editEventData?.region, // Could be St. James, etc.
      country: country?.country,
      hours: "",
      type: editEventData?.type,
      ticket: editEventData?.ticket,
      description: editEventData?.description,
      photos: [],
      price: editEventData?.price,
    },
  });
  const [hoursComp, setShowHoursComp] = useState(false);
  const bizHours = useSelector((state) => state.counter.businessHours);
  const hoursData = useSelector((state) => state.counter.businessHours);
  const userData = useSelector((state) => state.counter.userState);
  const eventHours = useSelector((state) => state.counter.eventHours);

  console.log("edit evfnet data", eventHours);
  const [addEvent] = useAddEventMutation();
  const [editEvent] = useEditEventMutation();
  const navigation = useNavigation();
  const { pickImages, allImages } = useImagePicker();

  const onSubmit = async (data) => {
    const finalAddData = {
      eventInfo: data,
      allImages,
      eventHours,
      userId: userData?.data?.user?.user_id,
    };
    const finalEditData = {
      eventInfo: data,
      allImages,
      eventHours,
      userId: userData?.data?.user?.user_id,
      eventId: eventId,
    };
    let response = null;
    operation === "edit"
      ? (response = await editEvent(finalEditData))
      : (response = await addEvent(finalAddData));
    console.log("response add event change", response);
    if (response?.error) {
      Notifier.showNotification({
        title: "Error",
        description: `${response?.error?.data?.error}`,
        // duration: 3000,
        // showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
    } else {
      Notifier.showNotification({
        title: "Success!",
        description: "Event created successfully!",
        duration: 6000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
      reset();
      navigation.goBack();
    }
  };

  const editEventHours = {
    date: editEventData.date,
    start: editEventData.start_time,
    end: editEventData.end_time,
  };
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
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Event Name"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <View style={styles.rowInputs}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Type"
                  placeholderTextColor={placeholderTextColor}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={styles.smallInput}
                />
              )}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
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
                  style={styles.smallInput}
                  keyboardType="numeric"
                />
              )}
              name="price"
            />
          </View>
        </View>
        {errors.price && (
          <Text style={styles.errorText}>This is required.</Text>
        )}
        <Controller
          control={control}
          name="description"
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
        />

        <Controller
          control={control}
          name="addressLine1"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Address Line 1"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="addressLine2"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Address Line 2"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="ticket"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Ticket Link"
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`City/Town/Village (e.g. ${country?.exampleAddress?.locality})`}
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="postal"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`Zip/Postal Code (e.g.${country?.exampleAddress?.postalCode})`}
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="region"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={`State/Province/Region (e.g. ${country?.exampleAddress?.subRegion})`}
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={country?.country}
              placeholderTextColor={placeholderTextColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={country?.country}
              style={styles.input}
              editable={false}
            />
          )}
        />

        <Pressable
          onPress={() => setShowHoursComp((prev) => !prev)}
          style={styles.input}
        >
          {bizHours && Object.keys(bizHours).length > 0 && (
            <Text style={styles.selectedHoursText}>Add Event Hours</Text>
          )}
        </Pressable>

        {hoursComp && (
          <BusinessHours
            operation={operation}
            editEventHours={editEventHours}
            eventType={eventType}
            addCompany
          />
        )}

        <View style={{ marginTop: 8, alignItems: "center" }}>{thumbNail}</View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={pickImages} style={styles.addPhotosButton}>
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
    // marginTop: 10,
  },
  errorText: {
    color: errorTextColor,
    marginTop: 5,
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
    // width: "50%",
    paddingHorizontal: 15,

    paddingVertical: 15,
    justifyContent: "center",
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
    margin: "auto",
  },
});
