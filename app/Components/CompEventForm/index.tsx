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
import { MainForm } from "./MainForm";
// import { BusinessHoursModal } from "./BusinessHoursModal";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

// const ModalItem = ({ modalVis, hideModal }) => {
//   return (
//     <Modal transparent={true} visible={modalVis} animationType="slide">
//       <BusinessHoursModal closeView={hideModal} />
//     </Modal>
//   );
// };
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
  const userData = useSelector((state) => state.counter.userState); // Assuming your slice is named 'userSlice'
  const hoursData = useSelector((state) => state.counter.businessHours); // Assuming your slice is named 'userSlice'
  const eventHours = useSelector((state) => state.counter.eventHours); // Assuming your slice is named 'userSlice'
  const dispatch = useDispatch();
  // dispatch(setBusinessHours(hours));
  // console.log("paramsB BRYAN COMP", params);
  const navigation = useNavigation();
  const onSubmit = async (data) => {
    console.log("all my hours data", params.params.eventType);
    if (params.params.eventType === "company") {
      const finalData = {
        companyInfo: data,
        allImages,
        hoursData,
        userId: userData?.data?.user?.user_id,
      };

      const createCompany = await addCompany(finalData);
      console.log("respoine request", createCompany);
    } else {
      const finalData = {
        eventInfo: data,
        allImages,
        eventHours,
        userId: userData?.data?.user?.user_id,
      };

      console.log("EVENT HOURS NOW EVENT", eventHours);
      const createCompany = await addEvent(finalData);
      console.log("CREATE COMPANY RESPONS", createCompany);
    }

    reset();
    navigation.navigate("Home");
  };

  const addPhotos = () => {
    console.log("add phoes");
    pickImages();
  };
  console.log("all image nmow EVVENT TYPE", params.params.eventType);
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
        // eventType={params.eventType}
        thumbNail={
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: allImages[0]?.uri }}
          />
        }
      />

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
