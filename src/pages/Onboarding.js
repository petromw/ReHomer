import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../redux/userSlice'
import { Button } from '@rneui/themed';
import { collection, doc, getDocs, getFirestore, query, runTransaction, where } from 'firebase/firestore';



export default function OnBoarding() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  
  const db = getFirestore()

  const buttonStyle = {
    marginBottom: 15, 
    width: 100
  }
  
  const updateUser = async (type) => {
    try {
      await runTransaction(db, async (transaction) => {
    
        transaction.update(doc(db, "users", uid), { type: type });
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       <Button containerStyle={buttonStyle} title='Adoptor' onPress={() => updateUser('Adoptor')}/>
       <Button containerStyle={buttonStyle} title='Adoptee' onPress={() => updateUser('Adoptee')}/>

    </View>
  )
}