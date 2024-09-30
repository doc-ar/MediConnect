import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen(){
    const [UserName,setUserName] = useState("Sarah");

    return(
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.container}>
                <View style={{flexDirection:"row", justifyContent:"space-between", width:wp(98)}}>
                <Text style={styles.WelcomeText}>Welcome Back, {UserName}</Text>
                <Ionicons style={styles.NotificationIcon} name="notifications-outline" size={hp(3)} color="black" />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems:"center",
      paddingVertical:hp(1),
      paddingHorizontal:wp(1),
      
    },
    WelcomeText:{
        fontSize:hp(3),
        fontWeight:"700",
        color:"black",
        left:0,
        position:"absolute"
    },
    NotificationIcon:{
        right:0,
        position:"absolute",
        paddingTop:hp(0.5)
    }
  });