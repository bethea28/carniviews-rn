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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { increment, setUserData } from "@/store/globalState/globalState";
import { ProfileScreen } from "./Screens/ProfileScreen";
import { HomeScreen } from "./Screens/HomeScreen";
import { AddCompanyScreen } from "./Screens/AddCompanyScreen";
import { DetailsScreen } from "./Screens/DetailsScreen";
import { ReviewScreen } from "./Screens/ReviewScreen";
import { AddReviewScreen } from "./Screens/AddReviewScreen";
// WebView Component

const BottomTab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

function MyBottomTabs() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <BottomTab.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfileScreen}
      />
    </BottomTab.Navigator>
  );
}

function RootStack() {
  return (
    <StackNav.Navigator>
      <StackNav.Screen
        name="ProfileScreen"
        component={MyBottomTabs}
        options={{ headerShown: false }}
      />
      <StackNav.Screen name="AddCompany" component={AddCompanyScreen} />
      <StackNav.Screen name="Details" component={DetailsScreen} />
      <StackNav.Screen name="Reviews" component={ReviewScreen} />
      <StackNav.Screen name="AddReviews" component={AddReviewScreen} />
    </StackNav.Navigator>
  );
}

function WebViewComp({
  handleWebViewNavigationStateChange,
  handleViewMessage,
}) {
  return (
    <WebView
      style={styles.container}
      // source={{ uri: "http://127.0.0.1:8000/" }} // Replace with your Django server URL
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
function MainApp() {
  const dispatch = useDispatch();
  // const { data: weatherData } = useGetWeatherQuery();
  const { data: pokeMan } = useGetPokemonByNameQuery("book");
  const [books, setBooks] = React.useState([]);
  const [showHome, setShowHome] = React.useState(false);
  const [user, setUser] = React.useState("");
  React.useEffect(() => {
    // Example: Dispatch an action on component mount
    // dispatch(authorizeUser("the new user is bryan dude"));
    dispatch(increment({ value: 20 }));
    console.log("user name", user);
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

  const handleWebViewNavigationStateChange = (newNavState: any) => {
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

      console.log("User Dat received:", userData);
      setUser(userData);
      dispatch(setUserData({ userData }));
      // Use the received user data (e.g., update state, navigate)
      // Example: Dispatch an action with the user data
      dispatch(authorizeUser(userData.username));
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!user ? (
        // <NavigationContainer>
        <RootStack />
      ) : (
        // </NavigationContainer>
        <WebViewComp
          handleViewMessage={handleViewMessage}
          handleWebViewNavigationStateChange={
            handleWebViewNavigationStateChange
          }
        />
      )}
    </View>
  );
}

// App Entry Point
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}
