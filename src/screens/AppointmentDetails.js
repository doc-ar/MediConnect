import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRoute } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import MedicationTable from "../components/MedicationTable";

export default function AppointmentDetails() {
    const route = useRoute(); 
    const navigation = useNavigation();

    const { AppointmentDetail } = route.params; 

    console.log(AppointmentDetail); 

    return (
    <View style={styles.container}>
        <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <   Text style={styles.AppointmentText}>Appointment Details</Text>
        </View>
        <View style={styles.BottomView}>
            <View style={styles.DoctorView}>
                <Image source={{ uri: AppointmentDetail.image }} style={styles.doctorImage} />
                <View style={styles.DoctorView2}>
                    <Text style={styles.doctorName}>{AppointmentDetail.doctorName} <Text style={styles.doctorqual}> ({AppointmentDetail.qualification})</Text>
                    </Text>
                    <Text style={styles.Doctordesignation}>{AppointmentDetail.designation}</Text>
                </View>
            </View>
            <View style={[styles.statusView,AppointmentDetail.status === 'completed' ? styles.completedStatus : 
            AppointmentDetail.status === 'cancelled' ? styles.canceledStatus : 
            styles.scheduledStatus]}>
                <Text style={[
                styles.statusText,AppointmentDetail.status === 'completed' ? styles.completedStatusText : 
                AppointmentDetail.status === 'cancelled' ? styles.canceledStatusText : 
                styles.scheduledStatusText
                ]}>
                {AppointmentDetail.status === 'completed' ? 'Completed' : 
                AppointmentDetail.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
                </Text>
            </View>
            <View style={styles.DetailView}>
                <Text style={styles.details}>Date: {AppointmentDetail.date} ({AppointmentDetail.day})</Text>
                <Text style={styles.details}>Time: {AppointmentDetail.startTime} - {AppointmentDetail.endTime}</Text>
                <Text style={styles.details}>Room Number: {AppointmentDetail.doctorRoom}</Text>
                <Text style={styles.details}>Contact: {AppointmentDetail.contact}</Text>
                <Text style={styles.details}>Email: {AppointmentDetail.email}</Text>
            </View>
            {AppointmentDetail.status === 'completed' &&
            <>
            <Text style={styles.details}>Prescription: </Text>
            <View style={styles.MedicationView}>
                <MedicationTable Medication={AppointmentDetail.prescription.Medication}/>
            </View>
            </>
            }
            {(AppointmentDetail.status === 'Scheduled' || AppointmentDetail.status === 'rescheduled') && (
              <View style={styles.BottomButtons}>
                <TouchableOpacity style={styles.RescheduleButton}>
                  <Text style={styles.RescheduleButtonText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.CancelButton}>
                  <Text style={styles.CancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
            
            
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
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
        paddingBottom:hp(1)
        
    },
    backArrow:{
        position:"absolute",
        left: 0
    },
    BottomView:{
        paddingHorizontal:wp(2)
    },
    DoctorView:{
        marginTop: hp(4),
        flexDirection:"row",
    },
    DoctorView2:{
        flexDirection:"column",
        marginLeft:wp(2),
        paddingTop:hp(1)
    },
    doctorImage: {
        width: wp(18),
        height: wp(18),
        borderRadius: 40,
        marginRight: wp(3),
      },
      doctorName: {
        fontSize: hp(2),
        fontWeight: "bold",
      },
      doctorqual: {
        fontSize: hp(2),
        color: "gray",
        fontWeight:"bold"
      },
      Doctordesignation: {
        fontSize: hp(1.8),
        color: "#41474D",
        fontWeight:"bold"
      },
      statusView:{
        paddingHorizontal: wp(0.8),
        paddingVertical: wp(0.5),
        borderRadius: 5,
        width: wp(20),
        alignItems:"center",
        marginTop: hp(2)
      },
      statusText: {
        fontSize: hp(1.5),
        fontWeight:"bold",
      },
      completedStatus: {
        backgroundColor: '#EBEDF3',
      },
      canceledStatus: {
        backgroundColor: '#FAE9E6',    
      },
      scheduledStatus: {
        backgroundColor: '#2F3D7E'  
      },
      completedStatusText: {
        color: '#2F3D7E',
      },
      canceledStatusText: {
        color: '#F37794',
        
      },
      scheduledStatusText: {
        color: 'white',
      },
      DetailView:{
        marginTop:hp(1.5)
      },
      details:{
        fontSize:hp(1.8),
        fontWeight:"bold",
        marginVertical:hp(0.5)
      },
      MedicationView:{
        marginHorizontal: wp(1)
      },
      BottomButtons:{
        marginTop:hp(5),
        justifyContent:"space-between",
        alignSelf:"center",
    },
      RescheduleButton:{
        backgroundColor:"#2F3D7E",
        paddingVertical:hp(1),
        paddingHorizontal:wp(1),
        borderRadius:10,
        marginVertical:hp(1),
        width: wp(25),
        alignItems:"center"
      },
      RescheduleButtonText:{
        color:"white",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      CancelButton:{
        backgroundColor:"red",
        paddingVertical:hp(1),
        paddingHorizontal:wp(1),
        borderRadius:10,
        width: wp(25),
        alignItems:"center"

      },
      CancelButtonText:{
        color:"white",
        fontSize:hp(1.8),
        fontWeight:"bold"
      }
      
});
