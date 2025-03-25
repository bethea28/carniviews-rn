import React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

export function AddCompanyForm({ onSubmit, setModalVis, addPhotos }) {
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
      description: "",
      photos: [],
    },
  });

  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Name"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="name"
        />
        {/* {errors.name && <Text style={styles.errorText}>This is required.</Text>} */}

        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Address"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="address"
        />
        {/* {errors.address && (
          <Text style={styles.errorText}>This is required.</Text>
        )} */}

        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="city"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="city"
        />
        {/* {errors.city && <Text style={styles.errorText}>This is required.</Text>} */}

        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="state"
                placeholderTextColor="black"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{ width: 100, backgroundColor: "green" }}
              />
            )}
            name="state"
          />
          {/* {errors.state && (
            <Text style={styles.errorText}>This is required.</Text>
          )} */}
          <Controller
            control={control}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="zip"
                placeholderTextColor="black"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{ width: 100, backgroundColor: "green" }}
              />
            )}
            name="zip"
          />
          {/* {errors.zip && (
            <Text style={styles.errorText}>This is required.</Text>
          )} */}
        </View>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onPress={setModalVis}
              placeholder="Hours"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="hours"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Type"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="type"
        />
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="description"
              placeholderTextColor="black"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={styles.input}
            />
          )}
          name="description"
        />

        <Pressable
          onPress={addPhotos}
          style={({ pressed }) => [
            {
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "green",
              width: "50%",
            },
          ]}
        >
          <Text style={{ padding: 15 }}>Add Photos</Text>
        </Pressable>
        <View style={styles.buttonContainer}>
          <Button
            color="blue"
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
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
