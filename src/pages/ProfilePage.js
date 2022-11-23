
import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../redux/userSlice'
import { Button } from '@rneui/themed';



export default function Profile() {
  const user = useSelector((state) => state.user)

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {user.user.type === 'Adoptee' 
      &&
        <Button>
          Edit pet profile
        </Button>
      }
    </View>
  )
}