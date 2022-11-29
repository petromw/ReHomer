import { View,Text } from 'react-native'
import React, {useState} from 'react'
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { Input , Button} from '@rneui/themed';
import {useDispatch} from 'react-redux'





export default function HomePage(props) {
  const navigation = props.navigation
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home</Text>
          <Button 
            color={'#4d4365'}
            containerStyle={{width: 100, alignSelf: 'center', marginTop: 20}}  
            title={'Map'} 
            onPress={() => navigation.navigate("Map")}
          />
    </View>
    
  )
}