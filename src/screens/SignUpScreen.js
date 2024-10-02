import {StyleSheet, Text, View,Image, TouchableOpacity,TextInput} from "react-native";
import { StatusBar } from 'expo-status-bar';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useState } from "react";
import LoginScreen from "./LoginScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen(){

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [num, setNumber] = useState('');
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [accCreated, setaccCreated] = useState(false);
    const [regFailed, setregFailed] = useState(false);

  async function SignUpWithEmail() {
     
    }

    const HandleSignUp = () => {
      if (email !== '' && password !== '' && num !=='' && username!== '') {
       SignUpWithEmail();
      } else {
        setFieldsEmpty(true)
      }
    
    }

    return(
        <>
    <StatusBar barStyle="dark-content" backgroundColor="white" />
    
    <View style={styles.container}></View>
   
    </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent:"center"
    },
    
    
});