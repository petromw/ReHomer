import { View, Text,TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword  } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore"; 

export default function Register(props) {
    const db = getFirestore()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('')

    const auth = getAuth();
    const register = async () => {

      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        console.log(Object.keys(newUser), newUser.user.uid)
          try {
            const docRef = await addDoc(collection(db, "users"), {
              name,
              email, 
              userUID: newUser.user.uid
            });
            props.login()

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
       
                <TextInput
                    placeholder="name"
                    onChangeText={(name) => setName(name)}
                />
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button title={'Register'} onPress={() => register()}/>
    </View>
  )
}