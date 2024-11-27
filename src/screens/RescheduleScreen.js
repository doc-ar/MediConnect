import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Calendar from "react-native-calendars/src/calendar";
import {RadioButton } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
export default function RescheduleScreen(){
    const navigation = useNavigation();
    const [DoctorSchedule, setDoctorSchedule]= useState([
      {
        "date": "2024-10-26",
        "day": "Tuesday",
        "slots": [
          "09:00 am - 10:00 am",
          "11:00 am - 12:00 am",
          "02:00 pm - 03:00 pm"
        ]
      },
      {
        "date": "2024-10-27",
        "day": "Wednesday",
        "slots": [
          "10:00 am - 11:00 am",
          "01:00 pm - 02:00 pm",
          "03:00 pm - 04:00 pm"
        ]
      },
      {
        "date": "2024-10-17",
        "day": "Thursday",
        "slots": [
          "10:00 am - 11:00 am",
          "01:00 pm - 02:00 pm",
          "03:00 pm - 04:00 pm"
        ]
      },
      {
        "date": "2024-11-16",
        "day": "Friday",
        "slots": [
          "10:00 am - 11:00 am",
          "01:00 pm - 02:00 pm"
        ]
      }
    ]);
    const [DateList, setDateList] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [SlotList, setSlotList] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [EnableSlots, setEnableSlots] = useState(false);
    const [SubmitError, setSubmitError] = useState('');

    useEffect(() => {
        //fetch
        setMinMaxDate();
    }, []);

    useEffect(() => {
      const dateList = DoctorSchedule.map((item) => item.date);
      setDateList(dateList);
    }, [DoctorSchedule]);

    useEffect(() => {
        const Slots = DoctorSchedule.find(scheduleItem => scheduleItem.date === selectedDate)?.slots || [];
        if (Slots) {
            setSlotList(Slots);
        }
    }, [selectedDate]);

    useEffect(() => {
        const dates = {};
    
        DoctorSchedule.forEach(scheduleItem => {
            dates[scheduleItem.date] = {
                marked: true
            };
        });
    
        if (selectedDate) {
            dates[selectedDate] = {
                selected: true,
                selectedColor: '#2F3D7E',
                selectedTextColor: 'white',
                dotColor:"transparent"
            };
        }
        setMarkedDates(dates);
    }, [DoctorSchedule, selectedDate]);

    const setMinMaxDate = () => {
        const today = new Date();
        const minDateApp = today.toISOString().split('T')[0];
        const maxDateApp = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const formattedMaxDate = maxDateApp.toISOString().split('T')[0];
        setMaxDate(formattedMaxDate);
        setMinDate(minDateApp);
    };

    const handleSubmit =()=>{
        if(!selectedDate || !selectedSlot){
            setSubmitError("All the Categories must be filled to Rescehdule Appointment");
        }
        else{
            navigation.navigate("Home", {
                screen: "AppointmentScreen",
              }); 
        }
        }

    return(
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white"/>
        <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.AppointmentText}>Reschedule Appointment</Text>
        </View>
        <View style={styles.BottomView}>
            {DateList.length > 0 &&
                <>
                <Text style={styles.TimeSlotsText}>Select from Available Dates: </Text>
                <Calendar 
                style={{ marginHorizontal: wp(3), marginVertical: hp(2), borderRadius: 40, elevation: 4, paddingVertical: hp(2)}}
                minDate={minDate}
                maxDate={maxDate}
                markedDates={markedDates}
                initialDate={minDate}
                hideExtraDays={true}
                onDayPress={(date) => {
                    setSelectedDate(date.dateString);
                    setEnableSlots(true);
                }}               
            /></>
            }
            {
                DateList.length==0 && <Text style={styles.NoDatesText}>Apologies! Looks like doctor does not have any other slots available right now.</Text>
            }
            {EnableSlots ? (
                        SlotList.length > 0 ? (
                            <>
                                <Text style={styles.TimeSlotsText}>Select from Available Time Slots:</Text>
                                {SlotList.map((slot, index) => (
                                    <View key={index} style={styles.RadioButton}>
                                        <RadioButton
                                            value={slot}
                                            status={slot === selectedSlot ? 'checked' : 'unchecked'}
                                            onPress={() => setSelectedSlot(slot)}
                                            color="#2F3D7E"
                                        />
                                        <Text style={styles.RadioButtonText}>{slot}</Text>
                                    </View>
                                ))}
                            </>
                        ) : (
                            <Text style={styles.TimeSlotsText}>Doctor has no time slots available for this date.</Text>
                        )
                    ) : (
                        <></>
                    )}
                    {SubmitError && <Text style={styles.SubmitError}>{SubmitError}</Text>}
                    <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                        <Text style={styles.ButtonText}>Reschedule Appointment</Text>
                    </TouchableOpacity>
        </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
        paddingHorizontal:wp(2)
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
        paddingHorizontal:wp(2),
        flex:1,
    },
    NoDatesText:{
        fontSize:hp(2),
        fontWeight:"bold",
        color:"#41474D",
        textAlign:"center",
        marginTop:hp(5),
    },
    TimeSlotsText:{
        fontSize: hp(1.8),
        marginTop: hp(2),
    },
    RadioButton:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:hp(1)
    },
    RadioButtonText:{
        fontSize: hp(1.8),
        marginLeft: wp(2)
    },
    Button:{
        borderRadius: 12,
        width: wp(90),
        alignSelf:"center",
        backgroundColor:"#2F3D7E",
        height:hp(5),
        justifyContent:"center",
        alignItems:"center",
        position:"absolute",
        bottom:hp(2)
    },
    ButtonText:{
        color:"white",
        fontWeight:"bold",
        fontSize:hp(1.8)
    },
    SubmitError:{
        fontSize: hp(1.5),
        color: "red",
        alignSelf: "center",
        marginTop: hp(1),
        position:"absolute",
        bottom:hp(10)
    }
});