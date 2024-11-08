import { StatusBar } from 'expo-status-bar';
import { ScrollView,StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMediConnectStore } from '../Store/Store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function RegisterDetails() {
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const setIsRegistered = useMediConnectStore(state=>state.setIsRegistered)
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
    const [EmptyReqFields, setEmptyReqFields] = useState(false);
    const getIsRegistered = useMediConnectStore(state=>state.getIsRegistered);

    useEffect(()=>{
        const IsRegistered = getIsRegistered();
        if(IsRegistered==="true"){
            setIsRegistered(true);
            return;
        }
    },[])

    const validateAndSubmit = async () => {
        
        if (Name && Contact && Address && Age && Gender) {
            setEmptyReqFields(false);

            console.log({ Name, Contact, Address, Age, Weight, Gender, BloodGlucose, BloodPressure });
            const response = await FetchRequest("https://www.mediconnect.live/mobile/create-patient-profile","post",
                {  // user_id:"ba750072-6f30-4089-b2a9-5bdd136dd72c",
                    name: Name,
                    gender: Gender,
                    address: Address,
                    weight: Weight,
                    blood_pressure: BloodPressure,
                    age: Age,
                    blood_glucose: BloodGlucose,
                    contact: Contact,
                    height: Height,
                    bloodtype:BloodType,
                    allergies:Allergy,
                    image: "https://cdn.openart.ai/published/6QLTkchH5F6bKgAmbRfc/aofdob56_vO8y_512.webp" 
                  }
            );
            if (response.status === 200) { 
                console.log("Back to register Screen Success: ",response.data);
                setIsRegistered(true);
                return;
            }
            console.log("Error: ",response.data);
            
        } else {
            setEmptyReqFields(true);
            return;
        }
    };
    

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
                        />
                    </View>

                    {/* DOB */}
                    <Text style={styles.label}>Age<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Age in Years"
                            placeholderTextColor="#B0B0B0"
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
                            placeholder="Enter your Gender"
                            placeholderTextColor="#B0B0B0"
                            value={Gender}
                            onChangeText={setGender}
                        />
                    </View>

                    {/* Optional Fields */}
                    <Text style={styles.label}>Weight (kg)</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Weight"
                            placeholderTextColor="#B0B0B0"
                            value={Weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
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
                        />
                    </View>


                    {EmptyReqFields && <Text style={[styles.required, {marginTop: hp(2), alignSelf:"center"}]}>Some required fields are empty</Text>}
            
                    <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
                        <Text style={styles.submitButtonText}>Next</Text>
                        <Ionicons name="arrow-forward-circle-outline" style={[styles.ButtonIcon, {paddingTop:hp(0.2)}]}  size={hp(3.01)} color="#2F3D7E" />
                    </TouchableOpacity>

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
    submitButton: {
        marginVertical: hp(2.5),
        alignItems: "center",
        width: wp(20),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf:"flex-end"
    },
    submitButtonText: {
        color: "#2F3D7E",
        fontSize: hp(2.7),
        fontWeight: "bold",
    },
    
    ButtonIcon:{
        marginTop:hp(0.2),
        marginHorizontal:wp(0.4)
    }
    
});
