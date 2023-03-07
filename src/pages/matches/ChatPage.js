import React, {useState, useEffect} from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'

const exampleMessages = [
  { text: "Hey, how's it going?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "Not too bad, just hanging out. How about you?", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "Same here, just chilling at home. Did you do anything fun this weekend?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "Yeah, I went to the beach with some friends. It was really nice.", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "That sounds awesome. I haven't been to the beach in ages. Maybe we should plan a trip sometime?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "Definitely! That would be so much fun.", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "Have you been to any other cool places lately?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "Yeah, I went hiking in the mountains last week. The views were amazing.", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "Wow, that sounds incredible. I love hiking but I haven't been in ages. Where did you go?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "We went to the national park about an hour from here. It's really beautiful this time of year.", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "I'll have to check that out sometime. Maybe we could go together next time?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "That would be great! Let me know when you're free and we can plan something.", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "Definitely. How's next weekend for you?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "Next weekend works for me. Let's do it!", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1' },
  { text: "Awesome, I can't wait. Hey, have you seen that new movie that just came out?", sentBy: 'A787YQ8fggYapINQhvwyYrPxzLp2' },
  { text: "No, I haven't had a chance to see it yet. What's it called?", sentBy: 'IjNP5JqABeRGcG5uOjYiPfsrXNt1'}
]



const styles =  StyleSheet.create({
  container: {
    flex: 1,

  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#909090',
    borderWidth: 1,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  rightArrow: {
    position: "absolute",
    backgroundColor: "#0078fe",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomLeftRadius: 25,
    right: -10
  },
  
  rightArrowOverlap: {
    position: "absolute",
    backgroundColor: "#eeeeee",
    //backgroundColor:"green",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomLeftRadius: 18,
    right: -20
  
  },
  
  /*Arrow head for recevied messages*/
  leftArrow: {
      position: "absolute",
      backgroundColor: "#dedede",
      //backgroundColor:"red",
      width: 20,
      height: 25,
      bottom: 0,
      borderBottomRightRadius: 25,
      left: -10
  },
  
  leftArrowOverlap: {
      position: "absolute",
      backgroundColor: "#eeeeee",
      //backgroundColor:"green",
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomRightRadius: 18,
      left: -20
  
  },
});

const ChatPage = () => {
  const user = useSelector((state) => state.user)

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

 useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  console.log(user.user.userUID)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View style={styles.inner}>
        <ScrollView > 
          {exampleMessages.map((message, index) => {
            const isThisUsersMessage = message.sentBy === user.user.userUID
            if(isThisUsersMessage){return (
              <View style={{
                backgroundColor: "#0078fe",
                padding:10,
                marginLeft: '45%',
                borderRadius: 5,
                marginTop: 5,
                marginRight: "5%",
                maxWidth: '50%',
                alignSelf: 'flex-end',
                borderRadius: 20,
                marginBottom: index === exampleMessages.length -1  ? 15 : 0
              }} key={index}>                
                <Text style={{ fontSize: 16, color: "#fff", }} key={index}>{message.text}</Text>
                <View style={styles.rightArrow}/>
                <View style={styles.rightArrowOverlap}/>
            </View>
            )} else {
              return (<View style={{
                backgroundColor: "#dedede",
                padding:10,
                borderRadius: 5,
                marginTop: 5,
                marginLeft: "5%",
                maxWidth: '50%',
                alignSelf: 'flex-start',
                borderRadius: 20,
                marginBottom: index === exampleMessages.length -1  ? 15 : 0

              }} key={index}>
                  <Text style={{ fontSize: 16, color: "#000",justifyContent:"center" }} key={index}> {message.text}</Text>
                  <View style={styles.leftArrow}/>
                  <View style={styles.leftArrowOverlap}/>                
                </View>
              )
            }
          })}
        </ScrollView>
          <TextInput placeholder="New Message" style={[styles.textInput, {marginBottom: isKeyboardVisible ? 90 : 0}]} />
          
        </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

export default ChatPage;
