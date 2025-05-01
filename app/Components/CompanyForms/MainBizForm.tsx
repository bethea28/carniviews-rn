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
import { useSelector } from "react-redux";
import { useImagePicker } from "@/app/customHooks";
import { Notifier, Easing } from "react-native-notifier";
import { useNavigation } from "@react-navigation/native";
import { useAddUnverifiedBusinessMutation } from "@/store/api/api";
import { BusinessHours } from "../BusinessHours";

const colors = {
  primary: "#a349a4",
  secondary: "#FF8C00",
  background: "#FFB347",
  textPrimary: "#ffffff",
  textSecondary: "#333333",
  inputBg: "#ffffff",
  error: "red",
  placeholder: "gray",
};

const FormInput = ({
  control,
  name,
  placeholder,
  multiline = false,
  value,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value } }) => (
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        style={[styles.input, multiline && styles.multilineInput]}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    )}
  />
);

export function MainBizForm({
  setModalVis,
  addPhotos,
  thumbNail,
  country,
  eventType,
  editEventData,
}) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: editEventData?.companyInfo.name,
      type: editEventData?.companyInfo.company_type,
      description: editEventData?.companyInfo.description,
      phone: editEventData?.companyInfo.phone,
      email: editEventData?.companyInfo.email,
      website: editEventData?.companyInfo.website,
      twitter: editEventData?.companyInfo.twitter,
      instagram: editEventData?.companyInfo.instagram,
      facebook: editEventData?.companyInfo.facebook,
      addressLine1: editEventData?.companyInfo.address_line1,
      addressLine2: editEventData?.companyInfo.address_line2,
      city: editEventData?.companyInfo.city,
      postal: editEventData?.companyInfo.postal_code,
      region: editEventData?.companyInfo.region,
      country: country?.country,
    },
  });

  const [hoursComp, setShowHoursComp] = useState(false);
  const hoursData = useSelector((state) => state.counter.businessHours);
  const userData = useSelector((state) => state.counter.userState);
  const [addBusiness] = useAddUnverifiedBusinessMutation();
  const navigation = useNavigation();
  const { pickImages, allImages } = useImagePicker();
  console.log("edit even data", editEventData);
  const onSubmit = async (data) => {
    console.log("data submit", data);
    // return;
    const finalData = {
      companyInfo: data,
      allImages,
      hoursData,
      userId: userData?.data?.user?.user_id,
    };

    const addingBiz = await addBusiness(finalData);

    console.log("adding business messs", addingBiz);
    if (!addingBiz?.error) {
      Notifier.showNotification({
        title: "Success!",
        description: "Business created successfully!",
        duration: 6000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
      // reset();
      // navigation.navigate("MarketPlace");
    } else {
      Notifier.showNotification({
        title: "Error",
        description: "Something went wrong. Please try again.",
        duration: 3000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
    }
  };

  const textInputs = [
    { name: "name", placeholder: "Business Name" },
    { name: "type", placeholder: "Business Type" },
    { name: "description", placeholder: "Description", multiline: true },
    { name: "phone", placeholder: "Phone" },
    { name: "email", placeholder: "Email" },
    { name: "website", placeholder: "Website" },
    { name: "twitter", placeholder: "Twitter" },
    { name: "instagram", placeholder: "Instagram" },
    { name: "facebook", placeholder: "Facebook" },
    { name: "addressLine1", placeholder: "Address Line 1" },
    { name: "addressLine2", placeholder: "Address Line 2" },
    {
      name: "city",
      placeholder: `City/Town/Village (e.g. ${country?.exampleAddress?.locality})`,
    },
    {
      name: "postal",
      placeholder: `Zip/Postal Code (e.g. ${country?.exampleAddress?.postalCode})`,
    },
    {
      name: "region",
      placeholder: `State/Province/Region (e.g. ${country?.exampleAddress?.subRegion})`,
    },
    { name: "country", placeholder: "Country" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {textInputs.map((input) => (
          <FormInput key={input.name} control={control} {...input} />
        ))}

        {hoursComp && <BusinessHours eventType="company" addCompany />}

        <View style={{ marginTop: 8, alignItems: "center" }}>{thumbNail}</View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={pickImages} style={styles.addPhotosButton}>
            <Text style={styles.addPhotosText}>Add Photos</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
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
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    height: 50,
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    color: colors.textSecondary,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginLeft: 10,
  },
  submitButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  addPhotosButton: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  addPhotosText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
