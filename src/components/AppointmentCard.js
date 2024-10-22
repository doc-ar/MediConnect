import { StyleSheet, Text, View, FlatList, Image, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
const AppointmentItem = ({ appointment }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: appointment.image }} style={styles.doctorImage} />
        <View style={styles.appointmentInfo}>
          <View style={styles.NameDetailsView}>
            <Text style={styles.doctorName}>{appointment.doctorName}</Text>
            <TouchableOpacity
              style={styles.Details}
              onPress={() =>
                navigation.navigate("AppointmentDetails", {
                  AppointmentDetail: appointment,
                })
              }
            >
              <Text style={styles.DetailsText}>Details</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.designation}>{appointment.designation}</Text>
          <Text style={styles.dateTime}>
            {appointment.startTime} - {appointment.endTime}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusView,
          appointment.status === "completed"
            ? styles.completedStatus
            : appointment.status === "cancelled"
            ? styles.canceledStatus
            : styles.scheduledStatus,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            appointment.status === "completed"
              ? styles.completedStatusText
              : appointment.status === "cancelled"
              ? styles.canceledStatusText
              : styles.scheduledStatusText,
          ]}
        >
          {appointment.status === "completed"
            ? "Appointment Completed"
            : appointment.status === "cancelled"
            ? "Appointment Cancelled"
            : "Scheduled"}
        </Text>
      </View>
    </View>
  );
};

export default function AppointmentCard({Appointments}) {

  const [AppointmentMonthYear, setAppointmentMonthYear] = useState("");


  if (!Appointments || Object.keys(Appointments).length === 0) {
    return (
       <View>
       <Text style={styles.noAppointmentsText}>No appointments available</Text>
       </View>
    );
  }

  const separateDate=(dateString)=> {
    const [year,month,day] = dateString.split('-'); 
    setAppointmentMonthYear(`${month} ${year}`);
  }

useEffect(() => {
    if (Appointments && Object.keys(Appointments).length !== 0) {
        const LatestAppointmentData = Appointments[Object.keys(Appointments)[0]][0];
        separateDate(LatestAppointmentData.date);
    }
}, [Appointments]);
  
  return (
  <View style={styles.container}>  
    <FlatList
      data={Object.keys(Appointments)}
      keyExtractor={(item) => item.toString()}
      renderItem={({ item: date }) => {
        const appointmentsForDate = Appointments[date];
        const firstAppointment = appointmentsForDate[0];

        return (
          <View style={styles.dateSection}>
            <View style={styles.daydateview}>
               <Text style={styles.dateText}>{date}</Text>
                <View style={styles.daymonthSection}>
                  <Text style={styles.dayText}>{firstAppointment.day} </Text>
                  <Text style={styles.monthText}>{AppointmentMonthYear}</Text>
                </View>
            </View>
          
            <FlatList
              data={appointmentsForDate}
              keyExtractor={(item) => item.appointmentId}
              renderItem={({ item: appointment }) => (
                <AppointmentItem appointment={appointment} />
              )}
            />
          </View>
          
        );
      }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  noAppointmentsText: {
    fontSize: hp(2.5),
    textAlign: "center",
    marginTop: hp(5),
  },
  dateSection: {
    marginBottom: hp(2),
    marginLeft: wp(4),
  },
  daydateview: {
    flexDirection: "row",
  },
  dateText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: "#2F3D7E",
  },
  daymonthSection: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: wp(2),
    paddingTop: hp(1),
  },
  dayText: {
    fontSize: hp(1.5),
    fontWeight: "bold",
    color: "#B5B7C1",
  },
  monthText: {
    fontSize: hp(1.5),
    color: "#46538C",
  },
  card: {
    borderRadius: 20,
    padding: hp(2),
    marginVertical: hp(1),
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#2F3D7E",
    width: wp(90),
    marginRight: wp(5),
  },
  canceledCard: {
    backgroundColor: "#FEE2E2",
  },
  completedCard: {
    backgroundColor: "#E2F7E2",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 10,
    marginRight: wp(3),
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: hp(2),
    fontWeight: "bold",
  },
  designation: {
    fontSize: hp(1.5),
    color: "#666",
    marginBottom: hp(1),
  },
  dateTime: {
    fontSize: hp(1.6),
    color: "#999",
    fontWeight: "bold",
  },
  statusView: {
    marginTop: hp(1),
    alignItems: "center",
    justifyContent: "center",
    width: wp(80),
    borderRadius: 10,
    height: hp(5),
  },
  statusText: {
    fontSize: hp(2),
    borderRadius: 20,
    fontWeight: "bold",
  },
  completedStatus: {
    backgroundColor: "#EBEDF3",
  },
  canceledStatus: {
    backgroundColor: "#FAE9E6",
  },
  scheduledStatus: {
    backgroundColor: "#2F3D7E",
  },
  completedStatusText: {
    color: "#2F3D7E",
  },
  canceledStatusText: {
    color: "#F37794",
  },
  scheduledStatusText: {
    color: "white",
  },
  NameDetailsView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Details: {},
  DetailsText: {
    fontSize: hp(1.5),
    fontWeight: "bold",
    color: "gray",
    textDecorationLine: "underline",
    textDecorationColor: "black",
  },
});
