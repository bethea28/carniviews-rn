import { View } from "react-native";
import { AmericanForm } from "./AmericanForm";
import { MainBizForm } from "./MainBizForm";
import { useSelector } from "react-redux";
import { MainEventForm } from "./MainEventForm";
export const CompanyForms = ({ route }) => {
  const country = useSelector((state) => state.counter.country);
  const eventType = route.params.eventType;
  // const lower = country?.toLowerCase();
  console.log("company forms bryan", country);
  // return;
  return (
    <View style={{ flex: 1 }}>
      {eventType === "company" ? (
        <MainBizForm eventType={eventType} country={country} />
      ) : (
        <MainEventForm eventType={eventType} country={country} />
      )}
      {/* {country === null && <AmericanForm country={country} />}
      {lower?.includes("states") && <AmericanForm country={country} />}
      {lower?.includes("trinidad") && <TrinidadForm country={country} />} */}
    </View>
  );
};
