import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useMediConnectStore } from '../Store/Store';
import { DataTable } from 'react-native-paper'; 
export default function MedicalDataScreen() {
    const navigation = useNavigation();
    const [MedicalData, setMedicalData] = useState([1,2]);
    const [Loading, setLoading] = useState(false);
    const fetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
    const PatientData = useMediConnectStore((state) => state.PatientData);
    const [medicalFields, setMedicalFields] = useState([
        { label: 'Height', value: PatientData.height },
        { label: 'Weight', value: PatientData.weight },
        { label: 'Allergies', value: PatientData.allergies },
        { label: 'Blood Glucose', value: PatientData.blood_glucose },
        { label: 'Blood Pressure', value: PatientData.blood_pressure },
        { label: 'Blood Type', value: PatientData.bloodtype },
    ]);
    useEffect(() => {
        /*const fetchSOAP = async () => {
            const response = await fetchRequest("https://www.mediconnect.live/mobile/get-soap-notes", "get");
            if (response.status === 200) {
                console.log("SOAP Notes, Back to SOAP Screen Success: ", response.data);
                setSOAP(response.data);
                setLoading(false);
            } else {
                console.log("Error Fetching SOAP Notes: ", response.data);
            }
        }
        fetchSOAP();*/
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={() => navigation.goBack()} />
                <Text style={styles.HeadingText}>Medical Data</Text>
            </View>
            <ScrollView contentContainerStyle={styles.BottomView}>
                {Loading && <Text style={styles.LoadingText}>Loading...</Text>}
                {!Loading && MedicalData.length === 0 && <Text style={styles.LoadingText}>No Medical Data Available</Text>}
                {!Loading && MedicalData.length > 0 && <>
                    <Text style={styles.DateText}>Dated: 01/11/2024</Text>                    

                        <DataTable style={styles.tablecontainer}>
                        {/* Medical Data Rows */}
                        {medicalFields.map((field, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{field.label}:</DataTable.Cell>
                            <DataTable.Cell>{field.value}</DataTable.Cell>
                        </DataTable.Row>
                        ))}
                        </DataTable>
                    <Text style={styles.DateText}>Dated: 11/11/2024</Text>                    

                    <DataTable style={styles.tablecontainer}>
                        {/* Medical Data Rows */}
                        {medicalFields.map((field, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{field.label}:</DataTable.Cell>
                                <DataTable.Cell>{field.value}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>

                    <Text style={styles.DateText}>Dated: 14/11/2024</Text>                    

                    <DataTable style={styles.tablecontainer}>
                        {/* Medical Data Rows */}
                        {medicalFields.map((field, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{field.label}:</DataTable.Cell>
                                <DataTable.Cell>{field.value}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                    
                </>}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: hp(1),
        paddingHorizontal: wp(2)
    },
    HeadingText: {
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
        paddingBottom: hp(1)
    },
    backArrow: {
        position: "absolute",
        left: 0
    },
    BottomView: {
        paddingHorizontal: wp(2),
        paddingTop:hp(3)
    },
    LoadingText: {
        fontSize: hp(2.3),
        fontWeight: "bold",
        marginVertical: hp(4),
        alignSelf: "center",
    },
    tablecontainer: { 
        paddingVertical: hp(1),
        backgroundColor: '#e1e5f5',
        marginBottom: hp(2),
        borderRadius: 15
    }, 
    DateText:{
        fontSize: hp(2),
        fontWeight: "bold",
        marginBottom: hp(0.5)
        
    }
});
