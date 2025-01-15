import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome, Entypo } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Calendar from "react-native-calendars/src/calendar";
import { SelectList } from "react-native-dropdown-select-list";
import {RadioButton } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { useMediConnectStore } from "../Store/Store";
import Modal from "react-native-modal";

export default function NewAppointment() {
    const navigation = useNavigation();
    const setReloadAppointments = useMediConnectStore((state) => state.setReloadAppointments)
    const setReloadUpcomingAppointments = useMediConnectStore((state) => state.setReloadUpcomingAppointments)
    const FetchRequest = useMediConnectStore((state)=>state.fetchWithRetry);
    const PatientData = useMediConnectStore(state=>state.PatientData);
    const [DoctorsList, setDoctorsList] = useState([]);
    const [DoctorsNameList, setDoctorsNameList] = useState([]);
    const [DoctorsName, setDoctorsName] = useState([]);
    const [DoctorTypesList, setDoctorTypesList] = useState([]);
    const [DoctorType, setDoctorType] = useState("");
    const [SelectedDoctorTypeFilter, setSelectedDoctorTypeFilter] = useState("designation");
    const [IsDataFetched, setIsDataFetched] = useState(false);
    const [SelectedDoctorSchedule, setSelectedDoctorSchedule] = useState([]);
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedDate,setSelectedDate] = useState('');
    const [selectedTime,setSelectedTime] = useState('');
    const [EnableSlots, setEnableSlots] = useState(false);
    const [EnableCalender, setEnableCalender] = useState(false);
    const [SlotsList, setSlotsList] = useState([]);
    const [SelectedSlot, setSelectedSlot] = useState(null);
    const [SubmitError, setSubmitError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [SubmitMessage,setSubmitMessage]=useState("");
    const [isErrorModalVisible, setErrorModalVisible] = useState(false);
    const showAppointmentNotification = useMediConnectStore(state=>state.showAppointmentNotification);

    useEffect(() => {
        fetchDoctorData();
        setMinMaxDate();
    }, []);
    
    useEffect(() => {
        setDoctorType("");
        setDoctorTypesList([]);
        setDoctorsNameList([]);
        setMarkedDates({});
        setSelectedDate("");
        setSlotsList([]);
        setEnableSlots(false);
        setSelectedDoctorSchedule([]);
        setDoctorsName("");
        if (SelectedDoctorTypeFilter === "designation") {
            const designations = DoctorsList.map(doctor => ({
                key: doctor.designation,
                value: doctor.designation,
            }));
            const uniqueDesignations = [...new Set(designations)];
            setDoctorTypesList(uniqueDesignations);
        } else if (SelectedDoctorTypeFilter === "qualification") {
            const qualifications = DoctorsList.map(doctor => ({
                key: doctor.qualification,
                value: doctor.qualification,
            }));
            const uniqueQualifications = [...new Set(qualifications)];
            setDoctorTypesList(uniqueQualifications);
        }
    }, [SelectedDoctorTypeFilter, DoctorsList]);
    
    useEffect(() => {
        if (SelectedDoctorTypeFilter === "designation") {
            const filteredDoctors = DoctorsList.filter(doctor => doctor.designation === DoctorType);
            const doctors = filteredDoctors.map(doctor => ({
                key: doctor.name,
                value: doctor.name,
            }));
            const uniqueDoctors = [...new Set(doctors)];
            setDoctorsNameList(uniqueDoctors);
        } else if (SelectedDoctorTypeFilter === "qualification") {
            const filteredDoctors = DoctorsList.filter(doctor => doctor.qualification === DoctorType);
            const doctors = filteredDoctors.map(doctor => ({
                key: doctor.name,
                value: doctor.name,
            }));
            const uniqueDoctors = [...new Set(doctors)];
            setDoctorsNameList(uniqueDoctors);
        }
    }, [DoctorType, SelectedDoctorTypeFilter]);
    
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
        
        const response = await FetchRequest("https://www.mediconnect.live/mobile/get-doctors", "get");
        if (response.status === 200) {
            console.log("Doctors Data , Back to Schedule screen Success: ", response.data);
            const data = response.data;
    
            const filteredDoctors = data.filter(doctor => 
                doctor.qualification && 
                doctor.designation && 
                doctor.schedule?.[0]?.date
            );
            setDoctorsList(filteredDoctors);
            setIsDataFetched(true);
        } else {
            console.log("Error Fetching Doctor Data: ", response.data);
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

    const handleSubmit = async()=>{
        console.log("Appointment Scheduled by patient: ", DoctorType, DoctorsName, selectedDate, SelectedSlot)
        console.log("Doctor id: ",DoctorsList.find(doctor => doctor.name === DoctorsName).doctor_id);

        if(!DoctorType || !DoctorsName || !selectedDate || !SelectedSlot){
            setSubmitError("All the Categories must be selected to Scehdule Appointment");
            setErrorModalVisible(true);
        }
        else{
            console.log("Appointment Scheduled by patient: ", DoctorType, DoctorsName, selectedDate, SelectedSlot)
            console.log(DoctorsList.find(doctor => doctor.name === DoctorsName));
            const response = await FetchRequest("https://www.mediconnect.live/mobile/create-appointment","post",{
                status:"scheduled",
                slot_id: SelectedSlot,
                patient_id: PatientData.patient_id,
                doctor_id: DoctorsList.find(doctor => doctor.name === DoctorsName).doctor_id,
            }
            );
            if (response.status === 200) {
                console.log("Appointment scheduled Success: ",response.data);
                setSubmitMessage("Appointment Scheduled Successfully");
                setModalVisible(true);
                showAppointmentNotification(`Appointment Scheduled with ${DoctorsName} on ${selectedDate} at ${selectedTime}`,null);
                setReloadAppointments(prev => !prev);
            }
            else{
                console.log("Error on new app Screen: ", response.data);
                setSubmitMessage("Error Scheduling Appointment. Try Again.");
                setModalVisible(true);
            }
        
        }
        }
    
    
        const formatSlot = (slot) => {
        console.log(slot);
        const parts = slot.split("-");
        const startTime = parts[0];
        const endTime = parts[1];
        const slotId = parts.slice(2).join("-").slice(1);
        console.log("slotId: ", slotId);
    return { displayTime: `${startTime} - ${endTime}`, slotId };
        };

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
                    <View style={styles.TypesView}>
                <Text style={styles.RadioButtonTypeText}>Filter:</Text>

                <View style={styles.RadioButtonTypesView}>
                    <View style={styles.RadioButtonSet}>
                        
                    <RadioButton
                                value={"qualification"}
                                status={SelectedDoctorTypeFilter ==="qualification" ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedDoctorTypeFilter("qualification")}
                                color="#2F3D7E"
                            />
                    <Text style={[styles.RadioButtonText, {marginLeft:wp(0.5)}]}>qualification</Text>
                    </View>
                    <View style={styles.RadioButtonSet}>
                    <RadioButton
                                value={"designation"}
                                status={SelectedDoctorTypeFilter==="designation" ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedDoctorTypeFilter("designation")}
                                color="#2F3D7E"
                    />
                    <Text style={[styles.RadioButtonText, {marginLeft:wp(0.5)}]}>designation</Text>
                    </View>
                </View>
                </View>
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
                                {SlotsList.map((slot, index) => {
                    const { displayTime, slotId } = formatSlot(slot);
                    
                    return (
                        <View key={index} style={styles.RadioButton}>
                            <RadioButton
                                value={slotId}
                                status={slotId === SelectedSlot ? 'checked' : 'unchecked'}
                                onPress={() => {setSelectedSlot(slotId); setSelectedTime(displayTime);}}
                                color="#2F3D7E"
                            />
                            <Text style={styles.RadioButtonText}>{displayTime}</Text>
                        </View>
                    );
                })}
                            </>
                        ) : (
                            <Text style={styles.TimeSlotsText}>Doctor has no time slots available for this date.</Text>
                        )
                    ) : (
                        <></>
                    )}
                    <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
                        <Text style={styles.ButtonText}>Schedule Appointment</Text>
                    </TouchableOpacity>
                    
            <Modal isVisible={isModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>{SubmitMessage}</Text>
                    {SubmitMessage === "Appointment Scheduled Successfully"?
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.Modalcheck}/>:
                    <Entypo name="circle-with-cross" size={hp(9)} color="#a1020a" style={styles.Modalcheck}/>
                    }
                    <TouchableOpacity style={[styles.ModalBackButton, {backgroundColor:"#FAE9E6"}]} onPress={()=>navigation.goBack()}>
                        <Text style={[styles.ModalBackButtonText, {color:"#a1020a" }]}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal isVisible={isErrorModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>{SubmitError}</Text>
                    <Entypo name="circle-with-cross" size={hp(9)} color="#a1020a" style={styles.Modalcheck}/>
                    <TouchableOpacity style={[styles.ModalBackButton, {backgroundColor:"#FAE9E6"}]} onPress={()=>setErrorModalVisible(false)}>
                        <Text style={[styles.ModalBackButtonText, {color:"#a1020a" }]}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            
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
    },
    ModalView:{
        backgroundColor:"white",
        borderRadius:20,
        height:hp(25),
        width:wp(80),
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center"
      },
      ModalText:{
        fontSize:hp(2),
        fontWeight:"bold",
        textAlign:"center",
        marginBottom:hp(1)
      },
      Modalcheck:{
        alignSelf:"center",
      },
      ModalBackButton:{
        backgroundColor:"#2F3D7E",
        borderRadius:12,
        width:wp(50),
        height:hp(5),
        justifyContent:"center",
        alignItems:"center",
        marginTop:hp(2)
      },
      ModalBackButtonText:{
        color:"white",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      TypesView:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:wp(90),
        marginVertical:hp(1)

      },
      RadioButtonTypesView:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:wp(60),
        alignSelf:"center",
      },
      RadioButtonSet:{
        flexDirection:"row",
        alignItems:"center",
      },
    RadioButtonTypeText:{
        fontSize: hp(1.8),
        marginTop:hp(1),
        fontWeight:"700"
    },
    
});
