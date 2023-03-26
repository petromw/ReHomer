import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
import {  IconButton } from 'react-native-paper';


  const DropdownComponent = ({data,  value, setValue, canBeEditable}) => {
    const [isFocus, setIsFocus] = useState(false);
    const [editable, setEditable] = useState(false)
    return (
      <View style={styles.container}>

        {canBeEditable && !editable ? 
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.name}>{value}</Text>
            <IconButton onPress={() => setEditable(!editable)}  size={20}  color={'#000000'} icon={'pencil'}/>
          </View> 
        : 
          <View style={{width: '85%'}}>
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select item' : '...'}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setValue(item.value);
                setIsFocus(false);
              }}
            />
          </View>
        }
        
        {canBeEditable && editable ?  <IconButton onPress={() => setEditable(!editable)}  size={20}  color={'#000000'} icon={'pencil'}/> : <></>}
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      display: 'flex',
      flexDirection: 'row'
    },
    dropdown: {
      height: 50,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });