import { StyleSheet,Text,View,ScrollView} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function AppInfoScreen(){
    const navigation = useNavigation();
    const [AppInfo, SetAppInfo] = useState(`MediConnect is a comprehensive healthcare app designed to provide patients with easy access to their medical records, prescriptions, appointment scheduling, and secure communication with healthcare providers. This app is built to streamline patient care, offering a user-friendly interface and a secure platform to manage all your healthcare needs.

Key Features:
Medical Records Access: Instantly view your medical history, test results, and treatment plans.
Prescription Management: Review current and past prescriptions provided by your healthcare provider.
Appointment Scheduling: Schedule, modify, or cancel appointments with your doctor at your convenience.
Secure Communication: Communicate with your healthcare professional in a confidential and secure manner for non-emergency consultations.
Data Privacy and Security
At MediConnect, we prioritize the confidentiality and security of your medical information. All data is securely encrypted and stored, following industry best practices and applicable privacy regulations. Only authorized healthcare professionals will have access to your information, ensuring the protection of your personal data.

Licenses and Certifications:
Medical Licenses: All healthcare professionals using the MediConnect platform are licensed and certified according to their respective medical governing bodies. This ensures that any medical advice, prescriptions, and treatment plans provided through the app are regulated and meet the highest standards of medical practice.

Compliance: MediConnect complies with all relevant healthcare regulations, including [applicable country-specific healthcare regulations, such as HIPAA (for US-based apps)] to ensure that your medical data is handled with the utmost care.

App Certifications: The app has been developed in accordance with health technology guidelines and complies with all necessary standards for mobile health applications, ensuring a secure, reliable, and user-friendly experience.

Contact Us:
For any questions, support, or feedback, please contact our support team via the options provided within the app. We are committed to providing you with the best healthcare experience possible.`)
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>App Information</Text>
            </View>
            <ScrollView contentContainerStyle={styles.AppInfoView}>
                <Text>{AppInfo}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        marginBottom:hp(2)
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
    AppInfoView:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        width: wp(90),
        marginHorizontal:wp(5),
        paddingBottom:hp(1)

    },
    AppInfo:{
        fontSize:hp(1.8),
    }
})