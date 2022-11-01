import { View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { completeOnboardingReduxAction } from '../redux/userSlice'
import { Button, Input } from '@rneui/themed';
import { addDoc, collection, doc, getDocs, getFirestore, query, runTransaction, where } from 'firebase/firestore';
import { Card, Switch } from '@rneui/base';
import { Divider } from 'react-native-paper';
import DropdownComponent from '../components/DropDownSelect';



export default function OnBoarding() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [petName, setPetName] = useState('')
  const [petSpecies, setPetSpecies] = useState('')

  const [type, setType] = useState('Adoptor')
  const totalSteps = type === 'Adoptor' ? 1 : 2

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
  console.log(uid)

  const createPet = async () => {
    try {
        const docRef = await addDoc(collection(db, "pet"), {
          name: petName,
          species: petSpecies
        });
        
      await runTransaction(db, async (transaction) => {
        transaction.set(doc(db, "users", uid), { pet: {docRef} });
      });
      
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  const completeOnboarding = async () => {
    if(step === 2) createPet()
    if(step < totalSteps) {
      setStep(step + 1)
    } else {
      try {
        createPet()
        await runTransaction(db, async (transaction) => {
          transaction.update(doc(db, "users", uid), { onboardingComplete: true });
        });
        dispatch(completeOnboardingReduxAction(true))
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.log("Transaction failed: ", e);
      }
    }
    
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d4365', padding: 25}}>
      <Text style={{position: 'absolute', right: 50, top: 50}}>{step + 1} / {totalSteps + 1} </Text>
      {step === 0 &&
        <View>
          <Text style={{fontSize: 20, color: '#0f0d14', textAlign: 'center'}}>We just need a little more information to get you started.</Text>
          <View style={{justifyContent: 'center', marginTop: 25}}>
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
          </View>
        </View>
        }
        {step === 1 && 
          <View style={{display: 'flex', marginVertical: 10,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
             <View style={{display: 'flex', flex: 1, backgroundColor: type === 'Adoptor' ? '#ffffff10' : '#ffffff00', borderRadius: 15}}>
            <Text onPress={() => 
                  {
                    if(type === 'Adoptee'){
                      setType('Adoptor')
                    } else {
                      setType('Adoptee')
                    }
                  }
                }  style={{fontSize: type === 'Adoptor' ? 30 : 20,fontWeight: type === 'Adoptor' ? '600' : 'normal', textAlign: 'center'}}>Looking to adopt</Text>
             </View>
             <View style={{display: 'flex', flex: 1, backgroundColor: type === 'Adoptee' ? '#ffffff10' : '#ffffff00', borderRadius: 15}}>

             <Text onPress={() => 
                  {
                    if(type === 'Adoptee'){
                      setType('Adoptor')
                    } else {
                      setType('Adoptee')
                    }
                  }
                }  style={{fontSize: type === 'Adoptee' ? 30 : 20,fontWeight: type === 'Adoptee' ? '600' : 'normal', textAlign: 'center'}}>Looking to ReHome</Text>
            </View>
          </View>
          }
          {step === 2 && 
             <View style={{justifyContent: 'center', marginTop: 25}}>
             <Input
               value={petName}
               label={`What is your pet's name?`}
               labelStyle={{color:'#0f0d14' }}
               placeholderTextColor={'#0f0d14'}
               selectionColor={'#0f0d14'}
               underlineColorAndroid={'#0f0d14'}
               onChangeText={(name) => setPetName(name)}
             />
             <Text>And what type of animal is your pet?</Text>
            <DropdownComponent value={petSpecies} setValue={(value) => setPetSpecies(value)} 
              data={[
                      { label: 'Cat', value: 'Cat' },
                      { label: 'Dog', value: 'Dog' },
                      { label: 'Bird', value: 'Bird' },]}/>
           </View>
          }
          <Button 
            color={'#4d4365'}
            containerStyle={{width: 100, alignSelf: 'center', marginTop: 20}}  
            title={'Continue'} 
            onPress={() => completeOnboarding()}
          />
        
      
    </View>
  )
}