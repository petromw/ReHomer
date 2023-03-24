import { View, StyleSheet, Text, Image, Linking, TouchableHighlight } from 'react-native'
import doggos from '../../assets/doggos.jpg'

export default function Report() {


    return (
        <View style={styles.container}>
              <View style={styles.header}> 
              <Image style={styles.avatar} source={doggos} />          
              </View>
              <View style={styles.bodyContent}>
                <Text style={styles.paragraph}>Animal abuse refers to any harmful or cruel treatment of animals by humans. This can take many forms, including neglect, physical violence, emotional abuse, and killing. Unfortunately, animal abuse is a widespread problem that occurs all over the world, often in the form of domestic violence, factory farming, animal testing, and illegal wildlife trade.{'\n\n'}
                If you suspect or witness animal abuse, <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('https://www.usacops.com/')}>contact</Text> your local animal control agency, shelter or law enforcement authorities immediately.{'\n\n'}
                You may also contact the <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL('https://www.humanesociety.org/contact-us')}>Humane Society of the United States</Text>
                </Text>                
              </View>
    

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
        bodyContent: {
          marginTop:75,
          alignItems: 'center',
          fontStyle: 'bold',
          fontSize:20
        },
        paragraph: {
            marginLeft:40,
            marginRight:40,
            fontSize:28,
            justifyContent: 'center'
        }
    });