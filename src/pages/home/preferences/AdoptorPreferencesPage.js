import { View , Text, SafeAreaView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './PreferencesPage'
import { useDispatch, useSelector } from 'react-redux'
import DropdownComponent from '../../../components/DropDownSelect'
import { petTypeArray , petSizeArray,petAgeArray} from '../../../utils'
import { setUser } from '../../../redux/userSlice'
import {  doc, runTransaction, getFirestore } from 'firebase/firestore';
import { Slider } from '@rneui/base'


export default function AdoptorPreferencesPage() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  const dispatch = useDispatch()
  const db = getFirestore()

  const [selectedPetType, setSelectedPetType] = useState()
  const [selectedPetSize, setSelectedPetSize] = useState()
  const [selectedPetAge, setSelectedPetAge] = useState()
  const [distance, setDistance] = useState(0)
  const [distanceUnits, setDistanceUnits] = useState('Miles')



  useEffect(() => {
    if(user && user.preferences){
      user.preferences.petType && setSelectedPetType(user.preferences.petType)
      user.preferences.petSize && setSelectedPetSize(user.preferences.petSize)
      user.preferences.petAge && setSelectedPetAge(user.preferences.petAge)
      user.preferences.distance && setDistance(user.preferences.distance)
    } 
  }, [user])

  const updateUser = async (dto) => {
    try {
      
      await runTransaction(db, async (transaction) => {
        transaction.update(doc(db, "users", uid), {preferences: {...user.preferences, ...dto} });
      });
      dispatch(setUser( {...user, preferences: {...user.preferences, ...dto} }))

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.error("Transaction failed: ", e);
    }
  }


  useEffect(() => {
    updateUser({petType: selectedPetType})
  }, [selectedPetType])

  
  useEffect(() => {
    updateUser({petSize: selectedPetSize})
  }, [selectedPetSize])

   
  useEffect(() => {
    updateUser({petAge: selectedPetAge})
  }, [selectedPetAge])



  return (
    <SafeAreaView style={{flex: 1, margin: 25}}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Pet Type</Text>
        <DropdownComponent data={petTypeArray.map((petType) => {return {label: petType, value: petType}})} value={selectedPetType} setValue={setSelectedPetType}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Size</Text>
        <DropdownComponent data={petSizeArray.map((petSize) => {return {label: petSize, value: petSize}})} value={selectedPetSize} setValue={setSelectedPetSize}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Age</Text>
        <DropdownComponent data={petAgeArray.map((petAge) => {return {label: petAge, value: petAge}})} value={selectedPetAge} setValue={setSelectedPetAge}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Distance</Text>
        <Slider minimumValue={1} maximumValue={100} value={distance} onSlidingComplete={(value) => updateUser({distance: value.toFixed(1)})}/>
        <Text>{`${distance} ${distanceUnits}`}</Text>
      </View>
    </SafeAreaView>
  )
}