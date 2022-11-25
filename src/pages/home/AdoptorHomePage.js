import { View, Text, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/userSlice'
import { useMemo } from 'react';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { async } from '@firebase/util';
import { Button, IconButton } from 'react-native-paper';




export default function AdoptorHomePage() {
  
  const user = useSelector((state) => state.user)
  const db = getFirestore()

  const [otherUserProfiles, setOtherUserProfiles] = useState([])
  const [index, setIndex] = useState(0)


  const getOtherUsers = async () => {
    try {
      const users = []
      const otherUsers = await getDocs(query(collection(db, 'users'), where('type', '==', 'Adoptee')))
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

  const likeUser = () => {
    console.log('like', otherUserProfiles[index])
    setIndex(index + 1)

  }

  const disLikeUser = () => {
    console.log('dislike', otherUserProfiles[index])
    setIndex(index + 1)
  }

  if(index > otherUserProfiles.length){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No more Profiles. Please try again later</Text>        
      </View>
    )
  }
  
  return (
    <View style={{flex: 1, justifyContent: 'space-between', alignItems: 'center', marginTop: '25%', marginBottom: '5%'}}>
      <View>
        <Text style={{fontSize: 24}}>Owner: {otherUserProfiles[index]?.name}</Text>
        <Text style={{fontSize: 24}}>Pet: {otherUserProfiles[index]?.pet?.name}</Text>
      </View>
      <View>
        <Image 
          source={otherUserProfiles[index]?.pet?.profileImage ? {uri: otherUserProfiles[index]?.pet?.profileImage} : ''}
          style={{
            width: 300,
            height: 300,
          }} 
        />
      </View>
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <IconButton onPress={() =>  disLikeUser(otherUserProfiles[index])} icon={'thumb-down'} size={50} mode={'contained'} iconColor={'#ff000075'}/>
      <IconButton onPress={() =>  likeUser(otherUserProfiles[index])} icon={'star'} size={50} mode={'contained'}/>
    </View>
    </View>
  )
}