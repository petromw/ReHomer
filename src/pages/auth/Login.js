import { View, Text,TextInput, Button } from 'react-native'
import React, {useState} from 'react'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";



const Login = (props) =>  {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const auth = getAuth();
    const register = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password)
          props.login()
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(`${errorCode}: ${errorMessage}`)
          console.log(error)
        }   
    }

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
       
               
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Button title={'Login'} onPress={() => register()}/>
    </View>
  )
}

export default Login;