import React, { useState , useEffect} from 'react';
import { useSelector } from 'react-redux'
import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/pages/auth/Login';
import RegisterScreen from './src/pages/auth/Register';
import HomePage from './src/pages/HomePage';
import WelcomeScreen from './src/pages/WelcomeScreen';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setLoggedIn, setUser } from './src/redux/userSlice';
import {useDispatch} from 'react-redux'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import OnBoarding from './src/pages/Onboarding';




const Stack = createStackNavigator();
const Main  = () =>  {
    const selectUser = useSelector((state) => state.user.user)
    const loggedIn = useSelector((state) => state.user.loggedIn)

    const dispatch = useDispatch()
    const db = getFirestore()

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setLoggedIn(true))
        console.log('selected user', selectUser)
        const uid = user.uid;
        try {
          const users = await getDocs(query(collection(db, 'users'), where('userUID', '==', uid )))
          users.forEach((doc) => {
            if(doc.data().userUID === uid){
              if(!selectUser.email){
                dispatch(setUser(doc.data()))
              }
            }
          })
        } catch (error) {
          console.log('User not found',error)
        }
      } else {
        dispatch(setLoggedIn(false))
        console.log('No user found')
      }
    });

     if(!loggedIn){
      return (
         <NavigationContainer>
              <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name={"Welcome"} component={WelcomeScreen}   options={{ headerShown: false }} />
                <Stack.Screen name="Register"  options={{ headerShown: false }} >
                  {() => <RegisterScreen/>}

                </Stack.Screen>
                <Stack.Screen name="Login"   options={{ headerShown: false }} >
                  {() => <LoginScreen/>}
                </Stack.Screen>
              </Stack.Navigator>
          </NavigationContainer>
      );
    } else if(loggedIn){
      if(selectUser?.onboardingComplete){
        return (
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Home Page" component={HomePage} />
          </Stack.Navigator>
        </NavigationContainer>
        )
      } else {
        return (
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Onboarding" component={OnBoarding} />
          </Stack.Navigator>
        </NavigationContainer>
        )
      }
    }
}

export default Main
