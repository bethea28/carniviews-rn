import { Text, View, TextInput, Button, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAddReviewMutation } from "@/store/api/api";
export function AddReviewScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      review: "",
      userName: "",
    },
  });

  const [addReview] = useAddReviewMutation();
  const onSubmit = async (data) => {
    try {
      console.log("handling now gppd", data);
      addReview(data);
      // const req = await fetch("http://127.0.0.1:8000/bryan/bookPost/", {
      //   method: "POST",
      //   // headers: {
      //   //   "Content-Type": "application/json", // Important!
      //   // },
      //   body: JSON.stringify(data), // Convert data to JSON string
      // });

      // const resp = await req.json();
      // console.log("resp", resp);
    } catch (error) {
      console.log("error", error);
    }
    console.log("data,data", data);
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
            placeholder="Type your review"
            placeholderTextColor="black"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{ backgroundColor: "green", height: 50, marginTop: 50 }}
          />
        )}
        name="review"
      />
      {errors.review && <Text>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="stars"
            placeholderTextColor="black"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{ backgroundColor: "red", height: 50, marginTop: 50 }}
          />
        )}
        name="userName"
      />

      <Button color="blue" title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
