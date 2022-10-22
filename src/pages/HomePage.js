import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../redux/userSlice'
import { Button } from '@rneui/themed';



export default function HomePage() {
  const user = useSelector((state) => state.user)

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Text>{String(user.user)}</Text>
    </View>
  )
}