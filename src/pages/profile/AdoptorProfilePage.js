import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect,useState,useCallback,Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg';
import { firebase, getDocs, getDoc, getFirestore, runTransaction, db, doc, updateDoc} from "firebase/firestore";


export default function AdoptorProfile() {
  const user = useSelector((state) => state.user.user); 
  const uid = useSelector((state) => state.user.uid)
  const profileImage = user?.profileImage ? {uri: user?.profileImage} : blankProfile
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
//  const [zip, setZip] = useState('');
  const auth = getAuth();
  const dispatch = useDispatch();
  const db = getFirestore();

const updateUserName = async (name) => {
  try {
    await runTransaction(db, async (transaction) => {
      transaction.update(doc(db, "users", uid), { name: name });
    });
    dispatch(setName( { ...user, name: name }))

    console.log("Transaction successfully committed!");
  } catch (e) {
    console.error("Transaction failed: ", e);
  }
}

  return (
    <View style={styles.container}>
          <View style={styles.header}>
            {/* <View style={{ marginTop: '15%', alignSelf: 'flex-end', marginRight: '5%'}}>
              <IconButton size={50} mode={'contained'} color={'#000000'} icon={'account'}/>
            </View> */}
            
          </View>
          <Image style={styles.avatar} source={profileImage} />
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{user?.name}</Text>



          </View>

          <View styles={{ marginTop: '20%', marginLeft: '5%'}}>
            <Text style = {styles.floating}>Name</Text>
            <TextInput
              style={styles.input}
              value={user?.name}
              onChangeText={(name) => setName(name)}
              onBlur={() => updateUserName(name)}
            />            
            <Text style = {styles.floating}>Email</Text>
            <TextInput
              style={styles.input}
              value={user?.email}
              onChangeText={(email) => setEmail(email)}
              onBlur={() => updateUserEmail(email)}
            />
            
          </View>


          <View style={{marginTop: '80%', width: '75%', alignSelf: 'center'}}>
              <Button mode='contained' onPress={() => auth.signOut()}>
                Sign Out
              </Button>
            </View>



          
            
       
      </View>
    )
  }



const styles = StyleSheet.create({
  header:{
    backgroundColor: '#4d4365',
    height:200,
  },
  slider: {
    width: 600,
    alignSelf: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  titleContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: '#4d4365',
  },
  floating: {
    padding: 5,
    fontSize: 20,
    paddingBottom: 0,
  },
  input:{
    borderColor: "gray",
    width: "75%",
    fontSize: 20,
    height: 80,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 20,
  },
  name:{
    fontSize:500,
    color:"#000000",
    fontWeight:'600',
  },
  bodyContent: {
    marginTop:40,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600",
  },
  info:{
    fontSize:16,
    color: '#4d4365',
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  houseType:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  familyType:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#4d436550",
  },
});

