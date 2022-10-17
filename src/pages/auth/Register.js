import { View, Text,TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword  } from "firebase/auth";



export default function Register(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('')

    const auth = getAuth();
    const register = async () => {

      try {
        const newUser = await createUserWithEmailAndPassword(auth, email, password)
        try {
          await updateProfile(auth.currentUser, {
            displayName: name
          })
          signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(`${errorCode}: ${errorMessage}`)
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
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