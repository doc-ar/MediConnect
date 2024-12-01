import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Modal from "react-native-modal";
import { ScrollView } from 'react-native';

export default function ChangePassword() {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [error,setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setIsPasswordValid(hasUppercase && hasLowercase && hasNumber && hasSpecialChar);
    };

    const handleChangePassword = async () => {
        setError('');

        if (!currentPassword || !password || !confirmPassword) {
            setError("Fields cannot be empty");
            return;
        }

        if(!isPasswordValid){
            setError("New Password not valid");
            return;
        }
        if (password !== confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }
        else{
            setModalVisible(true);
        }

        /*try {
            const response = await axios.post("https://www.mediconnect.live/auth/signup", {
                email: email,
                password: password,
                role: "patient",
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data) {
                console.log("Success", response.data.users);
                setModalVisible(true);
            } else {
                setError("Sign Up Failed. Try again.");
            }
        } catch (error) {
            console.error("Error:",  error);
            setError("Sign Up Failed. Try Again.");
        }*/
    };
    
    return (
        <SafeAreaView style={styles.container}>    
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.PrescriptionText}>Change Password</Text>
            </View>
            <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.BottomView} >
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Current Password..."
                        placeholderTextColor="#B0B0B0"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        onFocus={() => setShowPasswordValidation(false)}
                    />
                </View>
                <Text style={styles.label}>New Password</Text>
                {showPasswordValidation && (
                        <View style={styles.passwordValidation}>
                            <Text style={styles.validationText}>
                                {`• At least one uppercase letter`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one lowercase letter`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one number`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one special character`}
                            </Text>
                        </View>
                    )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password..."
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            validatePassword(text);
                        }}                       
                        onFocus={() => setShowPasswordValidation(true)}
                    />
                </View>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password..."
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setShowPasswordValidation(false)}
                    />
                </View>
            </View>
            
            <TouchableOpacity style={styles.signUpButton} onPress={handleChangePassword}>
                <Text style={styles.signUpButtonText}>Change Password</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
            
            <Modal isVisible={isModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>Password Successfully Changed</Text>
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.Modalcheck}/>
                    <TouchableOpacity style={styles.ModalButton} onPress={()=>{navigation.goBack()}}><Text style={styles.ModalButtonText}>Back</Text></TouchableOpacity>
                </View>
            </Modal>     
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    PrescriptionText:{
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
        paddingBottom:hp(1)
        
    },
    backArrow:{
        position:"absolute",
        left: 0
    },
    BottomView: {
        width: wp(100),
        alignItems: 'center',
        //justifyContent: 'center',
    },
    inputContainer: {
        width: wp(85),
        marginTop: hp(2),
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
        height:hp(5),
        justifyContent:'center'
    },
    input: {
        fontSize: hp(2.2),
        color: 'black'
    },
    signUpButton: {
        backgroundColor: '#2F3D7E',
        width: wp(85),
        height: hp(6),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },
    signUpButtonText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
   footerView:{
    flexDirection:"row",
    marginTop: hp(6),
   },
    footerText: {
        fontSize: hp(2),
        color: '#B0B0B0',
    },
    FooterSignInText: {
        color: '#2F3D7E',
        fontWeight: 'bold',
        fontSize: hp(2),
        textDecorationLine: 'underline',
        textDecorationColor:"#2F3D7E"
    },
    error:{
        color:"red",
        marginTop:hp(2),
        fontSize:hp(2)
    },
    passwordValidation: {
        marginTop: hp(1),
        padding: wp(2),
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },
    validationText: {
        color: 'black',
        fontSize: hp(2),
    },
    ModalView:{
        backgroundColor:"white",
        borderRadius:20,
        height:hp(25),
        width:wp(80),
        alignSelf:"center"
      },
      ModalText:{
        fontSize:hp(2),
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:hp(2)
      },
      
      ModalButton:{
        justifyContent:"center",
        borderRadius:10,
        width: wp(33),
        height: hp(5),
        alignItems:"center",
        backgroundColor: "#2F3D7E",
        alignSelf:"center",
        marginVertical:hp(2)
      },
      ModalButtonText:{
        color:"white",
        fontWeight:"bold"
      },
      Modalcheck:{
        alignSelf:"center",
      }
});
