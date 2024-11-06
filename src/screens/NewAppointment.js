import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Calendar from "react-native-calendars/src/calendar";
import { SelectList } from "react-native-dropdown-select-list";
import {RadioButton } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediConnectStore } from "../Store/Store";

export default function NewAppointment() {
    const navigation = useNavigation();
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const [DoctorsList, setDoctorsList] = useState([]);
    const [DoctorsNameList, setDoctorsNameList] = useState([]);
    const [DoctorsName, setDoctorsName] = useState([]);
    const [DoctorTypesList, setDoctorTypesList] = useState([]);
    const [DoctorType, setDoctorType] = useState("");
    const [IsDataFetched, setIsDataFetched] = useState(false);
    const [SelectedDoctorSchedule, setSelectedDoctorSchedule] = useState([]);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate,setSelectedDate] = useState('');
    const [EnableSlots, setEnableSlots] = useState(false);
    const [EnableCalender, setEnableCalender] = useState(false);
    const [SlotsList, setSlotsList] = useState([]);
    const [SelectedSlot, setSelectedSlot] = useState('');
    const [SubmitError, setSubmitError] = useState('');
    useEffect(() => {
        fetchDoctorData();
        setMinMaxDate();
    }, []);

    useEffect(() => {
        const filteredDoctors = DoctorsList.filter(doctor => doctor.designation === DoctorType);
        const doctors = filteredDoctors.map(doctor => ({
            key: doctor.name, 
            value: doctor.name
        }));
        const uniqueDoctors = [...new Set(doctors)];
        setDoctorsNameList(uniqueDoctors);
    }, [DoctorType]);

    useEffect(() => {
        const selectedDoctor = DoctorsList.find(doctor => doctor.name === DoctorsName);
        if (selectedDoctor) {
            setSelectedDoctorSchedule(selectedDoctor.schedule);
        }
    }, [DoctorsName]);

    useEffect(() => {
        const Slots = SelectedDoctorSchedule.find(scheduleItem => scheduleItem.date === selectedDate)?.slots || [];
        if (Slots) {
            setSlotsList(Slots);
        }
    }, [selectedDate]);

    useEffect(() => {
        const dates = {};
    
        SelectedDoctorSchedule.forEach(scheduleItem => {
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
    }, [SelectedDoctorSchedule, selectedDate]);
    

    const fetchDoctorData = async () => {
        try {
            const response = await fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-3/Doctors');
            const data = await response.json();
            setDoctorsList(data);
            
            const designations = data.map(doctor => ({
                key: doctor.designation,
                value: doctor.designation
            }));
            const uniqueDesignations = [...new Set(designations)];
            setDoctorTypesList(uniqueDesignations);
            setIsDataFetched(true);
        } catch (error) {
            console.error('Error fetching Doctors:', error);
        }
        const response = await FetchRequest("https://www.mediconnect.live/mobile/get-doctors","get"
        );
        if (response.status === 200) {
            console.log("Doctors Data , Back to Schedule screen Success: ",response.data);
        }
        else{
        console.log("Error Fetching Latest Prescription Data on Prescription Screen: ",response.data);
    }
    };

    const setMinMaxDate = () => {
        const today = new Date();
        const minDateApp = today.toISOString().split('T')[0];
        const maxDateApp = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const formattedMaxDate = maxDateApp.toISOString().split('T')[0];
        setMaxDate(formattedMaxDate);
        setMinDate(minDateApp);
    };

    const handleSubmit =()=>{
        if(!DoctorType || !DoctorsName || !selectedDate || !SelectedSlot){
            setSubmitError("All the Categories must be filled to Scehdule Appointment");
        }
        else{
            navigation.goBack();
        }
        }
    

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={() => navigation.goBack()} />
                <Text style={styles.AppointmentText}>New Appointment</Text>
            </View>
            {IsDataFetched && (
                <ScrollView contentContainerStyle={styles.BottomView}>
                    <Text style={styles.FormTexts}>Select Doctor type:</Text>
                    <SelectList
                        setSelected={(Type)=>{setDoctorType(Type); setDoctorsName("");}}
                        data={DoctorTypesList}
                        arrowicon={<FontAwesome name="chevron-down" size={hp(2)} color={'black'} />}
                        boxStyles={styles.boxStyles}
                        defaultOption={{ key: "Select Option", value: "Select Option" }} 
                        dropdownStyles={styles.dropdownStyles}
                        search={true}
                    />

                    <Text style={styles.FormTexts}>Select Doctor:</Text>
                    <SelectList
                        key={DoctorType}
                        setSelected={(Name)=>{
                            setDoctorsName(Name);
                            setEnableCalender(true);
                        }}
                        data={DoctorsNameList}
                        arrowicon={<FontAwesome name="chevron-down" size={hp(2)} color={'black'}/>}
                        boxStyles={styles.boxStyles}
                        defaultOption={{ key: "Select Option", value: "Select Option" }} 
                        dropdownStyles={styles.dropdownStyles}
                        search={true}
                    />
                    <Text style={styles.TimeSlotsText}>Select from Available Dates: </Text>
                    <Calendar 
                        style={{ marginHorizontal: wp(3), marginVertical: hp(2), borderRadius: 40, elevation: 4, paddingVertical: hp(2)}}
                        disabledByDefault={!EnableCalender}
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
                    {EnableSlots ? (
                        SlotsList.length > 0 ? (
                            <>
                                <Text style={styles.TimeSlotsText}>Select from Available Time Slots:</Text>
                                {SlotsList.map((slot, index) => (
                                    <View key={index} style={styles.RadioButton}>
                                        <RadioButton
                                            value={slot}
                                            status={slot === SelectedSlot ? 'checked' : 'unchecked'}
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
                        <Text style={styles.ButtonText}>Schedule Appointment</Text>
                    </TouchableOpacity>
                    
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: hp(1),
        
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
        left: 4
    },
    BottomView: {
        width: wp(100),
        paddingHorizontal: wp(2),
    },
    FormTexts: {
        fontSize: hp(2.3),
        fontWeight: "bold",
        marginTop: hp(2),
    },
    boxStyles: {
        marginTop: hp(1),
        width: wp(90),
        alignSelf: "center",
        borderRadius: 30,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        height: hp(6),
        alignItems:"center",
        fontSize: hp(2.2),
        zIndex:1,
    },
    dropdownStyles: {
        borderRadius: 20,
        width: wp(90),
        marginTop: hp(1),
        backgroundColor: "white",
        zIndex:2,
        alignSelf: "center",
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
        height:hp(5.5),
        justifyContent:"center",
        alignItems:"center",
        marginVertical:hp(2),
      
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
        marginTop: hp(1)
    }
});
