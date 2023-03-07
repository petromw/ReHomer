
import { View, Text , StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native'
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
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    },
  likesContainer: {
    marginLeft: 5,
    marginRight: 5,
    
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
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


export default function MatchSection(props) {
  const user = useSelector((state) => state.user)
  const db = getFirestore()
  const [likedUsers, setLikedUsers] = useState([])
  const [matches, setMatches] = useState([])
  const navigation = props.navigation

  const getOtherUsers = async () => {
    try {
      const liked = []
      const matched = []
      const likes = [].concat(user?.user?.likedProfiles ?? [])
       
      const otherUsers =   await getDocs(query(
        collection(db, 'users'), 
          where('userUID', 'in', likes),
          
        )) 
      otherUsers.forEach((user) => {
        liked.push(user.data())
      })
      const matchesQuery =   await getDocs(query(
        collection(db, 'users'), 
          where('userUID', 'in', likes),
          where('likedProfiles', 'array-contains', user.user.userUID)
        )) 
      matchesQuery.forEach((user) => {
        matched.push(user.data())
      })
      return {liked, matched}
    } catch (error) {
      console.error(error)
      return null
    }
  }


  useEffect(() => {
    const load = async() => {
      const users = await getOtherUsers()
      if(users){
        if(users.liked.length > 0){
          setLikedUsers(users.liked)

        }
        if(users.matched.length > 0){
          setMatches(users.matched)

        }
      }
    }
    load()
  }, [db])

  const handleMatchPress = (match) => {
    navigation.navigate("ChatPage")
    console.log(`Open chat with ${match.name}`)
  }
  
  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Messages</Text>
        <Divider />
        <Text style={styles.subtitle}>Likes</Text>
        
        {likedUsers.length > 0 ? 
          
          <ScrollView horizontal style={{maxHeight: 100}}>
          {likedUsers.map((match) => (
              <View  style={styles.likesContainer}>
                <Image source={match.profileImage ? {uri: match.profileImage} : blankProfile} style={styles.profilePicture} />
                <Text style={styles.matchName}>{match.name}</Text>
              </View>
            ))} 
            </ScrollView>
          : 
            <Text style={{textAlign: 'center'}}>No likes found</Text>
          }
          <Divider />
        <Text style={styles.subtitle}>Matches</Text>
        
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