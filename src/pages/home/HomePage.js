import { View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import AdopteeHomePage from './AdopteeHomePage';
import AdoptorHomePage from './AdoptorHomePage';



export default function HomePage(props) {
  
  const user = useSelector((state) => state.user)
  
  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       {user.user.type === 'Adoptee' 
        ? 
        (<AdopteeHomePage {...props}/>) : 
        (<AdoptorHomePage {...props}/>)
      }
    </View>
    
  )
}