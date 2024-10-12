import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ContactScreen(){
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Contact</Text>
            </View>
            <View style={styles.NumView}>
                <Text style={styles.purposeText}>Medical Purposes</Text>
                <View style={styles.NumView2}>
                    <Ionicons name="call" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>999-111-570</Text>
                </View>
                <View style={styles.NumView2}>
                    <Ionicons name="call" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>289-410-000</Text>
                </View>
                <View style={styles.NumView2}>
                    <MaterialIcons name="email" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>MCMedicalTeam@gmail.com</Text>
                </View>
            
                <Text style={styles.purposeText}>Application Issues</Text>
                <View style={styles.NumView2}>
                    <Ionicons name="call" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>232-3232-543</Text>
                </View>
                <View style={styles.NumView2}>
                    <Ionicons name="call" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>323-441-334</Text>
                </View>
                <View style={styles.NumView2}>
                    <MaterialIcons name="email" size={hp(2.5)} color="#646466" />
                    <Text style={styles.NumText}>MCTechTeam@gmail.com</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
    NumView:{
    marginHorizontal: wp(5),
    marginVertical:hp(1)
    },
    purposeText:{
        fontSize:hp(2.5),
        fontWeight:"550",
        marginVertical: hp(2)
    },

    NumText:{
        fontSize:hp(2.3),
        marginLeft:wp(2)
    },
    NumView2:{
        flexDirection:"row",
        alignItems:"center",
        marginBottom: hp(1)
    }
    
})