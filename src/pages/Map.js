import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { StyleSheet, View, Text, Image } from "react-native";
import { getAuth } from "firebase/auth";
import {
  get,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  runTransaction,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

export default function Map() {
  const db = getFirestore();
  const [markers, setMarkers] = useState([]);
  const [allPins, setAllPins] = useState([]);
  const markersArray = [];

  useEffect(() => {
    const load = async () => {
      const users = await getLatLong();
      if (users && users.length > 0) {
        setAllPins(users);
      }
    };
    load();
  }, [db]);

  if (allPins?.length > 0) {
    for (let i = 0; i < allPins?.length; i++) {
      markersArray.push({
        id: i,
        latitude: parseFloat(allPins[i].lat),
        longitude: parseFloat(allPins[i].long),
      });
    }
  }

  useEffect(() => {
    setMarkers(...markersArray);
  }, []);

  const getLatLong = async () => {
    try {
      const pins = [];
      const otherUsers = await getDocs(query(collection(db, "pins")));
      otherUsers.forEach((pin) => {
        pins.push(pin.data());
      });
      return pins;
    } catch (error) {
      return null;
    }
  };

  console.log(markers);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        annotations={markers}
        style={styles.map}
        initialRegion={{
          latitude: 39.1329,
          longitude: -84.515,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(39.1329),
            longitude: parseFloat(-84.515),
          }}
          image={require("../assets/dogpin.png")}
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>Becky</Text>
                <Text style={styles.info}>Name of Pet: Otis</Text>
                <Text style={styles.info}>Type: Dog</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>

        <Marker
          coordinate={{
            latitude: parseFloat(38.1329),
            longitude: parseFloat(-84.515),
          }}
          image={require("../assets/puppypin.png")}
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>Tom</Text>
                <Text style={styles.info}>Name of Pet: Sparky</Text>
                <Text style={styles.info}>Type: Puppy</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>

        <Marker
          coordinate={{
            latitude: parseFloat(39.4525),
            longitude: parseFloat(-84.0125),
          }}
          image={require("../assets/dogpin.png")}
        >
          <Callout tooltip>
            <View>
              <View style={styles.bubble}>
                <Text style={styles.name}>Megan</Text>
                <Text style={styles.info}>Name of Pet: Oliver</Text>
                <Text style={styles.info}>Type: Puppy</Text>
              </View>
              <View style={styles.arrowBorder} />
              <View style={styles.arrow} />
            </View>
          </Callout>
        </Marker>

        {markers && markers.length
          ? markers.map((item) => {
              return (
                <Marker
                  coordinate={{
                    latitude: item.LATITUDE,
                    longitude: item.LONGITUDE,
                  }}
                />
              );
            })
          : null}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  bubble: {
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 165,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  info: {
    fontSize: 13,
    marginBottom: 5,
    textAlign: "center",
  },

  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 50,
    height: 50,
  },
});
