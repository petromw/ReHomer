import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/userSlice'
import { Button } from '@rneui/themed';
import { useMemo } from 'react';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { async } from '@firebase/util';




export default function AdopteeHomePage() {
  
  const user = useSelector((state) => state.user)
  const db = getFirestore()

  const [otherUserProfiles, setOtherUserProfiles] = useState([])
  const [index, setIndex] = useState(0)


  const getOtherUsers = async () => {
    try {
      const users = []
      const otherUsers = await getDocs(query(collection(db, 'users'), where('type', '==', 'Adoptor')))
      otherUsers.forEach((user) => {
        users.push(user.data())
      })
      return users
    } catch (error) {
      return null
    }
  }


  useEffect(() => {
    const load = async() => {
      const users = await getOtherUsers()
      if(users && users.length > 0){
        setOtherUserProfiles(users)
      }
    }
    load()
  }, [db])

  useEffect(() => {
    console.log(otherUserProfiles)
  }, [otherUserProfiles])
  
  return (
    <View style={{flex: 1, alignItems: 'center', marginTop: '25%'}}>
      <Text style={{fontSize: 24}}>{otherUserProfiles[index]?.name}</Text>
      {/* <Text style={{fontSize: 24}}>{otherUserProfiles[index]}</Text> */}
    </View>
  )
}