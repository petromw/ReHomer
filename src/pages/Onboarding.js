import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { completeOnboardingReduxAction } from '../redux/userSlice'
import { Button, Input } from '@rneui/themed';
import { collection, doc, getDocs, getFirestore, query, runTransaction, where } from 'firebase/firestore';
import { Card, Switch } from '@rneui/base';



export default function OnBoarding() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  const [name, setName] = useState('')
  const [type, setType] = useState('Adoptor')
  const dispatch = useDispatch()
  
  const db = getFirestore()
  
  const updateUser = async (type) => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { type: type });
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  useEffect(() => {
    updateUser(type)
  }, [type])
  
  const updateUserName = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { name: name });
      });
      
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  const completeOnboarding = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { onboardingComplete: true });
      });
      dispatch(completeOnboardingReduxAction(true))
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d4365'}}>
      <Card containerStyle={{minWidth: '85%', backgroundColor: '#ffffff65'}}>
        <Card.Title style={{fontSize: 20, color: '#0f0d14'}}>We just need a little more information to get you started.</Card.Title>
        <View style={{justifyContent: 'center'}}>
          <Input
            value={name}
            label='What is your name?'
            labelStyle={{color:'#0f0d14' }}
            placeholderTextColor={'#0f0d14'}
            selectionColor={'#0f0d14'}
            underlineColorAndroid={'#0f0d14'}
            onChangeText={(name) => setName(name)}
            onBlur={() => updateUserName()}
          />
          <View style={{display: 'flex', marginVertical: 10,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20}}>Looking to adopt</Text>
            <Switch 
              onValueChange={() => 
                {
                  if(type === 'Adoptee'){
                    setType('Adoptor')
                  } else {
                    setType('Adoptee')
                  }
                }
              } 
              value={type === 'Adoptor'}/>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20 }}>Looking to ReHome</Text>
            <Switch 
              onValueChange={() => 
                {
                  if(type === 'Adoptee'){
                    setType('Adoptor')
                  } else {
                    setType('Adoptee')
                  }
                }
              } 
              value={type === 'Adoptee'}/>
          </View>
          <Button 
            color={'#4d4365'}
            containerStyle={{width: 100, alignSelf: 'center', marginTop: 20}}  
            title={'Continue'} 
            onPress={() => completeOnboarding()}
          />
        </View>
      </Card>
    </View>
  )
}