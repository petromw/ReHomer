import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {  IconButton } from 'react-native-paper';
import { Input } from '@rneui/themed';


  const CustomTextInput = ({value, setValue, updateValue}) => {
    const [editable, setEditable] = useState(false)
    const blur = () => {
      updateValue()
      setEditable(!editable)

    }
    if(editable) {
      return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginHorizontal: 15}}>
           <Input
           
                 value={value}
                 defaultValue={value}
                 labelStyle={{color:'#0f0d14' }}
                 placeholderTextColor={'#0f0d14'}
                 selectionColor={'#0f0d14'}
                 underlineColorAndroid={'#0f0d14'}
                 onChangeText={(value) => setValue(value)}
                 onBlur={() => blur()}
               />
               <IconButton onPress={() => blur()}  size={25} color={'#000000'} icon={'content-save'}/>
    </View>
        
    )} else {
      return (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Text style={styles.name}>{value}</Text>
        <IconButton onPress={() => setEditable(!editable)}  size={20}  color={'#000000'} icon={'pencil'}/>
      </View>
    )
    }
  };

  export default CustomTextInput;


  const styles = StyleSheet.create({
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
      alignSelf:'center',
      position: 'absolute',
      marginTop:130
    },
    name:{
      fontSize:28,
      color: "#696969",
      fontWeight: "600"
    },
  });
  