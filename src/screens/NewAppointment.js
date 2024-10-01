import { StyleSheet, Text, View} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";

export default function NewAppointment(){
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
          <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.AppointmentText}>New Appointment</Text>
        </View>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex: 1,   
        paddingVertical:hp(1),
    },
    AppointmentText:{
        fontSize:hp(2.8),
        fontWeight:"bold",
        color:"#41474D",
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
    }
})