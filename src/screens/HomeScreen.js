import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {MaterialIcons} from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen({navigation}) {

    const [Info, setInfo] = useState({
        BloodType: "O+",
        Weight: "70 kg",
        Height: "170 cm",
        Allergies: "None",
        BloodGlucose: "120 mg/dL",
        BloodPressure: "120/80 mmHg",
        Age:"25"
    });
    const [LatestAppointmentData, setLatestAppointmentData] = useState({appointmentId: "006",
        doctorName: "Dr. David Lee",
        designation: "Orthopedic Surgeon",
        qualification: "MD, FAAOS",
        date: "20",
        month:"Sept 2024",
        day: "Tue",
        startTime: "4:00 PM",
        endTime: "5:00 PM",
        status: "Scheduled",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJ43pA5ohSHvxkSP_0VAxPy8GZAUgDydGQ8kyYZewhxXpYtRoL8SSHfQtpruehLB29Ls&usqp=CAU"
        
    });


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={styles.TopView}>
                    <Text style={styles.LogoText}>MediConnect</Text>
                    <Ionicons style={styles.NotificationIcon} name="notifications-outline" size={hp(4)} color="black" onPress={()=>navigation.navigate("NotificationScreen")} />
                </View>
                <View style={styles.PatientView}>
                    <Image source={{ uri: "https://img.freepik.com/premium-photo/portrait-lovely-pretty-positive-woman-toothy-beaming-smile-blue-background_525549-5283.jpg?w=360" }} style={styles.PatientImage} />
                    <View style={styles.PatientView2}>
                        <Text style={styles.PatientName}>Sarah Thompson</Text>
                        <Text style={styles.PatientAgeGender}>25, Female</Text>
                    </View>
                </View>

                <View style={styles.BioView}>
                    <Text style={styles.BioDataText}>Medical Data:</Text>
                    <AntDesign name="edit" size={hp(3)} color="#2F3D7E" style={styles.editicon} onPress={()=>navigation.navigate('EditProfile')}/>
                </View>
                <View style={styles.BioView2}>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Type: {Info.BloodType}</Text>
                        <Text style={styles.data}>Weight: {Info.Weight}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Glucose: {Info.BloodGlucose}</Text>
                        <Text style={styles.data}>Height: {Info.Height}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Pressure: {Info.BloodPressure}</Text>
                        <Text style={styles.data}>Age: {Info.Age}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Allergies: {Info.Allergies}</Text>
                    </View>
                </View>

                {Object.keys(LatestAppointmentData).length === 0 &&
                <>
                    <Text style={styles.AppointmentText}>No Upcoming Appointments</Text>
                    <View style={styles.NewAppointmentView}>
                        <View style={styles.NewApointmentLogoView}>
                            <Entypo name="plus" size={hp(2)} color="white" style={styles.plusIcon} onPress={()=>navigation.navigate("NewAppointment")} />
                        </View>
                        <Text style={styles.NewAppointmentText}>Schedule a New Appointment</Text>

                    </View>
                </>
                }
                {Object.keys(LatestAppointmentData).length !== 0 &&
                    <>
                        <Text style={styles.AppointmentText}>Upcoming Appointment:</Text>
                        <TouchableOpacity style={styles.LatestAppView} onPress={()=>navigation.navigate("AppointmentDetails", {AppointmentDetail: LatestAppointmentData})}>
                            <View style={styles.DateView}>
                                <Text style={styles.dateText}>{LatestAppointmentData.date}</Text>
                                <Text style={styles.MonthDayText}>{LatestAppointmentData.month}</Text>
                            </View>

                            <View style={styles.AppointmentDetailsView}>
                                <View style={styles.AppointmentDetailsView2}>
                                    <Text style={styles.DoctorName}>{LatestAppointmentData.doctorName}</Text>
                                    <Text style={styles.AppointmentDetailsText}>{LatestAppointmentData.designation}</Text>
                                    <Text style={styles.AppointmentDetailsText}>{LatestAppointmentData.startTime} - {LatestAppointmentData.endTime}</Text>
                                </View>
                                <MaterialIcons name="navigate-next" size={hp(5)} color="#2F3D7E" />
                            </View>
                        </TouchableOpacity>
                    </>
                }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: hp(1),
        paddingHorizontal: wp(2)
    },
    TopView: {
        flexDirection: "row", justifyContent: "space-between", width: wp(98),
        height: hp(4)
    },
    BioView: {
        flexDirection: "row", justifyContent: "space-between", width: wp(96)
    },
    LogoText: {
        fontSize: hp(4),
        fontWeight: "bold",
        color: "#2F3D7E",
        left: 3,
        position: "absolute"
    },
    NotificationIcon: {
        right: 3,
        position: "absolute",
    },
    editicon: {
        marginRight: wp(1)
    },
    BioDataText: {
        fontSize: hp(2.3),
        fontWeight: "bold",
        marginVertical: hp(0.5)
    },
    PatientView: {
        marginTop: hp(4),
        flexDirection: "row",
        marginBottom: hp(2)
    },
    PatientView2: {
        flexDirection: "column",
        marginLeft: wp(2),
        paddingTop: hp(1)
    },
    PatientImage: {
        width: wp(22),
        height: wp(22),
        borderRadius: 40,
        marginRight: wp(3),
    },
    PatientName: {
        fontSize: hp(2.8),
        fontWeight: "bold",
    },
    PatientAgeGender: {
        fontSize: hp(2),
        color: "#41474D",
        fontWeight: "bold"
    },
    AppointmentText:{
        fontSize: hp(2.3), fontWeight: "bold", marginTop: hp(2), marginBottom: hp(2)
    },
    NewAppointmentView:{
        flexDirection: "row", paddingVertical: hp(1.5)
    },
    NewAppointmentText:{
        fontSize: hp(2), fontWeight:"bold", marginLeft: wp(2),
        
    },
    plusIcon:{
    },
    NewApointmentLogoView: {
        alignItems: "center",
        backgroundColor:"#2F3D7E",
        borderRadius:23,
        width:wp(6),
        height:hp(2.6),
        justifyContent:"center",
        marginTop:hp(0.2)

      },
      BioView2:{
        marginVertical:hp(1)
      },
      row:{
        flexDirection:"row",
        justifyContent:"space-between",
        flexWrap:"wrap",
        width:wp(96),
        alignSelf:"center",
        marginVertical:hp(0.5)
      },
      data:{
        fontSize:hp(2.1),
        fontWeight:"400"
      },
      LatestAppView:{
        overflow: 'hidden',
        width: wp(95),
        alignSelf:"center",
        borderRadius: 10,
        flexDirection:"row", 
        height: hp(12) 
      },
    DateView:{
        flexDirection:"column",
        backgroundColor:"#2F3D7E",
        color:"white",
        paddingVertical: hp(1),
        paddingHorizontal:wp(3)
    },
    dateText:{
        fontSize:hp(4),
        color:"white",
        fontWeight:"600",
        marginRight:wp(1)
    },
    MonthDayView:{
        flexDirection:"column",
        justifyContent:"space-between",
    },
    MonthDayText:{
        fontSize:hp(2),
        color:"white"
    },
    AppointmentDetailsView:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingVertical:hp(1),
        backgroundColor:"#EBEDF3",
        width: wp(70),
        paddingLeft: wp(3)
    },
    AppointmentDetailsView2:{
        flexDirection:"column",
        justifyContent:"space-between",
        height:hp(8)
    },
    DoctorName:{
        fontSize:hp(2.5),
        fontWeight:"bold"
    },
    AppointmentDetailsText:{
        fontSize:hp(2),
        color:"#41474D"
    }

});
