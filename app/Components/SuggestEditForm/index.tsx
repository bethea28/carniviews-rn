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
import {
  useAddUnverifiedBusinessMutation,
  useEditVerifiedBusinessMutation,
  useAddEditSuggestionMutation,
} from "@/store/api/api";
import { BusinessSubmitConfirmation } from "../ConfirmationModal";

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

const FormInput = ({ control, name, placeholder, multiline = false }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value } }) => (
      <TextInput
        editable={name === "description"}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        style={[styles.input, multiline && styles.multilineInput]}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    )}
  />
);

export function SuggestEditForm({
  setModalVis,
  addPhotos,
  thumbNail,
  eventType,
  editEventData,
  operation,
  route: { params },
}) {
  const defaultName =
    params.item?.companyInfo?.name || params.item?.compInfo?.name || "";
  const defaultCountry =
    params.item?.companyInfo?.country || params.item?.compInfo?.country || "";

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: defaultName,
      type: params?.eventType?.toUpperCase() || "",
      description: "",
      country: defaultCountry,
    },
  });

  const [confirmModal, setConfirmModal] = useState(false);
  const hoursData = useSelector((state) => state.counter.businessHours);
  const userData = useSelector((state) => state.counter.userState);
  const [editVerifiedBusiness] = useEditVerifiedBusinessMutation();
  const [addBusiness] = useAddUnverifiedBusinessMutation();
  const [addEditSuggestion] = useAddEditSuggestionMutation();
  const navigation = useNavigation();
  const { pickImages, allImages } = useImagePicker();

  const onSubmit = async (data) => {
    const userId = userData?.data?.user?.user_id;
    const entityId =
      data.type === "BAND" ? params.item?.companyId : params.item?.id;

    const suggestionData = {
      ...data,
      userId,
      entityId,
    };

    const response = await addEditSuggestion(suggestionData);
    console.log("test me", response);
    // return;
    if (response.data.message.includes("success")) {
      Notifier.showNotification({
        title: "Success!",
        description: "Suggestion sent successfully!",
        duration: 6000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
    } else {
      Notifier.showNotification({
        title: "Failure!",
        description: "Suggestion failure!",
        duration: 6000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });
    }
    // You may want to inspect response here before navigating.
    reset();
    navigation.goBack();
  };

  const textInputs = [
    { name: "name", placeholder: "Business Name" },
    { name: "type", placeholder: "Business Type" },
    {
      name: "description",
      placeholder:
        "What field needs to be changed? ex: name, description, hours, etc",
      multiline: true,
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

      <BusinessSubmitConfirmation
        onCancel={() => setConfirmModal(false)}
        visible={confirmModal}
        onConfirm={handleSubmit(onSubmit)}
        operation={operation}
      />
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
    minHeight: 120,
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
