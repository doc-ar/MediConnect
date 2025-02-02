import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import MedicationTable from "../components/MedicationTable";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Modal from "react-native-modal";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useMediConnectStore } from "../Store/Store";

export default function AppointmentDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const setReloadAppointments = useMediConnectStore(
    (state) => state.setReloadAppointments,
  );
  const setReloadUpcomingAppointments = useMediConnectStore(
    (state) => state.setReloadUpcomingAppointments,
  );
  const FetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);
  const { AppointmentDetail } = route.params;
  const { appointment_id, slot_id } = AppointmentDetail;
  const [isLoadingModalVisible, setLoadingModalVisible] = useState(false);
  const [isSubmitModalVisible, setSubmitModalVisible] = useState(false);
  const [SubmitMessage, setSubmitMessage] = useState("");
  const showAppointmentNotification = useMediConnectStore(
    (state) => state.showAppointmentNotification,
  );

  const handleCancelAppointment = async () => {
    setLoadingModalVisible(true);
    console.log("Attempting to cancel appointment:", appointment_id);

    try {
      const response = await FetchRequest(
        "http://localhost:3002/mobile/cancel-appointment",
        "patch",
        {
          appointment_id,
        },
      );

      if (response.status === 200) {
        console.log("Appointment cancelled successfully:", response.data);
        setSubmitMessage("Appointment Cancelled Successfully");
        setCancelModalVisible(false);
        setSubmitModalVisible(true);
        setReloadAppointments((prev) => !prev);
        showAppointmentNotification(
          `Appointment cancelled with ${AppointmentDetail.name} on ${AppointmentDetail.date}`,
          null,
        );
      } else {
        console.error("Error cancelling appointment:", response);
        setSubmitMessage("Error Cancelling Appointment. Try Again.");
      }
    } catch (error) {
      console.error("Network error cancelling appointment:", error);
      setSubmitMessage("Network Error. Please try again.");
    } finally {
      setLoadingModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.TopView}>
        <AntDesign
          name="arrowleft"
          size={hp(3.5)}
          color="#646466"
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.AppointmentText}>Appointment Details</Text>
      </View>
      <View style={styles.BottomView}>
        <View style={styles.DoctorView}>
          <Image
            source={{ uri: AppointmentDetail.image }}
            style={styles.doctorImage}
          />
          <View style={styles.DoctorView2}>
            <Text style={styles.doctorName}>
              {AppointmentDetail.name}{" "}
              <Text style={styles.doctorqual}>
                {" "}
                ({AppointmentDetail.qualification})
              </Text>
            </Text>
            <Text style={styles.Doctordesignation}>
              {AppointmentDetail.designation}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.statusView,
            AppointmentDetail.status === "completed"
              ? styles.completedStatus
              : AppointmentDetail.status === "cancelled"
                ? styles.canceledStatus
                : styles.scheduledStatus,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              AppointmentDetail.status === "completed"
                ? styles.completedStatusText
                : AppointmentDetail.status === "cancelled"
                  ? styles.canceledStatusText
                  : styles.scheduledStatusText,
            ]}
          >
            {AppointmentDetail.status === "completed"
              ? "Completed"
              : AppointmentDetail.status === "cancelled"
                ? "Cancelled"
                : "Scheduled"}
          </Text>
        </View>
        <View style={styles.DetailView}>
          <Text style={styles.details}>
            Date: {AppointmentDetail.date} ({AppointmentDetail.day})
          </Text>
          <Text style={styles.details}>
            Time: {AppointmentDetail.start_time} - {AppointmentDetail.end_time}
          </Text>
          <Text style={styles.details}>
            Room Number: {AppointmentDetail.roomno}
          </Text>
          <Text style={styles.details}>
            Contact: {AppointmentDetail.contact}
          </Text>
          <Text style={styles.details}>
            Email: {AppointmentDetail.doctor_email}
          </Text>
        </View>
        {AppointmentDetail.status === "completed" && (
          <>
            <Text style={styles.details}>Prescription: </Text>
            <View style={styles.MedicationView}>
              <MedicationTable
                Medications={AppointmentDetail.prescription}
                DoctorName={AppointmentDetail.name}
                AppointmentDate={AppointmentDetail.date}
              />
            </View>
          </>
        )}
        {(AppointmentDetail.status === "Scheduled" ||
          AppointmentDetail.status === "scheduled" ||
          AppointmentDetail.status === "rescheduled" ||
          AppointmentDetail.status === "Rescheduled" ||
          AppointmentDetail.status === "ReScheduled") && (
          <>
            <View style={styles.BottomButtons}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RescheduleScreen", {
                    appointment_id: AppointmentDetail.appointment_id,
                    doctor_name: AppointmentDetail.name,
                  })
                }
                style={styles.RescheduleButton}
              >
                <Text style={styles.RescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.CancelButton}
                onPress={() => setCancelModalVisible(true)}
              >
                <Text style={styles.CancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Modal isVisible={isCancelModalVisible}>
              <View style={styles.CancelModalView}>
                <Text style={styles.ModalText}>
                  Do you want to cancel your Appointment?
                </Text>
                <View style={styles.CancelModalButtons}>
                  <TouchableOpacity
                    onPress={() => setCancelModalVisible(false)}
                    style={styles.CancelModalCancelButton}
                  >
                    <Text style={styles.CancelButtonText}>Don't Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCancelAppointment()}
                    style={styles.CancelModalButton}
                  >
                    <Text style={styles.RescheduleButtonText}>
                      Yes, Cancel Appointment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal isVisible={isLoadingModalVisible}>
              <View style={styles.LoadingModal}>
                <ActivityIndicator size="large" color="#fafafa" />
              </View>
            </Modal>

            <Modal isVisible={isSubmitModalVisible}>
              <View style={styles.ModalView}>
                <Text style={styles.ModalText}>{SubmitMessage}</Text>
                {SubmitMessage === "Appointment Cancelled Successfully" ? (
                  <AntDesign
                    name="checkcircle"
                    size={hp(9)}
                    color="#2F3D7E"
                    style={styles.Modalcheck}
                  />
                ) : (
                  <Entypo
                    name="circle-with-cross"
                    size={hp(9)}
                    color="#a1020a"
                    style={styles.Modalcheck}
                  />
                )}
                <TouchableOpacity
                  style={[
                    styles.ModalBackButton,
                    { backgroundColor: "#FAE9E6" },
                  ]}
                  onPress={() =>
                    navigation.navigate("HomeStack", {
                      screen: "AppointmentScreen",
                    })
                  }
                >
                  <Text
                    style={[styles.ModalBackButtonText, { color: "#a1020a" }]}
                  >
                    Go Back
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  AppointmentText: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#41474D",
  },
  TopView: {
    flexDirection: "row",
    marginTop: hp(0.5),
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    borderBottomWidth: hp(0.06),
    borderBottomColor: "#d4d2cd",
    paddingBottom: hp(1),
  },
  backArrow: {
    position: "absolute",
    left: 0,
  },
  BottomView: {
    paddingHorizontal: wp(2),
  },
  DoctorView: {
    marginTop: hp(4),
    flexDirection: "row",
  },
  DoctorView2: {
    flexDirection: "column",
    marginLeft: wp(2),
    paddingTop: hp(1),
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
    fontWeight: "bold",
  },
  Doctordesignation: {
    fontSize: hp(1.8),
    color: "#41474D",
    fontWeight: "bold",
  },
  statusView: {
    paddingHorizontal: wp(0.8),
    paddingVertical: wp(0.5),
    borderRadius: 5,
    width: wp(20),
    alignItems: "center",
    marginTop: hp(2),
  },
  statusText: {
    fontSize: hp(1.5),
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
  DetailView: {
    marginTop: hp(1.5),
  },
  details: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    marginVertical: hp(0.5),
  },
  MedicationView: {
    marginHorizontal: wp(1),
  },
  BottomButtons: {
    marginTop: hp(5),
    justifyContent: "space-between",
    alignSelf: "center",
  },
  RescheduleButton: {
    backgroundColor: "#2F3D7E",
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderRadius: 12,
    marginVertical: hp(1),
    width: wp(90),
    alignItems: "center",
    height: hp(5),
    justifyContent: "center",
  },
  RescheduleButtonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  CancelButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderRadius: 12,
    width: wp(90),
    alignItems: "center",
    backgroundColor: "#a1020a",
    height: hp(5),
    justifyContent: "center",
  },
  CancelButtonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  CancelModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: hp(25),
    width: wp(80),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  ModalText: {
    fontSize: hp(2),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: hp(2),
  },
  CancelModalButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: hp(2),
    height: hp(12),
  },
  CancelModalCancelButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderRadius: 10,
    width: wp(70),
    height: hp(5),
    alignItems: "center",
    backgroundColor: "#a1020a",
  },
  CancelModalButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    borderRadius: 10,
    width: wp(70),
    height: hp(5),
    alignItems: "center",
    backgroundColor: "#2F3D7E",
  },
  LoadingModal: {
    height: hp(30),
    width: wp(80),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  ModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: hp(25),
    width: wp(80),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  ModalText: {
    fontSize: hp(2),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: hp(1),
  },
  Modalcheck: {
    alignSelf: "center",
  },
  ModalBackButton: {
    backgroundColor: "#2F3D7E",
    borderRadius: 12,
    width: wp(50),
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(2),
  },
  ModalBackButtonText: {
    color: "white",
    fontSize: hp(1.8),
    fontWeight: "bold",
  },
});
