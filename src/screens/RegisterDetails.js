import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';

export default function RegisterDetails(){
return(
    <>
    <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
    <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/Logo.png')}></Image>
        <View style={styles.inputContainer}>
            
        </View>
        
    </View>
    </>
)
}
const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(2),
        alignItems:"center",
    },
    logo:{
        height:hp(10),
        width:wp(60),
    },
    inputContainer:{
       display:"flex"
    }
})