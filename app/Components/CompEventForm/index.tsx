import React from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { useImagePicker } from "@/app/customHooks";
import { useAddCompanyMutation, useAddEventMutation } from "@/store/api/api";
import { MainForm } from "./MainForm";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Notifier, Easing } from "react-native-notifier";

export function AddCompEventForm({ route: params }) {
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
      photos: [],
    },
  });

  const { pickImages, allImages } = useImagePicker();
  const [addCompany] = useAddCompanyMutation();
  const [addEvent] = useAddEventMutation();
  const [modalVis, setModalVis] = React.useState(false);

  const userData = useSelector((state) => state.counter.userState);
  const hoursData = useSelector((state) => state.counter.businessHours);
  const eventHours = useSelector((state) => state.counter.eventHours);
  const navigation = useNavigation();

  console.log("event type now", params?.params?.eventType);
  const onSubmit = async (data) => {
    const eventType = params?.params?.eventType;
    // Notifier.showNotification({
    //   title: "Submitting Info",
    //   description:
    //     eventType === "company"
    //       ? "Creating a new company..."
    //       : "Creating a new event...",
    //   duration: 2000,
    //   showAnimationDuration: 800,
    //   showEasing: Easing.bounce,
    //   onHidden: () => console.log("Notification hidden"),
    //   onPress: () => console.log("Notification pressed"),
    //   hideOnPress: true,
    // });

    const finalData =
      eventType === "company"
        ? {
            companyInfo: data,
            allImages,
            hoursData,
            userId: userData?.data?.user?.user_id,
          }
        : {
            eventInfo: data,
            allImages,
            eventHours,
            userId: userData?.data?.user?.user_id,
          };

    try {
      const response =
        eventType === "company"
          ? await addCompany(finalData)
          : await addEvent(finalData);

      console.log("Submission response:", response);

      Notifier.showNotification({
        title: "Success!",
        description:
          eventType === "company"
            ? "Company created successfully!"
            : "Event created successfully!",
        duration: 6000,
        showAnimationDuration: 800,
        showEasing: Easing.ease,
        hideOnPress: true,
      });

      reset();
      eventType === "company"
        ? navigation.navigate("Home")
        : navigation.goBack();
    } catch (err) {
      console.error("Error submitting:", err);
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

  const addPhotos = () => {
    pickImages();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <MainForm
        setModalVis={() => setModalVis(true)}
        onSubmit={onSubmit}
        hoursData={hoursData}
        addPhotos={addPhotos}
        eventType={params.params?.eventType}
        thumbNail={
          allImages[0]?.uri && (
            <Image
              style={{ width: 100, height: 100 }}
              source={{ uri: allImages[0]?.uri }}
            />
          )
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  input: {
    height: 50,
    backgroundColor: "green",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
