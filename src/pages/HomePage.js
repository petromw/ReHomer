import { View, Text } from 'react-native'
import React, {useEffect} from 'react'
import { getAuth } from "firebase/auth";


export default function HomePage() {
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    console.log(user)
  }, [user])
  
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text></Text>
    </View>
  )
}