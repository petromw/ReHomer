import { getAuth } from 'firebase/auth';
import React, { Component , useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg'
import CustomTextInput from '../../components/CustomTextInput';
import { runTransaction ,getFirestore, doc} from 'firebase/firestore';
import { setUser } from '../../redux/userSlice';
import DropdownComponent from '../../components/DropDownSelect';
import { familyTypeArray, houseTypeArray } from '../../utils';
import * as ImagePicker from 'expo-image-picker';


export default function AdoptorProfile() {
  const user = useSelector((state) => state.user.user)
  const profilePicture = user?.profilePicture ? {uri: user?.profilePicture} : blankProfile
  const uid =  useSelector((state) => state.user.uid)

  const db = getFirestore()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [familyType, setFamilyType] = useState()
  const [houseType, setHouseType] = useState()

  useEffect(() => {
    setName(user?.name)
    setFamilyType(user?.adoptorFields?.familyType)
    setHouseType(user?.adoptorFields?.houseType)
  }, [])

  const auth = getAuth();
  const updateUser = async (field) => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "newUserTable", uid), field);
      });
      dispatch(setUser({...user, field}))
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction update user failed: ", e);
    }
  }

  const uploadProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "newUserTable", uid), { ...user, profilePicture: result.uri });
      });

      dispatch(setUser({...user, profilePicture: result.uri } ))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction uploadImage failed: ", e);
    }
  }

  useEffect(() => {
    if(familyType && houseType){
      updateUser({adoptorFields: {familyType, houseType}})
    }
  }, [familyType, houseType])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    <ScrollView>
   
      <View style={styles.container}>
          <View style={styles.header}/>
            <Image style={styles.avatar} source={profilePicture} />
            <IconButton
              icon="camera"
              size={30}
              style={styles.iconButton}
              onPress={() => uploadProfileImage()}
            />
          <View style={styles.bodyContent}>
            <CustomTextInput updateValue={() => updateUser({ name: name })} value={name} setValue={setName}/>           
          </View>
          <View style={{padding: 15}}>
            <DropdownComponent canBeEditable={true} data={familyTypeArray.map((familyType) => {return {label: familyType, value: familyType}})} value={familyType ?? 'Set your family type'} setValue={setFamilyType}/>
            <DropdownComponent canBeEditable={true} data={houseTypeArray.map((houseType) => {return {label: houseType, value: houseType}})} value={houseType ?? 'Set your house type'} setValue={setHouseType}/>
          
          </View>
          <View style={{marginTop: 65, width: '75%', alignSelf: 'center'}}>
              <Button mode='contained' onPress={() => auth.signOut()}>
                Sign Out
              </Button>
            </View>
      </View>
      
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  iconButton: {
    width: 130,
    height: 130,
    marginBottom: 10,
    position: 'absolute',
    marginTop: 180,
    marginLeft: 165
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
