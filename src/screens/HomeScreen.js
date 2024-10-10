import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper'; 
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppointmentCard from '../components/AppointmentCard';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {


    const [Info, setInfo] = useState({
        BloodType: "O+",
        Weight: "70 kg",
        Height: "170 cm",
        Allergies: "None",
        BloodGlucose: "120 mg/dL",
        BloodPressure: "120/80 mmHg"
    });
    const [LatestAppointmentData, setLatestAppointmentData] = useState({20:[{appointmentId: "006",
        doctorName: "Dr. David Lee",
        designation: "Orthopedic Surgeon",
        qualification: "MD, FAAOS",
        date: "2024-Sept-20",
        day: "Tuesday",
        startTime: "4:00 PM",
        endTime: "5:00 PM",
        status: "Scheduled",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJ43pA5ohSHvxkSP_0VAxPy8GZAUgDydGQ8kyYZewhxXpYtRoL8SSHfQtpruehLB29Ls&usqp=CAU"}]
    });


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={styles.TopView}>
                    <Text style={styles.LogoText}>MediConnect</Text>
                    <Ionicons style={styles.NotificationIcon} name="notifications-outline" size={hp(4)} color="black" />
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
                    <AntDesign name="edit" size={hp(3)} color="#2F3D7E" style={styles.editicon} />
                </View>
                <DataTable style={styles.Infocontainer}>
                    {Object.entries(Info).map(([key, value], index) => (
                        <DataTable.Row
                            key={index}
                            style={index === Object.entries(Info).length - 1 ? styles.lastRow : styles.row}>
                            <DataTable.Cell>{key}</DataTable.Cell>
                            <DataTable.Cell>{value}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>

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
                        <AppointmentCard Appointments={LatestAppointmentData} />
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
    Infocontainer: {
        paddingHorizontal: wp(0.5),
        paddingVertical: hp(1),
        marginTop: hp(1.5),
        borderRadius: 15,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#2F3D7E",
    },
    row: {
        borderBottomWidth: 1,
        borderBottomColor: '#2F3D7E',
    },
    lastRow: {
        borderBottomWidth: 0,
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
        width: wp(18),
        height: wp(18),
        borderRadius: 40,
        marginRight: wp(3),
    },
    PatientName: {
        fontSize: hp(2.3),
        fontWeight: "bold",
    },
    PatientAgeGender: {
        fontSize: hp(1.8),
        color: "#41474D",
        fontWeight: "bold"
    },
    AppointmentText:{
        fontSize: hp(2.3), fontWeight: "bold", marginTop: hp(2), marginBottom: hp(1)
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
});
