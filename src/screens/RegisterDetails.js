import { StatusBar } from 'expo-status-bar';
import { ScrollView,StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMediConnectStore } from '../Store/Store';
import Modal from "react-native-modal";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';

export default function RegisterDetails() {
    const [isValidationModalVisible, setIsValidationModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const setIsRegistered = useMediConnectStore(state=>state.setIsRegistered);
    const clearTokens = useMediConnectStore(state=>state.clearTokens);
    const [Name, setName] = useState(null);
    const [Contact, setContact] = useState(null);
    const [Address, setAddress] = useState(null);
    const [Age, setAge] = useState(null);
    const [Weight, setWeight] = useState(null);
    const [Gender, setGender] = useState(null);
    const [Height, setHeight] = useState(null);
    const [Allergy, setAllergy] = useState(null);
    const [BloodType, setBloodType] = useState(null);
    const [BloodGlucose, setBloodGlucose] = useState(null);
    const [BloodPressure, setBloodPressure] = useState(null);
    const [Error, setError] = useState(null);
    const setRegistrationCheck = useMediConnectStore(state=>state.setRegistrationCheck);

    const handleSuccessfulRegistration = async () => {
        setIsModalVisible(true);
        await setIsRegistered(true);
        setTimeout(() => {
            setRegistrationCheck(true);
        }, 5000);
    };
    
    const validateAndSubmit = async () => {
        
        if (Name && Contact && Address && Age && Gender) {
            setError("Error");

            if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(BloodType) && BloodType) {
                setError("Blood type is invalid. Use valid blood types (A+, A-, B+, etc.)");
                setIsValidationModalVisible(true);
                return;
            }
            // Validating age
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

            const age = Age ? parseFloat(Age) : null;
            const weight = Weight ? parseFloat(Weight) : null;
            const height = Height ? parseFloat(Height) : null;
            const bloodGlucose = BloodGlucose ? parseFloat(BloodGlucose) : null;

            const response = await FetchRequest("https://www.mediconnect.live/mobile/create-patient-profile","post",
                {  // user_id:"ba750072-6f30-4089-b2a9-5bdd136dd72c",
                    name: Name,
                    gender: Gender,
                    address: Address,
                    weight: weight,
                    blood_pressure: BloodPressure,
                    age: age,
                    blood_glucose: bloodGlucose,
                    contact: Contact,
                    height: height,
                    bloodtype:BloodType,
                    allergies:Allergy,
                    image: "https://cdn.openart.ai/published/6QLTkchH5F6bKgAmbRfc/aofdob56_vO8y_512.webp" 
                  }
            );
            if (response.status === 200) { 
                console.log("Back to register Screen Success: ",response.data);
                handleSuccessfulRegistration();
                return;
            }
            else{
                setError("There was an error in registration. Please try again.");
                setIsValidationModalVisible(true);
                console.log("Error: ",response.data);
            }
        } else {
            setError("Some Required Fields are Empty");
            setIsValidationModalVisible(true);
            return;
        }
    };
    
        const handleLogout = async () => {
            clearTokens();
        }
    return (
        
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
                <Text style={styles.MediConnectText}>MediConnect</Text>
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

                <View style={styles.Buttons}>
                    <TouchableOpacity style={styles.LogoutButton} onPress={handleLogout}>
                        <SimpleLineIcons name="logout" style={[styles.ButtonIcon]}  size={hp(2.3)} color="#a1020a" />
                        <Text style={styles.LogoutButtonText}> Log out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
                        <Text style={styles.submitButtonText}> Next</Text>
                        <Ionicons name="arrow-forward-circle-outline" style={[styles.ButtonIcon, {paddingTop:hp(0.2)}]}  size={hp(3)} color="#2F3D7E" />
                    </TouchableOpacity>
                </View>
                <Modal isVisible={isValidationModalVisible}>
                <View style={styles.ValidationModalView}>
                    <Text style={styles.ValidationModalText}>{Error}</Text>
                    <MaterialIcons name="error-outline" size={hp(9)} color="#a1020a" style={styles.ValidationModalIcon}/>
                      <TouchableOpacity onPress={()=>setIsValidationModalVisible(false)} style={styles.ValidationModalButton}><Text style={styles.ValidationButtonText}>Okay</Text></TouchableOpacity>
                </View>
                </Modal>

                <Modal isVisible={isModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>Registration Successful!</Text>
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.Modalcheck}/>
                </View>
                </Modal>
                </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: hp(2),
        alignItems: "center",
    },
    MediConnectText: {
        fontSize: hp(4),
        color: "#2F3D7E",
        fontWeight: "bold",
    },
    inputContainer: {
        display: "flex",
        marginTop: hp(2),
        width: wp(90),
        marginHorizontal: wp(5)
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
        justifyContent: 'center'
    },
    input: {
        height: hp(3),
        fontSize: hp(2.2),
        color: 'black',
    },
    required:{
        color:"red",
        fontSize:hp(2.2)
    },
    MedicalData:{
        marginTop:hp(3),
        marginBottom: hp(1),
        fontSize:hp(2.5),
        fontWeight:"bold",
        color:"#2F3D7E"
    },
    Buttons:{
        flexDirection:"row",
        marginVertical: hp(2.5),
        justifyContent:"space-between",
        width:wp(90),
    },
    submitButton: {
        alignItems: "center",
        flexDirection: "row",
    },
    submitButtonText: {
        color: "#2F3D7E",
        fontSize: hp(2.7),
        fontWeight: "bold",
    },
    
    ButtonIcon:{
        marginTop:hp(0.2),
        marginHorizontal:wp(0.4)
    },
    LogoutButton: {
        alignItems: "center",
        flexDirection: "row",
    },
    LogoutButtonText: {
        color: "#a1020a",
        fontSize: hp(2.5),
        fontWeight: "bold",
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
});
