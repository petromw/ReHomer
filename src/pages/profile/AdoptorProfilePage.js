import { getAuth } from 'firebase/auth';
import React, { Component , useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg'
import CustomTextInput from '../../components/CustomTextInput';
import { runTransaction ,getFirestore, doc} from 'firebase/firestore';
import { setUser } from '../../redux/userSlice';





export default function AdoptorProfile() {
  const user = useSelector((state) => state.user.user)
  const profileImage = user?.profileImage ? {uri: user?.profileImage} : blankProfile
  const uid =  useSelector((state) => state.user.uid)

  const db = getFirestore()
  const dispatch = useDispatch()

  const [name, setName] = useState('')

  useEffect(() => {
    setName(user?.name)
    
  }, [])

  const auth = getAuth();
  const updateUser = async (field) => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), field);
      });
      dispatch(setUser({...user, field}))
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction update user failed: ", e);
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
          <CustomTextInput updateValue={() => updateUser({ name: name })} value={name} setValue={setName}/>
          
            
          </View>

          <View style={{marginTop: '85%', width: '75%', alignSelf: 'center'}}>
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
    fontWeight: "600"
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
