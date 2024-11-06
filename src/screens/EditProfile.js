import { StyleSheet,Text,View,TouchableOpacity, ScrollView, TextInput} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useMediConnectStore } from "../Store/Store";

export default function EditProfile(){
    const setPatientData = useMediConnectStore(state=>state.setPatientData);
    const PatientData = useMediConnectStore(state=>state.PatientData);
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const navigation = useNavigation();
    const [Name, setName] = useState(PatientData.name);
    const [Contact, setContact] = useState(PatientData.contact);
    const [Address, setAddress] = useState(PatientData.address);
    const [Age, setAge] = useState(PatientData.age);
    const [Weight, setWeight] = useState(PatientData.weight);
    const [Gender, setGender] = useState(PatientData.gender);
    const [Height, setHeight] = useState(PatientData.height);
    const [Allergy, setAllergy] = useState(PatientData.allergies);
    const [BloodType, setBloodType] = useState(PatientData.bloodtype);
    const [BloodGlucose, setBloodGlucose] = useState(PatientData.blood_glucose);
    const [BloodPressure, setBloodPressure] = useState(PatientData.blood_pressure);
    const [EmptyReqFields, setEmptyReqFields] = useState(false);

    const validateAndSubmit = () => {
        // Check if all required fields are filled and the date is valid
        if (Name && Contact && Address && Age && Gender) {
            setEmptyReqFields(false);
                 
            UpdatePatientData();
      
            // Submit logic here
        } else {
            setEmptyReqFields(true);
        }
    };

    const UpdatePatientData= async() =>{
        const response = await FetchRequest("https://www.mediconnect.live/mobile/update-patient","patch", {name:Name, gender:Gender, address:Address, weight:Weight, blood_pressure:BloodPressure, image:null, age:Age, blood_glucose:BloodGlucose, contact:Contact, bloodtype:BloodType, allergies:Allergy, height:Height}
        );
        if (response.status === 200) {
            console.log("Patient Data Updated , Back to Edit Screen Success: ",response.data);
            setPatientData(response.data);
            navigation.goBack();
        }
        else{
        console.log("Error setting Patient Data on Edit Screen: ",response.data);
    }
    } 

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Edit Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.inputContainer}>
                <Text style={styles.required}>*Required Fields</Text>
                
                {/* Name */}
                <Text style={styles.label}>Name<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Name}
                        onChangeText={setName}
                    />
                </View>

                {/* Contact */}
                <Text style={styles.label}>Contact<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Contact}
                        onChangeText={setContact}
                        keyboardType="numeric"
                    />
                </View>

                {/* Address */}
                <Text style={styles.label}>Address<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* Age */}
                <Text style={styles.label}>Age<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                    />
                </View>

                {/* Gender */}
                <Text style={styles.label}>Gender<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Gender}
                        onChangeText={setGender}
                    />
                </View>

                {/* Optional Fields */}
                <Text style={styles.label}>Weight (kg)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Blood Glucose (mg/dL)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={BloodGlucose}
                        onChangeText={setBloodGlucose}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Blood Pressure (mmHg)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={BloodPressure}
                        onChangeText={setBloodPressure}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Height (cm)</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={styles.label}>Blood Type</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={BloodType}
                        onChangeText={setBloodType}
                    />
                </View>

                <Text style={styles.label}>Allergies</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={Allergy}
                        onChangeText={setAllergy}
                    />
                </View>

                {EmptyReqFields && <Text style={[styles.required, {marginTop: hp(2), alignSelf:"center"}]}>Some required fields are empty</Text>}
                
                {/* Buttons */}
                <View style={styles.ButtonsView}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.submitButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
                        <Text style={styles.submitButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
    },
    SettingsText:{
        fontSize:hp(2.8),
        fontWeight:"bold",
        color:"#41474D"
    },
    TopView:{
        flexDirection:"row",
        marginTop:hp(0.5),
        justifyContent:"center",
        width: wp(100),
        alignItems:"center",
        borderBottomWidth:hp(0.06),
        borderBottomColor:"#d4d2cd",
        paddingBottom:hp(1),
        marginBottom:hp(1)
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
    inputContainer: {
        display: "flex",
        marginTop: hp(2),
        width: wp(90),
        marginHorizontal: wp(5),
    },
    label: {
        marginTop: hp(3),
        fontSize: hp(2.2),
        fontWeight: 'bold',
    },
    inputWrapper: {
        marginTop: hp(1),
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp(1.2),
        height: hp(5),
        justifyContent: 'center',
    },
    input: {
        height: hp(3),
        fontSize: hp(2.2),
        color: 'black',
    },
    required: {
        color: "red",
        fontSize: hp(2.2),
    },
    submitButton: {
        paddingVertical: hp(1),
        alignItems: "center",
        width: wp(40),
        backgroundColor: "#2F3D7E",
        borderRadius: 10,
        justifyContent: "center",
        marginTop: hp(1),
        height:hp(5)
    },
    submitButtonText: {
        color: "white",
        fontSize: hp(2.2),
        fontWeight: "bold",
    },
    ButtonsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: hp(2),
        width: wp(90),
    },
})