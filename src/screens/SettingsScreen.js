import { StyleSheet,Text,View,Image, TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function SettingsScreen() {

    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
                <View style={styles.TopView}>
                    <Text style={styles.SettingsText}>Settings</Text>
                </View>
                <View style={styles.BottomView}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: "https://img.freepik.com/premium-photo/portrait-lovely-pretty-positive-woman-toothy-beaming-smile-blue-background_525549-5283.jpg?w=360" }} style={styles.PatientImage} />
                        <MaterialCommunityIcons name="pencil-circle" size={hp(5)} color="#2F3D7E" style={styles.pencilicon}/>
                    </View>
                    <Text style={styles.PatientName}>Sarah</Text>
                    <Text style={styles.PatientEmail}>sarah.chris@gmail.com</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("EditProfile")}>
                            <View style={styles.buttonstartView}>
                              <MaterialCommunityIcons name="account" size={hp(4)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Edit Profile</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("NotificationSettings")}>
                            <View style={styles.buttonstartView}>
                              <Ionicons name="notifications" size={hp(3.3)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Notifications</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("HelpScreen")}>
                            <View style={styles.buttonstartView}>
                              <Entypo name="help-with-circle" size={hp(3.3)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Help & Support</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("LanguageScreen")}>
                            <View style={styles.buttonstartView}>
                              <Fontisto name="world-o" size={hp(3.3)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Language</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.LogOutbutton}>
                              <Text style={styles.LogOutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
        </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
    },
    TopView:{
        paddingTop: hp(0.5),
        borderBottomWidth:hp(0.06),
        borderBottomColor:"#d4d2cd",
        paddingBottom:hp(1),
        width:wp(100),
        alignItems:"center"
      },
      SettingsText: {
        fontSize: hp(2.8),
        fontWeight: "bold",
        color: "#41474D",
      },
      BottomView:{
        marginTop:hp(3),
        alignItems:"center",
        flex:1
      },
      imageContainer: {
        position: 'relative',
        width: wp(28),
        height: wp(28),
      },
      PatientImage: {
        width: '100%',
        height: '100%',
        borderRadius: wp(15),
        borderWidth: wp(2),
        borderColor: "#EBEDF3",
      },
      pencilicon: {
        position: "absolute",
        bottom: -hp(1),
        right: -wp(2),
      },
      PatientName: {
        fontSize: hp(2.7),
        fontWeight: "700",
        color: "#2F3D7E",
        marginTop: hp(1),
      },
      PatientEmail: {
        fontSize: hp(1.8),
        color: "#A2A29F",
        marginTop: hp(0.3),
      },
    buttons:{
      marginTop:hp(6),
      marginHorizontal:wp(5)
    },
    button:{
      width:wp(90),
      height:hp(7),
      backgroundColor:"#EBEDF3",
      borderRadius:hp(1.5),
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingHorizontal:wp(4),
      marginBottom:hp(2)
    },
    buttonstartView:{
      flexDirection:"row",
      alignItems:"center",
      width:wp(60),
    },
    buttonText:{
      fontSize:hp(2.3),
      fontWeight:"550",
      color:"#888885",
      marginLeft:wp(5)
    },
    LogOutbutton:{
      position:"absolute",
      bottom:hp(2),
    },
    LogOutText:{
      color:"red",
      fontSize:hp(2.3)
    }
})