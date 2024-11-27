import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fontisto from '@expo/vector-icons/Fontisto';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MedicalReacordsScreen(){

    const navigation = useNavigation();
    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <Text style={styles.MedicalRecordsText}>Medical Records</Text>
            </View>
            <View style={styles.BottomView}>
                <TouchableOpacity style={styles.ButtonView} onPress={()=>navigation.navigate("PrescriptionScreen")}>
                    <MaterialCommunityIcons name="pill"  size={hp(6)} color="#2F3D7E" style={styles.ButtonIcon} />
                    <Text style={styles.ButtonText}>Prescriptions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ButtonView} onPress={()=>navigation.navigate("SOAPNotesScreen")}>
                    <Fontisto name="prescription" size={hp(6)} color="#2F3D7E" style={styles.ButtonIcon} />
                    <Text style={styles.ButtonText}>SOAP Notes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ButtonView} onPress={()=>navigation.navigate("MedicalDataScreen")}>
                    <FontAwesome5 name="stethoscope" size={hp(6)} color="#2F3D7E" style={styles.ButtonIcon} />
                    <Text style={styles.ButtonText}>Medical Data</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex:1
    },
    BottomView:{
        paddingTop:hp(4),
        paddingHorizontal:wp(5),
        justifyContent:"space-between",
        flexDirection:"row",
        flexWrap:"wrap",
    },
    TopView:{
      paddingTop: hp(0.5),
      borderBottomWidth:hp(0.06),
      borderBottomColor:"#d4d2cd",
      paddingBottom:hp(1),
      width:wp(100),
      alignItems:"center"
    },
    MedicalRecordsText: {
      fontSize: hp(2.8),
      fontWeight: "bold",
      color: "#41474D",
    },
    ButtonView:{
        flexDirection:"column",
        alignItems:"center",
        paddingVertical:hp(1),
        paddingHorizontal:wp(3),
        borderRadius:hp(1),
        backgroundColor:"#F2F2F2",
        marginBottom:hp(2),
        width:wp(40),
        height: hp(13),
        justifyContent:"space-between",
    },
    ButtonIcon:{
        marginRight:wp(2)
    },
    ButtonText:{
        fontSize:hp(2.5),
        fontWeight:"bold",
        color:"#2F3D7E"
    }
})