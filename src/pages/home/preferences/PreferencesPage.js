import { View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import AdoptorPreferencesPage from './AdoptorPreferencesPage'
import AdopteePreferencesPage from './AdopteePreferencesPage'



export default function PreferencesPage(props) {
  
  const user = useSelector((state) => state.user)

  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    {user.user.type === 'Adoptee' 
     ? 
     (<AdopteePreferencesPage {...props}/>) : 
     (<AdoptorPreferencesPage {...props}/>)
   }
 </View>
  )
}