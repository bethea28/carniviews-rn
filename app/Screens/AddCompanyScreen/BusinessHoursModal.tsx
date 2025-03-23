import { BusinessHours } from "../BusinessHours";
import { Modal } from "react-native";
export const BusinessHoursModal = ({ modalVis = false, hideModal }) => {
  return (
    <Modal transparent={true} visible={modalVis} animationType="slide">
      <BusinessHours closeView={hideModal} />
    </Modal>
  );
};
