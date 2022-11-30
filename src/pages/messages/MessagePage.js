
import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/userSlice'
import { Button } from '@rneui/themed';



export default function MessagePage() {
  const user = useSelector((state) => state.user)

  return (
    <View style={{flex: 1}}>
      {user.user.type === 'Adoptee' 
        ? 
        (
          <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>Chat with adoptors you matched with</Text>
            <Text style={{fontSize: 18}}>Feature coming soon</Text>
          </View>
        ) : 
        (
          <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={{fontSize: 24}}>Chat with owners you matched with</Text>
            <Text style={{fontSize: 18}}>Feature coming soon</Text>
          </View>
        )
      }
    </View>
  )
}