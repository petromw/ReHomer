
import { View, Text , StyleSheet, TouchableOpacity, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { Divider } from 'react-native-paper';
import { collection, getDocs, getFirestore, query, where, runTransaction, doc} from "firebase/firestore";
import blankProfile from '../../assets/blankProfile.jpg'

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 25,
  marginTop: 75,
  },
  title: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  },
  matchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  },
  matchName: {
  fontSize: 16,
  marginLeft: 10,
  },
  profilePicture: {
  width: 50,
  height: 50,
  borderRadius: 25,
  },
})


export default function MessagePage() {
  const user = useSelector((state) => state.user)
  const db = getFirestore()
  const [matches, setMatches] = useState([])

  const getOtherUsers = async () => {
    try {
      const users = []
      const likes = [].concat(user?.user?.likedProfiles ?? [])
       
      const otherUsers =   await getDocs(query(
        collection(db, 'users'), 
          where('type', '==', 'Adoptee'), 
          where('userUID', 'in', likes),
          
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
        setMatches(users)
      }
    }
    load()
  }, [db])

  const handleMatchPress = (match) => {
    console.log(`Open chat with ${match.name}`)
  }
  
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <Divider />
        {matches.length > 0 ? 
          matches.map((match) => (
            <TouchableOpacity onPress={() => handleMatchPress(match)} key={match.userUID}>
              <View style={styles.matchContainer}>
                <Image source={match.profileImage ? {uri: match.profileImage} : blankProfile} style={styles.profilePicture} />
                <Text style={styles.matchName}>{match.name}</Text>
              </View>
            </TouchableOpacity>
            )) 
          : 
            <Text style={{textAlign: 'center'}}>No matches found</Text>
          }
        </View>      
    </View>
  )
}