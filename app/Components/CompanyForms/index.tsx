import { View } from "react-native";
import { AmericanForm } from "./AmericanForm";
import { TrinidadForm } from "./TriniForm";
import { useSelector } from "react-redux";

export const CompanyForms = () => {
  const country = useSelector((state) => state.counter.country);
  // const lower = country?.toLowerCase();
  console.log("company forms bryan", country);
  return (
    <View style={{ flex: 1 }}>
      <TrinidadForm country={country} />
      {/* {country === null && <AmericanForm country={country} />}
      {lower?.includes("states") && <AmericanForm country={country} />}
      {lower?.includes("trinidad") && <TrinidadForm country={country} />} */}
    </View>
  );
};
