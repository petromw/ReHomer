import React, { useState , useEffect} from 'react';
import { useSelector } from 'react-redux'
import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/pages/auth/Login';
import RegisterScreen from './src/pages/auth/Register';
import HomePage from './src/pages/home/HomePage';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setLoggedIn, setUid, setUser } from './src/redux/userSlice';
import {useDispatch} from 'react-redux'
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import OnBoarding from './src/pages/Onboarding';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './src/pages/profile/ProfilePageWrapper';
import MessagePage from './src/pages/matches/MatchSection';
import {
  StatusBar,
} from 'react-native';
import PreferencesPage from './src/pages/home/preferences/PreferencesPage';
import HomeStack from './src/pages/home/HomeStack';
import { ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MatchSectionStack from './src/pages/matches/MatchSectionStack';
import Report from './src/pages/Report/reportPage';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const Main  = () =>  {
    const selectUser = useSelector((state) => state.user.user)
    const loggedIn = useSelector((state) => state.user.loggedIn)
    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch()
    const db = getFirestore()

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        dispatch(setLoggedIn(true))
        const uid = user.uid;
        try {
          const users = await getDocs(query(collection(db, 'users'), where('userUID', '==', uid )))
          users.forEach((doc) => {
            if(doc.data().userUID === uid){
              if(!selectUser.email){

                dispatch(setUid(doc.id))
                dispatch(setUser(doc.data()))
              }
            }
          })
        } catch (error) {
          console.error('User not found',error)
        } finally {
          setLoading(false)
        }
      } else {
        dispatch(setLoggedIn(false))
        setLoading(false)
      }
    });

    if(loading){
      return (
        <SafeAreaView style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d436550'}}>
          <ActivityIndicator animating={true}/>
        </SafeAreaView>
      )
    } else if(!loggedIn){
      return (
         <NavigationContainer>
      
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Register"  options={{ headerShown: false }} >
                  {(props) => <RegisterScreen {...props}/>}

                </Stack.Screen>
                <Stack.Screen name="Login"   options={{ headerShown: false }} >
                  {(props) => <LoginScreen {...props}/>}
                </Stack.Screen>
              </Stack.Navigator>
          </NavigationContainer>
      );
    } else if(loggedIn){
      if(selectUser?.onboardingComplete){
        return (
        <NavigationContainer>
          <Tab.Navigator barStyle={{backgroundColor: '#4d4365'}}  initialRouteName="Home">
            <Tab.Screen  
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={'#fff'} size={26} />
                ),
                }} 
              name="Home" 
              component={HomeStack} 
            />
            <Tab.Screen  
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="chat" color={'#fff'} size={26} />
                ),
                }} 
              name="Messages" 
              component={MatchSectionStack} 
            />
            
            <Tab.Screen  
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="account" color={'#fff'} size={26} />
                ),
                }} 
              name="Profile" 
              component={Profile} 
            />
            <Tab.Screen  
              options={{
                tabBarLabel: '',
                tabBarIcon: () => (
                  <MaterialCommunityIcons name="flag" color={'#fff'} size={26} />
                ),
                }} 
              name="Report" 
              component={Report} 
            />           
          </Tab.Navigator>
        </NavigationContainer>
        )
      } else {
        return (
          <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen options={{ headerShown: false }} name="Onboarding" component={OnBoarding} />
          </Stack.Navigator>
        </NavigationContainer>
        )
      }
    }
}

export default Main
