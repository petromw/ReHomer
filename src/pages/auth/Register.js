import { View,Text } from 'react-native'
import React, {useState} from 'react'
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 
import { Input , Button} from '@rneui/themed';
import {useDispatch} from 'react-redux'
import { setUid } from '../../redux/userSlice';
import { Card } from '@rneui/base';


export default function Register(props) {
    const db = getFirestore()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const navigation = props.navigation

    const auth = getAuth();
    const register = async () => {

      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
          try {
            const docRef = await addDoc(collection(db, "newUserTable"), {
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d436550'}}>
      <Card containerStyle={{minWidth: '85%', backgroundColor: '#ffffff65'}}>
        <Card.Title style={{fontSize: 25, color: '#0f0d14'}}>Welcome to ReHomer!</Card.Title>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Input
            placeholderTextColor={'#0f0d14'}
            selectionColor={'#0f0d14'}
            // underlineColorAndroid={'#0f0d14'}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
          />
          <Input
            placeholderTextColor={'#0f0d14'}
            selectionColor={'#0f0d14'}
            // underlineColorAndroid={'#0f0d14'}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button 
          color={'#4d4365'}
            containerStyle={{width: 100}}  
            title={'Register'} 
            onPress={() => register()}
          />
          <Text onPress={() => navigation.navigate("Login")} style={{marginTop: 10}}>Already have an account? Click here to sign-in</Text>
        </View>
      </Card>
    </View>
  )
}