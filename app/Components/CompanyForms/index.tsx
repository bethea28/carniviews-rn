import { View } from "react-native";
import { AmericanForm } from "./AmericanForm";
import { MainBizForm } from "./MainBizForm";
import { useSelector } from "react-redux";
import { MainEventForm } from "./MainEventForm";
import { DuplicationCheck } from "../DuplicationCheck";

export const CompanyForms = ({ route }) => {
  const country = useSelector((state) => state.counter.country);
  const eventType = route.params.eventType;
  const operation = route.params.operation;
  const eventId = route.params.eventId;
  const editEventData = route.params.item || null;

  // const lower = country?.toLowerCase();
  // return;
  console.log("company form route", route.params.item);
  return (
    <View style={{ flex: 1 }}>
      {eventType !== "event" ? (
        <MainBizForm
          editEventData={editEventData}
          eventType={eventType}
          eventType={eventType}
          country={country}
          operation={operation}
        />
      ) : (
        <MainEventForm
          country={country}
          editEventData={editEventData}
          eventType={eventType}
          country={country}
          operation={operation}
          eventId={eventId}
        />
      )}
      {/* {country === null && <AmericanForm country={country} />}
      {lower?.includes("states") && <AmericanForm country={country} />}
      {lower?.includes("trinidad") && <TrinidadForm country={country} />} */}
    </View>
  );
};
