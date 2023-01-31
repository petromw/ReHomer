import React from 'react';
import MapView, { Callout, Circle, Marker } from "react-native-maps"
import { StyleSheet, View, Text, Image } from 'react-native';


export default function Map() {


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 39.1329,
          longitude: -84.5150,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}

      >
        <Marker
          coordinate={{
            latitude: 39.1329,
            longitude: -84.5150,
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
                  source={require('../src/assets/sleepinsbed1.jpg')}
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
    flexDirection: 'row',
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
    width: 120,
    height: 80
  }

});