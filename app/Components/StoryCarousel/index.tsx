import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const colors = ["#B0604D", "#899F9C", "#5C6265", "#D1A6A6", "#7EB6B8"];

export const StoryCarousel = () => {
  const ref = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const rotate = interpolate(
        animationValue.value,
        [index - 1, index, index + 1],
        [-5, 0, 5],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ rotate: `${rotate}deg` }],
      };
    });

    return (
      <Animated.View
        style={[styles.card, { backgroundColor: item }, animatedStyle]}
      >
        {/* <View onPress={() => setModalVisible(!modalVisible)}> */}
        {/* <Text style={styles.text}>Card {index + 1}</Text> */}
        <TextInput
          style={{
            flex: 1,
            paddingHorizontal: 10,
            width: 300,
            height: 500,
            backgroundColor: "green",
          }}
          defaultValue={`Card ${index + 1}`}
          multiline
        />
        {/* </View> */}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Carousel
            ref={ref}
            data={colors}
            renderItem={renderItem}
            width={400}
            loop
            mode="horizontal-stack"
            pagingEnabled
            snapEnabled
            defaultIndex={1}
            modeConfig={{}}
            customConfig={() => ({
              type: "positive",
              viewCount: 5,
            })}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 370,
    borderRadius: 16,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: {
    fontSize: 22,
    color: "#fff",
    height: 200,
  },
});
