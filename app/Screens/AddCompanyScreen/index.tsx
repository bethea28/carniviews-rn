import React from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
} from "react-native";
import { useForm } from "react-hook-form";
import { useImagePicker } from "@/app/customHooks";
import { useAddCompanyMutation, useAddEventMutation } from "@/store/api/api";
import { AddCompanyForm } from "./AddCompanyForm";
import { BusinessHoursModal } from "./BusinessHoursModal";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { AddCompEventForm } from "@/app/Components/CompEventForm";

const ModalItem = ({ modalVis, hideModal }) => {
  return (
    <Modal transparent={true} visible={modalVis} animationType="slide">
      <BusinessHoursModal closeView={hideModal} />
    </Modal>
  );
};
export function AddCompanyScreen({ route: params }) {
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
  const userData = useSelector((state) => state.counter.userState); // Assuming your slice is named 'userSlice'
  const hoursData = useSelector((state) => state.counter.businessHours); // Assuming your slice is named 'userSlice'
  const dispatch = useDispatch();
  // dispatch(setBusinessHours(hours));

  const navigation = useNavigation();
  const onSubmit = async (data) => {
    return;
    if (params.eventType === "company") {
      const finalData = {
        companyInfo: data,
        allImages,
        hoursData,
        userId: userData?.data?.user?.user_id,
      };

      const createCompany = await addCompany(finalData);
    } else {
      const finalData = {
        companyInfo: data,
        allImages,
        hoursData,
        userId: userData?.data?.user?.user_id,
      };
      const createCompany = await addEvent(finalData);
    }
    console.log("respoine request", createCompany);
    reset();
    navigation.navigate("Bands");
  };

  const addPhotos = () => {
    console.log("add phoes");
    pickImages();
  };
  console.log("all image nmow", allImages[0]?.uri);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <AddCompEventForm
        setModalVis={() => setModalVis(true)}
        onSubmit={onSubmit}
        hoursData={hoursData}
        addPhotos={addPhotos}
        eventType={params.eventType}
        thumbNail={
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: allImages[0]?.uri }}
          />
        }
      />
      {/* <AddCompanyForm
        setModalVis={() => setModalVis(true)}
        onSubmit={onSubmit}
        hoursData={hoursData}
        addPhotos={addPhotos}
        eventType={params.eventType}
        thumbNail={
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: allImages[0]?.uri }}
          />
        }
      /> */}

      {/* <BusinessHoursModal modalVis={modalVis} hideModal={handleModalClose} /> */}
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
