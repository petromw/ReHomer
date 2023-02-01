import { View, Text, Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { collection, getDocs, getFirestore, query, where, runTransaction, doc} from "firebase/firestore";
import { IconButton } from 'react-native-paper'
import {  setUser } from '../../redux/userSlice'





export default function AdoptorHomePage() {
  
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const db = getFirestore()

  const [otherUserProfiles, setOtherUserProfiles] = useState([])
  const [likedThisSession, setLikedThisSession] = useState([]) 
  const [dislikedThisSession, setDislikedThisSession] = useState([]) 

  const [index, setIndex] = useState(0)


  const getOtherUsers = async () => {
    try {
      const users = []
      const fitleredOut = [].concat(user?.user?.likedProfiles ?? []).concat(user?.user?.dislikedProfiles ?? []) 
       
      const otherUsers =  fitleredOut.length > 0 ? await getDocs(query(
        collection(db, 'users'), 
          where('type', '==', 'Adoptee'), 
          where('userUID', 'not-in', fitleredOut),
          
        )) : await getDocs(query(
          collection(db, 'users'), 
            where('type', '==', 'Adoptee'), 
            
          ))
      otherUsers.forEach((user) => {
        users.push(user.data())
      })
      return users
    } catch (error) {
      console.error(error)
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

  
  const likeUser = async (uid) => {
    try {
      const likedProfiles =  [].concat(user?.user?.likedProfiles ?? []).concat(likedThisSession).concat(uid)
      setLikedThisSession([...likedThisSession, uid])
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", user.uid), { likedProfiles});
      });
      console.log("Transaction likeUser successfully committed!");
      setIndex(index + 1)
    } catch (e) {
      console.error("Transaction likeUser failed: ", e);
    }
  };

  const dislikeUser = async (uid) => {
    try {
      const dislikedProfiles =  [].concat(user?.user?.likedProfiles ?? []).concat(dislikedThisSession).concat(uid)
      setDislikedThisSession([...dislikedThisSession, uid])
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", user.uid), {  dislikedProfiles});
      });
      console.log("Transaction dislikeUser successfully committed!");
      setIndex(index + 1)
    } catch (e) {
      console.error("Transaction dislikeUser failed: ", e);
    }
  };

  if(index > otherUserProfiles.length - 1){
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
        <Text style={{fontSize: 24}}>Species: {otherUserProfiles[index]?.pet?.species}</Text>
      </View>
      <View>
        {
          otherUserProfiles[index]?.pet?.profileImage ?  
          <Image 
          source={ {uri: otherUserProfiles[index]?.pet?.profileImage}}
          style={{
            width: 300,
            height: 300,
          }} 
        /> 
        :
         <Text>No image avalible</Text>
         }
       
      </View>
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <IconButton onPress={() =>  dislikeUser(otherUserProfiles[index].userUID)} icon={'thumb-down'} size={50} mode={'contained'} iconColor={'#ff000075'}/>
      <IconButton onPress={() =>  likeUser(otherUserProfiles[index].userUID)} icon={'star'} size={50} mode={'contained'}/>
    </View>
    </View>
  )
}