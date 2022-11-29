import { Animated, Text, View } from 'react-native'
import React, { Component } from 'react'


const CustomLinearProgress = (props) =>  {

  const styles = (completed) => {
    return {
      outerStyle: { 
        width: '90%', 
        height: 30, 
        backgroundColor: '#4d436585', 
        borderRadius: 50
      },
      fillerStyle:{ 
      height: '100%',
      width: `${completed}%`,
      backgroundColor: '#4d436585',
      borderRadius: 50,
      
    }
    }
  }
 
  return (
    <View
      style={styles().outerStyle}    
    >
       <View style={styles(props.percentage).fillerStyle}/>
    </View>
  )
  
}

export default CustomLinearProgress