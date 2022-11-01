import { View,Text } from 'react-native'
import React, {useState} from 'react'
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { Input , Button} from '@rneui/themed';
import { Card } from '@rneui/base';

const Login = (props) =>  {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')

    const auth = getAuth();
    const login = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(`${errorCode}: ${errorMessage}`)
          console.log(error)
        }   
    }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d4365'}}>
      <Card containerStyle={{minWidth: '85%', backgroundColor: '#ffffff65'}}>
        <Card.Title style={{fontSize: 25, color: '#0f0d14'}}>Sign In</Card.Title>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Input
            placeholderTextColor={'#0f0d14'}
            selectionColor={'#0f0d14'}
            underlineColorAndroid={'#0f0d14'}
            placeholder="Email"
            onChangeText={(email) => setEmail(email)}
          />
          <Input
            placeholderTextColor={'#0f0d14'}
            selectionColor={'#0f0d14'}
            underlineColorAndroid={'#0f0d14'}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button 
          color={'#4d4365'}
            containerStyle={{width: 100}}  
            title={'Login'} 
            onPress={() => login()}
          />
          <Text onPress={() => props.navigation.navigate("Register")} style={{marginTop: 10}}>Don't have an account yet? Click here to register</Text>
        </View>
      </Card>
    </View>
  )
}

export default Login;