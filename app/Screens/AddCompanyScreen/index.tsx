import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";

export function AddCompanyScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "",
      lastName: "",
    },
  });
  const onSubmit = async (data) => {
    console.log("data,data", data);
    const req = await fetch("http://127.0.0.1:8000/bryan/bookPost/", data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Company Name"
            placeholderTextColor="black"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{ backgroundColor: "green", height: 50, marginTop: 50 }}
          />
        )}
        name="companyName"
      />
      {errors.companyName && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Last name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{ backgroundColor: "red", height: 50, marginTop: 50 }}
          />
        )}
        name="lastName"
      />

      <Button color="blue" title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
