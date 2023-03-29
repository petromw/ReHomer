import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState , useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { ThemeProvider, Button, createTheme } from '@rneui/themed';
import store from './src/redux/store'
import { Provider } from 'react-redux'
import Main from './Main';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs()

const theme = createTheme({
  components: {

  },
});

const app = initializeApp(firebaseConfig);

const App  = () =>  {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Main/>
      </ThemeProvider>
    </Provider>
  );
}

export default App
