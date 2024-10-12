import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView } from "react-native-web";

export default function TermsConditionsScreen(){
    const navigation = useNavigation();
    const [Terms,SetTerms] = useState(`
1. Introduction
Welcome to the MediConnect Mobile Application. This App provides patients with access to their medical records, prescriptions, appointment scheduling, and secure communication with healthcare professionals. By using the App, you agree to the following terms and conditions.

2. User Accounts
- Users must create an account to access the App. You are responsible for maintaining the confidentiality of your account credentials and ensuring that any information you provide is accurate and up to date.
- Unauthorized use of your account must be reported immediately.

3. Access to Medical Information
- The App allows you to view your medical records, including test results, prescriptions, and treatment plans, as provided by your healthcare provider.
- All medical information within the App is provided directly by healthcare professionals. Ensure that you consult with your healthcare provider for any questions or clarifications related to your medical care.

4. Prescription Management
- Prescriptions available through the App are provided and managed by licensed healthcare providers. Patients are advised to follow their healthcare provider’s guidance regarding the use of medications.
- It is your responsibility to review and adhere to the details of any prescriptions, including dosage and instructions provided by your healthcare provider.

5. Appointment Scheduling
- Patients can use the App to schedule, modify, or cancel appointments with healthcare professionals, subject to availability.
- Appointment confirmations and notifications will be provided through the App. Patients are expected to manage their appointments responsibly.

6. Secure Communication
- The App allows for secure communication between patients and healthcare professionals. All communications are part of the patient’s medical record and will be treated confidentially in accordance with applicable privacy regulations.
- Please note that this communication is intended for non-urgent matters. For emergencies, contact your healthcare provider directly or seek immediate medical attention.

7. Data Privacy and Security
- We prioritize the security and confidentiality of your medical data. The App complies with all applicable data protection laws, including encryption protocols to safeguard your information.
- Your data will only be accessed by authorized healthcare professionals and will not be shared without your consent, except where required by law.

8. Medical Advice and Treatment
- All medical advice, prescriptions, and treatment plans available through the App are provided by licensed healthcare professionals.
- This App does not replace face-to-face consultations or emergency medical services. Always consult with your healthcare provider for any significant health concerns or decisions.

9. Limitation of Use
- The App is intended solely for patients to access healthcare services and information. Any misuse of the App, including sharing of login credentials or unauthorized access to medical information, is prohibited and may result in account suspension.

10. Changes to Terms
- We reserve the right to update these terms and conditions as necessary. Continued use of the App signifies your acceptance of any changes. You will be notified of significant updates.

11. Contact Information
- For support or inquiries related to the App, you can reach our support team through the contact options provided within the App.

By using the App, you acknowledge and agree to these terms and conditions. If you do not agree, please discontinue the use of the App immediately and deactivate your account by contacting us.
`)
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Terms and Conditions</Text>
            </View>
            <ScrollView contentContainerStyle={styles.TermsView}>
                <Text>{Terms}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
        paddingBottom:hp(1)
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
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
    TermsView:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        width: wp(90),
        marginHorizontal:wp(5),
        paddingBottom:hp(1)

    },
    TermsText:{
        fontSize:hp(1.8),
    }
})