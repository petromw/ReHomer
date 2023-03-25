import { getAuth } from 'firebase/auth';
import React, { useState , useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg'
import { Input } from '@rneui/themed';
import EditProfile from './editProfile';



export default function AdopteeProfile() {
  const user = useSelector((state) => state.user.user)
  const selectName = useSelector((state) => state.user.name)

  const uid =  useSelector((state) => state.user.uid)
  const profileImage = user?.pet?.profileImage ? {uri: user?.pet?.profileImage} : blankProfile

  const [name, setName] = useState('')
  const [editable, setEditable] = useState(false)
  const auth = getAuth();

  useEffect(() => {
    setName(selectName)
  }, [])

  const updateUser = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { name: name });
      });
      dispatch(setUser({...user, type: type}))
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
            {editable ?            
         <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Input
                  value={name}
                  defaultValue={name}
                  labelStyle={{color:'#0f0d14' }}
                  placeholderTextColor={'#0f0d14'}
                  selectionColor={'#0f0d14'}
                  underlineColorAndroid={'#0f0d14'}
                  onChangeText={(name) => setName(name)}
                  onBlur={() => updateUser()}
                />
                <IconButton onPress={() => setEditable(!editable)}  size={15} mode={'outlined'} color={'#000000'} icon={'edit'}/>
                </View>
          : 
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.name}>{user?.name}</Text>
            <IconButton onPress={() => setEditable(!editable)}  size={20}  color={'#000000'} icon={'pencil'}/>
          </View>
          }
          </View>

          <View style={{marginTop: '85%', width: '75%', alignSelf: 'center'}}>
              <Button mode='contained' onPress={() => EditProfile()} style={styles.button}>
                Edit Profile
              </Button>            
              <Button mode='contained' onPress={() => auth.signOut()} >
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
  button: {
    marginVertical: 10,
  },
});
