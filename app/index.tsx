import { Pressable, Text, View } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../store/store";
import { authorizeUser } from "../store/userReducer";
import { testReducer } from "@/store/testReducer";
import {
  useGetWeatherQuery,
  useGetDjangoQuery,
  useGetBooksQuery,
} from "@/store/api/api";
import { useGetPokemonByNameQuery } from "@/store/pokemonTestApi/pokemonTestApi";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";

// WebView Component
function WebViewComp({
  handleWebViewNavigationStateChange,
  handleViewMessage,
}) {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "http://127.0.0.1:8000/" }} // Replace with your Django server URL
      onNavigationStateChange={handleWebViewNavigationStateChange}
      onMessage={handleViewMessage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});

// Main App Component
const TestApp = () => {
  const dispatch = useDispatch();
  const { data: weatherData } = useGetWeatherQuery();
  const { data: pokeMan } = useGetPokemonByNameQuery("book");
  const [books, setBooks] = React.useState([]);
  const [showHome, setShowHome] = React.useState(false);
  const [user, setUser] = React.useState("");
  React.useEffect(() => {
    // Example: Dispatch an action on component mount
    // dispatch(authorizeUser("the new user is bryan dude"));
  }, [dispatch]);

  const djangoCall = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/bryan/book/");
      const data = await response.json();
      setBooks(data);
      console.log("DATA WAS THIS", data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleWebViewNavigationStateChange = (newNavState) => {
    if (!newNavState) return;
    const { url } = newNavState;
    if (!url) return;

    // Handle specific URLs (e.g., show home screen when URL includes "/home")
    if (url.includes("/home")) {
      setShowHome(true);
    }
  };

  const handleViewMessage = (event) => {
    try {
      const userData = JSON.parse(event.nativeEvent.data);
      console.log("User Data received:", userData);
      setUser(userData);

      // Use the received user data (e.g., update state, navigate)
      // Example: Dispatch an action with the user data
      dispatch(authorizeUser(userData.username));
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {user ? (
        <>
          <Pressable
            onPress={djangoCall}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "red" : "green" },
              { alignItems: "center", justifyContent: "center", height: 50 },
            ]}
          >
            <Text>DJANGO API TEST</Text>
          </Pressable>
          {books.map((book, index) => (
            <View key={index}>
              <Text>{book.title}</Text>
              <Text>{book.author}</Text>
            </View>
          ))}
        </>
      ) : (
        <WebViewComp
          handleViewMessage={handleViewMessage}
          handleWebViewNavigationStateChange={
            handleWebViewNavigationStateChange
          }
        />
      )}
    </View>
  );
};

// App Entry Point
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TestApp />
      </PersistGate>
    </Provider>
  );
}
