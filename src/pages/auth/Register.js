import { View } from 'react-native'
import React, {useState} from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword  } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { Input , Button} from '@rneui/themed';
import {useDispatch} from 'react-redux'
import { setUid } from '../../redux/userSlice';


export default function Register(props) {
    const db = getFirestore()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('')
    const dispatch = useDispatch()

    const auth = getAuth();
    const register = async () => {

      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
          try {
            const docRef = await addDoc(collection(db, "users"), {
              name,
              email, 
              userUID: newUser.user.uid,
              onboardingComplete: false,
              type: ''
            });
            dispatch(setUid(docRef.id))
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          } 
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`${errorCode}: ${errorMessage}`)
        setError(`${errorCode}: ${errorMessage}`)
      }
    }
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
       
                <Input
                    placeholder="name"
                    onChangeText={(name) => setName(name)}
                />
                <Input
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                />
                <Input
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button containerStyle={{width: 100}}  title={'Register'} onPress={() => register()}/>
    </View>
  )
}