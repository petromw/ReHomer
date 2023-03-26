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
import { collection, getDocs, getFirestore, query, where, runTransaction, doc, firebase, addDoc} from "firebase/firestore";



const ChatPage = () => {
  const user = useSelector((state) => state.user)
  const chattingWith = useSelector((state) => (state.user.chattingWith))


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [newMessageText, setNewMessageText] = useState('')
  const db = getFirestore()
  const [messages, setMessages] = useState([])
  const [messageGroup, setMessageGroup] = useState({})

  useEffect(() => {
    console.log(messageGroup)
  }, [messageGroup])

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

  const getMessages = async () => {
    const messageArray = []
    try {
    const fetchedMessages = await getDocs(query(
      collection(db, 'messageGroups'), 
        where('newUserTable', 'array-contains', user.user.userUID),       
      )) 
      fetchedMessages.forEach((group) => {
        if(group.data().users.includes(chattingWith.userUID)){
          if(group.id){
            setMessageGroup(group)
          }
          group.data().messages.forEach((mesg) => {
            messageArray.push(mesg)
          })
        } 
      })
      return messageArray
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const createNewMessageGroup = async () => {
    try { 
     
      const messageGroupsRef = await addDoc(collection(db, "messageGroups"), {
        messages: [],
        users: [user.user.userUID, chattingWith.userUID]
      });
      setMessageGroup(messageGroupsRef)
      
      console.log("Transaction create new message group successfully committed!");
    } catch (e) {
      console.error("Transaction create new message failed: ", e);
    } 
  }

  useEffect(() => {
    console.log('Getting Messages')
    const load = async() => {
      const messageArray = await getMessages()
      if(!messageGroup.id && messageArray.length <= 0){
        await createNewMessageGroup()
      }
      const sorted = messageArray.sort((a, b) => a.sentAt - b.sentAt)
      setMessages(sorted ?? [])
    }
    if(user.user.userUID && chattingWith && db){
      load()
    }
  }, [user, chattingWith, db])
  


  const sendMessage = async () => {
    setNewMessageText('')
    try {
      const newMessages =  (messages ?? []).concat([{message: newMessageText, sentBy: user.user.userUID, sentAt: new Date()}])
      
      setMessages(newMessages)
        await runTransaction(db, async (transaction) => {
          transaction.update(doc(db, "messageGroups", messageGroup.id), { messages: newMessages});
        });
        
      
      
      
    } catch (e) {
      console.error("Transaction send message failed: ", e);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View style={styles.inner}>
        <ScrollView > 
          {messages && messages.length > 0 && messages.map((message, index) => {
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
                marginBottom: index === messages.length -1  ? 15 : 0
              }} key={index}>                
                <Text style={{ fontSize: 16, color: "#fff", }} key={index}>{message.message}</Text>
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
                marginBottom: index === messages.length -1  ? 15 : 0

              }} key={index}>
                  <Text style={{ fontSize: 16, color: "#000",justifyContent:"center" }} key={index}> {message.message}</Text>
                  <View style={styles.leftArrow}/>
                  <View style={styles.leftArrowOverlap}/>                
                </View>
              )
            }
          })}
        </ScrollView>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <View style={{display: 'flex', flex: 3}}> 
            <TextInput placeholder="New Message" value={newMessageText} onSubmitEditing={() => sendMessage()}  onChangeText={setNewMessageText}  style={[styles.textInput, {marginBottom: isKeyboardVisible ? 90 : 0}]}/>
          </View>
          <Button onPress={() => sendMessage()} color={'#0078fe'} variant={'contained'} title='Send'/>
        </View>
        </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
};

export default ChatPage;



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
    borderRadius: 5
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