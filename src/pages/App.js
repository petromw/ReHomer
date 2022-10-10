import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import HomePage from './HomePage';
import WelcomeScreen from './WelcomeScreen';
import { initializeApp } from 'firebase/app';
import { View, Text } from 'react-native'
import { getAuth } from "firebase/auth";


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

export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
      loggedIn: false,

    }
  }
  

  componentDidMount() {
    const user = auth.currentUser;
    if (!user) {
      this.setState({
        loggedIn: false,
        loaded: true,
      })
    } else {
      this.setState({
        loggedIn: true,
        loaded: true,
      })
    }
  }

  render() {

    const { loggedIn, loaded } = this.state;
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
            <Stack.Screen name={"Welcome"} component={WelcomeScreen}  navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} navigation={this.props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Login" navigation={this.props.navigation} component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Home Page" component={HomePage} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
    )
  }
}

export default App
