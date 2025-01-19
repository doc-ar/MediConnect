import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function LanguageScreen(){
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Language Settings</Text>
            </View>
            <TouchableOpacity style={styles.button}>
                <View style={styles.buttonstartView}>
                    <Fontisto name="world-o" size={hp(3)} color="#7B7B7C"/>
                    <Text style={styles.buttonText}>English</Text>
                </View>
                <AntDesign name="checkcircle" size={hp(3)} color="#2F3D7E"/>
            </TouchableOpacity>
            <Text style={styles.LanguageInfoText}>
                Default language is English. Additional languages will be available soon.
            </Text>
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
      button:{
        width:wp(100),
        height:hp(7),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:wp(4),
        borderBottomWidth:hp(0.06),
        borderBottomColor:"#d4d2cd",
        paddingBottom:hp(1)
      },
      buttonstartView:{
        flexDirection:"row",
        alignItems:"center",
        width:wp(60),
      },
      buttonText:{
        fontSize:hp(2.3),
        fontWeight:"550",
        marginLeft:wp(5)
      },
      LanguageInfoText:{
        fontSize:hp(1.8),
        color:"#A2A29F",
        marginTop:hp(3),
        marginHorizontal:wp(5)
      }
})