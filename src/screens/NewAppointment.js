import { StyleSheet, Text, View, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { FontAwesome } from "@expo/vector-icons";
import Calendar from "react-native-calendars/src/calendar";
export default function NewAppointment() {
    const navigation = useNavigation();

    const [DoctorsList, setDoctorsList] = useState([]);
    const [DoctorsNameList, setDoctorsNameList] = useState([]);
    const [DoctorsName, setDoctorsName] = useState([]);
    const [DoctorTypesList, setDoctorTypesList] = useState([]);
    const [DoctorType, setDoctorType] = useState("");
    const [IsDataFetched, setIsDataFetched] = useState(false);
    const [SelectedDoctorSchedule, setSelectedDoctorSchedule] = useState([]);
    const [selectedDate,setSelectedDate]=useState('22/10/2024');

    useEffect(() => {
        fetchDoctorData();
    }, []);

    useEffect(()=>{
        const filteredDoctors = DoctorsList.filter(doctor => doctor.designation === DoctorType);
        const doctors = filteredDoctors.map(doctor => ({
            key: doctor.name, 
            value: doctor.name
        }));
        const uniqueDoctors = [...new Set(doctors)];
        setDoctorsNameList(uniqueDoctors);

    },[DoctorType]);

    useEffect(() => {
        const selectedDoctor = DoctorsList.find(doctor => doctor.name === DoctorsName);
        if (selectedDoctor) {
            setSelectedDoctorSchedule(selectedDoctor.schedule);
        }
    }, [DoctorsName]);

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
                        <SelectList
                            setSelected={setDoctorType}
                            data={DoctorTypesList}
                            arrowicon={<FontAwesome name="chevron-down" size={hp(2)} color={'black'} />}
                            boxStyles={styles.boxStyles}
                            defaultOption={{ key: "Select Option", value: "Select Option" }} 
                            dropdownStyles={styles.dropdownStyles}
                            search={true}
                        />

                    <Text style={styles.FormTexts}>Select Doctor:</Text>
                        <SelectList
                            setSelected={setDoctorsName}
                            data={DoctorsNameList}
                            arrowicon={<FontAwesome name="chevron-down" size={hp(2)} color={'black'} />}
                            boxStyles={styles.boxStyles}
                            defaultOption={{ key: "Select Option", value: "Select Option" }} 
                            dropdownStyles={styles.dropdownStyles}
                            search={true}
                    />

                    <Calendar/>

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
        paddingHorizontal: wp(2)
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
    }
});
