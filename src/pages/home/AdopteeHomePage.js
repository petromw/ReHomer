import { View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../redux/userSlice'
import { collection, getDocs, getFirestore, query, where, runTransaction, doc } from "firebase/firestore";
import { IconButton , Button} from 'react-native-paper';




export default function AdopteeHomePage(props) {
  
  const user = useSelector((state) => state.user)
  const db = getFirestore()
  const navigation = props.navigation

  const [otherUserProfiles, setOtherUserProfiles] = useState([])
  const [index, setIndex] = useState(0)

  const [likedThisSession, setLikedThisSession] = useState([]) 
  const [dislikedThisSession, setDislikedThisSession] = useState([]) 




  const getOtherUsers = async () => {
    try {
      const users = []
      const fitleredOut = [].concat(user?.user?.likedProfiles ?? []).concat(user?.user?.dislikedProfiles ?? []) 
       
      const queryFiltered = (likedAndDislikedUsers) => {
        if(user.user.preferences){
          console.log({pref: user.user.preferences})
          if(likedAndDislikedUsers >= 1){
            return query(
              collection(db, 'users'), 
              where('type', '==', 'Adoptor'), 
              where('userUID', 'not-in', fitleredOut),
              where('adoptorFields.familyType', '==', user.user.preferences.familyType),
              where('adoptorFields.houseType', '==', user.user.preferences.houseType)

            )
          } else{
            return query(
              collection(db, 'users'), 
              where('type', '==', 'Adoptor'),
              where('adoptorFields.familyType', '==', user.user.preferences.familyType),
              where('adoptorFields.houseType', '==', user.user.preferences.houseType)

            )
          }            
        } else {
          if(likedAndDislikedUsers >= 1){
            return query(collection(db, 'users'), where('type', '==', 'Adoptor'), where('userUID', 'not-in', fitleredOut))
          } else{
            return query(collection(db, 'users'), where('type', '==', 'Adoptor'))
          }
        }      
    } 
    const otherUsers =  await getDocs(queryFiltered(fitleredOut))
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
  }, [db, user])

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
      <View style={{flex: 1, padding: '15%', alignItems: 'flex-end'}}>
        <Button onPress={() => navigation.navigate('Preferences')}>Preferences</Button>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No more Profiles. Please try again later</Text>        
        </View>
      </View>
    )
  }
  
  return (
    <View style={{flex: 1, padding: '15%', alignItems: 'flex-end'}}>
      <Button onPress={() => navigation.navigate('Preferences')}>Preferences</Button>
      <View style={styles.container}>
        <Text style={{fontSize: 24}}>{otherUserProfiles[index]?.name}</Text>
        <Text style={{fontSize: 22, textAlign: 'center', marginTop: 25}}>Has a {otherUserProfiles[index]?.adoptorFields?.houseType}</Text>
        <Text style={{fontSize: 22, textAlign: 'center', marginTop: 25}}>with {otherUserProfiles[index]?.adoptorFields?.familyType}</Text>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <IconButton onPress={() =>  dislikeUser(otherUserProfiles[index])} icon={'thumb-down'} size={50} mode={'contained'} iconColor={'#ff000075'}/>
          <IconButton onPress={() =>  likeUser(otherUserProfiles[index])} icon={'star'} size={50} mode={'contained'}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: '20%', 
    borderWidth: 3,
    padding: 5,
    borderColor: '#cdcdcd',
    borderRadius: 5,
    minWidth: '100%'
  },
});