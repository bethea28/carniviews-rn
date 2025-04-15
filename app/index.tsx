import { Pressable, Text, View, Alert, Button } from "react-native";
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
import { InfoScreen } from "./Screens/InfoScreen";
import { AddReviewScreen } from "./Screens/AddReviewScreen";
import { BusinessHours } from "./Components/BusinessHours";
import { AddCompEventForm } from "./Components/CompEventForm";
import { SocialLoginScreen } from "./Screens/SocialLoginScreen";
import { EventScreen } from "./Screens/EventScreen";
import { AnonymousFeedback } from "./Screens/FeedbackScreen";
import { useSelector } from "react-redux";
import { useGoogleAuthMutation } from "@/store/api/api";
import { useNavigation } from "@react-navigation/native";
import { goBack } from "expo-router/build/global-state/routing";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// WebView Component

const BottomTab = createBottomTabNavigator();
const StackNav = createNativeStackNavigator();

const PlaceHolder = () => <Text>Placeholder</Text>;
const Photos = () => <Text>Placeholder</Text>;

function MyBottomTabs() {
  const navigation = useNavigation();
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        // options={{ headerShown: false }}
        options={{
          headerRight: () => (
            <Pressable
              onPress={() =>
                navigation.navigate("AddCompEvent", { eventType: "company" })
              }
              style={[
                {
                  padding: 20,
                  marginRight: 10,
                  borderRadius: 100,
                  backgroundColor: "#a349a4",
                },
              ]}
            >
              <Text style={{ color: "white" }}>Add Company</Text>
            </Pressable>
          ),
        }}
        name="Home"
        component={HomeScreen}
      />
      <BottomTab.Screen
        options={{ headerShown: true, goBack: true }}
        name="Events"
        component={EventScreen}
      />
      <BottomTab.Screen
        // options={{ headerShown: true, goBack: true }}
        name="Feedback"
        component={AnonymousFeedback}
      />
    </BottomTab.Navigator>
  );
}

function RootStack() {
  return (
    <StackNav.Navigator>
      <StackNav.Screen
        name="Home"
        component={MyBottomTabs}
        options={{ headerShown: false }} // Keep it here if you want to hide in Home
      />
      <StackNav.Screen name="AddCompany" component={AddCompanyScreen} />
      <StackNav.Screen name="AddCompEvent" component={AddCompEventForm} />
      <StackNav.Screen name="Details" component={DetailsScreen} />
      <StackNav.Screen
        name="Info"
        component={InfoScreen}
        // Remove options={{ headerShown: false }} from here
      />
      <StackNav.Screen
        name="BusinessHours"
        component={BusinessHours}
        // Remove options={{ headerShown: false }} from here
      />
      <StackNav.Screen
        options={{ headerShown: false }}
        name="AddReviews"
        component={AddReviewScreen}
      />
      <StackNav.Screen
        // options={{ headerShown: false }}
        name="Photos"
        component={Photos}
      />
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
  const userData = useSelector((state) => state.counter.userState); // Assuming your slice is named 'userSlice'
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
      // setUser(userData);
      dispatch(setUserData({ userData }));
      // Use the received user data (e.g., update state, navigate)
      // Example: Dispatch an action with the user data
      dispatch(authorizeUser(userData.username));
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  };
  console.log("ALL USER FINAL DATA", userData);
  return (
    <View style={{ flex: 1 }}>
      {userData?.data?.message?.includes("successful") ? (
        // <NavigationContainer>
        <RootStack />
      ) : (
        // </NavigationContainer>
        // <WebViewComp
        //   handleViewMessage={handleViewMessage}
        //   handleWebViewNavigationStateChange={
        //     handleWebViewNavigationStateChange
        //   }
        // />
        <SocialLoginScreen />
      )}
    </View>
  );
}

// App Entry Point

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NotifierWrapper>
            <MainApp />
          </NotifierWrapper>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
