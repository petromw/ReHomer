import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import AdoptorPreferencesPage from './AdoptorPreferencesPage'
import AdopteePreferencesPage from './AdopteePreferencesPage'


export const styles = StyleSheet.create({
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 24
  },
  section: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#cdcdcd'
  }
})

export default function PreferencesPage(props) {
  
  const user = useSelector((state) => state.user)

  
  return (
    <>
      {user.user.type === 'Adoptee' 
        ? 
        (<AdopteePreferencesPage {...props}/>) : 
        (<AdoptorPreferencesPage {...props}/>)
      }
    </>
  )
}