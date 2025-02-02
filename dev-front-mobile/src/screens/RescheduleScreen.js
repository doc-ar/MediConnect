import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Calendar from "react-native-calendars/src/calendar";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediConnectStore } from "../Store/Store";
import Modal from "react-native-modal";
export default function RescheduleScreen({ route }) {
  const setReloadAppointments = useMediConnectStore(
    (state) => state.setReloadAppointments,
  );
  const navigation = useNavigation();
  const { appointment_id, doctor_name } = route.params;
  const [DoctorSchedule, setDoctorSchedule] = useState([]);
  const [DateList, setDateList] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [SlotList, setSlotList] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [EnableSlots, setEnableSlots] = useState(false);
  const [SubmitError, setSubmitError] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [SubmitMessage, setSubmitMessage] = useState("");
  const [isErrorModalVisible, setErrorModalVisible] = useState(false);
  const FetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
  const showAppointmentNotification = useMediConnectStore(
    (state) => state.showAppointmentNotification,
  );

  useEffect(() => {
    fetchDoctorData();
    setMinMaxDate();
  }, []);

  useEffect(() => {
    const dateList = DoctorSchedule.map((item) => item.date);
    setDateList(dateList);
  }, [DoctorSchedule]);

  useEffect(() => {
    const Slots =
      DoctorSchedule.find((scheduleItem) => scheduleItem.date === selectedDate)
        ?.slots || [];
    if (Slots) {
      setSlotList(Slots);
    }
  }, [selectedDate]);

  useEffect(() => {
    const dates = {};

    DoctorSchedule.forEach((scheduleItem) => {
      dates[scheduleItem.date] = {
        marked: true,
      };
    });

    if (selectedDate) {
      dates[selectedDate] = {
        selected: true,
        selectedColor: "#2F3D7E",
        selectedTextColor: "white",
        dotColor: "transparent",
      };
    }
    setMarkedDates(dates);
  }, [DoctorSchedule, selectedDate]);

  const fetchDoctorData = async () => {
    const response = await FetchRequest(
      "http://localhost:3002/mobile/get-doctors",
      "get",
    );
    if (response.status === 200) {
      console.log(
        "Doctors Data , Back to reschedule screen Success: ",
        response.data,
      );
      const data = response.data;
      const filteredDoctor = data.filter(
        (doctor) => doctor.name === doctor_name,
      );
      console.log(filteredDoctor);
      setDoctorSchedule(filteredDoctor[0].schedule);
    } else {
      console.log("Error Fetching Doctor Data: ", response.data);
    }
  };

  const formatSlot = (slot) => {
    console.log(slot);
    const parts = slot.split("-");
    const startTime = parts[0];
    const endTime = parts[1];
    const slotId = parts.slice(2).join("-").slice(1);
    return { displayTime: `${startTime} - ${endTime}`, slotId };
  };

  const setMinMaxDate = () => {
    const today = new Date();
    const minDateApp = today.toISOString().split("T")[0];
    const maxDateApp = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const formattedMaxDate = maxDateApp.toISOString().split("T")[0];
    setMaxDate(formattedMaxDate);
    setMinDate(minDateApp);
  };

  const handleSubmit = async () => {
    console.log(
      "Appointment Rescheduled by patient: ",
      appointment_id,
      selectedDate,
      selectedSlot,
    );
    setSubmitError("");
    setSubmitMessage("");
    if (!selectedDate || !selectedSlot) {
      setSubmitError(
        "All the Categories must be selected to Rescehdule Appointment",
      );
      setErrorModalVisible(true);
    } else {
      const response = await FetchRequest(
        "http://localhost:3002/mobile/reschedule-appointment",
        "patch",
        {
          slot_id: selectedSlot,
          appointment_id: appointment_id,
        },
      );
      if (response.status === 200) {
        console.log("Appointment Rescheduled Success: ", response.data);
        setSubmitMessage("Appointment Rescheduled Successfully");
        setModalVisible(true);
        setReloadAppointments(true);
        showAppointmentNotification(
          `Appointment Rescheduled with ${doctor_name} on ${selectedDate} at ${selectedTime}`,
          null,
        );
      } else {
        console.log("Error on new app reschedule Screen: ", response.data);
        setSubmitMessage("Error Rescheduling Appointment. Try Again.");
        setModalVisible(true);
      }
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
        <Text style={styles.AppointmentText}>Reschedule Appointment</Text>
      </View>
      <View style={styles.BottomView}>
        {DateList.length > 0 && (
          <>
            <Text style={styles.TimeSlotsText}>
              Select from Available Dates:{" "}
            </Text>
            <Calendar
              style={{
                marginHorizontal: wp(3),
                marginVertical: hp(2),
                borderRadius: 40,
                elevation: 4,
                paddingVertical: hp(2),
              }}
              minDate={minDate}
              maxDate={maxDate}
              markedDates={markedDates}
              initialDate={minDate}
              hideExtraDays={true}
              onDayPress={(date) => {
                setSelectedDate(date.dateString);
                setEnableSlots(true);
              }}
            />
          </>
        )}
        {DateList.length == 0 && (
          <Text style={styles.NoDatesText}>
            Apologies! Looks like doctor does not have any other slots available
            right now.
          </Text>
        )}
        {EnableSlots ? (
          SlotList.length > 0 ? (
            <>
              <Text style={styles.TimeSlotsText}>
                Select from Available Time Slots:
              </Text>
              {SlotList.map((slot, index) => {
                const { displayTime, slotId } = formatSlot(slot);
                return (
                  <View key={index} style={styles.RadioButton}>
                    <RadioButton
                      value={slotId}
                      status={slotId === selectedSlot ? "checked" : "unchecked"}
                      onPress={() => {
                        setSelectedSlot(slotId);
                        setSelectedTime(displayTime);
                      }}
                      color="#2F3D7E"
                    />
                    <Text style={styles.RadioButtonText}>{displayTime}</Text>
                  </View>
                );
              })}
            </>
          ) : (
            <Text style={styles.TimeSlotsText}>
              Doctor has no time slots available for this date.
            </Text>
          )
        ) : (
          <></>
        )}
        <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
          <Text style={styles.ButtonText}>Reschedule Appointment</Text>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
          <View style={styles.ModalView}>
            <Text style={styles.ModalText}>{SubmitMessage}</Text>
            {SubmitMessage === "Appointment Rescheduled Successfully" ? (
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
              style={[styles.ModalBackButton, { backgroundColor: "#FAE9E6" }]}
              onPress={() =>
                navigation.navigate("HomeStack", {
                  screen: "AppointmentScreen",
                })
              }
            >
              <Text style={[styles.ModalBackButtonText, { color: "#a1020a" }]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal isVisible={isErrorModalVisible}>
          <View style={styles.ModalView}>
            <Text style={styles.ModalText}>{SubmitError}</Text>
            <Entypo
              name="circle-with-cross"
              size={hp(9)}
              color="#a1020a"
              style={styles.Modalcheck}
            />
            <TouchableOpacity
              style={[styles.ModalBackButton, { backgroundColor: "#FAE9E6" }]}
              onPress={() => setErrorModalVisible(false)}
            >
              <Text style={[styles.ModalBackButtonText, { color: "#a1020a" }]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
    flex: 1,
  },
  NoDatesText: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#41474D",
    textAlign: "center",
    marginTop: hp(5),
  },
  TimeSlotsText: {
    fontSize: hp(1.8),
    marginTop: hp(2),
  },
  RadioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },
  RadioButtonText: {
    fontSize: hp(1.8),
    marginLeft: wp(2),
  },
  Button: {
    borderRadius: 12,
    width: wp(90),
    alignSelf: "center",
    backgroundColor: "#2F3D7E",
    height: hp(5),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: hp(2),
  },
  ButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: hp(1.8),
  },
  SubmitError: {
    fontSize: hp(1.5),
    color: "red",
    alignSelf: "center",
    marginTop: hp(1),
    position: "absolute",
    bottom: hp(10),
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
