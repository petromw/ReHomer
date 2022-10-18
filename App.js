import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState , useEffect} from 'react';
import LoginScreen from './src/pages/auth/Login';
import RegisterScreen from './src/pages/auth/Register';
import HomePage from './src/pages/HomePage';
import WelcomeScreen from './src/pages/WelcomeScreen';
import { initializeApp } from 'firebase/app';
import { View, Text } from 'react-native'
import { getAuth,onAuthStateChanged } from "firebase/auth";


//TODO replace with .env variables
const firebaseConfig = {
  apiKey: "AIzaSyByeNafw9TXJNVVmqU_pmA-7gUdAPAUYyU",
  authDomain: "rehomer-8d42c.firebaseapp.com",
  projectId: "rehomer-8d42c",
  storageBucket: "rehomer-8d42c.appspot.com",
  messagingSenderId: "193594662196",
  appId: "1:193594662196:web:4d6766add84de4712f5961",
  measurementId: "G-SDWZMQ4F72"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()

const Stack = createStackNavigator();

const App  = () =>  {
   const [loggedIn, setLoggedIn] = useState(false)
   const [loaded, setLoaded] = useState(false)

   useEffect(() => {
    if(auth.currentUser){
      setLoggedIn(true)
      setLoaded(true)
    } else {
      setLoggedIn(false)
      setLoaded(true)
    }
   }, [auth])

    if (!loaded) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen name={"Welcome"} component={WelcomeScreen}   options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen}   options={{ headerShown: false }} >
              {() => <RegisterScreen login={() => setLoggedIn(true)}/>}

            </Stack.Screen>
            <Stack.Screen name="Login"   options={{ headerShown: false }} >
              {() => <LoginScreen login={() => setLoggedIn(true)}/>}
            </Stack.Screen>

          </Stack.Navigator>
        </NavigationContainer>
      );
    } else if (loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Home Page" component={HomePage} />
          </Stack.Navigator>
        </NavigationContainer>
    )
    }

    
  }


export default App
