import { Text, Button } from "react-native-paper";
import { View, FlatList, Pressable } from "react-native";
import { CompanyCard } from "@/app/Components/CardComponent";
import { companyObjects, mockBusinessList } from "@/mockData";
import { useNavigation } from "@react-navigation/native";

export function HomeScreen() {
  const navigation = useNavigation();
  const renderItem = ({ item }) => {
    // console.log("get moeny", item);
    return (
      <>
        <CompanyCard
          wholeData={item}
          title={item.businessName}
          mainImage={item.mainImage}
        />
      </>
    );
  };
  return (
    <View style={{ padding: 10 }}>
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "green" : "magenta",
              width: 150,
              padding: 20,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>Add Company</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("AddCompany")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "green" : "magenta",
              width: 150,
              padding: 20,
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ textAlign: "center", fontSize: 15 }}>Add Company</Text>
        </Pressable>
      </View>
      <FlatList data={mockBusinessList} renderItem={renderItem} />
    </View>
  );
}
