import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DropdownDates from "../components/DropDownDates";
import AppointmentCard from "../components/AppointmentCard";
import { useMediConnectStore } from "../Store/Store";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
export default function AppointmentScreen() {
  const navigation = useNavigation();
  const [Appointments, setAppointments] = useState([]);
  const [MonthData, setMonthData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const selectedAppointmentMonth = useMediConnectStore((state) => state.selectedAppointmentMonth);
  const setSelectedAppointmentMonth = useMediConnectStore((state) => state.setSelectedAppointmentMonth);
  const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
  const ReloadAppointments = useMediConnectStore(state=>state.ReloadAppointments);
  const setReloadAppointments = useMediConnectStore(state=>state.setReloadAppointments);
  const setReloadUpcomingAppointments = useMediConnectStore(state=>state.setReloadUpcomingAppointments);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (ReloadAppointments) {
      console.log("Reload Appointments Triggered");
      fetchAppointments();
      setReloadAppointments(false);
      setReloadUpcomingAppointments(true);
    }
  }, [ReloadAppointments]);

  useEffect(() => {
    if (MonthData.length > 0) {
      setSelectedAppointmentMonth(MonthData[MonthData.length - 1]); 
    }
  }, [MonthData]);

  const fetchAppointments = async () => {
    const response = await FetchRequest("https://www.mediconnect.live/mobile/all-appointments","get");
    if (response.status === 200) { 
      console.log("Back to Appointment Screen Success: ",response.data);
      groupAppointmentsByMonthYear(response.data);
      return;
    }
    console.log("Error: ",response.data);
  };

  const formatTimeTo12Hour = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format, with 0 as 12
  
    return `${formattedHour} ${period}`;
  };

  function groupAppointmentsByMonthYear(data) {
    const groupedData = {};
    const uniqueMonthData = new Set(); // Track unique month-year combinations

    data.forEach((appointment) => {
        // Format the date and update the appointment's date attribute
        const formattedDate = formatDate(appointment.date);
        appointment.date = formattedDate;

        // Convert start and end time to 12-hour format
        appointment.start_time = formatTimeTo12Hour(appointment.start_time);
        appointment.end_time = formatTimeTo12Hour(appointment.end_time);

        // Extract year, month, and day from the formatted date
        const [year, month, day] = formattedDate.split('-');
        const key = `${month} ${year}`;

        // Add month-year to the set to ensure uniqueness
        uniqueMonthData.add(key);

        if (!groupedData[key]) {
            groupedData[key] = {};
        }

        if (!groupedData[key][day]) {
            groupedData[key][day] = [];
        }

        groupedData[key][day].push(appointment);
    });

    // Convert the set to an array and update MonthData with unique values
    setMonthData(Array.from(uniqueMonthData));
    setAppointments(groupedData);
    setLoading(false); 
    console.log(Array.from(uniqueMonthData)); // Optional: Log unique month data for debugging
  

    // Convert the set to an array and update MonthData with unique values
    setMonthData(Array.from(uniqueMonthData));
    setAppointments(groupedData);
    setLoading(false); 
    console.log(Array.from(uniqueMonthData)); // Optional: Log unique month data for debugging
}

  function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
  
    return `${year}-${month}-${day}`;
  }


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white"/>
      <View style={styles.AppointmentView}>
        <Text style={styles.AppointmentText}>My Appointments</Text>
      </View>
      
        <AntDesign name="pluscircle" size={hp(5)} color="#2F3D7E" style={styles.plusIcon} onPress={()=>navigation.navigate("NewAppointment")} />
      <DropdownDates Data={MonthData}/>
      <View>
      {!Loading && selectedAppointmentMonth && Appointments[selectedAppointmentMonth] ?
      <AppointmentCard Appointments={Appointments[selectedAppointmentMonth]} />:
        null}
        {!Loading && Object.keys(Appointments).length === 0 ? (
          <Text style={styles.NoAppointmentText}>You currently have no Appointment data available.</Text>
        ) : null}

      {Loading && <ActivityIndicator size="large" color="#2F3D7E"/>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    position: "relative"
  },
  AppointmentView:{
    paddingTop: hp(0.5),
    borderBottomWidth:hp(0.06),
    borderBottomColor:"#d4d2cd",
    paddingBottom:hp(1),
    width:wp(100),
    alignItems:"center"
  },
  AppointmentText: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#41474D",
  },
  plusIcon: {
    alignItems: "center",
    position: "absolute",
    right: wp(4),
    bottom: hp(3),
    zIndex:1,
    borderRadius:28,
    justifyContent:"center",
    backgroundColor:"white"
  },
  NoAppointmentText:{
    fontWeight:"bold",
    fontSize: hp(2),
    color:"#41474D",
    textAlign:"center",
    marginTop:hp(3),
    paddingHorizontal:wp(5)
  }
});
