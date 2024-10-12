import { StatusBar } from 'expo-status-bar';
import { ScrollView,StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterDetails() {
    const navigation = useNavigation();
    const [Name, setName] = useState('');
    const [Contact, setContact] = useState('');
    const [Address, setAddress] = useState('');
    const [DOB, setDOB] = useState('');
    const [Weight, setWeight] = useState('');
    const [Gender, setGender] = useState('');
    const [Height, setHeight] = useState('');
    const [Allergy, setAllergy] = useState('');
    const [BloodType, setBloodType] = useState('');
    const [BloodGlucose, setBloodGlucose] = useState('');
    const [BloodPressure, setBloodPressure] = useState('');
    const [EmptyReqFields, setEmptyReqFields] = useState(true);
    const [IsInvalidDate, setIsInvalidDate] = useState(false);
    
    const validateAndSubmit = () => {
        const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        const isDateValid = dobPattern.test(DOB);
        
        // If DOB format is invalid, set the flag
        if (!isDateValid) {
            setIsInvalidDate(true);
        } else {
            setIsInvalidDate(false);
        }
    
        // Check if all required fields are filled and the date is valid
        if (Name && Contact && Address && DOB && Gender && isDateValid) {
            setEmptyReqFields(false);
            console.log({ Name, Contact, Address, DOB, Weight, Gender, BloodGlucose, BloodPressure });
            
            // Navigate to the 'Home' screen if all validations pass
            navigation.navigate('Home');
        } else {
            setEmptyReqFields(true);
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
                <Text style={styles.MediConnectText}>MediConnect</Text>
                <ScrollView contentContainerStyle={styles.inputContainer}>
                    <Text style={styles.required}>*Required Fields</Text>
                    {/* Name */}
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
                    <Text style={styles.label}>Date of Birth (DD/MM/YYYY)<Text style={styles.required}>*</Text></Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor="#B0B0B0"
                            value={DOB}
                            onChangeText={setDOB}
                            keyboardType="numeric"
                        />
                    </View>
                    {IsInvalidDate && <Text style={styles.required}>Date Pattern is Invalid use: DD/MM/YYYY</Text>}

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
                    <View style={styles.ButtonsView}>
                    
                    <TouchableOpacity style={styles.submitButton} onPress={()=>navigation.goBack()}>
                        <Ionicons name="arrow-back-circle-outline" style={styles.ButtonIcon} size={hp(3)} color="#2F3D7E" />
                        <Text style={styles.submitButtonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={validateAndSubmit}>
                        <Text style={styles.submitButtonText}>Next</Text>
                        <Ionicons name="arrow-forward-circle-outline" style={[styles.ButtonIcon, {paddingTop:hp(0.2)}]}  size={hp(3.01)} color="#2F3D7E" />
                    </TouchableOpacity>

                    </View>
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
        paddingVertical: hp(1.5),
        alignItems: "center",
        width: wp(20),
        flexDirection: "row",
        justifyContent: "space-between",
    },
    submitButtonText: {
        color: "#2F3D7E",
        fontSize: hp(2.7),
        fontWeight: "bold",
    },
    ButtonsView:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:hp(2),
        width: wp(90),
    },
    ButtonIcon:{
        marginTop:hp(0.2),
        marginHorizontal:wp(0.4)
    }
    
});
