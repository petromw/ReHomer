import { createStackNavigator } from '@react-navigation/stack';
import React, {useEffect, useState} from 'react'
import MatchSection from './MatchSection';
import ChatPage from './ChatPage'
import { useSelector } from 'react-redux'


const Stack = createStackNavigator();

export default function MatchSectionStack() {
  const chattingWith = useSelector((state) => (state.user.chattingWith))


  return (
    <Stack.Navigator>
      
      <Stack.Screen name="MatchesSection"  options={{ headerShown: false }} >
        {(props) => <MatchSection  {...props} />}
      </Stack.Screen>
      <Stack.Screen name="ChatPage"  options={{ headerShown: true , headerTitle: chattingWith.name ?? '', headerBackTitleVisible: false}} >
        {(props) => <ChatPage {...props}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}