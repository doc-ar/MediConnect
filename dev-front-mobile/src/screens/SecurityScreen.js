import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

export default function SecurityScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.PrescriptionText}>Security</Text>
            </View>
            <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("ChangePassword")}>
                    <View style={styles.buttonstartView}>
                      <Entypo name="lock" size={hp(3.3)} color="#7B7B7C"/>
                      <Text style={styles.buttonText}>Change Password</Text>
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
    PrescriptionText:{
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
    buttons:{
        marginTop:hp(3),
        marginHorizontal:wp(2)
      },
      button:{
        width:wp(96),
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
        width:wp(68),
      },
      buttonText:{
        fontSize:hp(2.3),
        fontWeight:"550",
        color:"#888885",
        marginLeft:wp(5)
      }
    
})