import { View, Button } from 'react-native'
import React from 'react'

export default function WelcomeScreen(props) {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button title='Login' onPress={() => props.navigation.navigate("Login")}/>
      <Button title='Register' onPress={() => props.navigation.navigate("Register")}/>

    </View>
  )
}