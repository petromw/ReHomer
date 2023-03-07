import { createStackNavigator } from '@react-navigation/stack';
import MatchSection from './MatchSection';
import ChatPage from './ChatPage'

const Stack = createStackNavigator();

export default function MatchSectionStack() {
  return (
    <Stack.Navigator>
      
      <Stack.Screen name="MatchesSection"  options={{ headerShown: false }} >
        {(props) => <MatchSection {...props}/>}
      </Stack.Screen>
      <Stack.Screen name="ChatPage"  options={{ headerShown: true , headerTitle: '', headerBackTitleVisible: false}} >
        {(props) => <ChatPage {...props}/>}
      </Stack.Screen>
  
    </Stack.Navigator>
  );
}