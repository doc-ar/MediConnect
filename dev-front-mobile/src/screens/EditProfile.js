import { StyleSheet,Text,View,TouchableOpacity, ScrollView, TextInput} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useMediConnectStore } from "../Store/Store";
import Modal from "react-native-modal";

export default function EditProfile(){
    const [isValidationModalVisible, setIsValidationModalVisible] = useState(false);
    const setPatientData = useMediConnectStore(state=>state.setPatientData);
    const PatientData = useMediConnectStore(state=>state.PatientData);
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const navigation = useNavigation();
    const [Name, setName] = useState(PatientData.name);
    const [Contact, setContact] = useState(PatientData.contact);
    const [Address, setAddress] = useState(PatientData.address);
    const [Age, setAge] = useState(String(PatientData.age));
    const [Weight, setWeight] = useState(PatientData.weight);
    const [Gender, setGender] = useState(PatientData.gender);
    const [Height, setHeight] = useState(PatientData.height);
    const [Allergy, setAllergy] = useState(PatientData.allergies);
    const [BloodType, setBloodType] = useState(PatientData.bloodtype);
    const [BloodGlucose, setBloodGlucose] = useState(PatientData.blood_glucose);
    const [BloodPressure, setBloodPressure] = useState(PatientData.blood_pressure);
    const [image, setImage] = useState(PatientData.image);
    const [Error, setError] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [EditMessage, setEditMessage] = useState('');

    useEffect(() => {
        let timeout;
        if (isModalVisible) {
            timeout = setTimeout(() => {
                navigation.goBack();
            }, 2000);
        }

        return () => clearTimeout(timeout);
    }, [isModalVisible]);

    const validateAndSubmit = () => {
        // Check if all required fields are filled and the date is valid
        if (Name && Contact && Address && Age && Gender) {
            setError("");

            if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(BloodType) && BloodType) {
                setError("Blood type is invalid. Use valid blood types (A+, A-, B+, etc.)");
                setIsValidationModalVisible(true);
                return;
            }
            if (Age && (!Number.isFinite(parseFloat(Age)) || parseFloat(Age) <= 0)) {
                setError("Age is invalid. Enter a valid age in numbers");
                setIsValidationModalVisible(true);
                return;
            }

            // Validating weight
            if (Weight && (!Number.isFinite(parseFloat(Weight)) || parseFloat(Weight) <= 0)) {
                setError("Weight is invalid. Enter a valid weight in numbers");
                setIsValidationModalVisible(true);
                return;
            }

            // Validating height
            if (Height && (!Number.isFinite(parseFloat(Height)) || parseFloat(Height) <= 0)) {
                setError("Height is invalid. Enter a valid height in numbers");
                setIsValidationModalVisible(true);
                return;
            }

            // Validating blood glucose
            if (BloodGlucose && (!Number.isFinite(parseFloat(BloodGlucose)) || parseFloat(BloodGlucose) <= 0)) {
                setError("Blood Glucose is invalid. Enter a valid value in numbers");
                setIsValidationModalVisible(true);
                return;
            }             
            UpdatePatientData();
        } else {
            setError("Some required fields are Empty");
            setIsValidationModalVisible(true);
        }
    };

    const UpdatePatientData= async() =>{
        const age = Age ? parseFloat(Age) : null;
        const weight = Weight ? parseFloat(Weight) : null;
        const height = Height ? parseFloat(Height) : null;
        const bloodGlucose = BloodGlucose ? parseFloat(BloodGlucose) : null;

        const response = await FetchRequest("https://www.mediconnect.live/mobile/update-patient","patch", {name:Name, gender:Gender, address:Address, weight:weight, blood_pressure:BloodPressure, image:image, age:age, blood_glucose:bloodGlucose, contact:Contact, bloodtype:BloodType, allergies:Allergy, height:height}
        );
        if (response.status === 200) {
            console.log("Patient Data Updated , Back to Edit Screen Success: ",response.data);
            setPatientData(response.data);
            setEditMessage("Success!");
            setModalVisible(true);
        }
        else{
        console.log("Error setting Patient Data on Edit Screen: ",response.data);
        setEditMessage("An Error Occurred. Try Again.");
        setModalVisible(true);
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
                <Text style={styles.label}>Name<Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Name"
                            placeholderTextColor="#B0B0B0"
                            value={Name}
                            onChangeText={setName}
                            maxLength={30}
                        />
                    </View>

                    {/* Contact */}
                    <Text style={styles.label}>Contact<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Contact Number"
                            placeholderTextColor="#B0B0B0"
                            value={Contact}
                            onChangeText={setContact}
                            keyboardType="numeric"
                            maxLength={15}
                        />
                    </View>

                    {/* Address */}
                    <Text style={styles.label}>Address<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Address"
                            placeholderTextColor="#B0B0B0"
                            value={Address}
                            onChangeText={setAddress}
                            maxLength={50}
                        />
                    </View>

                    {/* Age */}
                    <Text style={styles.label}>Age<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Age in Years"
                            placeholderTextColor="#B0B0B0"
                            value={Age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                    </View>

                    {/* Gender */}
                    <Text style={styles.label}>Gender<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Gender"
                            placeholderTextColor="#B0B0B0"
                            value={Gender}
                            onChangeText={setGender}
                            maxLength={11}
                            />
                    </View>
                <Text style={styles.MedicalData}>Medical Data: </Text>
                <Text style={styles.required}>Enter your Medical data as last recorded by a medical professional. If you do not have the data, or if you are uncertain of the data please skip this part.</Text>
                    {/* Optional Fields */}
                    <Text style={[styles.label, {marginTop:hp(1.8)}]}>Weight (kg)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Weight"
                            placeholderTextColor="#B0B0B0"
                            value={Weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            maxLength={7}
                        />
                    </View>

                    <Text style={styles.label}>Blood Glucose (mg/dL)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Blood Glucose"
                            placeholderTextColor="#B0B0B0"
                            value={BloodGlucose}
                            onChangeText={setBloodGlucose}
                            maxLength={7}                       
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={styles.label}>Blood Pressure (mmHg)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Blood Pressure"
                            placeholderTextColor="#B0B0B0"
                            value={BloodPressure}
                            onChangeText={setBloodPressure}
                            maxLength={7}
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={styles.label}>Height (cm)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Height"
                            placeholderTextColor="#B0B0B0"
                            value={Height}
                            onChangeText={setHeight}                            
                            keyboardType="numeric"
                            maxLength={7}
                        />
                    </View>

                    <Text style={styles.label}>Blood Type</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Blood Type"
                            placeholderTextColor="#B0B0B0"
                            value={BloodType}
                            onChangeText={setBloodType}
                            maxLength={3}
                        />
                    </View>

                    <Text style={styles.label}>Allergies</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Allergies"
                            placeholderTextColor="#B0B0B0"
                            value={Allergy}
                            onChangeText={setAllergy}
                            maxLength={50}                            
                        />
                    </View>

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
            <Modal isVisible={isModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>{EditMessage}</Text>
                    {EditMessage === "Success!"?
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.Modalcheck}/>:
                    <Entypo name="emoji-sad" size={hp(9)} color="#a1020a" style={styles.Modalcheck}/>
                    }
                </View>
            </Modal>
            <Modal isVisible={isValidationModalVisible}>
                <View style={styles.ValidationModalView}>
                    <Text style={styles.ValidationModalText}>{Error}</Text>
                    <MaterialIcons name="error-outline" size={hp(9)} color="#a1020a" style={styles.ValidationModalIcon}/>
                      <TouchableOpacity onPress={()=>setIsValidationModalVisible(false)} style={styles.ValidationModalButton}><Text style={styles.ValidationButtonText}>Okay</Text></TouchableOpacity>
                </View>
            </Modal>
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
    MedicalData:{
        marginTop:hp(3),
        marginBottom: hp(1),
        fontSize:hp(2.5),
        fontWeight:"bold",
        color:"#2F3D7E"
    },
    ValidationModalView:{
        backgroundColor:"white",
        borderRadius:20,
        height:hp(25),
        width:wp(85),
        alignSelf:"center",
        alignItems:"center",
        justifyContent:"center"
      },
      ValidationModalText:{
        fontSize:hp(2.2),
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:hp(1),
        marginHorizontal:wp(1)
      },
      ValidationModalButton:{
        justifyContent:"center",
        borderRadius:10,
        width: wp(33),
        height: hp(5),
        alignItems:"center",
        backgroundColor: "white",
        borderColor:"#2F3D7E",
        borderWidth:2,
        marginTop: hp(1)
      },
      ValidationButtonText:{
        color:"#2F3D7E",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      ValidationModalIcon:{
        
    },
    ModalView:{
        backgroundColor:"white",
        borderRadius:20,
        height:hp(18),
        width:wp(80),
        alignSelf:"center"
      },
      ModalText:{
        fontSize:hp(2),
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:hp(2)
      },
      Modalcheck:{
        alignSelf:"center",
      }
})