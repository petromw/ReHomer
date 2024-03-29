import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {  IconButton } from 'react-native-paper';


  const CustomImagePicker = ({uploadImage, photo, index}) => {
    const existing = !!photo.uri
    return (
      <View>
        <TouchableOpacity onPress={() => uploadImage(index, existing)} style={styles.blankPhoto}>
          {existing 
            ? 
            <Image style={styles.avatar} source={photo} />
            :
            <IconButton iconColor='#afafaf' size={45} icon={'plus'}/>
          }
          
        </TouchableOpacity>
      </View>
    )
  };

  export default CustomImagePicker;


  const styles = StyleSheet.create({
    avatar: {
      borderColor: '#afafaf', 
      width: 100, 
      height: 100, 
      borderStyle: 'dashed', 
      borderWidth: 2, 
      borderRadius: 8, 
      alignItems: 'center',
      justifyContent: 'center',
      margin: 3
    },
    blankPhoto: {
      borderColor: '#afafaf', 
      width: 100, 
      height: 100, 
      borderStyle: 'dashed', 
      borderWidth: 2, 
      borderRadius: 8, 
      alignItems: 'center',
      justifyContent: 'center',
      margin: 3
    }
  });
  