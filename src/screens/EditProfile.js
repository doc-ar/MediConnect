import { StyleSheet,Text,View,TouchableOpacity, ScrollView, TextInput} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function EditProfile(){
    const navigation = useNavigation();
    const [Name, setName] = useState('John Doe');
    const [Contact, setContact] = useState('1234567890');
    const [Address, setAddress] = useState('123 Main St');
    const [DOB, setDOB] = useState('01/01/1990');
    const [Weight, setWeight] = useState('70');
    const [Gender, setGender] = useState('Male');
    const [Height, setHeight] = useState('170');
    const [Allergy, setAllergy] = useState('None');
    const [BloodType, setBloodType] = useState('O+');
    const [BloodGlucose, setBloodGlucose] = useState('90');
    const [BloodPressure, setBloodPressure] = useState('120/80');
    const [EmptyReqFields, setEmptyReqFields] = useState(false);
    const [IsInvalidDate, setIsInvalidDate] = useState(false);

    const validateAndSubmit = () => {
        const dobPattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        const isDateValid = dobPattern.test(DOB);
        
        if (!isDateValid) {
            setIsInvalidDate(true);
        } else {
            setIsInvalidDate(false);
        }
    
        // Check if all required fields are filled and the date is valid
        if (Name && Contact && Address && DOB && Gender && isDateValid) {
            setEmptyReqFields(false);
            console.log("info changed");     
            navigation.goBack();
      
            // Submit logic here
        } else {
            setEmptyReqFields(true);
        }
    };

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

                {/* DOB */}
                <Text style={styles.label}>Date of Birth (DD/MM/YYYY)<Text style={styles.required}>*</Text></Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        value={DOB}
                        onChangeText={setDOB}
                        keyboardType="numeric"
                    />
                </View>
                {IsInvalidDate && <Text style={styles.required}>Invalid Date Pattern. Use: DD/MM/YYYY</Text>}

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
        paddingVertical: hp(1.5),
        alignItems: "center",
        width: wp(40),
        backgroundColor: "#2F3D7E",
        borderRadius: 10,
        justifyContent: "center",
        marginTop: hp(3),
    },
    submitButtonText: {
        color: "white",
        fontSize: hp(2.7),
        fontWeight: "bold",
    },
    ButtonsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: hp(2),
        width: wp(90),
    },
})