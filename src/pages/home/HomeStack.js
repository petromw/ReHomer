import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage';
import PreferencesPage from './preferences/PreferencesPage';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen name="Home"  options={{ headerShown: false }} >
        {(props) => <HomePage {...props}/>}
      </Stack.Screen>
      <Stack.Screen name="Preferences"  options={{ headerShown: false }} >
        {(props) => <PreferencesPage {...props}/>}
      </Stack.Screen>
  
    </Stack.Navigator>
  );
}