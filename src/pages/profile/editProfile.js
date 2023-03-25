import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux'
import { collection, getDocs, getFirestore, query, where, runTransaction, doc} from "firebase/firestore";

const EditProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const db = getFirestore();

    useEffect(() => {
        const user = useSelector((state) => state.user);
        getFirestore.firestore()
        .collection(db, 'users')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => {
            setName(documentSnapshot.data().name);
            setEmail(documentSnapshot.data().email);
        });
    }, []);


const handleUpdate = () => {
    const user = useSelector((state) => state.user);
    getFirestore.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .update({
        name: name,
        email: email
    })
    .then(() => {
        alert('Profile updated');
    })
    .catch((error) => {
        console.log(error);
    });
};

return (
    <View style={styles.container}>
        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
        />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Update" onPress={handleUpdate} />
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginVertical: 10,
      paddingHorizontal: 10,
    },
  });

  export default EditProfile;