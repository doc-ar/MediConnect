import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {MaterialIcons} from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function HelpScreen(){
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Help & Support</Text>
            </View>
            <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("TermsConditionsScreen")}>
                            <View style={styles.buttonstartView}>
                              <MaterialCommunityIcons name="note-text-outline"  size={hp(4)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Terms and Conditions</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("AppInfoScreen")}>
                            <View style={styles.buttonstartView}>
                              <MaterialIcons name="info" size={hp(3.2)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>App info</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("ContactScreen")}>
                            <View style={styles.buttonstartView}>
                              <Ionicons name="call" size={hp(3.2)} color="#7B7B7C"/>
                              <Text style={styles.buttonText}>Contact Us</Text>
                            </View>
                            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C"/>
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
    SettingsText:{
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
        paddingBottom:hp(1),
        marginBottom:hp(2)
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
    buttons:{
        marginTop:hp(3),
        marginHorizontal:wp(5)
      },
      button:{
        width:wp(90),
        height:hp(6),
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
        width:wp(70),
      },
      buttonText:{
        fontSize:hp(2.3),
        fontWeight:"500",
        color:"#888885",
        marginLeft:wp(5)
      },
})