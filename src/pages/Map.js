import MapView, { Callout, Circle, Marker } from "react-native-maps"
import { StyleSheet, View, Text, Image } from 'react-native';
import { getAuth} from "firebase/auth";
import { get, collection, getDocs, getFirestore, query, where, runTransaction, doc} from "firebase/firestore";
import React, {useEffect, useState} from 'react'


export default function Map() {
  const db = getFirestore()
  var myloop = [];
  const [allPins, setAllPins] = useState([])


  const getLatLong = async () => {
    try {
      const pins = []
      const otherUsers = await getDocs(query(collection(db, 'pins')))
      otherUsers.forEach((pin) => {
        pins.push(pin.data())
      })
      return pins
    } catch (error) {
      return null
    }
  }


  useEffect(() => {
    const load = async() => {
      const users = await getLatLong()
      if(users && users.length > 0){
        setAllPins(users)
      }
    }
    load()
  }, [db])

  if (allPins?.length > 0 ){
    console.log(allPins[0].lat)
    console.log(allPins[0].long)


    for (let i = 0; i < allPins?.length; i++) {
      myloop.push(

      );
    }
  }






  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.1329,
          longitude: -84.5150,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        
        
          <Marker
          coordinate={{
            latitude: parseFloat(39.1329),
            longitude: parseFloat(-84.5150),
          }}
          title="test title"
          description="test desc"
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>Adoptee</Text>
                <Text>Name of Pet: Otis</Text>
                <Image
                  style={styles.image}
                  image={require('../assets/sleepinsbed1.jpg')}
                />
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>





      </MapView>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5
  },
  image: {
    width: 50,
    height: 50
  }

});