import { View, Text,Image } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux'
import { completeOnboardingReduxAction, setUser } from '../redux/userSlice'
import { Button, Input } from '@rneui/themed';
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, runTransaction, where } from 'firebase/firestore';
import { Card, Switch } from '@rneui/base';
import { Divider, RadioButton } from 'react-native-paper';
import DropdownComponent from '../components/DropDownSelect';
import CustomRadioButton from '../components/CustomRadioButton';
import { LinearProgress } from '@rneui/themed/dist/LinearProgress';
import CustomLinearProgress from '../components/CustomLinearProgress';
import * as ImagePicker from 'expo-image-picker';



export default function OnBoarding() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [petName, setPetName] = useState('')
  const [petSpecies, setPetSpecies] = useState('')
  const [adoptorFields, setAdoptorFields] = useState({houseType: '', familyType: ''})

  const [type, setType] = useState('Adoptor')
  // const totalSteps = type === 'Adoptor' ? 3 : 2
  const totalSteps =  3

  const auth = getAuth();
  const dispatch = useDispatch()
  
  const db = getFirestore()
  
  const updateUser = async (type) => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { type: type});
      });
      dispatch(setUser({...user, type: type}))
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  }
  
  const updateUserName = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { name: name });
      });
      dispatch(setUser( { ...user, name: name }))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  }
  

  const createPet = async () => {
    try {
      
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { pet: {name: petName, species: petSpecies} });
      });
      dispatch(setUser({...user,   pet: {
        name: petName, species: petSpecies
      } }))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  }

  const completeOnboarding = async () => {
    if(step === 2 && type === 'Adoptee'){
      createPet()
    }
    if(step < totalSteps) {
      setStep(step + 1)
    } else {
      try {
        if(type !== 'Adoptee'){
          updateUser(type)
          await runTransaction(db, async (transaction) => {
            transaction.update(doc(db, "users", uid), { adoptorFields: adoptorFields});
          });
        }
        await runTransaction(db, async (transaction) => {
          transaction.update(doc(db, "users", uid), { onboardingComplete: true });
        });
        dispatch(completeOnboardingReduxAction(true))
        console.log("Transaction successfully committed!");
      } catch (e) {
        console.error("Transaction failed: ", e);
      }
    }
    
  }

  const [image, setImage] = useState(null);

  const uploadImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImage(result.uri)
    try {
      const petImages = (user?.pet?.images && user?.pet?.images?.length) > 0 ? [].concat(user.pet.images).concat(result.uri) : [result.uri]
      console.log(petImages)
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), { pet: {...user.pet, images: petImages, profileImage: petImages[0]} });
      });

      dispatch(setUser({...user, pet: {...user.pet, images: petImages}} ))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction uploadImage failed: ", e);
    }
   


  };


  useEffect(() => {
    console.log('with', {...user, pet: {...user.pet, images: [user?.pet?.images]}  })

    console.log(user)
  }, [user])
  
  

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d436550', padding: 25, paddingTop: 100}}>
      <CustomLinearProgress percentage={(step / totalSteps) * 85}/>
      {
        step > 1 &&
        <View>
          <Text style={{fontSize: 18}}>
            {type}
          </Text>
        </View>
      }
      <View style={{flex: 1, justifyContent: 'space-around', alignItems: 'center',}}>
        {step === 0 &&
          <View>
            <Text style={{fontSize: 45, color: '#0f0d14'}}>What is your name?</Text>
            <View style={{justifyContent: 'center', marginTop: 25}}>
              <Input
                value={name}
                label='This is how your name will display to other users'
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
            <View>
              <Text style={{fontSize: 35, color: '#0f0d14', marginBottom: 25}}>Are you looking to adopt a pet (adoptor) or to rehome your pet (adoptee)</Text>
              <CustomRadioButton onPress={() => {
                updateUser('Adoptor')
                setType('Adoptor')}} title={'Adoptor'} checked={type === 'Adoptor'}/>
              <CustomRadioButton onPress={() => {updateUser('Adoptee')
              setType('Adoptee')}} title={'Adoptee'} checked={type === 'Adoptee'}/>
            </View>
            }
            {
              type === 'Adoptee' &&
              <>
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
                  <CustomRadioButton onPress={() => setPetSpecies('Cat')} title={'Cat'} checked={petSpecies === 'Cat'}/>
                  <CustomRadioButton onPress={() => setPetSpecies('Dog')} title={'Dog'} checked={petSpecies === 'Dog'}/>
                  <CustomRadioButton onPress={() => setPetSpecies('Bird')} title={'Bird'} checked={petSpecies === 'Bird'}/>
  
                </View>
                }
                 {step === 3 && 
                  <View style={{justifyContent: 'center', marginTop: 25}}>
                    <Text>Please upload an image of your pet?</Text>
                    <Button 
                      color={'#4d436550'}
                      containerStyle={{width: 100, alignSelf: 'center', marginTop: 20 , marginRight: 20}}  
                      title={'Select Image'} 
                      onPress={uploadImage}
                    />
                    <View style={{marginTop: 15}}>
                     {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                     </View>
                  </View>
                }
              
              </>
            }
             {
              type === 'Adoptor' &&
              <>
              {step === 2 && 
              <View style={{justifyContent: 'center', marginTop: 25}}>
                <Text>What kind of house do you live in?</Text>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, houseType: 'House with a big yard and fence'})} title={'House with a big yard and fence'} checked={adoptorFields.houseType === 'House with a big yard and fence'}/>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, houseType:'House with a big yard and no fence'})} title={'House with a big yard and no fence'} checked={adoptorFields.houseType === 'House with a big yard and no fence'}/>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, houseType:'House with a small yard or no yard'})} title={'House with a small yard or no yard'} checked={adoptorFields.houseType === 'House with a small yard or no yard'}/>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, houseType: 'Apartment'})} title={'Apartment'} checked={adoptorFields.houseType === 'Apartment'}/>
  
                </View>
                }
                {step === 3 && 
              <View style={{justifyContent: 'center', marginTop: 25}}>
                <Text>What people will live with the pet?</Text>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, familyType: 'Only adults'})} title={'Only adults'} checked={adoptorFields.familyType === 'Only adults'}/>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, familyType: 'Adults and older children'})} title={'Adults and older children'} checked={adoptorFields.familyType === 'Adults and older children'}/>
                  <CustomRadioButton onPress={() => setAdoptorFields({...adoptorFields, familyType: 'Some small children'})} title={'Some small children'} checked={adoptorFields.familyType === 'Some small children'}/>
                </View>
                }
              </>
            }
            <View style={{display: 'flex', flexDirection: 'row'}}>
            {(step > 0 )&&  <Button 
              color={'#4d436550'}
              containerStyle={{width: 100, alignSelf: 'center', marginTop: 20 , marginRight: 20}}  
              title={'Back'} 
              onPress={() => setStep(step -1)}
            />}
           
            <Button 
              color={'#4d4365'}
              containerStyle={{width: 100, alignSelf: 'center', marginTop: 20}}  
              title={'Continue'} 
              onPress={() => completeOnboarding()}
            /></View>
          
        
      </View>
    </View>
  )
}