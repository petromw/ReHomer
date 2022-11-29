import React from 'react'
import { View,Text } from 'react-native'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Input } from '@rneui/base'
import { Checkbox, Text, StyleSheet, View } from 'react-native'
import Slider from '@rneui/base'


export default function UpdateUserProfile() {
    const user = useSelector((state) => state.user)
    const [range,setRange] = useState(0)

    function updateUserProfile() {
        return firebase.updateProfile({ })
    }
}
//Make sure to get any information from saved from onboarding as well
//Slider for capturing distance preference
return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4d436550'}}>
    <Card containerStyle={{minWidth: '85%', backgroundColor: '#ffffff65'}}>
      <Card.Title style={{fontSize: 25, color: '#0f0d14'}}>Edit Profile Mode</Card.Title>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Input
          placeholderTextColor={'#0f0d14'}
          selectionColor={'#0f0d14'}
          placeholder="Zip Code"
          secureTextEntry={true}
          onChangeText={(zip) => setZip(zip)}
        />
        <View style={styles.container}>
            <Text style={{fontSize:25}}>{range}</Text>
        <Slider
        style={{width:200,height:30}}
        onValueChange={(value)=>setRange(value)}
        minimumValue={1}
        maximumValue={100}
        />
        </View>
        <View style={styles.container}>
            <View Style={styles.checkboxContainer}>
            <Text style={styles.label}>Pet Preferences</Text>
                <Checkbox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.Checkbox}
                />
                <Text style={styles.label}>Dog</Text>
                <Checkbox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.Checkbox}
                />
                <Text style={styles.label}>Cat</Text>
                <Checkbox
                    value={isSelected}
                    onValueChange={setSelection}
                    style={styles.Checkbox}
                />
                <Text style={styles.label}>Bird</Text>
            </View>
        </View>

        <Button 
          color={'#4d4365'}
          containerStyle={{width: 100}}  
          title={'Update'} 
          onPress={() => UpdateUserProfile()}
        />
        </View>
      </Card>
    </View>
)