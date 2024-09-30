import MedicationTable from "../components/MedicationTable";
import { StyleSheet,Text,View} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function PrescriptionDetail({route}) {
    const navigation = useNavigation();

    const prescriptionDetails=route.params;
    return (
        <View style={styles.container}>
            <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.PrescriptionText}>Prescription</Text>
            </View>
            <View style={styles.BottomView}>
            <Text style={styles.Text}>Medication:</Text>
            <MedicationTable Medication={prescriptionDetails.prescription.Medication}/>
            <Text style={styles.Text}>Dated: {prescriptionDetails.prescription.Date}</Text>
            <Text style={styles.Text}>Doctor: {prescriptionDetails.prescription.Doctor}</Text>
            </View>
        </View>
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
    Text:{
        fontSize:hp(2),
        fontWeight:"bold",
        marginVertical:hp(0.5)
    },
    BottomView:{
        paddingHorizontal:wp(4),
        justifyContent:"center",
        marginTop: hp(4)

    }
    
})