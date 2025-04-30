import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useDuplicateCheckMutation } from "@/store/api/api";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export const DuplicationCheck = ({ route }) => {
  const [checkDups] = useDuplicateCheckMutation();
  const country = useSelector((state) => state.counter.country);
  const [name, setName] = React.useState("");
  const [dupResults, setDupResults] = React.useState(null);
  const [isDuplicateConfirmed, setIsDuplicateConfirmed] = React.useState(false);
  const navigation = useNavigation();
  const handleDupCheck = async () => {
    console.log("ROUTES NOW", route.params.eventType);
    if (name.trim()) {
      const checkForDups = await checkDups({
        country: country?.country,
        name,
        type: route.params.eventType,
      });
      setDupResults(checkForDups?.data?.results);
    } else {
      setDupResults([]);
    }
  };

  const handleConfirmDuplicate = () => {
    setIsDuplicateConfirmed(true);
    console.log("User confirmed a duplicate.");
    // You might want to disable further form submission or navigate elsewhere
  };

  const handleNotDuplicate = () => {
    // setIsDuplicateConfirmed(false);
    // if (onNextStep) {
    //   onNextStep(); // Call the callback to move to the next step
    // }
    navigation.navigate("CompanyForms", { eventType: route.params.eventType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>
        Check If Your {route.params.eventType} is Already Listed
      </Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        placeholder="Enter Business Name"
        value={name}
      />
      <TouchableOpacity style={styles.button} onPress={handleDupCheck}>
        <Text style={styles.buttonText}>Check</Text>
      </TouchableOpacity>
      {dupResults && dupResults.length > 0 && (
        <View>
          {/* <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={handleConfirmDuplicate}
              >
                <Text style={styles.buttonText}>This is a Duplicate</Text>
              </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNotDuplicate}
          >
            <Text style={styles.buttonText}>
              My {route.params.eventType} is Different
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {dupResults && dupResults.length === 0 && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNotDuplicate}
        >
          <Text style={styles.buttonText}>
            Continue Adding {route.params.eventType}
          </Text>
        </TouchableOpacity>
      )}
      {dupResults !== null && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            Potential Existing Businesses:
          </Text>
          {dupResults && dupResults.length > 0 ? (
            <FlatList
              data={dupResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text style={styles.resultText}>Name: {item.name}</Text>
                  <Text style={styles.resultText}>Country: {item.country}</Text>
                  {item.name_similarity !== undefined && (
                    <Text style={styles.similarityText}>
                      Name Similarity: {(item.name_similarity * 100).toFixed(2)}
                      %
                    </Text>
                  )}
                </View>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>
              No similar businesses found.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  resultsContainer: {
    marginTop: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultItem: {
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
  },
  similarityText: {
    fontSize: 12,
    color: "gray",
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "gray",
  },
  nextButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 16,
  },
});
