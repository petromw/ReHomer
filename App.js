import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState , useEffect} from 'react';
import LoginScreen from './src/pages/auth/Login';
import RegisterScreen from './src/pages/auth/Register';
import HomePage from './src/pages/HomePage';
import WelcomeScreen from './src/pages/WelcomeScreen';
import { initializeApp } from 'firebase/app';
import { View, Text } from 'react-native'
import { getAuth } from "firebase/auth";
import { firebaseConfig } from './firebaseConfig';
import { ThemeProvider, Button, createTheme } from '@rneui/themed';
import store from './src/redux/store'
import { Provider } from 'react-redux'


const theme = createTheme({
  components: {},
});

//TODO replace with .env variables
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

    const login = () => { 
      setLoggedIn(true)
    }

    if (!loggedIn) {
      return (
        <Provider store={store}>
          <NavigationContainer>
            <ThemeProvider theme={theme}>
              <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name={"Welcome"} component={WelcomeScreen}   options={{ headerShown: false }} />
                <Stack.Screen name="Register"  options={{ headerShown: false }} >
                  {() => <RegisterScreen login={login}/>}

                </Stack.Screen>
                <Stack.Screen name="Login"   options={{ headerShown: false }} >
                  {() => <LoginScreen login={login}/>}
                </Stack.Screen>
              </Stack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </Provider>
      );
    } else if (loggedIn){
      return (
        <Provider store={store}>
          <NavigationContainer>
            <ThemeProvider theme={theme}>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Home Page" component={HomePage} />
            </Stack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </Provider>
    )
  }    
}

export default App
