import { View } from 'react-native'
import React from 'react'
import { Button } from "@rneui/themed";

export default function WelcomeScreen(props) {

  const buttonStyle = {
    marginBottom: 15, 
    width: 100
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button containerStyle={buttonStyle} title='Login' onPress={() => props.navigation.navigate("Login")}/>
      <Button containerStyle={buttonStyle} title='Register' onPress={() => props.navigation.navigate("Register")}/>

    </View>
  )
}