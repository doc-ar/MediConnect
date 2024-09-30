import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import DropdownDates from "../components/DropDownDates";
import AppointmentCard from "../components/AppointmentCard";
import { useMediConnectStore } from "../Store/Store";

export default function AppointmentScreen() {
  const [Appointments, setAppointments] = useState({});
  const [MonthData, setMonthData] = useState([]);
  const [Loading, setLoading] = useState(true);
  const selectedAppointmentMonth = useMediConnectStore((state) => state.selectedAppointmentMonth);
  const setSelectedAppointmentMonth = useMediConnectStore((state) => state.setSelectedAppointmentMonth);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Set the selected month after MonthData is updated
  useEffect(() => {
    if (MonthData.length > 0) {
      setSelectedAppointmentMonth(MonthData[MonthData.length - 1]); // Set the last month as selected
    }
  }, [MonthData]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API/Appointments');
      const data = await response.json();
      groupAppointmentsByMonthYear(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Group appointments by month and year
  function groupAppointmentsByMonthYear(data) {
    const groupedData = {};

    data.forEach((appointment) => {
      const [year, month, day] = appointment.date.split('-');
      const key = `${month} ${year}`;

      if (!groupedData[key]) {
        groupedData[key] = {};
        setMonthData((prev) => [...prev, key]);
      }

      if (!groupedData[key][day]) {
        groupedData[key][day] = [];
      }

      groupedData[key][day].push(appointment);
    });
    setAppointments(groupedData);
    setLoading(false); 
  }

  return (
    <View style={styles.container}>
      <View style={styles.AppointmentView}>
        <Text style={styles.AppointmentText}>My Appointments</Text>
      </View>
      <View style={styles.NewApointmentView}>
        <AntDesign name="pluscircle" size={hp(2)} color="#2F3D7E" style={styles.plusIcon} />
        <Text style={styles.NewAppointmentText}>New Appointment</Text>
      </View>
      <DropdownDates Data={MonthData}/>

      {!Loading && selectedAppointmentMonth && (
        <AppointmentCard Appointments={Appointments[selectedAppointmentMonth] || {}} />
      )}

      {Loading && <Text>Loading Appointments...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4)
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
  NewApointmentView: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: wp(4),
    top: hp(8),
  },
  plusIcon: {
    marginRight: wp(1)
  },
  NewAppointmentText: {
    fontSize: hp(2),
    fontWeight: "bold",
  }
});
