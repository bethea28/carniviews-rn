import React from "react";
import {
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { useForm } from "react-hook-form";
import { useImagePicker } from "@/app/customHooks";
import { useAddCompanyMutation } from "@/store/api/api";
import { AddCompanyForm } from "./AddCompanyForm";
import { BusinessHoursModal } from "./BusinessHoursModal";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

const ModalItem = ({ modalVis, hideModal }) => {
  return (
    <Modal transparent={true} visible={modalVis} animationType="slide">
      <BusinessHoursModal closeView={hideModal} />
    </Modal>
  );
};
export function AddCompanyScreen() {
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
  const [modalVis, setModalVis] = React.useState(false);
  const [hoursData, setHoursData] = React.useState({});
  const userData = useSelector((state) => state.counter.userState); // Assuming your slice is named 'userSlice'
  const dispatch = useDispatch();
  // dispatch(setBusinessHours(hours));

  const navigation = useNavigation();
  const onSubmit = async (data) => {
    console.log("all my hours data", hoursData);
    const finalData = {
      companyInfo: data,
      allImages,
      hoursData,
      userId: userData?.data?.user?.user_id,
    };

    console.log("ALL DATA NOW SUBMIT", data);
    addCompany(finalData);
    reset();
    navigation.navigate("Home");
  };

  const handleModalClose = (hourlyData) => {
    setHoursData(hourlyData);
    setModalVis(false);
  };

  const addPhotos = () => {
    console.log("add phoes");
    pickImages();
  };
  console.log("USER DATA NOW", userData.data.user.user_id);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <AddCompanyForm
        setModalVis={() => setModalVis(true)}
        onSubmit={onSubmit}
        hoursData={hoursData}
        addPhotos={addPhotos}
      />
      <BusinessHoursModal modalVis={modalVis} hideModal={handleModalClose} />
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
