import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const CustomRadioButton = (props) =>  {

  const styles = {
    containerStyle: { 
      margin: 5,
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
      borderRadius: 5,
      borderColor: '#4d436545',
      borderWidth: props.checked ? 2 : 1,
      backgroundColor: props.checked ? '#4d436515' : '#00000000'
    },
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.containerStyle}>
        <Text style={{fontSize: 25, fontWeight: props.checked && 'bold'}} >{props.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomRadioButton