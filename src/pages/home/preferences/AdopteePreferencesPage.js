import { View , Text} from 'react-native'
import React from 'react'
import { styles } from './PreferencesPage'
import { SafeAreaView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import DropdownComponent from '../../../components/DropDownSelect'
import { useState } from 'react'
import { useEffect } from 'react'
import { setUser } from '../../../redux/userSlice'
import {  doc, runTransaction, getFirestore } from 'firebase/firestore';
import { familyTypeArray, houseTypeArray } from '../../../utils'
import { Slider } from '@rneui/base'


export default function AdopteePreferencesPage() {
  const user = useSelector((state) => state.user.user)
  const uid = useSelector((state) => state.user.uid)
  const dispatch = useDispatch()
  const db = getFirestore()

  const [selectedFamilyType, setSelectedFamilyType] = useState()
  const [selectedHouseType, setSelectedHouseType] = useState()
  const [distance, setDistance] = useState(0)
  const [distanceUnits, setDistanceUnits] = useState('Miles')





  useEffect(() => {
    if(user && user.preferences){
     
      setSelectedFamilyType(user.preferences.familyType)
      setSelectedHouseType(user.preferences.houseType)
      setDistance(user.preferences.distance)
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
    updateUser({familyType: selectedFamilyType})
  }, [selectedFamilyType])

  useEffect(() => {
    updateUser({houseType: selectedHouseType})
  }, [selectedHouseType])


  return (
    <SafeAreaView style={{flex: 1, margin: 25}}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Family Type</Text>
        <DropdownComponent data={familyTypeArray.map((familyType) => {return {label: familyType, value: familyType}})} value={selectedFamilyType} setValue={setSelectedFamilyType}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>House Type</Text>
        <DropdownComponent data={houseTypeArray.map((houseType) => {return {label: houseType, value: houseType}})} value={selectedHouseType} setValue={setSelectedHouseType}/>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Distance</Text>
        <Slider minimumValue={1} maximumValue={100} value={distance} onSlidingComplete={(value) => updateUser({distance: value.toFixed(1)})}/>
        <Text>{`${distance ?? 0} ${distanceUnits}`}</Text>
      </View>
    </SafeAreaView>
  )
}