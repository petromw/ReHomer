import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect,useState,useCallback,Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import blankProfile from '../../assets/blankProfile.jpg';
import { getDocs, getDoc, db, doc} from "firebase/firestore";
import {useAsyncEffect} from '@react-hook/async';
import { Slider } from '@rneui/base';


export default function AdoptorProfile() {
  const user = useSelector((state) => state.user.user)
  const profileImage = user?.profileImage ? {uri: user?.profileImage} : blankProfile
  const familyType = user?.adoptorFields.familyType ? {uri: user?.familyType} : adoptorFields.familyType
  const houseType = user?.adoptorFields.houseType ? {uri: user?.houseType} : adoptorFields.houseType
  const [adoptorFields, setAdoptorFields] = useState({houseType: '', familyType: ''})
  const [text, setText] = useState('');
  const auth = getAuth();

  const renderThumb = useCallback(() => <Thumb/>, []);
  const renderRail = useCallback(() => <Rail/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback(value => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);
  const handleValueChange = useCallback((low, high) => {
    setLow(low);
    setHigh(high);
  }, []);

//----
//  useEffect(() => {
//    onAuthStateChanged(auth, async (user) => {
//      if (user) {
//        const snapshot = await getDoc(doc(db, 'users', user.uid))
//        console.log(snapshot.data())
//      }
//    });
//  }, []);
//----

  return (
    <View style={styles.container}>
          <View style={styles.header}>
            {/* <View style={{ marginTop: '15%', alignSelf: 'flex-end', marginRight: '5%'}}>
              <IconButton size={50} mode={'contained'} color={'#000000'} icon={'account'}/>
            </View> */}
            
          </View>
          <Image style={styles.avatar} source={profileImage} />
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{user?.name}</Text>



          </View>

          <View styles={{ marginTop: '20%', marginLeft: '5%'}}>
            <Text style = {styles.floating}>Family Type</Text>
            <TextInput
              style={styles.input}
              value={user?.adoptorFields.familyType}
              onChangeText={(text) => setAdoptorFields({...familyType, familyType: text})}
            />            
            <Text style = {styles.floating}>House Type</Text>
            <TextInput
              style={styles.input}
              value={user?.adoptorFields.houseType}
              onChangeText={(text) => setAdoptorFields({...houseType, houseType: text})}
            />
            
            <Text style = {styles.floating}>Zip Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Zip Code"
              onChangeText={newText => setText(newText)}
              defaultValue={text}

            />
          </View>

          <View style={{marginTop: '95%', width: '75%', alignSelf: 'center'}}>
              <Button mode='contained' onPress={() => auth.signOut()}>
                Sign Out
              </Button>
            </View>

          <Text style = {styles.floating}>Set Max Distance Preference</Text>
          <Slider
            style={styles.slider}
            min={0}
            max={100}
            step={1}
            floatingLabel
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            renderLabel={renderLabel}
            renderNotch={renderNotch}
            onValueChanged={handleValueChange}
          />

          
            
       
      </View>
  )
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: '#4d4365',
    height:200,
  },
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
  titleContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'left',
    alignItems: 'left',
    backgroundColor: '#4d4365',
  },
  floating: {
    padding: 5,
    fontSize: 20,
    paddingBottom: 0,
  },
  input:{
    borderColor: "gray",
    width: "75%",
    fontSize: 20,
    height: 80,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 20,
  },
  name:{
    fontSize:500,
    color:"#000000",
    fontWeight:'600',
  },
  bodyContent: {
    marginTop:40,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600",
  },
  info:{
    fontSize:16,
    color: '#4d4365',
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  houseType:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  familyType:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#4d436550",
  },
});
