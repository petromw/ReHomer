import { getAuth } from 'firebase/auth';
import React, { useState , useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg'
import { Input } from '@rneui/themed';
import { runTransaction ,getFirestore, doc} from 'firebase/firestore';
import { setUser } from '../../redux/userSlice';
import CustomTextInput from '../../components/CustomTextInput';
import * as ImagePicker from 'expo-image-picker';
import CustomImagePicker from '../../components/CustomImagePicker';

export default function AdopteeProfile() {
  const user = useSelector((state) => state.user.user)
  const db = getFirestore()
  const dispatch = useDispatch()


  const uid =  useSelector((state) => state.user.uid)
  const profileImage = user?.profilePicture ? {uri: user?.profilePicture} : blankProfile

  const [name, setName] = useState('')
  const [petName, setPetName] = useState('')
  const [images, setImages] = useState([])
  const auth = getAuth();

  useEffect(() => {
    if(images.length < 6){
      const diff = 6 - images.length
      for(let i = 0; i < diff; i++){
        setImages([...images, {}])
      }
    }
  }, [images])

  useEffect(() => {
    setName(user?.name)
    setPetName(user?.pet.name)
    const imagesToSet = user?.pet?.images.map((img) => {return {uri: img}})
    if(imagesToSet.length < 6){
      setImages(imagesToSet)
    } else {
      setImages([...imagesToSet, {}])

    }
  }, [])

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

  const uploadImage = async (index, existing) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    const imageArrayCopy = [...images]
    if(existing){
      imageArrayCopy.splice(index, 1)
    }
    setImages([{uri: result.uri}, ...imageArrayCopy])
    try {
      const userImages = [...user?.pet?.images]
      if(existing){
        userImages.splice(index, 1)
      }
      const petImages = (userImages && userImages.length) > 0 ? [].concat(userImages).concat(result.uri) : [result.uri]
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { pet: {...user.pet, images: petImages} });
      });

      dispatch(setUser({...user, pet: {...user.pet, images: petImages}} ))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction uploadImage failed: ", e);
    }
  };

  const uploadProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    try {
      
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { ...user,profilePicture: result.uri });
      });

      dispatch(setUser({...user, profilePicture: result } ))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction uploadImage failed: ", e);
    }
  }

  return (
    <KeyboardAvoidingView
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView>
      

      <View style={styles.container}>
        <View style={styles.header}/>
          <TouchableOpacity onPress={() => uploadProfileImage()}>
            <Image onPress={() => uploadProfileImage()} style={styles.avatar} source={profileImage} />          
          </TouchableOpacity>
          <View style={styles.bodyContent}>
          
          <CustomTextInput updateValue={() => updateUser({ name: name })} value={name} setValue={setName}/>
          </View>
          <View style={styles.mainBody}>
            <Text style={[styles.name, {textDecorationLine: 'underline'}]}>Pet</Text>
          <CustomTextInput updateValue={() => updateUser({pet: {...user.pet, name: petName}})} value={petName} setValue={setPetName}/>
          <View style={styles.imagesContainer}>
            {images.map((image, index) => {
              return (
                <CustomImagePicker key={index} index={index} photo={image} uploadImage={uploadImage}/>
              )
            })}
          </View>
          </View>
          <View style={{marginTop: 15,  width: '75%', alignSelf: 'center'}}>
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
  imagesContainer: {  flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'},
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
    top: -75
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
  mainBody: {
    margin: 10
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
  blankPhoto: {
    borderColor: '#afafaf', 
    width: 100, 
    height: 100, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    borderRadius: 8, 
    alignItems: 'center',
    justifyContent: 'center'
  }
});
