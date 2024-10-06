import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {useState} from 'react';

export default function ForgotPassword(){
  const navigation = useNavigation();

    const [email, setEmail] = useState('');

    return(
      <>
        <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
        <View style={styles.container}>
        <View style={styles.TopView}>
          <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
          <Text style={styles.ForgotPasswordText}>Forgot Password</Text>
        </View>
        <View style={styles.BottomView}>
        <Text style={styles.BottomText}>Enter Your Email. We will send you a mail.</Text>
         <TextInput style={styles.inputfield} placeholder='email@gmail.com'
           value={email}
           onChangeText={(text) => setEmail(text)}
      ></TextInput>
        <TouchableOpacity style={styles.button}><Text style={styles.buttontext}>Send</Text></TouchableOpacity>
        </View>
      </View>
      </>
    );
}
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
  },
  ForgotPasswordText:{
    fontSize:hp(2.8),
    fontWeight:"bold",
    color:"#41474D"
},
TopView:{
    flexDirection:"row",
    marginTop:hp(0.5),
    justifyContent:"center",
    width: wp(100),
    alignItems:"center",
    borderBottomWidth:hp(0.06),
    borderBottomColor:"#d4d2cd",
    paddingBottom:hp(1)
    
},
backArrow:{
    position:"absolute",
    left: 0
},
  inputfield:{
    width: wp(90),
    height: hp(5),
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    borderRadius: 3,
    paddingHorizontal:wp(2),
    borderWidth: wp(0.5),
    borderColor:"#41474D"
    
  },
  BottomView:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    width: wp(100),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    marginTop:hp(5)
  },
  BottomText:{
    fontSize: hp(2.2),
    color:"#2F3D7E",
    textAlign:"center",
    fontWeight:"bold"
  },
  button:{
    width: wp(30),
    height: hp(5),
    marginVertical: hp(2),
    marginHorizontal: wp(25),
    backgroundColor: "#2F3D7E",
    borderRadius: 5,
    paddingVertical: hp(1)
  },
  buttontext:{
    textAlign: "center",
    color: "white",
    fontWeight:"bold"
  },
})