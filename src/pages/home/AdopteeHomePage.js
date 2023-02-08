import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/userSlice'
import { Button } from '@rneui/themed';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { IconButton } from 'react-native-paper';




export default function AdopteeHomePage() {
  
  const user = useSelector((state) => state.user)
  const db = getFirestore()

  const [otherUserProfiles, setOtherUserProfiles] = useState([])
  const [index, setIndex] = useState(0)

  const [likedThisSession, setLikedThisSession] = useState([]) 
  const [dislikedThisSession, setDislikedThisSession] = useState([]) 




  const getOtherUsers = async () => {
    try {
      const users = []
      const fitleredOut = [].concat(user?.user?.likedProfiles ?? []).concat(user?.user?.dislikedProfiles ?? []) 
       
      const otherUsers =  fitleredOut.length > 0 ? await getDocs(query(
        collection(db, 'users'), 
          where('type', '==', 'Adoptor'), 
          where('userUID', 'not-in', fitleredOut),
          
        )) : await getDocs(query(
          collection(db, 'users'), 
            where('type', '==', 'Adoptor'), 
            
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
      <Text style={{fontSize: 24}}>{otherUserProfiles[index]?.name}</Text>
      <Text style={{fontSize: 22, textAlign: 'center', marginTop: 25}}>Has a {otherUserProfiles[index]?.adoptorFields?.houseType}</Text>
      <Text style={{fontSize: 22, textAlign: 'center', marginTop: 25}}>with {otherUserProfiles[index]?.adoptorFields?.familyType}</Text>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <IconButton onPress={() =>  dislikeUser(otherUserProfiles[index])} icon={'thumb-down'} size={50} mode={'contained'} iconColor={'#ff000075'}/>
        <IconButton onPress={() =>  likeUser(otherUserProfiles[index])} icon={'star'} size={50} mode={'contained'}/>
      </View>
    </View>
  )
}