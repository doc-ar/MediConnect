import { StatusBar } from 'expo-status-bar';
import { useState, useEffect , useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {MaterialIcons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMediConnectStore } from '../Store/Store';
export default function HomeScreen({navigation}) {

    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const [LatestAppointmentData, setLatestAppointmentData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const setPatientData = useMediConnectStore(state=>state.setPatientData);
    const Info = useMediConnectStore(state=>state.PatientData);
    const ReloadAppointments = useMediConnectStore((state)=>state.ReloadAppointments);
    const [isLoadingIndicatorVisible, setisLoadingIndicatorVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchUpcomingAppointments().then(() => setIsRefreshing(false));
      }, []);
    
    const fetchUpcomingAppointments = async () => {
        try{
            setisLoadingIndicatorVisible(true);
        const response = await FetchRequest("https://www.mediconnect.live/mobile/upcoming-appointments", "get");
        
        if (response.status === 200) {
            console.log("Upcoming App Data, Back to Home Screen Success: ", response.data);
            
            const formattedAppointments = response.data.map((appointment) => {
                const { yearMonth, date } = formatDate(appointment.date);
                const start_time = formatTimeTo12Hour(appointment.start_time);
                const end_time = formatTimeTo12Hour(appointment.end_time);
                return {
                    ...appointment,
                    month: yearMonth,
                    date: date,
                    start_time: start_time,
                    end_time: end_time
                };
            });            
            setLatestAppointmentData(formattedAppointments);
        } else {
            console.log("Error Fetching Upcoming App Data on Home Screen: ", response.data);
        }}
        catch(error){
            console.log("Error Fetching Upcoming App Data on Home Screen: ", error);
        }
        finally{
            setisLoadingIndicatorVisible(false);
        }
    };
    
    useEffect(()=>{
    const fetchPatientData=async()=>{
        const response = await FetchRequest("https://www.mediconnect.live/mobile/patient-data","get"
        );
        if (response.status === 200) {
            console.log("Patient Data , Back to Home Screen Success: ",response.data);
            setLoading(false);
            setPatientData(response.data);
        }
        else{
        console.log("Error Fetching Patient Data on Home Screen: ",response.data);
        setLoading(true);
    }}
    fetchPatientData();
    fetchUpcomingAppointments();
    },
    []
);
useEffect(() => {
    if (ReloadAppointments) {
      console.log("fetching Upcoming appointments, Reload Appointments Triggered");
      setTimeout(() => {
        fetchUpcomingAppointments();
      },1000)
    }
  }, [ReloadAppointments]);
    
const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
  
    return `${formattedHour}:00 ${period}`;
  };

    const formatDate=(dateString)=> {
        const date = new Date(dateString);
    
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
    
        const formattedYearMonth = `${month} ${year}`;
        const formattedDate = day.toString();
    
        return { yearMonth: formattedYearMonth, date: formattedDate };
    }

    const renderAppointmentItem=(item)=>{
        return(
        <TouchableOpacity style={styles.LatestAppView} onPress={()=>navigation.navigate("AppointmentDetails", {AppointmentDetail: item})}>
                <View style={styles.DateView}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={styles.MonthDayText}>{item.month}</Text>
                </View>
                <View style={styles.AppointmentDetailsView}>
                    <View style={styles.AppointmentDetailsView2}>
                        <Text style={styles.DoctorName}>{item.name}</Text>
                        <Text style={styles.AppointmentDetailsText}>{item.designation}</Text>
                        <Text style={styles.AppointmentDetailsText}>{item.start_time} - {item.end_time}</Text>
                    </View>
                    <MaterialIcons name="navigate-next" size={hp(5)} color="#2F3D7E" style={styles.Appointment_forward_Icon} />
                </View>
        </TouchableOpacity>);
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={styles.TopView}>
                    <Text style={styles.LogoText}>MediConnect</Text>
                    <Ionicons style={styles.NotificationIcon} name="notifications-outline" size={hp(4)} color="black" onPress={()=>navigation.navigate("NotificationScreen")} />
                </View>
            <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />} >
                {Loading && <Text style={styles.LoadingText}>Loading...</Text>}
                {!Loading&&<>
                <View style={styles.PatientView}>
                    <Image source={{ uri: Info.image }} style={styles.PatientImage} />
                    <View style={styles.PatientView2}>
                        <Text style={styles.PatientName}>{Info.name}</Text>
                        <Text style={styles.PatientAgeGender}>{Info.age}, {Info.gender}</Text>
                    </View>
                </View>

                <View style={styles.BioView}>
                    <Text style={styles.BioDataText}>Medical Data</Text>
                    <AntDesign name="edit" size={hp(3)} color="#2F3D7E" style={styles.editicon} onPress={()=>navigation.navigate('EditProfile')}/>
                </View>
                <View style={styles.BioView2}>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Type: {Info.bloodtype?Info.bloodtype:"NA"}</Text>
                        <Text style={styles.data}>Weight: {Info.weight?Info.weight:"NA"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Glucose: {Info.blood_glucose?Info.blood_glucose:"NA"}</Text>
                        <Text style={styles.data}>Height: {Info.height?Info.height:"NA"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Blood Pressure: {Info.blood_pressure?Info.blood_pressure:"NA"}</Text>
                        <Text style={styles.data}>Age: {Info.age?Info.age:"NA"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.data}>Allergies: {Info.allergies?Info.allergies:"NA"}</Text>
                    </View>
                </View></>}
                {isLoadingIndicatorVisible &&
                    <ActivityIndicator size="large" color="#2F3D7E"/>
                }
                {!isLoadingIndicatorVisible && Object.keys(LatestAppointmentData).length === 0 &&
                <>  
                    <View style={styles.AppointmentSectionHeading}>
                        <MaterialIcons name="sticky-note-2" size={hp(3)} color="gray"/>
                        <Text style={styles.AppointmentText}> Appointments</Text>
                    </View>
                    <View style={styles.NewAppointmentView}>
                        <AntDesign name="pluscircle" size={hp(2.5)} color="#2F3D7E" style={styles.plusIcon} onPress={()=>navigation.navigate("NewAppointment")} />
                        <Text style={styles.NewAppointmentText}>Schedule a New Appointment</Text>
                    </View>
                </>
                }
                {!isLoadingIndicatorVisible && Object.keys(LatestAppointmentData).length !== 0 &&
                    <>
                    <View style={styles.AppointmentSectionHeading}>
                            <MaterialIcons name="sticky-note-2" size={hp(2.5)} color="gray" style={{paddingTop:hp(0.4)}}/>
                            <Text style={styles.AppointmentText}> Upcoming Appointment</Text>
                    </View>
                    {console.log(LatestAppointmentData[0])}
                    {renderAppointmentItem(LatestAppointmentData[0])}
                    </>
                }
                </ScrollView>
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
    LoadingText:{
        fontSize: hp(2.3),
        fontWeight: "bold",
        marginVertical: hp(4),
        alignSelf:"center",
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
        fontSize: hp(2.6),
        fontWeight: "bold",
        marginTop: hp(0.5),
        
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
        borderRadius: 50,
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
    LoadingModal:{
        height:hp(10),
        width:wp(80),
        alignSelf:"center",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"white",
        
      },
    AppointmentText:{
        fontSize: hp(2.3), fontWeight: "bold", 
    },
    NewAppointmentView:{
        flexDirection: "row", paddingVertical: hp(1)
    },
    NewAppointmentText:{
        fontSize: hp(2), fontWeight:"bold", marginLeft: wp(2),
        
    },
    plusIcon:{
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
        fontSize:hp(1.8),
        fontWeight:"400"
      },
      LatestAppView:{
        overflow: 'hidden',
        width: wp(95),
        alignSelf:"center",
        borderRadius: 20,
        flexDirection:"row", 
        height: hp(12),
        marginBottom:hp(2)
      },
    DateView:{
        flexDirection:"column",
        backgroundColor:"#2F3D7E",
        color:"white",
        paddingVertical: hp(1.8),
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
        backgroundColor:"#EBEDF3",
        width: wp(73),
        paddingLeft: wp(3),
        paddingRight: wp(3),
        borderTopRightRadius:20,
        borderBottomRightRadius:20
        
    },
    AppointmentDetailsView2:{
        flexDirection:"column",
        justifyContent:"space-between",
        height:hp(8),
    },
    DoctorName:{
        fontSize:hp(2.3),
        fontWeight:"bold"
    },
    AppointmentDetailsText:{
        fontSize:hp(2),
        color:"#41474D"
    },
    AppointmentSectionHeading:{
        flexDirection:"row",
        marginTop: hp(1), marginBottom: hp(1.5)
    },
    AppointmentList:{
        
    },
    Appointment_forward_Icon:{
    }
    
});
